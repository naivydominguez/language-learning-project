import { View } from "react-native";
import { Text } from "./Text";

const SIZES = {
  sm: { padding: "p-1", fontSize: "text-base" },
  md: { padding: "p-2", fontSize: "text-2xl" },
  lg: { padding: "p-4", fontSize: "text-7xl" },
};

type LogoProps = {
  size?: keyof typeof SIZES;
};

export default function Logo({ size = "md" }: LogoProps) {
  const { padding, fontSize } = SIZES[size];
  return (
    <View className={`bg-primary-light rounded-lg ${padding}`}>
      <Text className={fontSize}>🌿</Text>
    </View>
  );
}

