import { View, Text } from "react-native";
import { router } from "expo-router";
import OnboardingButton from "@/components/onboardingButton";

export default function OnboardingIndex() {
  return (
    <View className="flex-1 justify-between p-6 bg-[#F8F3EF]">
      <View>
        <Text className="text-[#B8663A] font-bold tracking-widest mb-6">
          THE SCIENCE
        </Text>

        <Text className="text-4xl font-bold mb-6">
          Language is acquired, not studied.
        </Text>

        <Text className="text-lg text-[#8B6F63]">
          Research by linguist Stephen Krashen shows 
          that people acquire language by understanding input that
          is slightly beyond their current level — not through
          memorizing grammar rules.
        </Text>
      </View>

      <OnboardingButton
        title="Let's get started"
        onPress={() => router.push("/onboarding/import-vocab")}
      />
    </View>
  );
}




