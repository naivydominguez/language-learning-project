import { View, Pressable } from "react-native";
import { Text } from "@/components/Text";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import OnboardingButton from "./_components/OnboardingButton";
import { OnboardingColors } from "@/constants/onboardingTheme";
import { useState } from "react";
import { Check } from "lucide-react-native";
import { useOnboarding } from "./context/OnboardingContext";
import type { ImportType } from "@/lib/importNav";
import { savePendingOnboardingData } from "@/lib/onboardingStorage";

const options: {
    id: ImportType;
    title: string;
    subtitle: string;
    
} [] =[
        {id:"jpdb",title:"JPDB", subtitle:"Japanese vocabulary database"},
        {id:"anki",title:"Anki", subtitle:"Spaced repetition flashcards"},
        {id:"quizlet",title:"Quizlet", subtitle:"Online flashcard platform"},
    ];

export default function ImportVocab() {
    const {onboardingData, updateOnboardingData} = useOnboarding();
    const [selectedApps,setSelectedApps]= useState<ImportType[]>(onboardingData.selectedImportApps);

    function toggleApp(id:ImportType){
        if(selectedApps.includes(id)){
            setSelectedApps(selectedApps.filter((app) => app !== id));
        }
        else{
            setSelectedApps([...selectedApps,id]);
        }
    }

    const canContinue = selectedApps.length > 0

    function handleContinue(){
        if(!canContinue) return;

        updateOnboardingData({selectedImportApps:selectedApps,});

        const firstSelectedApp = selectedApps[0];

        router.push({
            pathname: `/onboarding/${firstSelectedApp}`,
            params: {
                selectedApps: JSON.stringify(selectedApps),
                currentIndex: "0",
            },
        });
    }

    async function handleSkip(){
        updateOnboardingData({ selectedImportApps:[],})
        await savePendingOnboardingData(onboardingData);
        router.push("/account/sign-up")
    }

    
  return (
    <View className="flex-1 justify-between bg-background-light px-6 pt-8 pb-6">
      <View>
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.push("/onboarding/personalize")}
            className="-ml-1 -mt-1 p-2"
          >
            <ArrowLeft
              size={20}
              color={OnboardingColors.secondary}
              strokeWidth={1.75}
            />
          </Pressable>

          <Text style={{ fontSize: 12, color: OnboardingColors.tertiary }}>
            Step 4 of 4
          </Text>
        </View>

        <Text weight="bold" className="text-3xl mb-3">
          Import your vocabulary
        </Text>

        <Text className="text-lg text-foreground-secondary">
          Already using flashcards? Connect your app to skip words you already
          know. You can always do this later.
        </Text>
      </View>

      <View>
        {options.map((option)=>{
            const isSelected = selectedApps?.includes(option.id);
            return(
                <Pressable key={option.id} onPress={()=>toggleApp(option.id)} className={`h-[120px] mt-3 flex-row items-center rounded-2xl border-2 px-8 ${
                  isSelected
                    ? "border-primary bg-primary-light/10"
                    : "border-gray-200 bg-white"
                }`}>
                    <View className="flex-1">
                        <Text weight="bold" className="text-[18px] text-primary-dark">{option.title}</Text>
                        <Text className="mt-2 text-[15px] text-foreground-secondary">{option.subtitle}</Text>
                    </View>

                    <View className={`h-11 w-11 flex-row items-center justify-center rounded-full border-2 ${
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-gray-200 bg-white"
                  }`}>
                    {isSelected && <Check size={20} color="white"/>}

                    </View>

                </Pressable>
            );
        })}
      </View>

      <View>
        <OnboardingButton
        title="Continue"
        disabled={!canContinue}
        onPress={handleContinue}
      />

      <Pressable onPress={handleSkip}>
      <Text className={"mt-3 text-xl text-foreground-secondary text-center"}>
            Skip for now
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
