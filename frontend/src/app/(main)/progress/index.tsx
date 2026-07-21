import KnownWordsPreview from "@/app/(main)/progress/_components/KnownWordsPreview";
import MasteryDistribution from "@/app/(main)/progress/_components/MasteryDistribution";
import StreakCalendar from "@/app/(main)/progress/_components/StreakCalendar";
import VocabGraph from "@/app/(main)/progress/_components/VocabGraph";
import WeeklyMessages from "@/app/(main)/progress/_components/WeeklyMessages";
import { useQuery } from "@tanstack/react-query";
import { Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useAuth } from "@/hooks/use-auth";
import MainHeader from "@/components/MainHeader";

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
  const { session } = useAuth();
  const statsData = useQuery({
    queryKey: ["temporalUserStatistics"],
    enabled: !!session,
    queryFn: async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/user_statistics/me`,
        { headers: { Authorization: `Bearer ${session!.access_token}` } },
      );
      if (!response.ok) throw new Error("Failed to fetch user statistics");
      return response.json() as Promise<UserStatisticsResponse[]>;
    },
  });

  const wordsData = useQuery({
    queryKey: ["knownWords10Recent"],
    enabled: !!session,
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "10", sort_by: "recent" });
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/user_known_words/me?${params.toString()}`,
        { headers: { Authorization: `Bearer ${session!.access_token}` } },
      );
      if (!response.ok){
        const errorText = await response.text();
        console.error(
            "Known words request failed:",response.status, errorText,
        );

        throw new Error("Failed to fetch known words");

      } 
      const data = await response.json();
      console.log("Known words preview data:",data);
      return data;
    },
  });

  const wordsCountData = useQuery({
    queryKey: ["knownWordsCount"],
    enabled: !!session,
    queryFn: async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/user_known_words/count`,
        { headers: { Authorization: `Bearer ${session!.access_token}` } },
      );
      if (!response.ok) throw new Error("Failed to fetch known words count");
      return response.json();
    },
  });

  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <MainHeader title="Progress" />
      <ScrollView className="flex flex-col bg-background pt-4 px-6" contentContainerClassName="gap-6 pb-6">
        <Pressable onPress={() => router.push("/")} className="p-2">
          <ChevronLeft size={20} color="#8C6E60" strokeWidth={2} />
        </Pressable>

        <StreakCalendar data={statsData.data ?? []} />
        <VocabGraph data={statsData.data ?? []} axisTextStyles={AXIS_TEXT_STYLES} />
        <WeeklyMessages data={statsData.data ?? []} axisTextStyles={AXIS_TEXT_STYLES} />
        <MasteryDistribution axisTextStyles={AXIS_TEXT_STYLES} />
        <KnownWordsPreview numWords={wordsCountData.data?.count || 0} mostRecentWords={wordsData.data ?? []} />
      </ScrollView>
    </View>
  );
}
