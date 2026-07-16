import React from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import {  TextInput } from "../../../../components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChatboxActions from "../../../../components/ChatboxActions";

type Props = {
  onSend: (message: string) => void;
  isWaiting?: boolean;
  showLanguagePicker?: boolean;
};
export default function ChatInputBar({ onSend, isWaiting = false, showLanguagePicker = true }: Props) {
  const [message, setMessage] = React.useState("");
    const handleSend = () => {
      const trimmedMessage = message.trim();
      if (trimmedMessage && !isWaiting) {
        onSend(trimmedMessage);
        setMessage(""); // Clear the input after sending
      }
    };
  const canSend = !!message.trim() && !isWaiting;
  const insets = useSafeAreaInsets();
    
  return (
    <KeyboardAvoidingView
    
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ marginBottom: insets.bottom }}
    >
      <View className="flex  gap-2 p-2 bg-white rounded-lg shadow-md w-full">
        <View>
          <TextInput
            className="flex-1 text-base text-foreground px-4 py-3 mr-2 rounded-xl bg-white max-h-32 p-2"
            value={message}
            onChangeText={setMessage}
            placeholder="Message Immerbot..."
            placeholderTextColor="#8C6E60"
            multiline
            textAlignVertical="top"
          />
        </View>
        <View className="border-t border-foreground/10 pt-1">
          <ChatboxActions onSend={handleSend} canSend={canSend} showLanguagePicker={showLanguagePicker} />
        </View>
      </View>
      
    </KeyboardAvoidingView>
  );
}
