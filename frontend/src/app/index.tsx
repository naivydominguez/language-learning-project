// src/app/index.tsx
import { View } from "react-native";
import HomePage from "@/components/homePage";

export default function HomeScreen() {
  return (
    <View className="flex-1 flex-row">
      <HomePage />
    </View>
  );
}
