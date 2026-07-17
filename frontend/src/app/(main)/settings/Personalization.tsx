import { Pressable, View, ScrollView } from "react-native";
import { Text, TextInput } from "@/components/Text";
import { useState } from "react";
import { Check } from "lucide-react-native";
import SaveChangeButton from "./_components/SaveChangeButton";
import PageHeader from "./_components/PageHeader";
import Toast from "react-native-toast-message";
const accessToken = "YOUR_ACCESS_TOKEN"; // Replace with your actual access token
export default function PersonalizationSetting() {
const preset = [
  { title: "Friendly exchange partner", description: "like a language exchange partner living in Tokyo." },
  {
    title: "Patient tutor",
    description: "Patient and methodical, like a tutor who explains things clearly and never rushes.",
  },
  { title: "Casual friend", description: "Casual and relaxed, like a native-speaking friend textraling on their phone." },
  { title: "Cultural guide", description: "Knowledgeable about different cultures, like a cultural ambassador who can provide insights into local customs and traditions." }
];
  const [name, setName] = useState("");

  const [personality, setPersonality] = useState("");
    const handleSaveChanges = async () => {
         try {
           const response = await fetch(
             `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/me`,
             {
               method: "PATCH",
               headers: {
                 "Content-Type": "application/json",
                 authorization: `Bearer ${accessToken}`, // Replace with your actual access token
               },
               body: JSON.stringify({
                 name: name,
                 personality_prompt: personality,
               }),
             },
           );
   
           setName("");
           setPersonality("");
           if (!response.ok) {
             throw new Error("Failed to save changes");
           }
           return true;
         } catch (error) {
           Toast.show({
             type: "error",
             text1: "Error saving changes",
             text2: error instanceof Error ? error.message : String(error),
           });
           return false;
         }
       };
  return (
    <View className="flex-1 bg-background-light">
      <PageHeader title="Personalization" />

      <View className="flex-1 px-6 pt-3 pb-3">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View>
            <Text weight="bold" className="mt-14 mb-3 text-sm text-foreground-secondary">
              What should Immerbot call you?{" "}
              <Text weight="normal" className="text-foreground-tertiary">
                (optional)
              </Text>
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name or nickname"
              placeholderTextColor="#9B9692"
              multiline
              style={{ outlineWidth: 0 } as any}
              className="rounded-xl border border-gray-200 bg-background-light px-5 py-4 text-base text-foreground"
            />
            <Text className="text-foreground-tertiary text-sm">
              Immerbot will use this name when addressing you in conversations.
            </Text>
          </View>

          <View>
            <Text weight="bold" className="mt-14 mb-3 text-sm text-foreground-secondary">
              Immerbot personality{" "}
              <Text weight="normal" className="text-foreground-tertiary">
                (optional)
              </Text>
            </Text>

            <TextInput
              value={personality}
              onChangeText={setPersonality}
              placeholder="e.g. Friendly and encouraging, like a language exchange partner living in Tokyo."
              placeholderTextColor="#9B9692"
              multiline
              style={{ outlineWidth: 0 } as any}
              className="rounded-xl border border-gray-200 bg-background-light px-5 py-8 text-base text-foreground"
            ></TextInput>
            <Text className="text-foreground-tertiary text-sm">
              This prompt is applied to every conversation. Keep it concise.
            </Text>

            <View className="mt-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text>Quick presets</Text>
              </View>
              {preset.map((item) => (
                <Pressable
                  key={item.title}
                  onPress={() => setPersonality(item.description)}
                  className={`rounded-md border ${personality === item.description ? "border-primary bg-background-dark" : "border-gray-200 bg-background"} px-5 py-4 text-base  flex-row text-foreground mb-3`}
                >
                  {personality === item.description ? <Check size={20} color={"#B5613A"} /> : null}
                  <Text className={`${personality === item.description ? "text-primary ml-4" : "text-foreground"}`}>{item.title}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        <SaveChangeButton onPress={handleSaveChanges} />
      </View>
    </View>
  );
}
