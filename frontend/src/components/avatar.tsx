import { View, Text } from "react-native";
export default function Avatar({ isUser}: { isUser: boolean }) {
  return (
    <View className={`w-8 h-8 rounded-full flex items-center justify-center ${isUser ? "bg-accent-subtle" : "bg-surface"}`}>
      <Text className={`text-sm font-bold ${isUser ? "text-accent-fg" : "text-foreground"}`}>
        {isUser ? "You" : "AI"}
      </Text>
    </View>
  );
}