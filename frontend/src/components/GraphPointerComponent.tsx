import { View, Text } from "react-native";

interface Props {
  labelPretext?: string;
  units?: string;
}

export default function PointerComponentCreator({
  labelPretext,
  units,
}: Props) {
  return function PointerComponent(dataPoints: any) {
    if (!dataPoints) return null;

    let label: string;
    let value: number;

    if (Array.isArray(dataPoints)) {
      if (!dataPoints[0]) return null;
      label = dataPoints[0].label;
      value = dataPoints[0].value;
    } else {
      label = dataPoints.label;
      value = dataPoints.value;
    }

    return (
      <View className="w-max px-6 flex flex-col items-start bg-white rounded-md border border-background-dark p-2 font-thin whitespace-nowrap select-none">
        <Text numberOfLines={1} className="text-lg text-foreground">
          {labelPretext ? `${labelPretext} ${label}` : label}
        </Text>
        <Text numberOfLines={1} className="text-sm font-thin text-primary">
          {value} {units}
        </Text>
      </View>
    );
  };
}
