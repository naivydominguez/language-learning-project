import type { RealtimeVoiceCallbacks } from "./types";

export function handleRealtimeEvent(raw: string, callbacks: RealtimeVoiceCallbacks) {
  let event: any;
  try {
    event = JSON.parse(raw);
  } catch {
    return;
  }

  switch (event.type) {
    case "conversation.item.input_audio_transcription.delta":
      callbacks.onUserTranscriptDelta(event.delta ?? "");
      break;
    case "conversation.item.input_audio_transcription.completed":
      callbacks.onUserTranscriptDone(event.transcript ?? "");
      break;
    case "response.output_audio_transcript.delta":
      callbacks.onAssistantTranscriptDelta(event.delta ?? "");
      break;
    case "response.output_audio_transcript.done":
      callbacks.onAssistantTranscriptDone(event.transcript ?? "");
      break;
    case "error":
      callbacks.onError(new Error(event.error?.message ?? "Realtime API error"));
      break;
    default:
      break;
  }
}
