import { Pressable, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import KnownWordsFilter from "./_components/KnownWordsFilter";
import KnownWordItem from "./_components/KnownWordItem";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Text } from "@/components/Text";

type KnownWord = {
  word: string;
  translation: string;
  pronunciation: string;
  mastery_level: number;
};

export type FilterArgs = {
  sortType: "recent" | "alphabetical" | "mastery";
  searchTerm?: string;
  languageCode?: string;
  descending?: boolean;
};

const knownWords = () => {
  const { session } = useAuth();
  const router = useRouter();
  const [filterArgs, setFilterArgs] = useState<FilterArgs>({
    sortType: "alphabetical",
  });

  const handleFilter = useCallback((args: FilterArgs) => {
    setFilterArgs(args);
  }, []);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["knownWords", filterArgs],
    enabled: !!session,
    queryFn: async ({ queryKey }) => {
      const [_, filterArgs] = queryKey as [string, FilterArgs];
      const params = new URLSearchParams();
      if (filterArgs.searchTerm) {
        params.set("search", filterArgs.searchTerm);
      }
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/user_known_words/me?${params.toString()}`,
        { headers: { Authorization: `Bearer ${session!.access_token}` } },
      );
      if (!response.ok) throw new Error("Failed to fetch known words");
      return response.json();
    },
  });

  return (
    <View className="h-full bg-background-light pt-4">
      <View className="flex-row items-center justify-between border-b border-foreground-secondary/20 bg-background-light px-4 py-4">
        <Pressable onPress={() => router.back()} className="w-10">
          <ChevronLeft size={28} strokeWidth={2} />
        </Pressable>

        <Text weight="bold" className="text-2xl">
          Known Words
        </Text>

        <View className="w-10" />
      </View>

      <FlashList
        className="bg-background flex flex-col items-center"
        data={data ?? []}
        renderItem={({ item, index }: { item: KnownWord; index: number }) => (
          <View>
            <KnownWordItem
              word={item.word}
              translationText={item.translation}
              pronunciation={item.pronunciation}
              mastery={item.mastery_level}
            />
            {index < (data?.length ?? 0) - 1 && (
              <View className="h-px w-full bg-foreground-secondary/30" />
            )}
          </View>
        )}
        ListHeaderComponent={<KnownWordsFilter onFilter={handleFilter} />}
      />
    </View>
  );
};

export default knownWords;
