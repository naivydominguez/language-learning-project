import { View, Text } from "react-native";
import { router } from "expo-router";
import OnboardingButton from "@/components/onboardingButton";
import InfoCard from "@/components/infoCard";
import { BookOpen, MessageCircle, Sparkles } from "lucide-react-native";


export default function OnboardingIndex() {
  return (
    
    <View className="flex-1 justify-between p-8 bg-[#F8F3EF]">
      <View>
        <Text className="text-[#B8663A] font-bold tracking-widest mb-4">
          THE SCIENCE
        </Text>

        <Text className="text-4xl font-bold mb-6">
          Language is acquired, not studied.
        </Text>

        <Text className="text-lg text-[#8B6F63] mb-3">
          Research by linguist Stephen Krashen shows that people acquire
          language by understanding input that is slightly beyond their current
          level — not through memorizing grammar rules.
        </Text>

        <View className="gap-y-4">
          <InfoCard
            Icon={BookOpen}
            title="Comprehensible input"
            body="Reading and listening to content you mostly understand — with a few unknown words — is the most direct path to fluency."
          />

          <InfoCard
            Icon={MessageCircle}
            title="Adaptive conversations"
            body="Immerbot adjusts every response to match your vocabulary, automatically introducing new words as you grow."
          />

          <InfoCard
            Icon={Sparkles}
            title="Unlimited immersion"
            body="Unlike podcasts or textbooks, the supply of personalized content is infinite and gets better the more you chat."
          />
        </View>
      </View>

      <View className="py-3">
        <OnboardingButton
          title="Let's get started"
          onPress={() => router.push("/onboarding/language")}
        />
      </View>
    </View>
  );
}
