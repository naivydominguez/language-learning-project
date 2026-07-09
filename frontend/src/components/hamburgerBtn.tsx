import { Pressable, Text, View } from "react-native";

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
