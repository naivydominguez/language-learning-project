import { View, Pressable } from "react-native";
import { Text } from "@/components/Text";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import OnboardingButton from "./_components/OnboardingButton";
import { OnboardingColors } from "@/constants/onboardingTheme";
import { useState } from "react";

export default function DailyGoal() {
    const goalOptions=[ "5 minutes","10 minutes","15 minutes","30 minutes","1 hour"];
    const [selectedGoal,setSelectedGoal] = useState("15 minutes");
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
          How long do you want to practice each day? This counts toward your streak.
        </Text>
      </View>

      <View className="mt-6">
        {goalOptions.map((goal)=> {
            const isSelected = selectedGoal === goal;
            return (
                <Pressable key={goal} onPress={() => setSelectedGoal(goal)} className={`w-full rounded-xl border px-6 py-6 mb-4 flex-row justify-between items-center 
                    ${
                    isSelected
                    ? "bg-accent-light border-accent"
                    : "bg-white border-gray-200"}`}>
                    <Text className={`text-xl ${ isSelected ? "text-primary-dark" : "text-foreground"}`}>
                        {goal}
                    </Text>
                    {isSelected && (<Text className="text-lg text-primary">✓</Text>)}

                </Pressable>
                
            );
        })}

      </View>

      <OnboardingButton
        title="Continue"
        onPress={() => router.push("/onboarding/personalize")}
      />
    </View>
  );
}
