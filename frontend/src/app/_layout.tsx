import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { View } from "react-native";
import { Stack } from "expo-router";



import "../global.css";

export default function RootLayout() {

  const queryClient = new QueryClient();

  return (
    <SafeAreaView className="flex-1">
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
