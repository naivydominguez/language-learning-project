export type RealtimeVoiceStatus = "idle" | "connecting" | "connected" | "error";

export type RealtimeVoiceCallbacks = {
  onUserTranscript: (text: string) => void;
  onAssistantTranscriptDelta: (delta: string) => void;
  onAssistantTranscriptDone: (fullText: string) => void;
  onStatusChange: (status: RealtimeVoiceStatus) => void;
  onError: (error: Error) => void;
};

export interface RealtimeVoiceConnection {
  start(clientSecret: string, callbacks: RealtimeVoiceCallbacks): Promise<void>;
  stop(): Promise<void>;
}
