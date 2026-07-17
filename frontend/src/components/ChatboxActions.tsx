import React from "react";
import { View } from "react-native";
import VoiceInputComponent from "./VoiceInputComponent";
import LanguagePicker from "./LanguagePicker";
import SendChatComponent from "./SendChatComponent";
type chatboxActionsProps = {
  onSend: () => void;
  canSend: boolean;
  showLanguagePicker?: boolean;
  showVoiceButton?: boolean;
  onVoiceUserTranscript?: (text: string) => void;
  onVoiceAssistantDelta?: (chunk: string) => void;
  onVoiceTurnDone?: (userText: string, assistantText: string) => void;
};

export default function ChatboxActions({
  onSend,
  canSend,
  showLanguagePicker,
  showVoiceButton = true,
  onVoiceUserTranscript,
  onVoiceAssistantDelta,
  onVoiceTurnDone,
}: chatboxActionsProps) {

  return (
    <View className="flex-row items-center w-full">
      {showLanguagePicker && <LanguagePicker />}
      <View className="flex-1" />
      <View className="flex-row items-center gap-2">
        {showVoiceButton && onVoiceTurnDone && (
          <VoiceInputComponent
            onUserTranscript={onVoiceUserTranscript}
            onAssistantDelta={onVoiceAssistantDelta}
            onAssistantTurnDone={onVoiceTurnDone}
          />
        )}
        <SendChatComponent onSend={onSend} canSend={canSend} />
      </View>
    </View>
  );
}
