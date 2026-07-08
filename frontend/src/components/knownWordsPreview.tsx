import { View, Text } from "react-native";
import { useRouter } from "expo-router";

const KnownWordsPreview = () => {
  const router = useRouter();

  const navigateToKnownWords = () => {
    router.push("/progress/knownWords");
  };

  return (
    <View className="w-full h-max flex flex-col bg-white p-4 rounded-md border border-background-dark">
      <View className="flex flex-col gap-1 items-start">
        <Text className="font-bold text-lg">Known Words</Text>
        <Text className="font-bold text-lg">Known Words</Text>
      </View>
      <View className="w-full mt-4">
        <Text className="text-sm text-foreground-tertiary">
          You know 123 words
        </Text>
        <Text className="text-sm text-foreground-tertiary">
          Click to see your known words
        </Text>
      </View>
      <View className="flex flex-row justify-around text-sm text-foreground-tertiary">
        <Text
          className="text-sm text-foreground-tertiary"
          onPress={navigateToKnownWords}
        >
          View Known Words
        </Text>
      </View>
    </View>
  );
};

export default KnownWordsPreview;
