import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ChatInputBar from "../components/ui/chatInputBar";
import MessageBubble from "../components/messageBubble";
import { FlatList } from "react-native-gesture-handler";

type Message = {
  id: string;
  sender: "user" | "ai";
  context: string;
};


export default function ChatScreen() {
  const { start,initialMessage, title } = useLocalSearchParams<{
    start? :string;
    initialMessage?: string;
    title?: string;
    conversationId?: string;
  }>();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isWaiting, setIsWaiting] = React.useState(false);
  const hasSentInitial = React.useRef(false);

   const createConversation = async () => {
     try {
       const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/conversations/`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           target_lang: "Spanish", // Replace with your target language
         }),
       });

       if (!response.ok) {
         throw new Error("Failed to create conversation");
       }

       return response.json();
     } catch (error) {
       console.error("Error creating conversation:", error);
       throw error;
     }
   };

  
   const sendMessageToAI = async (context: string, conversationId: string, accessToken: string) => {
     try {
       const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/conversations/${conversationId}/messages`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${accessToken}`,
         },
         body: JSON.stringify({
           content: context,
         }),
       });

       if (!response.ok) {
         throw new Error("Failed to send message");
       }
       return response.json();
     } catch (error) {
       console.error("Error sending message:", error);
       throw error;
     }
   };


  const handleSend = async (messageText: string) => {
    setIsWaiting(true);
    try {
      const newMessage: Message = {
        id: Date.now().toString()+messageText,
        sender: "user",
        context: messageText,
      };
      setMessages((prev) => [...prev, newMessage]);
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString()+`AI reply to: ${messageText}`,
              context: `AI reply to: ${messageText}`,
              sender: "ai",
            },
          ]);
          resolve();
        }, 500);
      });
    } finally {
      setIsWaiting(false);
    }
  };


   
  const handleSendBackend = async (messageText: string) => {
    setIsWaiting(true);
    try {
      const newMessage: Message = {
        id: Date.now().toString()+messageText,
        sender: "user",
        context: messageText,
      };
      setMessages((prev) => [...prev, newMessage]);

      const convoData = await createConversation();
      const conversationId = convoData.id;
      const accessToken = "temporary-access-token"; // Replace with your actual access token
      const aiMessage = await sendMessageToAI(messageText, conversationId, accessToken);
      setMessages((prev) => [...prev, { id: Date.now().toString()+aiMessage.content, sender: "ai", context: aiMessage.content }]);
    } finally {
      setIsWaiting(false);
    }
  };

  React.useEffect(() => {
    if (!hasSentInitial.current) {
      hasSentInitial.current = true;
      if (start) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString()+start, sender: "ai", context: start },
        ]);
      }
      if (initialMessage) {
        handleSend(initialMessage);
      }
    }
  }, [start, initialMessage]);

  return (
    <View className="flex-1 bg-background p-4" style={{ paddingTop: 60 }}>
      <View className="items-center justify-center mb-4 border-b border-border pb-2">
      {title ? (
        <Text className="font-sans text-lg font-semibold text-foreground text-center mb-2">
          {title}
        </Text>
      ) : null}
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={{ padding: 16, gap: 8 }}
      />
      <ChatInputBar onSend={handleSend} isWaiting={isWaiting} />
    </View>
  );
}
