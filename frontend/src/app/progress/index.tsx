import KnownWordsPreview from "@/components/knownWordsPreview";
import MasteryDistribution from "@/components/masteryDistribution";
import StreakCalendar from "@/components/streakCalendar";
import VocabGraph from "@/components/vocabGraph";
import { ChevronLeft } from "lucide-react-native";
import WeeklyMessages from "@/components/weeklyMessages";
import { Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";

const AXIS_TEXT_STYLES = {
  color: "#bfad9f", // foreground-tertiary
  fontSize: 12,
};

export default function ProgressRoute() {
  const router = useRouter();

  return (
    <ScrollView className="flex flex-col bg-background pt-4 px-6" contentContainerClassName="gap-6 pb-6">
      <Pressable onPress={() => router.push("/homePage")} className="p-2">
        <ChevronLeft size={20} color="#8C6E60" strokeWidth={2} />
      </Pressable>

      <StreakCalendar />
      <VocabGraph axisTextStyles={AXIS_TEXT_STYLES} />
      <WeeklyMessages axisTextStyles={AXIS_TEXT_STYLES} />
      <MasteryDistribution axisTextStyles={AXIS_TEXT_STYLES} />
      <KnownWordsPreview />
    </ScrollView>
  );
}
