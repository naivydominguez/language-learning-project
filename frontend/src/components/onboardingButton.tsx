import { Pressable, Text } from "react-native";

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
      <Text className={`text-xl font-bold ${
          disabled ? "text-[#8B6F63]" : "text-white" }`}>
            {title}
        </Text>
    </Pressable>
  );
}
