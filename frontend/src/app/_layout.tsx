import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";



import "../global.css";

export default function RootLayout() {

  return (
    <SafeAreaView className="flex-1">
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}