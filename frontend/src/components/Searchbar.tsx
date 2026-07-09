import { useState } from "react";
import { KeyboardAvoidingView, View, TextInput, Platform } from "react-native";

interface Props {
  searchPrompt: string;
  onSearch: (searchTerm: string) => void;
}

const Searchbar = ({ searchPrompt, onSearch }: Props) => {
  const [search, setSearch] = useState("");

  const handleSearchChange = (text: string) => {
    setSearch(text);
    onSearch(text);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="w-full h-max bg-white rounded-md border border-foreground-tertiary p-4">
        <TextInput
          value={search}
          className="w-full h-max text-base text-foreground placeholder-foreground-tertiary"
          placeholder={searchPrompt}
          onChangeText={handleSearchChange}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Searchbar;
