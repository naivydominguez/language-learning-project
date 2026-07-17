import { exchangeSdp } from "./exchangeSdp";
import { handleRealtimeEvent } from "./handleRealtimeEvent";
import type { RealtimeVoiceCallbacks, RealtimeVoiceConnection } from "./types";

class WebRealtimeVoiceConnection implements RealtimeVoiceConnection {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private localStream: MediaStream | null = null;
  private audioEl: HTMLAudioElement | null = null;

  async start(clientSecret: string, callbacks: RealtimeVoiceCallbacks): Promise<void> {
    callbacks.onStatusChange("connecting");

    const peerConnection = new RTCPeerConnection();
    this.peerConnection = peerConnection;

    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === "connected") {
        callbacks.onStatusChange("connected");
      } else if (peerConnection.connectionState === "failed" || peerConnection.connectionState === "closed") {
        callbacks.onStatusChange("error");
      }
    };

    peerConnection.ontrack = (event) => {
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioEl.srcObject = event.streams[0];
      this.audioEl = audioEl;
    };

    const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.localStream = localStream;
    localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

    const dataChannel = peerConnection.createDataChannel("oai-events");
    this.dataChannel = dataChannel;
    dataChannel.onmessage = (event) => handleRealtimeEvent(event.data, callbacks);

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    if (!offer.sdp) {
      throw new Error("Failed to create WebRTC offer SDP");
    }

    const answerSdp = await exchangeSdp(offer.sdp, clientSecret);
    await peerConnection.setRemoteDescription({ type: "answer", sdp: answerSdp });
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

    this.peerConnection?.close();
    this.peerConnection = null;
  }
}

/**
 * Returns a WebRealtimeVoiceConnection instance. 
 * start() starts recording audio and establishes a WebRTC connection with OpenAI to start voice mode.
 * stop() stops recording and closes the connection.
 * Used for web only. 
 */
export function createConnection(): RealtimeVoiceConnection {
  return new WebRealtimeVoiceConnection();
}
