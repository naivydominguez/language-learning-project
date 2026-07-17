import { View, Pressable } from "react-native";
import { Text, TextInput } from "@/components/Text";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import OnboardingButton from "./_components/OnboardingButton";
import { OnboardingColors } from "@/constants/onboardingTheme";
import { useState } from "react";
import { useOnboarding } from "./context/OnboardingContext";

export default function Personalization() {

  const {onboardingData,updateOnboardingData} = useOnboarding();
  const [name, setName] = useState(onboardingData.preferredName);
  const [personality, setPersonality] = useState(onboardingData.immerbotPersonality);

  function handleContinue(){
    updateOnboardingData({
        preferredName:name.trim(),
        immerbotPersonality:personality.trim(),
    });
    router.push("/onboarding/import-vocab");
  }

  return (
    <View className="flex-1 justify-between bg-background-light px-6 pt-8 pb-6">
      <View>
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.push("/onboarding/goal")}
            className="-ml-1 -mt-1 p-2"
          >
            <ArrowLeft
              size={20}
              color={OnboardingColors.secondary}
              strokeWidth={1.75}
            />
          </Pressable>

          <Text style={{ fontSize: 12, color: OnboardingColors.tertiary }}>
            Step 3 of 4
          </Text>
        </View>

        <Text weight="bold" className="text-3xl mb-3">Make it yours</Text>

        <Text className="text-lg text-foreground-secondary">
          You can change these later in Settings.
        </Text>

        <Text weight="bold" className="mt-14 mb-3 text-lg text-foreground-secondary">
          What should Immerbot call you?{" "}
          <Text weight="normal" className="text-foreground-tertiary">(optional)</Text>
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name or nickname"
          placeholderTextColor="#9B9692"
          style={{ outlineWidth: 0 } as any}
          className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-xl text-foreground"
        />

        <Text weight="bold" className="mt-14 mb-3 text-lg text-foreground-secondary">
          Give Immerbot a personality{" "}
          <Text weight="normal" className="text-foreground-tertiary">(optional)</Text>
        </Text>

        <TextInput
          value={personality}
          onChangeText={setPersonality}
          placeholder="e.g. Friendly and encouraging, like a language exchange partner living in Tokyo."
          placeholderTextColor="#9B9692"
          multiline
          style={{ outlineWidth: 0 } as any}
          className="rounded-xl border border-gray-200 bg-white px-5 py-8 text-xl text-foreground"
        />
      </View>

      <OnboardingButton
        title="Continue"
        onPress={handleContinue}
      />
    </View>
  );
}
