import { Pressable, Text, View } from "react-native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "expo-router"; // or '@react-navigation/native' pre-SDK56
import React from "react";
import Navbar from "./navbar";
type NavigationProps = DrawerNavigationProp<any>;

export default function HamburgerButton() {
  const navigation = useNavigation<NavigationProps>();
const [navOpen, setNavOpen] = React.useState(false);
  return (
    <View>
      <Pressable onPress={() => setNavOpen(!navOpen)} hitSlop={10}>
        <Text>☰</Text>
      </Pressable>

      <View>{navOpen && <Navbar visible={navOpen} onClose={() => setNavOpen(false)} />}</View>
    </View>
  );
}
