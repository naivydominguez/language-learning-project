import { useState } from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const AXIS_TEXT_STYLES = {
  color: "#bfad9f", // foreground-tertiary
  fontSize: 12,
};

const POINTER_CONFIG = {
  activatePointersOnLongPress: true,
  showPointerStrip: false,
  pointerComponent: PointerComponent,
  autoAdjustPointerLabelPosition: true,
};

const VocabGraph = () => {
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
      <Text className="font-bold text-lg">Vocabulary Growth</Text>
      <View
        className="w-full mt-4"
        onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
      >
        <LineChart
          data={data}
          areaChart
          hideDataPoints
          // hideRules
          color="#b5613a" // primary
          startFillColor="#d67a4a" // primary-light
          startOpacity={0.3}
          endOpacity={0}
          width={300}
          height={160}
          initialSpacing={0}
          endSpacing={0}
          rulesLength={300}
          noOfSections={4}
          yAxisTextStyle={AXIS_TEXT_STYLES}
          xAxisLabelTextStyle={{ ...AXIS_TEXT_STYLES, transform: [{ translateX: 0 }] }}
          pointerConfig={POINTER_CONFIG}
        />
      </View>
    </View>
  );
};

function PointerComponent(dataPoint: { label: string; value: number }) {
  const { label, value } = dataPoint;

  return (
    <View className="flex flex-col items-start bg-white rounded-md border border-background-dark p-2 font-thin whitespace-nowrap select-none">
      <Text numberOfLines={1} className="text-lg text-foreground">
        {label}
      </Text>
      <Text numberOfLines={1} className="text-sm font-thin text-primary">
        {value} words
      </Text>
    </View>
  );
}

export default VocabGraph;
