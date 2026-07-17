import Text from "@/components/Text";
import React from "react";
import { View } from "react-native";

type Message = {
  id: string;
  sender: "user" | "assistant";
  messageContent: string;
};

type MessageBubbleProps = {
  message: Message;
  onWordPress: (word: string) => void;
};

export default function MessageBubble({ message, onWordPress }: MessageBubbleProps) {
  const isUser = message.sender === "user";
  const words = message.messageContent.split(/(\s+)/);

  return (
    <View className={`w-full flex-row mb-2 items-end  ${isUser ? "justify-end" : "justify-start"}`}>
      <View
        className={`max-w-[80%] rounded-xl px-4 py-3 ${isUser ? "bg-[#f4d6c6]" : "bg-white"} ${isUser ? "rounded-tr-none" : "rounded-tl-none"}`}
      >
        <Text className={`text-base ${isUser ? "text-primary-dark" : "text-foreground"}`}>
          {words.map((word, index) => {
            if (word.trim() === "") {
              return <Text key={index}>{word}</Text>;
            } else {
              return (
                <Text key={index} onPress={() => onWordPress(word)}>
                  {word}
                </Text>
              );
            }
          })}
        </Text>
      </View>
    </View>
  );
}
