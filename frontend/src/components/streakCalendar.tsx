import { View, Text } from "react-native";
import { WeeklyHeatMap } from "@symbiot.dev/react-native-heatmap";

const HEATMAP_COLORS = {
  cellDefaultColor: "#faf7f4", // background-light
  cellColor: {
    1: "#b5613a", // primary
    2: "#b5613a", // primary
    3: "#b5613a", // primary
    4: "#b5613a", // primary
    5: "#b5613a", // primary
  },
  headerTextColor: "#bfad9f", // foreground-tertiary
};

const StreakCalendar = () => {
  // Query server for streak data: get back an array of booleans representing streak completions.
  // We can count backwards from the current data to fill the whole calendar grid.
  // (For now, we have a mock list of dates)
  const streakDays = [
    new Date(),
    new Date(Date.now() - 86400000),
    new Date(Date.now() - 172800000),
  ];

  return (
    <View className="w-full h-max flex flex-col bg-white p-4 rounded-md border border-background-dark">
      <View className="flex flex-col gap-y-1 text-foreground mb-4">
        <View className="flex flex-row items-center gap-2">
          {/* fire icon */}
          <Text className="font-bold text-lg">12 day streak</Text>
        </View>
        <Text className="text-xs text-foreground-secondary/90">Longest: 15 days</Text>
      </View>
      <WeeklyHeatMap
        data={streakDays}
        endDate={new Date()}
        cellSize={20}
        cellGap={4}
        theme={{ light: HEATMAP_COLORS, dark: HEATMAP_COLORS }}
      />
    </View>
  );
};

export default StreakCalendar;
