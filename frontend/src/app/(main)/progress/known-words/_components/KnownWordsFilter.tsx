import Searchbar from "@/components/Searchbar";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { FilterArgs } from "..";

interface Props {
  onFilter: (filter: FilterArgs) => void;
}

const KnownWordsFilter = ({ onFilter }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<
    "recent" | "alphabetical" | "mastery"
  >("recent");
  const [languageCode, setLanguageCode] = useState<string | undefined>(
    undefined,
  );

  const updateFilter = useCallback(({
    sort,
    search,
    language,
  }: {
    sort?: "recent" | "alphabetical" | "mastery";
    search?: string;
    language?: string;
  }) => {
    const newSortType = sort ?? sortType;
    const newSearch = search !== undefined ? search : searchTerm;
    const newLanguage = language !== undefined ? language : languageCode;

    if (sort) setSortType(newSortType);
    if (search !== undefined) setSearchTerm(newSearch);
    if (language !== undefined) setLanguageCode(newLanguage);

    onFilter({
      sortType: newSortType,
      searchTerm: newSearch,
      languageCode: newLanguage,
    });
  }, [onFilter, sortType, searchTerm, languageCode]);

  const onSearch = useCallback(
    (search: string) => {
      updateFilter({ search });
    },
    [updateFilter],
  );

  return (
    <View className="mx-6 my-2">
      <Searchbar searchPrompt="Search words..." onSearch={onSearch} />
    </View>
  );
};

export default KnownWordsFilter;
