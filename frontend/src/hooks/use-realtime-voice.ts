import { useCallback, useEffect, useRef, useState } from "react";
import { createConnection } from "@/lib/realtimeVoice/connection";
import { fetchClientSecret } from "@/lib/realtimeVoice/fetchClientSecret";
import type { RealtimeVoiceConnection, RealtimeVoiceStatus } from "@/lib/realtimeVoice/types";

type VoiceTurnCallbacks = {
  onUserTranscript: (text: string) => void;
  onAssistantDelta: (chunk: string) => void;
  onAssistantTurnDone: (userText: string, assistantText: string) => void;
};

export function useRealtimeVoice() {
  const [status, setStatus] = useState<RealtimeVoiceStatus>("idle");
  const connectionRef = useRef<RealtimeVoiceConnection | null>(null);
  const lastUserTranscriptRef = useRef("");
  const assistantTranscriptRef = useRef("");

  const start = useCallback(async (callbacks: VoiceTurnCallbacks) => {
    if (connectionRef.current) return;

    try {
      setStatus("connecting");
      const clientSecret = await fetchClientSecret();

      const connection = createConnection();
      connectionRef.current = connection;

      await connection.start(clientSecret, {
        onStatusChange: setStatus,
        onError: (error) => {
          console.error("Realtime voice error:", error);
          setStatus("error");
        },
        onUserTranscript: (text) => {
          lastUserTranscriptRef.current = text;
          assistantTranscriptRef.current = "";
          callbacks.onUserTranscript(text);
        },
        onAssistantTranscriptDelta: (delta) => {
          assistantTranscriptRef.current += delta;
          callbacks.onAssistantDelta(delta);
        },
        onAssistantTranscriptDone: (fullText) => {
          const finalText = fullText || assistantTranscriptRef.current;
          callbacks.onAssistantTurnDone(lastUserTranscriptRef.current, finalText);
        },
      });
    } catch (error) {
      console.error("Failed to start realtime voice session:", error);
      setStatus("error");
      connectionRef.current = null;
    }
  }, []);

  const stop = useCallback(async () => {
    const connection = connectionRef.current;
    connectionRef.current = null;
    await connection?.stop();
    setStatus("idle");
  }, []);

  useEffect(() => {
    return () => {
      connectionRef.current?.stop();
      connectionRef.current = null;
    };
  }, []);

  return { status, start, stop };
}
