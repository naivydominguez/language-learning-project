import React from "react";
import { View, Text } from "react-native";
type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};
export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === "user";
  return (
    <View className={`flex-row ${isUser ? "justify-end" : "justify-start"} `}>
      <View className={`max-w-[80%] p-3 rounded-lg ${isUser ? "bg-accent-subtle" : "bg-surface"}`}>
        <Text className="text-base ${isUser ? 'text-accent-subtle-fg' : 'text-foreground'}">{message.text}</Text>
      </View>
    </View>
  );
}
