import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import KnownWordsPill from "@/app/progress/_components/KnownWordsPill";
import { ChevronRight } from "lucide-react-native";

const KnownWordsPreview = () => {
  const router = useRouter();

  const navigateToKnownWords = () => {
    router.push("/progress/knownWords");
  };

  const mostRecentWords = [
    { word: "Bonjour", translation: "Hello" },
    { word: "Merci", translation: "Thank you" },
    { word: "Hi", translation: "Goodbye" },
    { word: "Au revoir", translation: "Goodbye" },
  ];

  const numKnownWords = 244; // This should be fetched from your data source

  return (
    <View className="w-full h-max flex flex-col bg-white p-4 rounded-md border border-background-dark">
      <View className="flex flex-row items-start justify-between">
        <View className="flex flex-col gap-1 items-start">
          <Text className="font-bold text-xl">Known Words</Text>
          <Text className="font-light text-sm text-foreground-secondary">
            {numKnownWords} words
          </Text>
        </View>
        <Pressable className="p-2" onPress={navigateToKnownWords}>
          <ChevronRight size={20} color="#BFAD9F" />
        </Pressable>
      </View>
      <View className="flex flex-row flex-wrap items-center gap-2 mt-4">
        {mostRecentWords.map(({ word, translation }, index) => (
          <KnownWordsPill key={word} word={word} translation={translation} />
        ))}
        <Text className="text-sm text-foreground-secondary/80">
          +{numKnownWords - mostRecentWords.length} more
        </Text>
      </View>
    </View>
  );
};

export default KnownWordsPreview;
