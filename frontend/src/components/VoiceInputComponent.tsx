import { Pressable, ActivityIndicator } from "react-native";
import { Mic } from "lucide-react-native";
import { useRealtimeVoiceContext } from "@/context/RealtimeVoiceContext";

type VoiceInputComponentProps = {
  onUserTranscriptDone?: (text: string) => void;
  onAssistantDelta?: (chunk: string) => void;
  onAssistantTurnDone?: (userText: string, assistantText: string) => void;
  onUserTranscriptDelta?: (chunk: string) => void;
};

export default function VoiceInputComponent({
  onUserTranscriptDelta,
  onUserTranscriptDone,
  onAssistantDelta,
  onAssistantTurnDone,
}: VoiceInputComponentProps) {
  const { status, start, stop } = useRealtimeVoiceContext();

  const handlePress = () => {
    if (status === "idle" || status === "error") {
      start({
        onUserTranscriptDelta,
        onUserTranscriptDone,
        onAssistantDelta,
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
