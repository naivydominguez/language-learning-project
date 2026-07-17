import { exchangeSdp } from "./exchangeSdp";
import { handleRealtimeEvent } from "./handleRealtimeEvent";
import type { RealtimeVoiceCallbacks, RealtimeVoiceConnection } from "./types";

class WebRealtimeVoiceConnection implements RealtimeVoiceConnection {
  private pc: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private localStream: MediaStream | null = null;
  private audioEl: HTMLAudioElement | null = null;

  async start(clientSecret: string, callbacks: RealtimeVoiceCallbacks): Promise<void> {
    callbacks.onStatusChange("connecting");

    const pc = new RTCPeerConnection();
    this.pc = pc;

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        callbacks.onStatusChange("connected");
      } else if (pc.connectionState === "failed" || pc.connectionState === "closed") {
        callbacks.onStatusChange("error");
      }
    };

    pc.ontrack = (event) => {
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioEl.srcObject = event.streams[0];
      this.audioEl = audioEl;
    };

    const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.localStream = localStream;
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    const dataChannel = pc.createDataChannel("oai-events");
    this.dataChannel = dataChannel;
    dataChannel.onmessage = (event) => handleRealtimeEvent(event.data, callbacks);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    if (!offer.sdp) {
      throw new Error("Failed to create WebRTC offer SDP");
    }

    const answerSdp = await exchangeSdp(offer.sdp, clientSecret);
    await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
  }

  async stop(): Promise<void> {
    this.dataChannel?.close();
    this.dataChannel = null;

    this.localStream?.getTracks().forEach((track) => track.stop());
    this.localStream = null;

    if (this.audioEl) {
      this.audioEl.srcObject = null;
      this.audioEl = null;
    }

    this.pc?.close();
    this.pc = null;
  }
}

export function createConnection(): RealtimeVoiceConnection {
  return new WebRealtimeVoiceConnection();
}
