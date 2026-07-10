import { useState } from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts/dist/BarChart";
import PointerComponentCreator from "./GraphPointerComponent";
import GraphLegendItem from "@/app/progress/_components/GraphLegendItem";

const POINTER_CONFIG = {
  activatePointersOnLongPress: true,
  showPointerStrip: false,
  radius: 0,
  pointerLabelComponent: PointerComponentCreator({
    labelPretext: "Mastery:",
    units: "words",
  }),
  autoAdjustPointerLabelPosition: true,
  pointerLabelWidth: 170,
};

interface Props {
  axisTextStyles: {
    color: string;
    fontSize: number;
  };
}

const MasteryDistribution = ({ axisTextStyles }: Props) => {
  const [chartWidth, setChartWidth] = useState(0);

  const data = [
    { label: String(1), value: 10, frontColor: "#bfad9f" }, // foreground-tertiary
    { label: String(2), value: 20, frontColor: "#d67a4a" }, // primary-light
    { label: String(3), value: 35, frontColor: "#d67a4a" }, // primary-light
    { label: String(4), value: 40, frontColor: "#b5613a" }, // primary
    { label: String(5), value: 50, frontColor: "#b5613a" }, // primary
    { label: String(6), value: 14, frontColor: "#6f3a22" }, // primary-dark
    { label: String(7), value: 7, frontColor: "#6f3a22" }, // primary-dark
  ];

  return (
    <View className="w-full h-max flex flex-col bg-white p-4 pr-0 rounded-md border border-background-dark">
      <Text className="font-bold text-xl">Words by mastery</Text>
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
      <View className="flex flex-row justify-center gap-3 pr-8 text-sm text-foreground-tertiary">
        {["New", "Learning", "Comfortable", "Mastered"].map((label, index) => (
          <GraphLegendItem
            key={label}
            color={["#bfad9f", "#d67a4a", "#b5613a", "#6f3a22"][index]}
            label={label}
          />
        ))}
      </View>
    </View>
  );
};

export default MasteryDistribution;
