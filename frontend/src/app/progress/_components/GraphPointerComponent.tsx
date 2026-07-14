import { View } from "react-native";
import { Text } from "@/components/Text";

interface Props {
  labelPretext?: string;
  units?: string;
  offset?: number;
}

export default function PointerComponentCreator({
  labelPretext,
  units,
  offset = 0,
}: Props) {
  return function PointerComponent(dataPoints: any) {
    if (!dataPoints) return null;

    let label: string;
    let value: number;

    if (Array.isArray(dataPoints)) {
      if (!dataPoints[0]) return null;
      label = dataPoints[0].label;
      value = dataPoints[0].value + offset;
    } else {
      label = dataPoints.label;
      value = dataPoints.value + offset;
    }

    return (
      <View className="w-max px-6 flex flex-col items-start bg-white rounded-md border border-background-dark p-2 font-thin whitespace-nowrap select-none">
        <Text numberOfLines={1} className="text-lg text-foreground">
          {labelPretext ? `${labelPretext} ${label}` : label}
        </Text>
        <Text numberOfLines={1} weight="thin" className="text-sm text-primary">
          {value} {units}
        </Text>
      </View>
    );
  };
}
