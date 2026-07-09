import Searchbar from "@/components/Searchbar";
import { useState } from "react";
import { View } from "react-native";

interface Props {
  onFilter: (
    sortType: "recent" | "alphabetical" | "mastery",
    searchTerm?: string,
    languageCode?: string,
  ) => void;
}

const KnownWordsFilter = ({ onFilter }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<
    "recent" | "alphabetical" | "mastery"
  >("recent");
  const [languageCode, setLanguageCode] = useState<string | undefined>(
    undefined,
  );

  const updateFilter = ({
    sort,
    search,
    language,
  }: {
    sort?: "recent" | "alphabetical" | "mastery";
    search?: string;
    language?: string;
  }) => {
    if (sort) setSortType(sort);
    if (search !== undefined) setSearchTerm(search);
    if (language !== undefined) setLanguageCode(language);

    onFilter(sortType || "recent", searchTerm || "", languageCode);
  };

  return (
    <View>
      <Searchbar
        searchPrompt="Search words..."
        onSearch={(search) => updateFilter({ search })}
      />
    </View>
  );
};

export default KnownWordsFilter;
