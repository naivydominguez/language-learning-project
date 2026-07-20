export type ConversationMessage = { role: "user" | "assistant"; content: string };

export type RealtimeVoiceStatus = "idle" | "connecting" | "connected" | "error";

export type RealtimeVoiceCallbacks = {
  onUserTranscriptDone: (text: string) => void;
  onUserTranscriptDelta: (delta: string) => void;
  onAssistantTranscriptDelta: (delta: string) => void;
  onAssistantTranscriptDone: (fullText: string) => void;
  onStatusChange: (status: RealtimeVoiceStatus) => void;
  onError: (error: Error) => void;
};

export interface RealtimeVoiceConnection {
  start(clientSecret: string, callbacks: RealtimeVoiceCallbacks, conversationHistory?: ConversationMessage[]): Promise<void>;
  stop(): Promise<void>;
}
