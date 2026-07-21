import { SafeAreaView } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SupabaseAuthContext, useAuthProvider } from "@/hooks/use-auth";

import "../global.css";
import Toast from "react-native-toast-message";
import { RealtimeVoiceProvider } from "@/context/RealtimeVoiceContext";

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const auth = useAuthProvider();
  const queryClient = new QueryClient();

  const [fontsLoaded] = useFonts({
    // Sans serif
    "DMSans-Thin": require("../../assets/fonts/DMSans_100Thin.ttf"),
    "DMSans-ExtraLight": require("../../assets/fonts/DMSans_200ExtraLight.ttf"),
    "DMSans-Light": require("../../assets/fonts/DMSans_300Light.ttf"),
    "DMSans-Regular": require("../../assets/fonts/DMSans_400Regular.ttf"),
    "DMSans-Medium": require("../../assets/fonts/DMSans_500Medium.ttf"),
    "DMSans-SemiBold": require("../../assets/fonts/DMSans_600SemiBold.ttf"),
    "DMSans-Bold": require("../../assets/fonts/DMSans_700Bold.ttf"),
    // Serif
    "Lora-Regular": require("../../assets/fonts/Lora_400Regular.ttf"),
    "Lora-Medium": require("../../assets/fonts/Lora_500Medium.ttf"),
    "Lora-SemiBold": require("../../assets/fonts/Lora_600SemiBold.ttf"),
    "Lora-Bold": require("../../assets/fonts/Lora_700Bold.ttf"),
    // Monospace
    "JetBrainsMono-Thin": require("../../assets/fonts/JetBrainsMono_100Thin.ttf"),
    "JetBrainsMono-ExtraLight": require("../../assets/fonts/JetBrainsMono_200ExtraLight.ttf"),
    "JetBrainsMono-Light": require("../../assets/fonts/JetBrainsMono_300Light.ttf"),
    "JetBrainsMono-Regular": require("../../assets/fonts/JetBrainsMono_400Regular.ttf"),
    "JetBrainsMono-Medium": require("../../assets/fonts/JetBrainsMono_500Medium.ttf"),
    "JetBrainsMono-SemiBold": require("../../assets/fonts/JetBrainsMono_600SemiBold.ttf"),
    "JetBrainsMono-Bold": require("../../assets/fonts/JetBrainsMono_700Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <RealtimeVoiceProvider>
      <SupabaseAuthContext.Provider value={auth}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaView className="flex-1">
            <Stack screenOptions={{ headerShown: false }} />
            <Toast />
          </SafeAreaView>
        </QueryClientProvider>
      </SupabaseAuthContext.Provider>
    </RealtimeVoiceProvider>
  );
}
