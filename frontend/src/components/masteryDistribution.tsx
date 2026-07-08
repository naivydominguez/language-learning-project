import { useState } from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts/dist/BarChart";
import PointerComponentCreator from "./GraphPointerComponent";

interface Props {
  axisTextStyles: {
    color: string;
    fontSize: number;
  };
}

const MasteryDistribution = ({ axisTextStyles }: Props) => {

  const [chartWidth, setChartWidth] = useState(0);

  const data = [
    { label: "0-20%", value: 5 },
    { label: "20-40%", value: 15 },
    { label: "40-60%", value: 25 },
    { label: "60-80%", value: 35 },
    { label: "80-100%", value: 45 },
  ]

  return (
    <View className="w-full h-max flex flex-col bg-white p-4 pr-0 rounded-md border border-background-dark">
      <Text className="font-bold text-lg">Mastery Distribution</Text>
      <View
        className="w-full mt-4"
        onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
      >
        <BarChart
          data={data}
          adjustToWidth
          disableScroll
          parentWidth={chartWidth}
          noOfSections={2}
          height={160}
          initialSpacing={12}
          endSpacing={12}
          frontColor="#6b7a55" // secondary
          barBorderTopLeftRadius={4}
          barBorderTopRightRadius={4}
          yAxisTextStyle={axisTextStyles}
          xAxisLabelTextStyle={axisTextStyles}
        />
      </View>
    </View>
  );
};

export default MasteryDistribution;
