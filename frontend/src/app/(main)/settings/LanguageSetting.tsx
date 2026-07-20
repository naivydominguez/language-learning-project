import { View, Pressable, ScrollView } from "react-native";
import { Text } from "@/components/Text";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import SaveChangeButton from "./_components/SaveChangeButton";
import PageHeader from "./_components/PageHeader";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useAuth } from "@/hooks/use-auth";

export default function LanguageSetting() {
  const { session } = useAuth(); // Replace with your actual access token
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [nativeLanguage, setNativeLanguage] = useState("English");

  const languages = [
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

  const native_languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Mandarin",
    "Japanese",
    "Korean",
    "Portuguese",
    "Arabic",
    "Russian",
  ];

  const toggleLang = (languageName: string) => {
    if (selectedLanguages.includes(languageName)) {
      setSelectedLanguages(
        selectedLanguages.filter((name) => name !== languageName),
      );
    } else {
      setSelectedLanguages([...selectedLanguages, languageName]);
    }
  };

  const canContinue = selectedLanguages.length > 0 && nativeLanguage !== "";
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/me`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${session?.access_token}`, // Replace with your actual access token
          },
          body: JSON.stringify({
            target_languages: selectedLanguages.join(", "),
            native_language: nativeLanguage,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }
      return true;
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error saving changes",
        text2: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  };

  return (
    <View className="flex-1 bg-background-light">
      <PageHeader title="Language Setting" />

      <View className="flex-1 px-6 pt-8 pb-6">
        <View className="flex-1">
          <View>
            <Text weight="bold" className="text-lg mb-3">
              Your native language
            </Text>

            <View className="bg-white border border-gray-200 rounded-xl px-2 overflow-hidden">
              <Picker
                selectedValue={nativeLanguage}
                onValueChange={(value) => setNativeLanguage(value)}
                style={{ height: 52, color: "#1F1A17", outlineWidth: 0 } as any}
              >
                <Picker.Item label="Select a language" value="" />
                {native_languages.map((language) => (
                  <Picker.Item
                    key={language}
                    label={language}
                    value={language}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View className="mt-14 flex-1">
            <Text weight="bold" className="text-lg mb-3">
              Your target language(s)
            </Text>

            <Text className="text-[15px] leading-[26px] text-foreground-secondary">
              Choose one or more target languages.
            </Text>

            <ScrollView
              className="flex-1 mt-3"
              showsVerticalScrollIndicator={true}
            >
              {languages.map((language) => {
                const isSelected = selectedLanguages.includes(language.name);
                return (
                  <Pressable
                    key={language.name}
                    onPress={() => toggleLang(language.name)}
                    className={`flex-row items-center justify-between border rounded-xl px-6 py-5 mb-4 ${
                      isSelected
                        ? "bg-accent-light border-accent"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <View className="flex-row items-center">
                      <Text className="text-lg mr-5">{language.flag}</Text>
                      <Text
                        className={`text-base ${isSelected ? "text-primary-dark" : "text-foreground"}`}
                      >
                        {language.name}
                      </Text>
                    </View>
                    <View
                      className={`w-9 h-9 rounded-full bg-accent items-center justify-center ${
                        isSelected ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Text weight="bold" className="text-white text-base">
                        ✓
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>

        <SaveChangeButton onPress={handleSaveChanges} />
      </View>
    </View>
  );
}
