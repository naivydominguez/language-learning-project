export async function exchangeSdp(offerSdp: string, clientSecret: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/realtime/calls", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clientSecret}`,
      "Content-Type": "application/json",
      Accept: "application/sdp",
    },
    body: JSON.stringify({ sdp: offerSdp }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Realtime SDP exchange failed (${response.status}): ${errorText}`);
  }

  return response.text();
}
