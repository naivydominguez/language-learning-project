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
  onWordPress: (word: string) => void;
};

export default function MessageBubble({ message, onWordPress }: MessageBubbleProps) {
  const isUser = message.sender === "user";
  const words= message.messageContent.split(/(\s+)/);
  return (
    <View className={`w-full flex-row mb-2 items-end  ${isUser ? "justify-end" : "justify-start"}`}>
     
<<<<<<< HEAD:frontend/src/components/messageBubble.tsx
      <View className={`max-w-[80%] rounded-xl px-4 py-3 ${isUser ? "bg-accent-subtle" : "bg-surface"} ${isUser ? "rounded-tr-none" : "rounded-tl-none"}`}>
        <Text className={`text-base ${isUser ? "text-accent-subtle-fg" : "text-foreground"}`}>
          {words.map((word, index) => {
            if (word.trim() === "") {
             return  <Text key={index}>{word}</Text>
            } else {
               return ( <Text key={index} onPress= {() => onWordPress(word)}>{word}</Text> );
              }
            })}
          </Text>
=======
      <View className={`max-w-[80%] rounded-xl px-4 py-3 ${isUser ? "bg-[#f4d6c6]" : "bg-white"} ${isUser ? "rounded-tr-none" : "rounded-tl-none"}`}>
        <Text className={`text-base ${isUser ? "text-primary-dark" : "text-foreground"}`}>{message.messageContent}</Text>
>>>>>>> origin/main:frontend/src/app/chat/_components/MessageBubble.tsx
      </View>
      
    </View>
  );
}
