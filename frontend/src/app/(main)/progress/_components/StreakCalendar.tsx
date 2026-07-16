import { View } from "react-native";
import { Text } from "@/components/Text";
import { WeeklyHeatMap } from "@symbiot.dev/react-native-heatmap";
import { UserStatisticsResponse } from "@/app/(main)/progress";

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

interface Props {
  data: UserStatisticsResponse[];
}

const StreakCalendar = ({ data }: Props) => {
  const streakDays = data
    .filter((stat) => stat.streak)
    .map((stat) => new Date(stat.date));

  return (
    <View className="w-full h-max flex flex-col bg-white p-4 rounded-md border border-background-dark">
      <View className="flex flex-col gap-y-1 text-foreground mb-4">
        <View className="flex flex-row items-center gap-2">
          {/* TODO: fire icon */}
          <Text weight="bold" className="text-xl">12 day streak</Text>
        </View>
        <Text weight="light" className="text-sm text-foreground-secondary/100">
          Longest: 15 days
        </Text>
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
