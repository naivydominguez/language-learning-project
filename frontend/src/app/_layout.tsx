<<<<<<< HEAD
import { SafeAreaView } from "react-native-safe-area-context";
=======
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { View } from "react-native";
>>>>>>> 164a076c4ffee61f6ef7b18c7ab8283b87de0b38
import { Stack } from "expo-router";



import "../global.css";

export default function RootLayout() {

  const queryClient = new QueryClient();

  return (
<<<<<<< HEAD
    <SafeAreaView className="flex-1">
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
=======
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
>>>>>>> 164a076c4ffee61f6ef7b18c7ab8283b87de0b38
  );
}
