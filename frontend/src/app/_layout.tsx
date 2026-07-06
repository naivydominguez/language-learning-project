import { View } from "react-native";
import { Stack } from "expo-router";
import HamburgerButton from "@/components/humburgerBtn";
import "../global.css";

export default function RootLayout() {
  return (
    <View className="flex-1">
      <HamburgerButton />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
