import { Pressable } from "react-native";
import { Text } from "@/components/Text";

type Props = {
  title: string;
  onPress: () => void;
  disabled? : boolean;
};

export default function OnboardingButton({ 
    title,
    onPress,
    disabled=false,

 }: Props) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`rounded-2xl py-5 items-center ${
        disabled ? "bg-foreground-tertiary/40" : "bg-accent"
      }`}
    >
      <Text weight="bold" className={`text-xl ${
          disabled ? "text-foreground-secondary" : "text-white" }`}>
            {title}
        </Text>
    </Pressable>
  );
}
