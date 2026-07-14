import { View } from "react-native";
import { Text } from "@/components/Text";

interface Props {
    word: string;
    translation: string;
}

const KnownWordsPill = ({ word, translation }: Props) => {
  return (
    <View className="w-max h-max flex flex-row p-2 bg-background rounded-sm text-xs">
      <Text className="text-xs">{word}</Text>
      {translation && (
        <Text className="text-xs text-foreground-secondary/80 ml-2">{translation}</Text>
      )}
    </View>
  )
}

export default KnownWordsPill