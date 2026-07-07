import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ChatInputBar from "../components/ui/chatInputBar";
import MessageBubble from "../components/messageBubble";
import { FlatList } from "react-native-gesture-handler";

type Message = {
  id: string;
  sender: "user" | "ai";
  context: string;
};

export default function ChatScreen() {
  const { start,initialMessage, title } = useLocalSearchParams<{
    start? :string;
    initialMessage?: string;
    title?: string;
    conversationId?: string;
  }>();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const hasSentInitial = React.useRef(false);

  const handleSend = (messageText: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      context: messageText,
    };

    setMessages((prev) => [...prev, newMessage]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          context: `AI reply to: ${messageText}`,
          sender: "ai",
        },
      ]);
    }, 500);
  };

   
      
  React.useEffect(() => {
    if (!hasSentInitial.current) {
      hasSentInitial.current = true;
      if (start) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "ai", context: start },
        ]);
      }
      if (initialMessage) {
        handleSend(initialMessage);
      }
    }
  }, [start, initialMessage]);

  return (
    <View className="flex-1 bg-background p-4" style={{ paddingTop: 60 }}>
      <View className="items-center justify-center mb-4 border-b border-border pb-2">
      {title ? (
        <Text className="font-sans text-lg font-semibold text-foreground text-center mb-2">
          {title}
        </Text>
      ) : null}
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={{ padding: 16, gap: 8 }}
      />
      <ChatInputBar onSend={handleSend} />
    </View>
  );
}
