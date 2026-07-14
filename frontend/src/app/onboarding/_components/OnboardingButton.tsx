import { Pressable } from "react-native";
import { Text } from "./Text";

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
        disabled ? "bg-[#DED9D6]" : "bg-[#BF693F]"
      }`}
    >
      <Text weight="bold" className={`text-xl ${
          disabled ? "text-[#8B6F63]" : "text-white" }`}>
            {title}
        </Text>
    </Pressable>
  );
}
