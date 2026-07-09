import KnownWordsPreview from "@/components/knownWordsPreview";
import MasteryDistribution from "@/components/masteryDistribution";
import StreakCalendar from "@/components/streakCalendar";
import VocabGraph from "@/components/vocabGraph";
import WeeklyMessages from "@/components/weeklyMessages";
import { ScrollView } from "react-native";

const AXIS_TEXT_STYLES = {
  color: "#bfad9f", // foreground-tertiary
  fontSize: 12,
};

export default function ProgressRoute() {
  return (
    <ScrollView
      className="flex flex-col bg-background pt-4 px-6"
      contentContainerClassName="gap-6 pb-6"
    >
      <StreakCalendar />
      <VocabGraph axisTextStyles={AXIS_TEXT_STYLES} />
      <WeeklyMessages axisTextStyles={AXIS_TEXT_STYLES} />
      <MasteryDistribution axisTextStyles={AXIS_TEXT_STYLES} />
      <KnownWordsPreview />
    </ScrollView>
  );
}
