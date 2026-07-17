import { View } from "react-native";
import { Text, TextInput } from "@/components/Text";
import { useState } from "react";
import SaveChangeButton from "./_components/SaveChangeButton";
import PageHeader from "./_components/PageHeader";

export default function PersonalizationSetting() {
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");
    const handleSaveChanges = () => {
    // Handle save changes logic here
    console.log("Name:", name);
    console.log("Personality:", personality);
  }
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
              className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-base text-foreground"
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
              className="rounded-xl border border-gray-200 bg-white px-5 py-8 text-base text-foreground"
            ></TextInput>
          </View>
        </View>

        <SaveChangeButton onPress={handleSaveChanges} />
      </View>
    </View>
  );
}
