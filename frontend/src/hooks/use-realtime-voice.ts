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
  // Bumped on every start()/stop() so stale events from a connection that's
  // still tearing down asynchronously can't leak into a newer session.
  const sessionIdRef = useRef(0);

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
    const sessionId = ++sessionIdRef.current;
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

      // A stop()/newer start() happened while we were awaiting setup above;
      // abandon this session instead of standing up a connection for it.
      if (sessionId !== sessionIdRef.current) return;

      const connection = createConnection();
      connectionRef.current = connection;

      await connection.start(
        clientSecret,
        {
          onStatusChange: (s) => {
            if (sessionId !== sessionIdRef.current) return;
            setStatus(s);
          },
          onError: (error) => {
            if (sessionId !== sessionIdRef.current) return;
            console.error("Realtime voice error:", error);
            setStatus("error");
          },
          onUserTranscriptDone: (text) => {
            if (sessionId !== sessionIdRef.current) return;
            lastUserTranscriptRef.current = text;
            assistantTranscriptRef.current = "";
            callbacksRef.current?.onUserTranscriptDone?.(text);
          },
          onUserTranscriptDelta: (delta) => {
            if (sessionId !== sessionIdRef.current) return;
            callbacksRef.current?.onUserTranscriptDelta?.(delta);
          },
          onAssistantTranscriptDelta: (delta) => {
            if (sessionId !== sessionIdRef.current) return;
            if (!callbacksRef.current?.onAssistantDelta) {
              pendingAssistantDeltasRef.current.push(delta);
              return;
            }
            assistantTranscriptRef.current += delta;
            callbacksRef.current.onAssistantDelta(delta);
          },
          onAssistantTranscriptDone: (fullText) => {
            if (sessionId !== sessionIdRef.current) return;
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
      if (sessionId !== sessionIdRef.current) return;
      console.error("Failed to start realtime voice session:", error);
      setStatus("error");
      connectionRef.current = null;
    }
  }, []);

  const stop = useCallback(async () => {
    // Invalidate immediately so any events still arriving from this
    // connection while it tears down asynchronously get dropped rather
    // than delivered to whatever callbacks/conversation is active next.
    sessionIdRef.current++;
    const connection = connectionRef.current;
    connectionRef.current = null;
    callbacksRef.current = null;
    await connection?.stop();
    setStatus("idle");
  }, []);

  useEffect(() => {
    return () => {
      sessionIdRef.current++;
      connectionRef.current?.stop();
      connectionRef.current = null;
    };
  }, []);

  return { status, start, stop, setCallbacks, setHistoryProvider };
}
