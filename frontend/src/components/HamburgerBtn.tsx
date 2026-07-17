import { Pressable, View } from "react-native";
import { Text } from "./Text";

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
