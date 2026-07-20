import React from "react";
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

type Message = {
  id: string;
  sender: "user" | "assistant";
  messageContent: string;
};
export default function ChatScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { start, initialMessage, title, conversationId } =
    useLocalSearchParams<{
      start?: string;
      initialMessage?: string;
      title?: string;
      conversationId: string;
    }>();
  const nativeLang = "Spanish"; // Replace with user's native language

  const { isWaiting, sendMessage } = useChat(conversationId);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const hasSentInitial = React.useRef(false);
  const convLang = "english"; // temp
  const [selectedWord, setSelectedWord] = React.useState<string | null>(null);

  const translateResponse = async (word: string, language: string) => {
    try {
      const params = new URLSearchParams({ word, language });
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/translate?${params}`,
      );
      if (!response.ok) {
        throw new Error("Failed to translate word");
      }
      const data = await response.json();
      return data.result;
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error translating word",
        text2: "Please try again later.",
      });
    }
  };

  const getBackendMessages = async (conversationId: string) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/messages/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch backend messages");
      }
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
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error fetching messages",
        text2: "Please try again later.",
      });
      //console.error("Error fetching messages:", error);
    }
  };

  const appendUserAndPlaceholderAssistant = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString() + text,
      sender: "user",
      messageContent: text,
    };
    const assistantMessage: Message = {
      id: Date.now().toString() + text + "assistant",
      sender: "assistant",
      messageContent: "",
    };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
  };

  const appendMessageChunk = (chunk: string) => {
    setMessages((prev) => {
      const lastMessage = prev[prev.length - 1];
      // Update the last assistant message with the new chunk
      const updatedLastMessage: Message = {
        ...lastMessage,
        messageContent: lastMessage.messageContent + chunk,
      };
      return [...prev.slice(0, -1), updatedLastMessage];
    });
  };

  const handleSend = (messageText: string) => {
    appendUserAndPlaceholderAssistant(messageText);
    sendMessage(messageText, appendMessageChunk);
  };

  const handleVoiceUserTranscript = (text: string) => {
    appendUserAndPlaceholderAssistant(text);
  };

  const handleVoiceAssistantDelta = (chunk: string) => {
    appendMessageChunk(chunk);
  };

  const handleVoiceTurnDone = async (userText: string, assistantText: string) => {
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
  React.useEffect(() => {
    if (hasSentInitial.current) return;
    hasSentInitial.current = true;
    if (start || initialMessage) {
      if (start) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + start,
            sender: "assistant",
            messageContent: start,
          },
        ]);
      }
      if (initialMessage) {
        handleSend(initialMessage);
      }
    } else if (conversationId) {
      getBackendMessages(conversationId);
    }
  }, [start, initialMessage, conversationId]);

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
