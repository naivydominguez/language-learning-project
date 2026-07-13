import { View, Text, Platform } from "react-native";

interface Props {
  word: string;
  translationText: string;
  pronunciation: string;
  mastery: number;
}

const KnownWordItem = ({
  word,
  translationText,
  pronunciation,
  mastery,
}: Props) => {
  return (
    <View className="w-full flex flex-col gap-2 px-6 py-4">
      <View className="w-full flex flex-row items-center justify-between">
        <View className="flex flex-row gap-1 items-end">
          <Text
            className="text-foreground leading-none font-bold text-lg"
            style={{ fontFamily: "serif" }}
          >
            {word}
          </Text>
          <Text className="text-xs font-light text-foreground-tertiary/80">
            {pronunciation}
          </Text>
        </View>
        <Text className="text-md font-medium text-foreground-tertiary">
          Mastery: {mastery}
        </Text>
      </View>
      <Text className="font-normal text-foreground/70 text-md">
        {translationText}
      </Text>
    </View>
  );
};

export default KnownWordItem;
