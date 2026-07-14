import { Pressable } from "react-native";
import { Text } from "@/components/Text";

interface Props {
  onPress?: () => void;
  isActive: boolean;
  text?: string;
}

const Pill = ({ onPress, isActive, text }: Props) => {
  return (
    <Pressable
      className={`h-max w-max rounded-lg p-2 border ${isActive ? "border-primary-light bg-primary-light/20" : "bg-foreground-tertiary"}`}
      onPress={onPress}
    >
      <Text className={`text-center ${isActive ? "text-primary-light font-normal" : "text-foreground-tertiary font-light"}`}>{text}</Text>
    </Pressable>
  );
};

export default Pill;
