import { View, Pressable } from "react-native";
import { Text } from "@/components/Text";
import { useState } from "react";
import { useRouter, usePathname } from "expo-router";

import PageHeader from "./_components/PageHeader";

const options = [
  {
    id: "jpdb",
    title: "JPDB",
    subtitle: "Japanese vocabulary database",
    type: "Connect",
    path: "/settings/Jpdb",
  },
  {
    id: "anki",
    title: "Anki",
    subtitle: "Spaced repetition flashcards",
    type: "Import",
    path: "/settings/Anki",
  },
  {
    id: "quizlet",
    title: "Quizlet",
    subtitle: "Online flashcard platform",
    type: "Import",
    path: "/settings/Quizlet",
  },
] as const;

export default function ConnectedApps() {
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
   const navigate = (path: Parameters<typeof router.push>[0]) => {
     router.push(path);
   };
  function toggleApp(id: string) {

    if (selectedApps?.includes(id)) {
      setSelectedApps(selectedApps.filter((app) => app !== id));
    } else {
      setSelectedApps([...selectedApps, id]);
    }
    navigate(options.find((option) => option.id === id)?.path || "/");
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
                  className="h-[120px] mt-3 flex-row items-center rounded-2xl border-2 px-8 border-gray-200 bg-white"
                >
                  <View className="flex-1">
                    <Text weight="bold" className="text-lg text-primary-dark">
                      {option.title}
                    </Text>
                    <Text className="mt-0.5 text-sm text-foreground-secondary">
                      {option.subtitle}
                    </Text>
                  </View>

                  <Pressable
                    className="bg-primary rounded-md px-4 py-2 items-center justify-center"
                    onPress={() => toggleApp(option.id)}
                  >
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
