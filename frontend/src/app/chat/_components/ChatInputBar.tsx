import React from "react";
import { View, Pressable, KeyboardAvoidingView, Platform, Modal} from "react-native";
import { Text ,TextInput } from "../../../components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowUp, ChevronDown } from "lucide-react-native";

const LANGUAGES = [
  { name: "English", value: "english" },
  { name: "French", value: "french" },
  { name: "Spanish", value: "spanish" },
];
type Props = {
  onSend: (message: string) => void;
  isWaiting?: boolean;
};
export default function ChatInputBar({ onSend, isWaiting = false }: Props) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = React.useState("");
  const [language, setLanguage] = React.useState("english");
  const [languagePickerOpen, setLanguagePickerOpen] = React.useState(false);
  const selectedLanguage = LANGUAGES.find((l) => l.value === language);
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
          className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${
            canSend ? "bg-primary-light" : "bg-background-element"
          }`}
        >
          <ArrowUp size={16} color={canSend ? "#FFFFFF" : "#BFAD9F"} strokeWidth={2} />
        </Pressable>
      </View>
      <Modal
        visible={languagePickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguagePickerOpen(false)}
      >
        <Pressable className="flex-1 justify-end bg-black/30" onPress={() => setLanguagePickerOpen(false)}>
          <View className="bg-white rounded-t-2xl p-4" style={{ marginBottom: insets.bottom }}>
            <Text className="text-base font-semibold text-foreground mb-3">Chat language</Text>
            {LANGUAGES.map((lang) => {
              const isSelected = lang.value === language;
              return (
                <Pressable
                  key={lang.value}
                  onPress={() => {
                    setLanguage(lang.value);
                    setLanguagePickerOpen(false);
                  }}
                  className={`flex-row items-center justify-between rounded-xl px-4 py-3 mb-2 border ${
                    isSelected ? "bg-[#FFF3ED] border-[#BF693F]" : "bg-white border-gray-200"
                  }`}
                >
                  <Text className={`text-base ${isSelected ? "text-[#7A3F2A] font-semibold" : "text-[#1F1A17]"}`}>
                    {lang.name}
                  </Text>
                  {isSelected && (
                    <View className="w-6 h-6 rounded-full bg-[#BF693F] items-center justify-center">
                      <Text className="text-white text-xs font-bold">✓</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}
