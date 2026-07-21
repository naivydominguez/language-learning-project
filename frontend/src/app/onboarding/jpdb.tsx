import { View, Pressable } from "react-native";
import { Text, TextInput } from "@/components/Text";
import { ArrowLeft } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import OnboardingButton from "./_components/OnboardingButton";
import { OnboardingColors } from "@/constants/onboardingTheme";
import { useState } from "react";
import { goToNextImport, ImportType } from "@/lib/importNav";
import { useOptionalOnboarding } from "./context/OnboardingContext";
import { savePendingOnboardingData } from "@/lib/onboardingStorage";

type settingPageProps = {
  embedded?: boolean;
  onDone?: () => void;
};

export default function JPDBImport({ embedded = false, onDone }: settingPageProps = {}) {
  const onboarding = useOptionalOnboarding();

  const [apiKey, setApiKey] = useState(onboarding?.onboardingData.jpdbApiKey ?? "");

  const canContinue = apiKey.trim().length > 0;

  async function handleContinue() {
    if (!canContinue) return;

    if (embedded) {
      onDone?.();
      return;
    }

    const completeOnboardingData = {
      ...onboarding!.onboardingData,
      jpdbApiKey: apiKey.trim(),
    };

    onboarding!.updateOnboardingData({ jpdbApiKey: apiKey.trim() });

    await goToNextImport(selectedApps, currentIndex, async () => {
      await savePendingOnboardingData(completeOnboardingData);
      router.replace("/account/sign-up");
    });
  }

  const params = useLocalSearchParams<{
    selectedApps?: string;
    currentIndex?: string;
  }>();

  const selectedApps: ImportType[] = params.selectedApps
    ? JSON.parse(params.selectedApps)
    : [];

  const currentIndex = Number(params.currentIndex ?? "0");

  return (
    <View
      className={
        embedded
          ? "flex-1 justify-between px-6 pt-4 pb-6"
          : "flex-1 justify-between bg-[#F8F3EF] px-6 pt-8 pb-6"
      }
    >
      <View>
        {!embedded && (
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => router.push("/onboarding/import-vocab")}
              className="-ml-1 -mt-1 p-2"
            >
              <ArrowLeft
                size={20}
                color={OnboardingColors.secondary}
                strokeWidth={1.75}
              />
            </Pressable>

            <Text style={{ fontSize: 12, color: OnboardingColors.tertiary }}>
              Extra
            </Text>
          </View>
        )}

        {!embedded && (
          <Text weight="bold" className="text-3xl mb-3">
            Enter your JPDB API Key
          </Text>
        )}

        <Text className="text-lg text-[#8B6F63]">
          You can get this from JPDB in Settings, Account Information API Key.
          Account Information can be found at the bottom of the page.
        </Text>

        <Text weight="bold" className="mt-5 mb-3 text-lg text-[#8B6A5B]">
          API Key
        </Text>

        <TextInput
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="Enter your API key"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#9B9692"
          secureTextEntry
          style={{ outlineWidth: 0 } as any}
          className="rounded-xl border border-[#E2DEDB] bg-white px-5 py-4 text-xl text-[#241A14]"
        />
      </View>

      <OnboardingButton
        title={embedded ? "Save" : "Continue"}
        disabled={!canContinue}
        onPress={handleContinue}
      />
    </View>
  );
}
