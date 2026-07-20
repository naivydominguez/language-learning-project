import React, { createContext, useContext } from "react";
import { useRealtimeVoice, type VoiceTurnCallbacks } from "@/hooks/use-realtime-voice";
import type { RealtimeVoiceStatus, ConversationMessage } from "@/lib/realtimeVoice/types";

type RealtimeVoiceContextValue = {
  status: RealtimeVoiceStatus;
  start: (callbacks: VoiceTurnCallbacks) => Promise<void>;
  stop: () => Promise<void>;
  setCallbacks: (callbacks: VoiceTurnCallbacks) => void;
  setHistoryProvider: (fn: () => Promise<ConversationMessage[]>) => void;
};

const RealtimeVoiceContext = createContext<RealtimeVoiceContextValue | null>(null);

export function RealtimeVoiceProvider({ children }: { children: React.ReactNode }) {
  const voice = useRealtimeVoice();
  return (
    <RealtimeVoiceContext.Provider value={voice}>
      {children}
    </RealtimeVoiceContext.Provider>
  );
}

export function useRealtimeVoiceContext(): RealtimeVoiceContextValue {
  const context = useContext(RealtimeVoiceContext);
  if (!context) throw new Error("useRealtimeVoiceContext must be used within RealtimeVoiceProvider");
  return context;
}
