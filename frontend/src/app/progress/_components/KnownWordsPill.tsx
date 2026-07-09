import { Text, View } from "react-native";

interface Props {
    word: string;
    translation: string;
}

const KnownWordsPill = ({ word, translation }: Props) => {
  return (
    <View className="w-max h-max flex flex-row p-2 bg-background rounded-sm text-xs">
      <Text className="text-xs">{word}</Text>
      <Text className="text-xs text-foreground-secondary/80 ml-2">{translation}</Text>
    </View>
  )
}

export default KnownWordsPill