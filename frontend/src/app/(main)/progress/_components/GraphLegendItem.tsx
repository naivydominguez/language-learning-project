import { View } from "react-native";
import { Text } from "@/components/Text";

const GraphLegendItem = ({
  color,
  label,
}: {
  color: string;
  label: string;
}) => {
  return (
    <View className="flex flex-row items-center gap-1">
      <View className="size-2 rounded-[2px]" style={{ backgroundColor: color }} />
      <Text className="text-xs text-foreground-tertiary">{label}</Text>
    </View>
  );
};

export default GraphLegendItem;