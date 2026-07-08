import { Pressable, Text } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
};

export default function OnboardingButton({ title, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-[#B8663A] rounded-3xl py-5 items-center"
    >
      <Text className="text-white text-xl font-bold">{title}</Text>
    </Pressable>
  );
}
