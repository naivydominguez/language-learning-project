import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import KnownWordsFilter from "./_components/KnownWordsFilter";
import KnownWordItem from "./_components/KnownWordItem";
import { useQuery } from "@tanstack/react-query";

type KnownWord = {
  word: string;
  translations: string;
  pronunciation: string;
  mastery: number;
};

const knownWords = () => {
  const accessToken = "temp"; // TODO: replace with supabase token

  const { data, isLoading, error } = useQuery({
    queryKey: ["knownWords"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/user_known_words/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch known words");
      }

      const data = await response.json();
      console.log(data);
      return data;
    },
  });

  return (
    <View className="h-full bg-background-light px-6 pt-4">
      <FlashList
        className="bg-background flex flex-col items-center mx-6"
        data={data ?? []}
        renderItem={({ item, index }: { item: KnownWord; index: number }) => (
          <View>
            <KnownWordItem
              word={item.word}
              translationText={item.translations}
              pronunciation={item.pronunciation}
              mastery={item.mastery}
            />
            {index < (data?.length ?? 0) - 1 && (
              <View className="h-px w-full bg-foreground-secondary/30" />
            )}
          </View>
        )}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={<KnownWordsFilter onFilter={() => {}} />}
      />
    </View>
  );
};

export default knownWords;
