import { View, Text } from "react-native";
import { router } from "expo-router";
import OnboardingButton from "@/components/onboardingButton";

export default function ImportVocabScreen() {
  return (
    <View className="flex-1 justify-between p-6 bg-[#F8F3EF]">
      <View>
        <Text className="text-4xl font-bold">Import your vocabulary</Text>
        <Text className="text-lg text-[#8B6F63] mt-4">
          Already using flashcards? Connect your app or skip for now.
        </Text>
      </View>

      <OnboardingButton
        title="Start chatting"
        onPress={() => router.push("/chat")}
      />
    </View>
  );
}
