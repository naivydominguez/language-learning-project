import { View, Pressable, ScrollView } from "react-native";
import { Text } from "@/components/Text";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import OnboardingButton from "@/components/onboardingButton";
import { OnboardingColors } from "@/constants/onboardingTheme";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";


export default function LanguageSelections() {
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [nativeLanguage, setNativeLanguage] = useState("English");

    const languages = [
        { name: 'Japanese', flag: '🇯🇵' }, { name: 'Spanish', flag: '🇪🇸' },
        { name: 'French', flag: '🇫🇷' },   { name: 'Korean', flag: '🇰🇷' },
        { name: 'Mandarin', flag: '🇨🇳' }, { name: 'German', flag: '🇩🇪' },
        { name: 'Portuguese', flag: '🇧🇷' }, { name: 'Italian', flag: '🇮🇹' },
        { name: 'Arabic', flag: '🇸🇦' },   { name: 'Russian', flag: '🇷🇺' },
    ];

    const native_languages = [
        'English', 'Spanish', 'French', 'German', 'Mandarin',
        'Japanese', 'Korean', 'Portuguese', 'Arabic', 'Russian',
    ];

    

    const toggleLang = (languageName : string) => {
        if(selectedLanguages.includes(languageName)){
            setSelectedLanguages(selectedLanguages.filter((name)=> name !== languageName));
        }
        else{
            setSelectedLanguages([...selectedLanguages,languageName]);
        }
    };

    const canContinue = selectedLanguages.length > 0 && nativeLanguage !== "";
    

  return (
    <View className="flex-1 justify-between bg-[#F8F3EF] px-6 pt-8 pb-6">
      <View className="flex-row items-center justify-between">
        <Pressable onPress={() => router.push("/onboarding")} className="-ml-1 -mt-1 p-2">
            <ArrowLeft
              size={20}
              color={OnboardingColors.secondary}
              strokeWidth={1.75}
            />
        </Pressable>
        
        <Text style={{ fontSize: 12, color: OnboardingColors.tertiary }}>
            Step 1 of 4
        </Text>
        </View>

        <Text weight="bold" className="text-3xl mb-3">
          What are you learning?
        </Text>

        <Text className="text-lg text-[#8B6F63]">
          Choose one or more target languages.
        </Text>


      <ScrollView className="max-h-[300px]" showsVerticalScrollIndicator={true}>
        {languages.map((language) => {
            const isSelected = selectedLanguages.includes(language.name);
            return(
                <Pressable key={language.name} onPress={() => toggleLang(language.name)}className={`flex-row items-center justify-between border rounded-xl px-6 py-5 mb-4 ${
                    isSelected 
                    ? "bg-[#FFF3ED] border-[#BF693F]"
                    : "bg-white border-gray-200"}`}>
                    <View className="flex-row items-center">
                        <Text className="text-xl mr-5">{language.flag}</Text>
                        <Text className={`text-xl ${isSelected ? "text-[#7A3F2A]" : "text-[#1F1A17]"}`}>{language.name}</Text>
                    </View>
                    {isSelected && (<View className="w-9 h-9 rounded-full bg-[#BF693F] items-center justify-center">
                        <Text weight="bold" className="text-white text-xl">✓</Text>
                    </View>)}

                </Pressable>
            );
        })}

      </ScrollView>

      <View className="mt-6">
        <Text weight="bold" className="text-[#B8A99F] tracking-widest mb-3">
            YOUR NATIVE LANGUAGE
        </Text>

        <View className="bg-white border border-gray-200  overflow-hidden">
            <Picker selectedValue={nativeLanguage} onValueChange={(value) => setNativeLanguage(value)}
                style={{height: 52,color: "#1F1A17",}}>
                
                <Picker.Item label="Select a language" value="" />
                {native_languages.map((language) => (
                    <Picker.Item
                    key={language}
                    label={language} 
                    value={language}
                    />))}
            </Picker>
            </View>
                             
      </View>
        
      <OnboardingButton
        title="Continue"
        disabled={!canContinue}
        onPress={() => {
            if (!canContinue) return;
            router.push("/onboarding/goal")}}
      />
    </View>
  );
}
