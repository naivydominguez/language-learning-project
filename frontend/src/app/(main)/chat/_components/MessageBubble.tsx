import Text from "@/components/Text";
import React from "react";
import { View } from "react-native";
import TypingIndicator from "./TypingIndicator";

type Message = {
  id: string;
  sender: "user" | "assistant";
  content: string;
  unknownWords?: string[];
};

type MessageBubbleProps = {
  message: Message;
  onWordPress: (word: string) => void;
};

export default function MessageBubble({
  message,
  onWordPress,
}: MessageBubbleProps) {
  const isUser = message.sender === "user";
  const words = message.content.split(/(\s+)/);

  return (
    <View
      className={`w-full flex-row mb-2 items-end  ${isUser ? "justify-end" : "justify-start"}`}
    >
      <View
        className={`max-w-[80%] rounded-xl px-4 py-3 ${isUser ? "bg-[#f4d6c6]" : "bg-white"} ${isUser ? "rounded-tr-none" : "rounded-tl-none"}`}
      >
        {message.content === "" ? (
          <TypingIndicator color={isUser ? "#6f3a22" : "#201810"} />
        ) : (
          <Text
            className={`text-base ${isUser ? "text-primary-dark" : "text-foreground"}`}
          >
            {words.map((word, index) => {
              const bare = word.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
              const isUnknown =
                !!bare &&
                !!message.unknownWords?.some((w) => w.toLowerCase() === bare);
              if (word.trim() === "") {
                return <Text key={index}>{word}</Text>;
              } else {
                return (
                  <Text
                    key={index}
                    onPress={() => onWordPress(word)}
                    className={
                      isUnknown ? "text-primary-light/80 underline" : undefined
                    }
                  >
                    {word}
                  </Text>
                );
              }
            })}
          </Text>
        )}
      </View>
    </View>
  );
}
