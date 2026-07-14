import React from "react";
import { View, Pressable, KeyboardAvoidingView, Platform} from "react-native";
import { TextInput } from "./Text";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import { ArrowUp } from "lucide-react-native";

type Props = {
    onSend: (message: string) => void;
    isWaiting?: boolean;
}
export default function ChatInputBar({ onSend, isWaiting = false }: Props) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = React.useState("");
  const handleSend = () => {
        const trimmedMessage = message.trim();
    if (trimmedMessage && !isWaiting) {
      onSend(trimmedMessage);
      setMessage(""); // Clear the input after sending
    }
    };
    const canSend = !!message.trim() && !isWaiting;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ marginBottom: insets.bottom }}
        >
            <View className="flex-row items-center gap-2 p-2 bg-white rounded-lg shadow-md">
                <TextInput
                    className="flex-1 text-base text-foreground px-4 py-3 mr-2 rounded-xl bg-white max-h-32 p-2"
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Message Immerbot..."
                    placeholderTextColor="#8C6E60"
                    multiline
                    textAlignVertical="top"
                />
                <Pressable
                    onPress={handleSend}
                    disabled={!canSend}
                    className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${canSend ? "bg-primary-light"
                         : "bg-background-element"}`}
                >
                    <ArrowUp size={16} color={canSend ? "#FFFFFF" : "#BFAD9F"} strokeWidth={2} />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}
