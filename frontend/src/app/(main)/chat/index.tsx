import React, { useEffect } from "react";
import { View, Pressable } from "react-native";
import { Text } from "../../../components/Text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import ChatInputBar from "./_components/ChatInputBar";
import MessageBubble from "./_components/MessageBubble";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import WordPopup from "./_components/WordPopup";
import { useChat } from "@/hooks/use-chat";
import { useAuth } from "@/hooks/use-auth";
import { useRealtimeVoiceContext } from "@/context/RealtimeVoiceContext";

type Message = {
  id: string;
  sender: "user" | "assistant";
  messageContent: string;
};
export default function ChatScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const { starterPrompt, initialMessage, title, conversationId, voice } =
    useLocalSearchParams<{
      starterPrompt?: string;
      initialMessage?: string;
      title?: string;
      conversationId: string;
      voice: "true" | "false";
    }>();

  const { setCallbacks } = useRealtimeVoiceContext();
  const { isWaiting, sendTextMessage } = useChat(conversationId);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const hasSentInitial = React.useRef(false);
  const [selectedWord, setSelectedWord] = React.useState<string | null>(null);

  const getBackendMessages = async (conversationId: string) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/messages/${conversationId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch backend messages");
      }
      const data = await response.json();
      const loaded: Message[] = data
        .sort(
          (a: any, b: any) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )
        .map((msg: any) => ({
          id: msg.id,
          sender: msg.sender,
          messageContent: msg.content,
        }));
      setMessages(loaded);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error fetching messages",
        text2: "Please try again later.",
      });
      //console.error("Error fetching messages:", error);
    }
  };

  const createChatBubbles = (userText: string) => {
    const userMessage: Message = {
      id: Date.now().toString() + userText,
      sender: "user",
      messageContent: userText,
    };
    const assistantMessage: Message = {
      id: Date.now().toString() + userText + "assistant",
      sender: "assistant",
      messageContent: "",
    };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
  };

  const onChunk = (chunk: string) => {
    setMessages((prev) => {
      const lastMessage = prev[prev.length - 1];
      if (!lastMessage) {
        // This should not happen for a functional app
        console.error("No last message found to update with chunk:", chunk);
        return prev;
      }
      // Update the last assistant message with the new chunk
      const updatedLastMessage: Message = {
        ...lastMessage,
        messageContent: lastMessage.messageContent + chunk,
      };
      return [...prev.slice(0, -1), updatedLastMessage];
    });
  };

  const handleSend = (messageText: string) => {
    createChatBubbles(messageText);
    sendTextMessage(messageText, onChunk);
  };

  /**
   * Voice handlers
   */
  const handleVoiceUserTranscript = (text: string) => {
    createChatBubbles(text);
  };

  const handleVoiceAssistantDelta = (chunk: string) => {
    onChunk(chunk);
  };

  const handleVoiceTurnDone = async (
    userText: string,
    assistantText: string,
  ) => {
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

  /**
   * If continuing a conversation, retrieve the messages. Otherwise, send the user's first message to the backend
   */
  useEffect(() => {
    if (hasSentInitial.current) return;
    hasSentInitial.current = true;
    if (starterPrompt) {
      setMessages([
        {
          id: Date.now().toString() + starterPrompt,
          sender: "assistant",
          messageContent: starterPrompt,
        },
      ]);
      try {
        if (voice === "true") {
          setCallbacks({
            onUserTranscript: handleVoiceUserTranscript,
            onAssistantDelta: handleVoiceAssistantDelta,
            onAssistantTurnDone: handleVoiceTurnDone,
          });
          handleVoiceUserTranscript(initialMessage!);
        } else {
          handleSend(initialMessage!);
        }
      } catch (error) {
        console.error("Error sending initial message:", error); // Shouldn't happen
      }
    } else {
      getBackendMessages(conversationId);
    }
  }, [starterPrompt, initialMessage, conversationId]);

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 bg-background">
        <View
          className="flex-row items-center gap-2 mb-4 bg-white border-shadow border-border pl-4 pb-2"
          style={{ paddingTop: 60 }}
        >
          <Pressable onPress={() => router.push("/")} className="p-2">
            <ChevronLeft size={20} color="#8C6E60" strokeWidth={2} />
          </Pressable>
          {title ? (
            <Text weight="semibold" className="text-lg text-foreground mb-2">
              {title}
            </Text>
          ) : null}
        </View>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble message={item} onWordPress={setSelectedWord} />
          )}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          className="p-4"
        />
      </ScrollView>
      <ChatInputBar
        onSend={handleSend}
        isWaiting={isWaiting}
        showLanguagePicker={false}
        onVoiceUserTranscript={handleVoiceUserTranscript}
        onVoiceAssistantDelta={handleVoiceAssistantDelta}
        onVoiceTurnDone={handleVoiceTurnDone}
      />
      <WordPopup
        word={selectedWord || ""}
        language="spanish"
        visible={!!selectedWord}
        OnDismiss={() => setSelectedWord(null)}
      />
    </View>
  );
}
