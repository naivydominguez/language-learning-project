import React from "react";
import { Pressable, ActivityIndicator } from "react-native";
import { Mic } from "lucide-react-native";
import { useRealtimeVoice } from "@/hooks/use-realtime-voice";

type VoiceInputComponentProps = {
  onUserTranscript?: (text: string) => void;
  onAssistantDelta?: (chunk: string) => void;
  onAssistantTurnDone: (userText: string, assistantText: string) => void;
};

export default function VoiceInputComponent({
  onUserTranscript,
  onAssistantDelta,
  onAssistantTurnDone,
}: VoiceInputComponentProps) {
  const { status, start, stop } = useRealtimeVoice();

  const handlePress = () => {
    if (status === "idle" || status === "error") {
      start({
        onUserTranscript: onUserTranscript ?? (() => {}),
        onAssistantDelta: onAssistantDelta ?? (() => {}),
        onAssistantTurnDone,
      });
    } else {
      stop();
    }
  };

  const iconColor = status === "connected" ? "#D9534F" : "#8C6E60";

  return (
    <Pressable
      onPress={handlePress}
      className="w-10 h-10 rounded-lg items-center justify-center mb-1"
    >
      {status === "connecting" ? (
        <ActivityIndicator size="small" color="#8C6E60" />
      ) : (
        <Mic size={16} color={iconColor} strokeWidth={2} />
      )}
    </Pressable>
  );
}
