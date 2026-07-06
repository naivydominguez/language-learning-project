import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HamburgerButton from "@/components/humburgerBtn";
import navbar from "@/components/navbar";

export default function app() {

  return (
    <View className="flex-1 flex-row">
      <HamburgerButton />
    </View>
  );
}
