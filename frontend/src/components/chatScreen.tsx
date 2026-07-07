import React from "react";
import { View } from "react-native";
import ChatInputBar from "./ui/chatInputBar";
import MessageBubble from "./messageBubble";
import { FlatList } from "react-native-gesture-handler";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

type Props = {
  text?: string;
};

export default function ChatScreen({ text = "" }: Props) {
  const [messages, setMessages] = React.useState<Message[]>([]);

  const handleSend = (messageText: string) => {
     console.log("Sending message:", messageText); // Debugging log

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: `Bot reply to: ${messageText}`,
          sender: "bot",
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
