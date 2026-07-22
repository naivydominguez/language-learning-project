import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "@/components/Text";
import { BarChart } from "react-native-gifted-charts";
import PointerComponentCreator from "./GraphPointerComponent";
import { UserStatisticsResponse } from "@/app/(main)/progress";

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
  data: UserStatisticsResponse[];
  axisTextStyles: {
    color: string;
    fontSize: number;
  };
  isLoading?: boolean;
}

const WeeklyMessages = ({ data, axisTextStyles, isLoading }: Props) => {
  const [chartWidth, setChartWidth] = useState(0);

  const dataThisWeek = data.slice(-7).map((item) => ({
    label: new Date(item.date).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    value: item.number_messages,
  }));

  return (
    <View className="w-full h-max flex flex-col bg-white p-4 pr-0 rounded-md border border-background-dark">
      <Text weight="bold" className="text-xl">Messages this week</Text>
      {isLoading ? (
        <View className="w-full h-[120px] mt-6 items-center justify-center">
          <ActivityIndicator size="small" color="#8C6E60" />
        </View>
      ) : (
        <View
          className="w-full mt-6"
          onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
        >
          <BarChart
            data={dataThisWeek}
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
      )}
    </View>
  );
};

export default WeeklyMessages;
