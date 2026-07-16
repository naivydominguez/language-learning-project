import { useState, useCallback, useRef } from "react";

/**
 * Streams chat messages
 */
export function useChat(conversationId: string) {
  const [message, setMessage] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const buffer = useRef("")

  const sendMessage = useCallback(async (content: string) => {
    if (isWaiting) return; // Prevent sending if already waiting for a response

    setMessage("");
    setIsWaiting(true);

    const accessToken = ""; // Replace with supabase auth token
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content }),
      },
    );

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { value, done } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        buffer.current += chunk;
        
        const events = buffer.current.split("\n\n")
        buffer.current = events.pop() || ""

        for (const event of events) {
            const fields = event.split("\n");
            const eventType = fields[0].replace("event: ", "").trim();
            const eventData = fields[1].replace("data: ", "");

            if (eventType === "delta") {
                setMessage((prev) => prev + eventData);
            } else if (eventType === "completed") {
                setIsWaiting(false);
            } else if (eventType === "error") {
                console.error("Error from server:", eventData);
            }

        }
      }
    } catch (error) {
      console.error("Error reading stream:", error);
    } finally {
      reader?.releaseLock();
      setIsWaiting(false);
    }
  }, [conversationId]);

  return { message, isWaiting, sendMessage };
}

/**
 * onClick -> chatResponse = useChat()
 * newMessage = chatResponse.message
 * messages.append(newMessage)
 */