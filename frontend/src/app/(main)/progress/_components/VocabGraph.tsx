import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "@/components/Text";
import { LineChart } from "react-native-gifted-charts";
import PointerComponentCreator from "./GraphPointerComponent";
import { UserStatisticsResponse } from "@/app/(main)/progress";

interface Props {
  data: UserStatisticsResponse[];
  axisTextStyles: {
    color: string;
    fontSize: number;
  };
  isLoading?: boolean;
}

const VocabGraph = ({ data: userData, axisTextStyles, isLoading }: Props) => {
  const [chartWidth, setChartWidth] = useState(0);

  const data = userData
    .filter((_, index) => {
      const overOneMonthOfEntries = userData.length > 30;
      if (!overOneMonthOfEntries) {
        return true;
      } else {
        if (index % 7 === 0) {
          return true;
        }
      }
    })
    .map((item) => ({
      label: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: item.known_words,
    }));
  const minValue = Math.min(...data.map((item) => item.value));
  const maxValue = Math.max(...data.map((item) => item.value));

  const pointerConfig = {
    activatePointersOnLongPress: true,
    showPointerStrip: false,
    pointerComponent: PointerComponentCreator({
      units: "words",
      offset: minValue,
    }),
    autoAdjustPointerLabelPosition: true,
  };

  return (
    <View className="w-full h-max flex flex-col bg-white p-4 rounded-md border border-background-dark">
      <Text weight="bold" className="text-xl">Vocabulary Growth</Text>
      {isLoading ? (
        <View className="w-full h-[120px] mt-6 items-center justify-center">
          <ActivityIndicator size="small" color="#8C6E60" />
        </View>
      ) : (
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
            yAxisOffset={minValue}
            maxValue={maxValue - minValue}
            initialSpacing={0}
            endSpacing={0}
            noOfSections={4}
            yAxisTextStyle={axisTextStyles}
            xAxisLabelTextStyle={{
              ...axisTextStyles,
              transform: [{ translateX: 0 }],
            }}
            pointerConfig={pointerConfig}
          />
        </View>
      )}
    </View>
  );
};

export default VocabGraph;
