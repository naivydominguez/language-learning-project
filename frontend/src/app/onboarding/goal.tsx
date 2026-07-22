import { View, Pressable } from "react-native";
import { Text } from "@/components/Text";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import OnboardingButton from "./_components/OnboardingButton";
import { OnboardingColors } from "@/constants/onboardingTheme";
import { useState } from "react";
import { useOnboarding } from "./context/OnboardingContext";

export default function DailyGoal() {
  const { onboardingData, updateOnboardingData } = useOnboarding();

  const goalOptions = [
    { label: "5 minutes", value: 5 },
    { label: "10 minutes", value: 10 },
    { label: "15 minutes", value: 15 },
    { label: "30 minutes", value: 30 },
    { label: "1 hour", value: 60 },
  ];

  const [selectedGoal, setSelectedGoal] = useState(onboardingData.dailyGoal);

  function handleContinue() {
    updateOnboardingData({
      dailyGoal: selectedGoal,
    });

    router.push("/onboarding/personalize");
  }

  return (
    <View className="flex-1 justify-between bg-background-light px-6 pt-8 pb-6">
      <View>
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.push("/onboarding/language")}
            className="-ml-1 -mt-1 p-2"
          >
            <ArrowLeft
              size={20}
              color={OnboardingColors.secondary}
              strokeWidth={1.75}
            />
          </Pressable>

          <Text style={{ fontSize: 12, color: OnboardingColors.tertiary }}>
            Step 2 of 4
          </Text>
        </View>

        <Text weight="bold" className="text-3xl mb-3">
          Daily goal
        </Text>

        <Text className="text-lg text-foreground-secondary">
          How long do you want to practice each day? This counts toward a daily streak.
        </Text>
      </View>

      <View className="mt-6">
        {goalOptions.map((goal) => {
          const isSelected = selectedGoal === goal.value;
          return (
            <Pressable
              key={goal.value}
              onPress={() => setSelectedGoal(goal.value)}
              className={`w-full rounded-xl border px-6 py-6 mb-4 flex-row justify-between items-center 
                    ${
                      isSelected
                        ? "bg-accent-light border-accent"
                        : "bg-white border-gray-200"
                    }`}
            >
              <Text
                className={`text-xl ${isSelected ? "text-primary-dark" : "text-foreground"}`}
              >
                {goal.label}
              </Text>
              {isSelected && <Text className="text-lg text-primary">✓</Text>}
            </Pressable>
          );
        })}
      </View>

      <OnboardingButton title="Continue" onPress={handleContinue} />
    </View>
  );
}
