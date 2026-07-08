import React from "react";
import { Text, View, TextInput, Pressable, KeyboardAvoidingView, Platform} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import { ArrowUp } from "lucide-react-native";

type Props = {
    onSend: (message: string) => void;
}
export default function ChatInputBar({ onSend }: Props) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = React.useState("");
  const handleSend = () => {
        const trimmedMessage = message.trim();
    if (trimmedMessage) {
      onSend(trimmedMessage);
      setMessage(""); // Clear the input after sending
    }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ marginBottom: insets.bottom }}
        >
            <View className="flex-row items-center gap-2 p-2 bg-gray-200 rounded-lg">
                <TextInput
                    className="flex-1 text-base text-forground px-4 py-3 mr-2 rounded-3xl bg-background-element max-h-32 p-2"
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Message Immer bot..."
                    placeholderTextColor="#8C6E60"
                    multiline
                    textAlignVertical="top"
                />
                <Pressable
                    onPress={handleSend}
                    disabled={!message.trim()}
                    className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${message.trim() ? "bg-primary-light"
                         : "bg-background-element"}`}
                >
                    <ArrowUp size={16} color={message.trim() ? "#FFFFFF" : "#BFAD9F"} strokeWidth={2} />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}
