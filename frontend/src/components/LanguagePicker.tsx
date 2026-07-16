import { useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { Text } from "./Text";
import React from "react";
import { Modal, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronDown } from "lucide-react-native";

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

const accessToken = ""; // Replace with your actual access token

export default function LanguagePicker() {
  const [language, setLanguage] = React.useState(LANGUAGES[0].name);
  const insets = useSafeAreaInsets();
  const [languagePickerOpen, setLanguagePickerOpen] = React.useState(false);
  const selectedLanguage = LANGUAGES.find((l) => l.name === language);

  useQuery({
    queryKey: ["userLanguage"],
    queryFn: async () => {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/user_languages/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Error fetching user language",
        });
      }

      const data = await response.json();
      setLanguage(data.language);
      return data;
    },
  });

  return (
    <View>
      <Pressable
        onPress={() => setLanguagePickerOpen(true)}
        className="px-5 py-3 rounded-xl flex-row items-center gap-2.5 mb-1 bg-background-light border border-foreground/10"
      >
        <Text className="text-xl">{selectedLanguage?.flag}</Text>
        <Text className="text-md font-semi text-foreground">{selectedLanguage?.name}</Text>
        <ChevronDown size={18} color="#BFAD9F" strokeWidth={2} />
      </Pressable>
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
