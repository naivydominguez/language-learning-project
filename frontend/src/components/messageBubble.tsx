import React from "react";
import { View, Text } from "react-native";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

type MessageBubbleProps = {
  message: Message;
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <View className={`w-full flex-row mb-2 ${isUser ? "justify-end" : "justify-start"}`}>
      <View className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser ? "bg-accent-subtle" : "bg-surface"}`}>
        <Text className={`text-base ${isUser ? "text-accent-subtle-fg" : "text-foreground"}`}>{message.text}</Text>
      </View>
    </View>
  );
}
