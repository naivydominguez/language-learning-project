import { useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/Text";
import { BarChart } from "react-native-gifted-charts/dist/BarChart";
import PointerComponentCreator from "./GraphPointerComponent";
import GraphLegendItem from "@/app/(main)/progress/_components/GraphLegendItem";
import { useQuery } from "@tanstack/react-query";

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

  const accessToken = "temp"; // TODO: replace with supabase token

  const { data, isLoading, error } = useQuery({
    queryKey: ["masteryDistribution"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/user_known_words/mastery_level`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch mastery distribution");
      }

      const data = await response.json();
      return data;
    },
  });

  const masteryData = data
    ?.sort(
      (a: { mastery_level: number }, b: { mastery_level: number }) =>
        a.mastery_level - b.mastery_level,
    )
    .map((item: { mastery_level: number; count: number }) => ({
      label: String(item.mastery_level),
      value: item.count,
      frontColor:
        item.mastery_level === 1
          ? "#bfad9f" // foreground-tertiary
          : item.mastery_level === 2 || item.mastery_level === 3
            ? "#d67a4a" // primary-light
            : item.mastery_level === 4 || item.mastery_level === 5
              ? "#b5613a" // primary
              : "#6f3a22", // primary-dark
    }));

  return (
    <View className="w-full h-max flex flex-col bg-white p-4 pr-0 rounded-md border border-background-dark">
      <Text weight="bold" className="text-xl">Words by mastery</Text>
      <View
        className="w-full mt-6"
        onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
      >
        <BarChart
          data={masteryData}
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
