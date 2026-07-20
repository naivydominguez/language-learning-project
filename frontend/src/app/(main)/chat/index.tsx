import React, { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";
import { Text } from "../../../components/Text";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import ChatInputBar from "./_components/ChatInputBar";
import MessageBubble from "./_components/MessageBubble";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import WordPopup from "./_components/WordPopup";
import { useChat } from "@/hooks/use-chat";
import { useAuth } from "@/hooks/use-auth";
import { useRealtimeVoiceContext } from "@/context/RealtimeVoiceContext";
import MainHeader from "@/components/MainHeader";

type Message = {
  id: string;
  sender: "user" | "assistant";
  messageContent: string;
};

let _bubbleCounter = 0;
const uid = () => `${Date.now()}-${++_bubbleCounter}`;

export default function ChatScreen() {
  const { session } = useAuth();
  const { starterPrompt, initialMessage, title, conversationId, voice } =
    useLocalSearchParams<{
      starterPrompt?: string;
      initialMessage?: string;
      title?: string;
      conversationId: string;
      voice: "true" | "false";
    }>();

  const { status, stop, setCallbacks, setHistoryProvider } =
    useRealtimeVoiceContext();
  const { isWaiting, sendTextMessage } = useChat(conversationId);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const hasSentInitial = React.useRef(false);
  const [selectedWord, setSelectedWord] = React.useState<string | null>(null);

  // States for voice
  const activeTurnRef = useRef<{
    userBubbleId: string;
    assistantBubbleId: string;
  } | null>(null); // null when no turn is active
  const pendingUserBubbleIdsRef = useRef<string[]>([]);
  const pendingAssistantDeltasRef = useRef<string[]>([]);

  const getBackendMessages = async (convId: string) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/messages/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      const loaded: Message[] = data
        .sort(
          (a: any, b: any) =>
            new Date(a.message.created_at).getTime() - new Date(b.message.created_at).getTime(),
        )
        .map((entry: any) => ({
          id: entry.message.id,
          sender: entry.message.sender,
          messageContent: entry.message.content,
        }));
      setMessages(loaded);
    } catch {
      Toast.show({
        type: "error",
        text1: "Error fetching messages",
        text2: "Please try again later.",
      });
    }
  };

  const updateBubble = (id: string, update: (prev: string) => string) => {
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === id);
      if (idx === -1) return prev;
      return [
        ...prev.slice(0, idx),
        { ...prev[idx], messageContent: update(prev[idx].messageContent) },
        ...prev.slice(idx + 1),
      ];
    });
  };

  const createChatBubbles = (userText: string) => {
    setMessages((prev) => [
      ...prev,
      { id: uid(), sender: "user", messageContent: userText },
      { id: uid(), sender: "assistant", messageContent: "" },
    ]);
  };

  const appendMessageChunk = (chunk: string) => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (!last || last.sender !== "assistant") return prev;
      return [
        ...prev.slice(0, -1),
        { ...last, messageContent: last.messageContent + chunk },
      ];
    });
  };

  const handleSend = (messageText: string) => {
    createChatBubbles(messageText);
    sendTextMessage(messageText, appendMessageChunk, () => {});
  };

  /**
   * Voice Handlers
   */
  const handleVoiceUserTranscriptDelta = (chunk: string) => {
    if (!activeTurnRef.current) {
      const userBubbleId = uid();
      const assistantBubbleId = uid();
      activeTurnRef.current = { userBubbleId, assistantBubbleId };
      pendingUserBubbleIdsRef.current.push(userBubbleId);

      const pending = pendingAssistantDeltasRef.current;
      pendingAssistantDeltasRef.current = [];

      setMessages((prev) => [
        ...prev,
        { id: userBubbleId, sender: "user", messageContent: "" },
        {
          id: assistantBubbleId,
          sender: "assistant",
          messageContent: pending.join(""),
        },
      ]);
    }
  };

  const handleVoiceUserTranscriptDone = (text: string) => {
    const targetId = pendingUserBubbleIdsRef.current.shift();
    if (targetId) updateBubble(targetId, () => text);
  };

  const handleVoiceAssistantDelta = (chunk: string) => {
    if (!activeTurnRef.current) {
      pendingAssistantDeltasRef.current.push(chunk);
    } else {
      updateBubble(activeTurnRef.current.assistantBubbleId, (c) => c + chunk);
    }
  };

  const handleVoiceTurnDone = async (
    userText: string,
    assistantText: string,
  ) => {
    activeTurnRef.current = null;
    pendingAssistantDeltasRef.current = [];
    try {
      await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/conversations/${conversationId}/messages/voice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            user_transcript: userText,
            assistant_transcript: assistantText,
          }),
        },
      );
    } catch (error) {
      console.error("Error saving voice turn:", error);
    }
  };


  // Close the voice session and clean up voice state when changing screens
  useFocusEffect(
    useCallback(() => {
      return () => {
        stop();
        activeTurnRef.current = null;
        pendingUserBubbleIdsRef.current = [];
        pendingAssistantDeltasRef.current = [];
      };
    }, [stop]),
  );

  useEffect(() => {
    if (status === "connecting") {
      activeTurnRef.current = null;
      pendingUserBubbleIdsRef.current = [];
      pendingAssistantDeltasRef.current = [];
    }
  }, [status]);

  useEffect(() => {
    setHistoryProvider(async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/messages/${conversationId}`,
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          },
        );
        if (!response.ok) return [];
        const data = await response.json();
        return data
          .sort(
            (a: any, b: any) =>
              new Date(a.message.created_at).getTime() -
              new Date(b.message.created_at).getTime(),
          )
          .map((entry: any) => ({
            role: entry.message.sender as "user" | "assistant",
            content: entry.message.content as string,
          }))
          .filter((msg: { role: string; content: string }) => msg.content);
      } catch {
        return [];
      }
    });
  }, [conversationId, setHistoryProvider]);

  // Seed the initial state and wire up voice/text callbacks.
  // setMessages is called BEFORE setCallbacks so that any buffered assistant
  // deltas flushed by setCallbacks land on already-existing bubbles.
  useEffect(() => {
    if (hasSentInitial.current) return;
    hasSentInitial.current = true;

    const callbacks = {
      onUserTranscriptDelta: handleVoiceUserTranscriptDelta,
      onUserTranscriptDone: handleVoiceUserTranscriptDone,
      onAssistantDelta: handleVoiceAssistantDelta,
      onAssistantTurnDone: handleVoiceTurnDone,
    };

    if (starterPrompt) {
      if (voice === "true") {
        // Voice navigation from home page: the user already spoke and the
        // session is live. Seed the initial turn and take ownership of events.
        const userBubbleId = uid();
        const assistantBubbleId = uid();
        activeTurnRef.current = { userBubbleId, assistantBubbleId };
        pendingUserBubbleIdsRef.current = [];

        setMessages([
          { id: uid(), sender: "assistant", messageContent: starterPrompt },
          {
            id: userBubbleId,
            sender: "user",
            messageContent: initialMessage ?? "",
          },
          { id: assistantBubbleId, sender: "assistant", messageContent: "" },
        ]);
        // setCallbacks after setMessages — flush lands on the correct bubbles.
        setCallbacks(callbacks);
      } else {
        setMessages([
          { id: uid(), sender: "assistant", messageContent: starterPrompt },
        ]);
        setCallbacks(callbacks);
        if (initialMessage) handleSend(initialMessage);
      }
    } else {
      setCallbacks(callbacks);
      getBackendMessages(conversationId);
    }
  }, [starterPrompt, initialMessage, conversationId]);

  return (
    <View className="flex-1 bg-background">
      <MainHeader title={title || "Chat"} />
      <ScrollView className="flex-1 bg-background">
        <View
          className="flex-1 bg-background p-4"
          style={{ paddingBottom: 16 }}
        >
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onWordPress={setSelectedWord}
            />
          ))}
        </View>
      </ScrollView>

      {selectedWord && (
        <WordPopup
          word={selectedWord}
          language=""
          visible={!!selectedWord}
          OnDismiss={() => setSelectedWord(null)}
        />
      )}

      <ChatInputBar
        onSend={handleSend}
        isWaiting={isWaiting}
        onUserTranscriptDelta={handleVoiceUserTranscriptDelta}
        onVoiceUserTranscript={handleVoiceUserTranscriptDone}
        onVoiceAssistantDelta={handleVoiceAssistantDelta}
        onVoiceTurnDone={handleVoiceTurnDone}
      />
    </View>
  );
}
