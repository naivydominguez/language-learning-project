import { View, Pressable } from "react-native";
import { Text } from "@/components/Text";
import { useState } from "react";
import { Check } from "lucide-react-native";
import PageHeader from "./_components/PageHeader";

const options =[
        {id:"jpdb",title:"JPDB", subtitle:"Japanese vocabulary database" , type: "Connect"},
        {id:"anki",title:"Anki", subtitle:"Spaced repetition flashcards" , type: "Import"},
        {id:"quizlet",title:"Quizlet", subtitle:"Online flashcard platform" , type: "Import"}
    ]

export default function ConnectedApps() {
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
    <View className="flex-1 bg-background-light">
      <PageHeader title="Connected Apps" />

      <View className="flex-1 justify-between px-6 pt-8 pb-6">
        <View>
          <Text weight="bold" className="text-lg mb-3">
            Import your vocabulary
          </Text>

          <Text className="text-[15px] leading-[26px] text-foreground-secondary">
            Already using flashcards? Connect your app to skip words you already
            know. You can always do this later.
          </Text>

          <View>
            {options.map((option) => {
              const isSelected = selectedApps?.includes(option.id);
              return (
                <View
                    key={option.id}
                 
                  className={`h-[120px] mt-3 flex-row items-center rounded-2xl border-2 px-8 ${
                    isSelected ? "border-primary bg-primary-light/10" : "border-gray-200 bg-white"
                  }`}
                >
                  <View className="flex-1">
                    <Text weight="bold" className="text-lg text-primary-dark">
                      {option.title}
                    </Text>
                    <Text className="mt-0.5 text-sm text-foreground-secondary">{option.subtitle}</Text>
                  </View>

                 
                  <Pressable className="bg-primary rounded-md p-2 items-center justify-center" onPress={() => toggleApp(option.id)}>
                    <Text
                      weight="bold"
                      className="text-sm text-white text-center"
                    >
                      {option.type}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
