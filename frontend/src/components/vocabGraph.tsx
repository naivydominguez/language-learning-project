import { useState } from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import PointerComponentCreator from "./GraphPointerComponent";

const POINTER_CONFIG = {
  activatePointersOnLongPress: true,
  showPointerStrip: false,
  pointerComponent: PointerComponentCreator({
    units: "words",
  }),
  autoAdjustPointerLabelPosition: true,
};

interface Props {
  axisTextStyles: {
    color: string;
    fontSize: number;
  };
}

const VocabGraph = ({ axisTextStyles }: Props) => {
  const [chartWidth, setChartWidth] = useState(0);
  // TODO: Load data from backend
  // map: data -> label, number of words -> value

  const data = [
    { label: "", value: 14 },
    { label: "May 3", value: 31 },
    { label: "May 10", value: 52 },
    { label: "May 17", value: 78 },
    { label: "May 24", value: 103 },
    { label: "May 31", value: 128 },
    { label: "Jun 7", value: 156 },
    { label: "Jun 14", value: 178 },
    { label: "Jun 21", value: 198 },
    { label: "Jun 28", value: 218 },
  ];

  return (
    <View className="w-full h-max flex flex-col bg-white p-4 rounded-md border border-background-dark">
      <Text className="font-bold text-xl">Vocabulary Growth</Text>
      <View
        className="w-full mt-6"
        onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
      >
        <LineChart
          data={data}
          areaChart
          hideDataPoints
          color="#b5613a" // primary
          startFillColor="#d67a4a" // primary-light
          startOpacity={0.3}
          endOpacity={0}
          width={chartWidth - 40} // subtract 40 to account for the space that the y-axis labels take up
          height={120}
          initialSpacing={0}
          endSpacing={0}
          noOfSections={4}
          yAxisTextStyle={axisTextStyles}
          xAxisLabelTextStyle={{
            ...axisTextStyles,
            transform: [{ translateX: 0 }],
          }}
          pointerConfig={POINTER_CONFIG}
        />
      </View>
    </View>
  );
};

export default VocabGraph;
