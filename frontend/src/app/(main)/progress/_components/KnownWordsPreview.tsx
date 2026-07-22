import { ActivityIndicator, View, Pressable } from "react-native";
import { Text } from "../../../../components/Text";
import { useRouter } from "expo-router";
import KnownWordsPill from "@/app/(main)/progress/_components/KnownWordsPill";
import { ChevronRight } from "lucide-react-native";

interface Props {
  numWords: number;
  mostRecentWords: { word: string; translation: string }[];
  isLoading?: boolean;
}

const KnownWordsPreview = ({ numWords, mostRecentWords, isLoading }: Props) => {
  const router = useRouter();

  const navigateToKnownWords = () => {
    router.push("/progress/known-words");
  };

  const numKnownWords = numWords;
  const numNotDisplayedWords = Math.max(
    numKnownWords - mostRecentWords.length,
    0,
  ); // Floor at 0 to avoid negative numbers during loading

  return (
    <View className="w-full h-max flex flex-col bg-white p-4 rounded-md border border-background-dark">
      <View className="flex flex-row items-start justify-between">
        <View className="flex flex-col gap-1 items-start">
          <Text weight="bold" className="text-xl">
            Known Words
          </Text>
          <Text weight="light" className="text-sm text-foreground-secondary">
            {isLoading ? "—" : `${numKnownWords} words`}
          </Text>
        </View>
        <Pressable className="p-2" onPress={navigateToKnownWords}>
          <ChevronRight size={20} color="#BFAD9F" />
        </Pressable>
      </View>
      {isLoading ? (
        <View className="w-full h-10 mt-4 items-center justify-center">
          <ActivityIndicator size="small" color="#8C6E60" />
        </View>
      ) : (
        <View className="flex flex-row flex-wrap items-center gap-2 mt-4">
          {mostRecentWords.map(({ word }, index) => (
            <KnownWordsPill key={word} word={word} />
          ))}
          <Text className="text-sm text-foreground-secondary/80">
            +{numNotDisplayedWords} more
          </Text>
        </View>
      )}
    </View>
  );
};

export default KnownWordsPreview;
