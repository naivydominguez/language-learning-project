import React from "react";
import { View, Pressable, Modal } from "react-native";
import { Text } from "./Text";
import Toast from "react-native-toast-message";
import { ArrowUp, ChevronDown, Mic } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type chatboxActionsProps = {
  onSend: () => void;
  canSend: boolean;
  showLanguagePicker?: boolean;
};
const LANGUAGES = [
  { name: "Japanese", flag: "🇯🇵" },
  { name: "Spanish", flag: "🇪🇸" },
  { name: "French", flag: "🇫🇷" },
  { name: "Korean", flag: "🇰🇷" },
  { name: "Mandarin", flag: "🇨🇳" },
  { name: "German", flag: "🇩🇪" },
  { name: "Portuguese", flag: "🇧🇷" },
  { name: "Italian", flag: "🇮🇹" },
  { name: "Arabic", flag: "🇸🇦" },
  { name: "Russian", flag: "🇷🇺" },
];
export default function ChatboxActions({ onSend, canSend, showLanguagePicker }: chatboxActionsProps) {
  const [language, setLanguage] = React.useState("english");
  const insets = useSafeAreaInsets();
  const accessToken = ""; // Replace with supabase auth token
  const [languagePickerOpen, setLanguagePickerOpen] = React.useState(false);
  const selectedLanguage = LANGUAGES.find((l) => l.name === language);
  const getLanguage = async () => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/user_languages/me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user language");
    }

    const data = await response.json();
    setLanguage(data.language);
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Error fetching user language",
    });
  }
};
  React.useEffect(() => {
    getLanguage();
  }, []);
  return (
    <View>
      <View className="flex-row items-center gap-2">
        {showLanguagePicker && (
          <Pressable
            onPress={() => setLanguagePickerOpen(true)}
            disabled={!canSend}
            className={`h-10 px-3 rounded-full flex-row items-center justify-center gap-1 mb-1 ${
              canSend ? "bg-primary-light" : "bg-background-dark"
            }`}
          >
            <Text className="text-sm text-foreground">{selectedLanguage?.name}</Text>
            <ChevronDown size={14} color="#8C6E60" strokeWidth={2} />
          </Pressable>
        )}

        <Pressable className="w-10 h-10 rounded-lg items-center justify-end mb-1">
          <Mic size={16} color={"#8C6E60"} strokeWidth={2} />
        </Pressable>

        <Pressable
          onPress={onSend}
          disabled={!canSend}
          className={`w-10 h-10 rounded-full items-center justify-end mb-1 ${
            canSend ? "bg-primary-light" : "bg-background-dark"
          }`}
        >
          <ArrowUp size={16} color={canSend ? "white" : "#BFAD9F"} strokeWidth={2} />
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
              const isSelected = lang.name === language;
              return (
                <Pressable
                  key={lang.name}
                  onPress={() => {
                    setLanguage(lang.name);
                    setLanguagePickerOpen(false);
                  }}
                  className={`flex-row items-center justify-between rounded-xl px-4 py-3 mb-2 border ${
                    isSelected ? "bg-accent-light border-accent" : "bg-white border-gray-200"
                  }`}
                >
                  <Text className={`text-base ${isSelected ? "text-primary-dark font-semibold" : "text-foreground"}`}>
                    {lang.name}
                  </Text>
                  {isSelected && (
                    <View className="w-6 h-6 rounded-full bg-accent items-center justify-center">
                      <Text className="text-white text-xs font-bold">✓</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
