import { View } from "react-native";
import { Text } from "@/components/Text";

interface Props {
  word: string;
}

const KnownWordsPill = ({ word }: Props) => {
  return (
    <View className="w-max h-max flex flex-row p-2 bg-background rounded-sm text-xs">
      <Text className="text-xs">{word}</Text>
    </View>
  );
};

export default KnownWordsPill;
