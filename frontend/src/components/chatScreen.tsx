import React from "react";
import { View } from "react-native";
import ChatInputBar from "./ui/chatInputBar";
import MessageBubble from "./messageBubble";
import { FlatList } from "react-native-gesture-handler";

type Message = {
  id: string;
  sender: "user" | "ai";
  context: string;
};

type Props = {
  text?: string;
};
type Prop = {
  conversationId: string;
};
export default function ChatScreen({ conversationId }: Prop) {
  const [messages, setMessages] = React.useState<Message[]>([]);

  const handleSend = (messageText: string) => {
     console.log("Sending message:", messageText); // Debugging log

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

  return (
    <View className="flex-1 bg-background p-4" style={{ paddingTop: 60 }}>
    <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={{ padding:16 , gap: 8 }}/>

      <ChatInputBar onSend={handleSend} />
    </View>
  );
}
