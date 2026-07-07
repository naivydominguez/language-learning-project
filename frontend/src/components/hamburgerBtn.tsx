import { Pressable, Text, View } from "react-native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "expo-router"; // or '@react-navigation/native' pre-SDK56
import React from "react";
import Navbar from "./navbar";
type NavigationProps = DrawerNavigationProp<any>;

type Props = {
  onPress: () => void;
};

export default function HamburgerButton({ onPress }: Props) {
  return (
    <Pressable onPress={onPress} hitSlop={10}>
      <Text>☰</Text>
    </Pressable>
  );
}
