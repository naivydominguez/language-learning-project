import { useCallback, useEffect, useRef, useState } from "react";
import { createConnection } from "@/lib/realtimeVoice/connection";
import { fetchClientSecret } from "@/lib/realtimeVoice/fetchClientSecret";
import type {
  RealtimeVoiceConnection,
  RealtimeVoiceStatus,
  ConversationMessage,
} from "@/lib/realtimeVoice/types";

export type VoiceTurnCallbacks = {
  onUserTranscriptDone?: (text: string) => void;
  onUserTranscriptDelta?: (chunk: string) => void;
  onAssistantDelta?: (chunk: string) => void;
  onAssistantTurnDone?: (userText: string, assistantText: string) => void;
};

export function useRealtimeVoice() {
  const [status, setStatus] = useState<RealtimeVoiceStatus>("idle");
  const connectionRef = useRef<RealtimeVoiceConnection | null>(null);
  const callbacksRef = useRef<VoiceTurnCallbacks | null>(null);
  const lastUserTranscriptRef = useRef("");
  const assistantTranscriptRef = useRef("");
  const historyProviderRef = useRef<
    (() => Promise<ConversationMessage[]>) | null
  >(null);

  const setHistoryProvider = useCallback(
    (fn: () => Promise<ConversationMessage[]>) => {
      historyProviderRef.current = fn;
    },
    [],
  );

  const pendingAssistantDeltasRef = useRef<string[]>([]);

  /**
   * Swap in new handlers without dropping the connection.
   * Flushes any assistant deltas that were buffered before this call.
   */
  const setCallbacks = useCallback((cb: VoiceTurnCallbacks) => {
    callbacksRef.current = cb;

    const pending = pendingAssistantDeltasRef.current;
    if (pending.length > 0 && cb.onAssistantDelta) {
      pendingAssistantDeltasRef.current = [];
      for (const delta of pending) {
        assistantTranscriptRef.current += delta;
        cb.onAssistantDelta(delta);
      }
    }
  }, []);

  const start = useCallback(async (callbacks: VoiceTurnCallbacks) => {
    if (connectionRef.current) return;
    callbacksRef.current = callbacks;
    pendingAssistantDeltasRef.current = [];

    try {
      setStatus("connecting");
      const [clientSecret, conversationHistory] = await Promise.all([
        fetchClientSecret(),
        historyProviderRef.current
          ? historyProviderRef.current().catch(() => [])
          : Promise.resolve([]),
      ]);

      const connection = createConnection();
      connectionRef.current = connection;

      await connection.start(
        clientSecret,
        {
          onStatusChange: setStatus,
          onError: (error) => {
            console.error("Realtime voice error:", error);
            setStatus("error");
          },
          onUserTranscriptDone: (text) => {
            lastUserTranscriptRef.current = text;
            assistantTranscriptRef.current = "";
            callbacksRef.current?.onUserTranscriptDone?.(text);
          },
          onUserTranscriptDelta: (delta) => {
            callbacksRef.current?.onUserTranscriptDelta?.(delta);
          },
          onAssistantTranscriptDelta: (delta) => {
            if (!callbacksRef.current?.onAssistantDelta) {
              pendingAssistantDeltasRef.current.push(delta);
              return;
            }
            assistantTranscriptRef.current += delta;
            callbacksRef.current.onAssistantDelta(delta);
          },
          onAssistantTranscriptDone: (fullText) => {
            const finalText = fullText || assistantTranscriptRef.current;
            callbacksRef.current?.onAssistantTurnDone?.(
              lastUserTranscriptRef.current,
              finalText,
            );
          },
        },
        conversationHistory,
      );
    } catch (error) {
      console.error("Failed to start realtime voice session:", error);
      setStatus("error");
      connectionRef.current = null;
    }
  }, []);

  const stop = useCallback(async () => {
    const connection = connectionRef.current;
    connectionRef.current = null;
    callbacksRef.current = null;
    await connection?.stop();
    setStatus("idle");
  }, []);

  useEffect(() => {
    return () => {
      connectionRef.current?.stop();
      connectionRef.current = null;
    };
  }, []);

  return { status, start, stop, setCallbacks, setHistoryProvider };
}
