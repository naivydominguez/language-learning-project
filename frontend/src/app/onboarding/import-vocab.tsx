import { View, Text, Pressable } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import OnboardingButton from "@/components/onboardingButton";
import { OnboardingColors } from "@/constants/onboardingTheme";
import { useState } from "react";
import { Check } from "lucide-react-native";

const options =[
        {id:"jpdb",title:"JPDB", subtitle:"Japanese vocabulary database"},
        {id:"anki",title:"Anki", subtitle:"Spaced repetition flashcards"},
        {id:"quizlet",title:"Quizlet", subtitle:"Online flashcard platform"}
    ]

export default function LanguageSelections() {
    const [selectedApps,setSelectedApps]= useState<string[]>([]);

    function toggleApp(id:string){
        if(selectedApps?.includes(id)){
            setSelectedApps(selectedApps.filter((app) => app !== id));
        }
        else{
            setSelectedApps([...selectedApps,id]);
        }
    }
    
  return (
    <View className="flex-1 justify-between bg-[#F8F3EF] px-6 pt-8 pb-6">
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
        

        <Text className="text-3xl font-bold mb-3">
          Import your vocabulary
        </Text>

        <Text className="text-lg text-[#8B6F63]">
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
                    ? "border-[#BA6238] bg-[#FFF3EE]"
                    : "border-[#E4E1DF] bg-white"
                }`}>
                    <View className="flex-1">
                        <Text className="text-[18px] font-bold text-[#4A2A1F]">{option.title}</Text>
                        <Text className="mt-2 text-[15px] text-[#8F7164]">{option.subtitle}</Text>
                    </View>

                    <View className={`h-11 w-11 flex-row items-center justify-center rounded-full border-2 ${
                    isSelected
                      ? "border-[#BA6238] bg-[#BA6238]"
                      : "border-[#E4E1DF] bg-white"
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
        onPress={() => router.push("/chat")}
      />

      <Pressable onPress={()=> router.push("/chat")}>
      <Text className={"mt-3 text-xl text-[#8C6E60] text-center"}>
            Skip for now
        </Text>
    </Pressable>

      </View>

      
    </View>
  );
}
