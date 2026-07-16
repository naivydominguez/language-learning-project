import { View } from "react-native";
import HamburgerButton from "../../components/HamburgerBtn";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Stack } from "expo-router";
export default function RootLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <View className="flex-1">
      <View style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
        <HamburgerButton onPress={() => setNavOpen(!navOpen)} />
      </View>

      <Navbar visible={navOpen} onClose={() => setNavOpen(false)} />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
