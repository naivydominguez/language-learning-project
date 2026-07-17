import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import KnownWordsFilter from "./_components/KnownWordsFilter";
import KnownWordItem from "./_components/KnownWordItem";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";

type KnownWord = {
  word: string;
  translations: string;
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
      <FlashList
        className="bg-background flex flex-col items-center"
        data={data ?? []}
        renderItem={({ item, index }: { item: KnownWord; index: number }) => (
          <View>
            <KnownWordItem
              word={item.word}
              translationText={item.translations}
              pronunciation={item.pronunciation}
              mastery={item.mastery_level}
            />
            {index < (data?.length ?? 0) - 1 && (
              <View className="h-px w-full bg-foreground-secondary/30" />
            )}
          </View>
        )}
        ListHeaderComponent={
          <KnownWordsFilter onFilter={handleFilter} />
        }
      />
    </View>
  );
};

export default knownWords;
