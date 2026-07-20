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
import { supabase } from "@/lib/supabase";
import { useChat } from "@/hooks/use-chat";
import MainHeader from "@/components/MainHeader";

type Message = {
  id: string;
  sender: "user" | "assistant";
  messageContent: string;
};
export default function ChatScreen() {
  const router = useRouter();
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

  const handleSend = (messageText: string) => {
    const userMessage: Message = {
      id: Date.now().toString() + messageText,
      sender: "user",
      messageContent: messageText,
    };
    const assistantMessage: Message = {
      id: Date.now().toString() + messageText + "assistant",
      sender: "assistant",
      messageContent: "",
    };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    sendMessage(messageText, (chunk) => {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        // Update the last assistant message with the new chunk
        const updatedLastMessage: Message = {
          ...lastMessage,
          messageContent: lastMessage.messageContent + chunk,
        };
        return [...prev.slice(0, -1), updatedLastMessage];
      });
    });
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
      <MainHeader title={title || "Chat"} />
      <ScrollView className="flex-1 bg-background">
        <View
          className="flex-row items-center gap-2 mb-4 bg-white border-shadow border-border pl-4 pb-2"
        >
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
