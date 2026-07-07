import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";

import HamburgerButton from "../components/hamburgerBtn";
import Navbar from "@/components/navbar";

import "../global.css";

export default function RootLayout() {
  const [navOpen, setNavOpen] = React.useState(false);

  return (
    <View className="flex-1">
      <Stack screenOptions={{ headerShown: false }} />

      <View style={{ position: "absolute", top: 10, left: 20, zIndex: 100 }}>
        <HamburgerButton onPress={() => setNavOpen(!navOpen)} />
      </View>

      <Navbar visible={navOpen} onClose={() => setNavOpen(false)} />
    </View>
  );
}