import KnownWordsPreview from "@/components/knownWordsPreview";
import ProgressOverview from "@/components/progressOverview";
import StreakCalendar from "@/components/streakCalendar";
import VocabGraph from "@/components/vocabGraph";
import WeeklyMessages from "@/components/weeklyMessages";
import { View } from "react-native";

export default function ProgressRoute() {
  return (
    <View className="flex flex-col gap-4 bg-background">
      <ProgressOverview />
      <StreakCalendar />
      <VocabGraph />
      <WeeklyMessages />
      <KnownWordsPreview />
    </View>
  );
}
