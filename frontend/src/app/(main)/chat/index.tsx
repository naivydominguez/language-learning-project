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

type Message = {
  id: string;
  sender: "user" | "ai";
  messageContent: string;
};
export default function ChatScreen() {
  const router = useRouter();
  const { start, initialMessage, title, conversationId } =
    useLocalSearchParams<{
      start?: string;
      initialMessage?: string;
      title?: string;
      conversationId?: string;
    }>();
    const nativeLang= "Spanish"; // Replace with user's native language

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isWaiting, setIsWaiting] = React.useState(false);
  const hasSentInitial = React.useRef(false);
  const convLang= "english" // temp
 const [selectedWord, setSelectedWord] = React.useState<string | null>(null);
  const sendMessageToAI = async (
    context: string,
    conversationId: string,
    accessToken: string,
  ) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            content: context,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      return response.json();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error sending message",
        text2: "Please try again later.",
      });
      //  console.error("Error sending message:", error);
      //  throw error;
    }
  };

  const translateResponse = async (word: string, language: string) => {
    try {
      const parmas = new URLSearchParams({ word, language });
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/translate-language?${parmas}`,
        
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
  

  const getBackendMessages = async (
    conversationId: string,
  ) => {
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

  const handleSendBackend = async (messageText: string) => {
    if (!conversationId) {
      Toast.show({
        type: "error",
        text1: "No active conversation",
        text2: "Please start a new conversation from the home screen.",
      });
      return;
    }
    setIsWaiting(true);
    try {
      const newMessage: Message = {
        id: Date.now().toString() + messageText,
        sender: "user",
        messageContent: messageText,
      };
      setMessages((prev) => [...prev, newMessage]);

      const supabaseSession = await supabase.auth.getSession();
      const accessToken = supabaseSession.data.session?.access_token ?? "";
      const aiMessage = await sendMessageToAI(
        messageText,
        conversationId,
        accessToken,
      );

      const tranResponse =
        nativeLang === "Spanish" && convLang === "english"
          ? (await translateResponse(aiMessage.content, "spanish")) ?? aiMessage.content
          : aiMessage.content;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + aiMessage.content,
          sender: "ai",
          messageContent: tranResponse,
        },
      ]);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error sending message",
        text2: "Please try again later.",
      });
      //console.error("Error sending message:", error);
    } finally {
      setIsWaiting(false);
    }
  };

  React.useEffect(() => {
    if (hasSentInitial.current) return;
    hasSentInitial.current = true;
    if (start || initialMessage) {
      if (start) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + start,
            sender: "ai",
            messageContent: start,
          },
        ]);
      }
      if (initialMessage) {
        handleSendBackend(initialMessage);
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
          renderItem={({ item }) => <MessageBubble message={item} onWordPress={setSelectedWord} />}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          className="p-4"
        />
      </ScrollView>
      <ChatInputBar onSend={handleSendBackend} isWaiting={isWaiting} showLanguagePicker={false} />
      <WordPopup
        word={selectedWord || ""}
        language="spanish"
        visible={!!selectedWord}
        OnDismiss={() => setSelectedWord(null)}
      />
    </View>
  );
}
   