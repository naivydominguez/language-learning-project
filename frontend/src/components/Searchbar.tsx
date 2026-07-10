import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, View, TextInput, Platform } from "react-native";
import { useDebounce } from "use-debounce";

interface Props {
  searchPrompt: string;
  onSearch: (searchTerm: string) => void;
}

const Searchbar = ({ searchPrompt, onSearch }: Props) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const hasMountedRef = useRef(false);

  const handleSearchChange = (text: string) => {
    setSearch(text);
  };

  useEffect(() => {
    // skip first render if you don't want an initial empty search
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    onSearch(debouncedSearch.trim());
  }, [debouncedSearch, onSearch]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="w-full h-max bg-white rounded-md border border-foreground-tertiary">
        <TextInput
          value={search}
          className="w-full h-max text-base text-foreground placeholder-foreground-tertiary p-4"
          placeholder={searchPrompt}
          onChangeText={handleSearchChange}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Searchbar;
