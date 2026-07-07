import KnownWordsPreview from "@/components/knownWordsPreview";
import MasteryDistribution from "@/components/masteryDistribution";
import StreakCalendar from "@/components/streakCalendar";
import VocabGraph from "@/components/vocabGraph";
import WeeklyMessages from "@/components/weeklyMessages";
import { View } from "react-native";

export default function ProgressRoute() {
  return (
    <View className="flex flex-col gap-6 bg-background pt-4 px-6">
      <StreakCalendar />
      <VocabGraph />
      <WeeklyMessages />
      <MasteryDistribution />
      <KnownWordsPreview />
    </View>
  );
}
