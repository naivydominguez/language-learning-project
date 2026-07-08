import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import KnownWordsFilter from "./_components/KnownWordsFilter";
import KnownWordItem from "./_components/KnownWordItem";

const knownWords = () => {
  const data = [
    {
      word: "Hola",
      translations: "Hello; Hi; Hey",
      pronunciation: "OH-lah",
      mastery: 10,
    },
    {
      word: "Gracias",
      translations: "Thank you; Thanks",
      pronunciation: "GRAH-syahs",
      mastery: 5,
    },
    {
      word: "Adiós",
      translations: "Goodbye; Farewell",
      pronunciation: "ah-dee-OHS",
      mastery: 7,
    },
  ];

  return (
    <View className="h-full bg-background-light px-6 pt-4">
      <FlashList
        className="bg-background flex flex-col items-center mx-6"
        data={data}
        renderItem={({ item, index }) => (
          <View>
            <KnownWordItem
              word={item.word}
              translationText={item.translations}
              pronunciation={item.pronunciation}
              mastery={item.mastery}
            />
            <View className="h-px w-full bg-foreground-secondary/60" />
          </View>
        )}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={<KnownWordsFilter onFilter={() => {}} />}
      />
    </View>
  );
};

export default knownWords;
