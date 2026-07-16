import React from "react";
import { Pressable, View } from "react-native";
import { ArrowUp } from "lucide-react-native";
type SendChatComponentProps = {
  onSend: () => void;
  canSend: boolean;
};
export default function SendChatComponent({ onSend, canSend }: SendChatComponentProps) {
  return (
    <View className="flex-row gap-2 justify-start">
      <Pressable
        onPress={onSend}
        disabled={!canSend}
        className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${
          canSend ? "bg-primary-light" : "bg-background-dark"
        }`}
      >
        <ArrowUp size={16} color={canSend ? "white" : "#BFAD9F"} strokeWidth={2} />
      </Pressable>
    </View>
  );
}