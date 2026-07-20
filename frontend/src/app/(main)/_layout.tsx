import { View } from "react-native";
import Navbar from "@/components/Navbar";
import { Stack } from "expo-router";
import { NavContext, useNavProvider } from "@/hooks/use-nav";

export default function RootLayout() {
  const nav = useNavProvider();

  return (
    <NavContext.Provider value={nav}>
      <View className="flex-1">
        <Navbar visible={nav.navOpen} onClose={nav.closeNav} />
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </NavContext.Provider>
  );
}
