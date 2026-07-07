import React from "react";
import Avatar from "./avatar";
import { View, Text } from "react-native";

type Message = {
  id: string;
  sender: "user" | "ai";
  context: string;
};

type MessageBubbleProps = {
  message: Message;
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <View className={`w-full flex-row mb-2 items-end bg-background-light ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <View className="mr-4 ">
          <Avatar isUser={isUser} />
        </View>
      )}
      <View className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser ? "bg-accent-subtle" : "bg-surface"}`}>
        <Text className={`text-base ${isUser ? "text-accent-subtle-fg" : "text-foreground"}`}>{message.context}</Text>
      </View>
      {isUser && (
        <View className="ml-4 ">
          <Avatar isUser={isUser} />
        </View>
      )}
    </View>
  );
}
