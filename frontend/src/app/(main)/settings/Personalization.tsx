import { View } from "react-native";
import { Text, TextInput } from "@/components/Text";
import { useState } from "react";
import SaveChangeButton from "./_components/SaveChangeButton";
import PageHeader from "./_components/PageHeader";
import Toast from "react-native-toast-message";
const accessToken = "YOUR_ACCESS_TOKEN"; // Replace with your actual access token
export default function PersonalizationSetting() {
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");
    const handleSaveChanges = async () => {
         try {
           const response = await fetch(
             `${process.env.EXPO_PUBLIC_BACKEND_URL}/user`,
             {
               method: "POST",
               headers: {
                 "Content-Type": "application/json",
                 authorization: `Bearer ${accessToken}`, // Replace with your actual access token
               },
               body: JSON.stringify({
                 name: name,
                 personality: personality,
               }),
             },
           );
   
           setName("");
           setPersonality("");
           if (!response.ok) {
             throw new Error("Failed to save changes");
           }
         } catch (error) {
           Toast.show({
             type: "error",
             text1: "Error saving changes",
             text2: error instanceof Error ? error.message : String(error),
           });
         }
       };
  return (
    <View className="flex-1 bg-background-light">
      <PageHeader title="Personalization" />

      <View className="flex-1 justify-between px-6 pt-8 pb-6">
        <View>
          <Text weight="bold" className="text-lg mb-3">
            Make it yours
          </Text>

          <Text className="text-[15px] leading-[26px] text-foreground-secondary">You can change these later in Settings.</Text>

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
          </View>

          <View>
            <Text weight="bold" className="mt-14 mb-3 text-sm text-foreground-secondary">
              Give Immerbot a personality{" "}
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
          </View>
        </View>

        <SaveChangeButton onPress={handleSaveChanges} />
      </View>
    </View>
  );
}
