import Text from "@/components/Text";
import React from "react";
import { View } from "react-native";

type Message = {
  id: string;
  sender: "user" | "ai";
  messageContent: string;
};

type MessageBubbleProps = {
  message: Message;
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <View className={`w-full flex-row mb-2 items-end  ${isUser ? "justify-end" : "justify-start"}`}>
     
      <View className={`max-w-[80%] rounded-xl px-4 py-3 ${isUser ? "bg-[#f4d6c6]" : "bg-white"} ${isUser ? "rounded-tr-none" : "rounded-tl-none"}`}>
        <Text className={`text-base ${isUser ? "text-primary-dark" : "text-foreground"}`}>{message.messageContent}</Text>
      </View>
      
    </View>
  );
}
