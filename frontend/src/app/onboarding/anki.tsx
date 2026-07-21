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

export default function AnkiImport({ embedded = false, onDone }: settingPageProps = {}) {
  const onboarding = useOptionalOnboarding();
  const [name, setName] = useState("");

  const params = useLocalSearchParams<{
    selectedApps?: string;
    currentIndex?: string;
    path?: string;
    backButton?: string;
  }>();

  const selectedApps: ImportType[] = params.selectedApps
    ? JSON.parse(params.selectedApps)
    : [];

  const currentIndex = Number(params.currentIndex ?? "0");
  const backButton = params.backButton === "true";
  const backPath: Parameters<typeof router.push>[0] =
    (params.path as Parameters<typeof router.push>[0]) || "/onboarding/import-vocab";

  function handleContinue() {
    if (embedded) {
      onDone?.();
      return;
    }
    goToNextImport(selectedApps, currentIndex, async () => {
      if (onboarding) {
        await savePendingOnboardingData(onboarding.onboardingData);
      }
      backButton ? router.push(backPath) : router.replace("/account/sign-up");
    });
  }

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
            {!backButton && (
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
            )}

            <Text style={{ fontSize: 12, color: OnboardingColors.tertiary }}>
              Extra
            </Text>
          </View>
        )}

        {!embedded && (
          <Text weight="bold" className="text-3xl mb-3">
            Anki
          </Text>
        )}

        <Text weight="bold" className="mt-5 mb-3 text-lg text-[#8B6A5B]">
          Enter a .csv or .txt file
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter a file"
          placeholderTextColor="#9B9692"
          multiline
          style={{ outlineWidth: 0 } as any}
          className="rounded-xl border border-[#E2DEDB] bg-white px-5 py-4 text-xl text-[#241A14]"
        />
      </View>

      <OnboardingButton
        title={embedded ? "Import" : backButton ? "Done" : "Continue"}
        onPress={handleContinue}
      />
    </View>
  );
}
