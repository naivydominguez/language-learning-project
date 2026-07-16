import { View, Platform } from "react-native";
import { Text } from "@/components/Text";

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
            fontFamily="serif"
            weight="bold"
            className="text-foreground leading-none text-lg"
          >
            {word}
          </Text>
          <Text weight="light" className="text-xs text-foreground-tertiary/80">
            {pronunciation}
          </Text>
        </View>
        <Text weight="medium" className="text-md text-foreground-tertiary">
          Mastery: {mastery}
        </Text>
      </View>
      <Text weight="normal" className="text-foreground/70 text-md">
        {translationText}
      </Text>
    </View>
  );
};

export default KnownWordItem;
