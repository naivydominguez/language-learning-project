import KnownWordsPreview from "@/components/knownWordsPreview";
import MasteryDistribution from "@/app/progress/_components/masteryDistribution";
import StreakCalendar from "@/app/progress/_components/streakCalendar";
import VocabGraph from "@/app/progress/_components/vocabGraph";
import WeeklyMessages from "@/app/progress/_components/weeklyMessages";
import { useQuery } from "@tanstack/react-query";
import { Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

const AXIS_TEXT_STYLES = {
  color: "#bfad9f", // foreground-tertiary
  fontSize: 12,
};

export type UserStatisticsResponse = {
  date: string;
  known_words: number;
  streak: boolean;
  number_messages: number;
};

export default function ProgressRoute() {
  const accessToken = "temp, TODO replace with actual token"; // TODO

  const { data, isLoading, error } = useQuery({
    queryKey: ["temporalUserStatistics"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/user_statistics/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user statistics");
      }

      const data = await response.json();
      return data as UserStatisticsResponse[];
    },
  });

  const router = useRouter();

  return (
    <ScrollView
      className="flex flex-col bg-background pt-4 px-6"
      contentContainerClassName="gap-6 pb-6"
    >
      <Pressable onPress={() => router.push("/homePage")} className="p-2">
        <ChevronLeft size={20} color="#8C6E60" strokeWidth={2} />
      </Pressable>

      <StreakCalendar data={data ?? []} />
      <VocabGraph data={data ?? []} axisTextStyles={AXIS_TEXT_STYLES} />
      <WeeklyMessages data={data ?? []} axisTextStyles={AXIS_TEXT_STYLES} />
      <MasteryDistribution axisTextStyles={AXIS_TEXT_STYLES} />
      <KnownWordsPreview />
    </ScrollView>
  );
}
