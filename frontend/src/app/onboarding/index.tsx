import { View } from "react-native";
import { Text } from "@/components/Text";
import { router } from "expo-router";
import OnboardingButton from "./_components/OnboardingButton";
import InfoCard from "@/app/onboarding/_components/InfoCard";
import { BookOpen, MessageCircle, Sparkles } from "lucide-react-native";

export default function OnboardingIndex() {
  return (
    <View className="flex-1 justify-between p-8 pb-4 bg-background-light">
      <View>
        <Text weight="bold" className="text-primary tracking-widest mb-4">
          THE SCIENCE
        </Text>

        <Text weight="bold" className="text-4xl mb-2">
          Language is acquired, not studied.
        </Text>

        <Text className="text-lg text-foreground-secondary mb-3 leading-6 ">
          Research by linguist Stephen Krashen shows that people acquire
          language by understanding input that is slightly beyond their current
          level. Finding input just right for you is tough, and that's where Immerbot comes in.
        </Text>

        <View>
          <InfoCard
            Icon={BookOpen}
            title="Comprehensible input"
            body="Reading and listening to content you mostly understand with a few unknown words is the most direct path to fluency."
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

      <View className="mt-4 flex flex-col gap-6">
        <OnboardingButton
          title="Let's get started"
          onPress={() => router.push("/onboarding/language")}
        />

        <Text className={"text-base text-center"}>
          <Text className="text-[#8C6E60]"> Returning User? </Text>

          <Text
            className="text-[#B5613A]"
            onPress={() => router.push("/account/sign-in")}
          >
            Sign In
          </Text>
        </Text>
      </View>
    </View>
  );
}
