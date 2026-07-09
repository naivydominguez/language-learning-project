import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { View } from "react-native";
import { Stack } from "expo-router";

import HamburgerButton from "../components/hamburgerBtn";
import Navbar from "@/components/navbar";

import "../global.css";

export default function RootLayout() {
  const [navOpen, setNavOpen] = React.useState(false);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView className="flex-1">
        <View className="flex-1">
          <Stack screenOptions={{ headerShown: false }} />
          <View style={{ position: "absolute", top: 10, left: 20, zIndex: 10 }}>
            <HamburgerButton onPress={() => setNavOpen(!navOpen)} />
          </View>
          <Navbar visible={navOpen} onClose={() => setNavOpen(false)} />
        </View>
      </SafeAreaView>
    </QueryClientProvider>
  );
}
