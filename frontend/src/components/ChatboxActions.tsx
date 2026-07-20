import React from "react";
import { View } from "react-native";
import VoiceInputComponent from "./VoiceInputComponent";
import LanguagePicker from "./LanguagePicker";
import SendChatComponent from "./SendChatComponent";
type chatboxActionsProps = {
  onSend: () => void;
  canSend: boolean;
  showLanguagePicker?: boolean;
  selectedLanguage?: string;
  onLanguageChange?: (language: string) => void;
};

export default function ChatboxActions({ onSend, canSend, showLanguagePicker, selectedLanguage, onLanguageChange }: chatboxActionsProps) {
  
  return (
    <View className="flex-row items-center w-full">
      {showLanguagePicker && <LanguagePicker selectedLanguage={selectedLanguage} onLanguageChange={onLanguageChange} />}
      <View className="flex-1" />
      <View className="flex-row items-center gap-2">
        <VoiceInputComponent />
        <SendChatComponent onSend={onSend} canSend={canSend} />
      </View>
    </View>
  );
}
