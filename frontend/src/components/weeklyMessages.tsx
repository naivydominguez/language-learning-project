import { useState } from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import PointerComponentCreator from "./GraphPointerComponent";

const POINTER_CONFIG = {
  activatePointersOnLongPress: true,
  showPointerStrip: false,
  radius: 0,
  pointerLabelComponent: PointerComponentCreator({
    units: "messages",
  }),
  autoAdjustPointerLabelPosition: true,
  pointerLabelWidth: 120,
};

interface Props {
  axisTextStyles: {
    color: string;
    fontSize: number;
  };
}

const WeeklyMessages = ({ axisTextStyles }: Props) => {
  const [chartWidth, setChartWidth] = useState(0);

  const data = [
    { label: "Mon", value: 5 },
    { label: "Tue", value: 3 },
    { label: "Wed", value: 8 },
    { label: "Thu", value: 2 },
    { label: "Fri", value: 6 },
    { label: "Sat", value: 4 },
    { label: "Sun", value: 7 },
  ];

  return (
    <View className="w-full h-max flex flex-col bg-white p-4 pr-0 rounded-md border border-background-dark">
      <Text className="font-bold text-xl">Messages this week</Text>
      <View
        className="w-full mt-6"
        onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
      >
        <BarChart
          data={data}
          adjustToWidth
          disableScroll
          parentWidth={chartWidth}
          noOfSections={2}
          height={120}
          initialSpacing={12}
          endSpacing={12}
          frontColor="#6b7a55" // secondary
          barBorderTopLeftRadius={4}
          barBorderTopRightRadius={4}
          yAxisTextStyle={axisTextStyles}
          xAxisLabelTextStyle={axisTextStyles}
          pointerConfig={POINTER_CONFIG}
        />
      </View>
    </View>
  );
};

export default WeeklyMessages;
