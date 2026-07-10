import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { View } from "react-native";
import { Stack } from "expo-router";


import "../global.css";
import Toast from "react-native-toast-message";

export default function RootLayout() {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView className="flex-1">
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </SafeAreaView>
    </QueryClientProvider>
  );
}
