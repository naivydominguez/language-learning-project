import { View, Pressable } from "react-native";
import { Text, TextInput } from "@/components/Text";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import OnboardingButton from "@/components/OnboardingButton";
import { OnboardingColors } from "@/constants/onboardingTheme";
import { useState } from "react";

export default function Personalization() {
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");

  return (
    <View className="flex-1 justify-between bg-[#F8F3EF] px-6 pt-8 pb-6">
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

        <Text className="text-lg text-[#8B6F63]">
          You can change these later in Settings.
        </Text>

        <Text weight="bold" className="mt-14 mb-3 text-lg text-[#8B6A5B]">
          What should Immerbot call you?{" "}
          <Text weight="normal" className="text-[#B8A79E]">(optional)</Text>
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name or nickname"
          placeholderTextColor="#9B9692"
          multiline
          style={{ outlineWidth: 0 } as any}
          className="rounded-xl border border-[#E2DEDB] bg-white px-5 py-4 text-xl text-[#241A14]"
        />

        <Text weight="bold" className="mt-14 mb-3 text-lg text-[#8B6A5B]">
          Give Immerbot a personality{" "}
          <Text weight="normal" className="text-[#B8A79E]">(optional)</Text>
        </Text>

        <TextInput
          value={personality}
          onChangeText={setPersonality}
          placeholder="e.g. Friendly and encouraging, like a language exchange partner living in Tokyo."
          placeholderTextColor="#9B9692"
          multiline
          style={{ outlineWidth: 0 } as any}
          className="rounded-xl border border-[#E2DEDB] bg-white px-5 py-8 text-xl text-[#241A14]"
        ></TextInput>
      </View>

      <OnboardingButton
        title="Continue"
        onPress={() => router.push("/onboarding/import-vocab")}
      />
    </View>
  );
}
