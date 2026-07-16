import { SafeAreaView } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Sans serif font imports
import { DMSans_100Thin } from "@expo-google-fonts/dm-sans/100Thin";
import { DMSans_200ExtraLight } from "@expo-google-fonts/dm-sans/200ExtraLight";
import { DMSans_300Light } from "@expo-google-fonts/dm-sans/300Light";
import { DMSans_400Regular } from "@expo-google-fonts/dm-sans/400Regular";
import { DMSans_500Medium } from "@expo-google-fonts/dm-sans/500Medium";
import { DMSans_600SemiBold } from "@expo-google-fonts/dm-sans/600SemiBold";
import { DMSans_700Bold } from "@expo-google-fonts/dm-sans/700Bold";

// Serif font imports
import { Lora_400Regular } from "@expo-google-fonts/lora/400Regular";
import { Lora_500Medium } from "@expo-google-fonts/lora/500Medium";
import { Lora_600SemiBold } from "@expo-google-fonts/lora/600SemiBold";
import { Lora_700Bold } from "@expo-google-fonts/lora/700Bold";

// Monospace font imports
import { JetBrainsMono_100Thin } from "@expo-google-fonts/jetbrains-mono/100Thin";
import { JetBrainsMono_200ExtraLight } from "@expo-google-fonts/jetbrains-mono/200ExtraLight";
import { JetBrainsMono_300Light } from "@expo-google-fonts/jetbrains-mono/300Light";
import { JetBrainsMono_400Regular } from "@expo-google-fonts/jetbrains-mono/400Regular";
import { JetBrainsMono_500Medium } from "@expo-google-fonts/jetbrains-mono/500Medium";
import { JetBrainsMono_600SemiBold } from "@expo-google-fonts/jetbrains-mono/600SemiBold";
import { JetBrainsMono_700Bold } from "@expo-google-fonts/jetbrains-mono/700Bold";

import "../../global.css";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();
import React from "react";
import { View } from "react-native";
import HamburgerButton from "../../components/HamburgerBtn";
import Navbar from "@/components/navbar";
export default function RootLayout() {
  const queryClient = new QueryClient();
  const [navOpen, setNavOpen] = React.useState(false);
  
  const [fontsLoaded] = useFonts({
    // Sans serif
    "DMSans-Thin": DMSans_100Thin,
    "DMSans-ExtraLight": DMSans_200ExtraLight,
    "DMSans-Light": DMSans_300Light,
    "DMSans-Regular": DMSans_400Regular,
    "DMSans-Medium": DMSans_500Medium,
    "DMSans-SemiBold": DMSans_600SemiBold,
    "DMSans-Bold": DMSans_700Bold,

    // Serif
    "Lora-Regular": Lora_400Regular,
    "Lora-Medium": Lora_500Medium,
    "Lora-SemiBold": Lora_600SemiBold,
    "Lora-Bold": Lora_700Bold,

    // Monospace
    "JetBrainsMono-Thin": JetBrainsMono_100Thin,
    "JetBrainsMono-ExtraLight": JetBrainsMono_200ExtraLight,
    "JetBrainsMono-Light": JetBrainsMono_300Light,
    "JetBrainsMono-Regular": JetBrainsMono_400Regular,
    "JetBrainsMono-Medium": JetBrainsMono_500Medium,
    "JetBrainsMono-SemiBold": JetBrainsMono_600SemiBold,
    "JetBrainsMono-Bold": JetBrainsMono_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView className="flex-1">
          <View style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
                <HamburgerButton onPress={() => setNavOpen(!navOpen)} />
              </View>
        
              <Navbar visible={navOpen} onClose={() => setNavOpen(false)} /> 
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </SafeAreaView>
    </QueryClientProvider>
  );
}
