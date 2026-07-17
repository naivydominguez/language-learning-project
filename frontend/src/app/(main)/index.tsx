import { View, Pressable } from "react-native";
import { Text } from "@/components/Text";
import { useRouter } from "expo-router";
import { RotateCcw } from "lucide-react-native";
import HamburgerButton from "@/components/HamburgerBtn";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import ChatInputBar from "./chat/_components/ChatInputBar";
import Toast from "react-native-toast-message";
import React from "react";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const [convStart, setConvoStart] = React.useState("");
  const router = useRouter();
  const [navOpen, setNavOpen] = React.useState(false);
  const { session } = useAuth();

  const convStarters = [
    "Hey! I just watched a really interesting video — have you seen anything good lately?",
    "What are your plans for the weekend? I'm trying to decide what to do.",
    "I've been thinking about trying a new restaurant. Do you like trying new foods?",
    "It's been so busy lately! How do you usually relax after a long day?",
    "I just finished a great book. Do you enjoy reading? What kinds of books do you like?",
    "The weather today is beautiful. Do you prefer sunny days or rainy ones?",
    "I'm thinking about learning a new skill. Is there something you've always wanted to learn?",
    "I saw something funny on the way here today. Do you ever notice interesting things on your commute?",
    "I can't decide what to cook for dinner tonight. Do you enjoy cooking?",
    "A friend just recommended a podcast to me. Do you listen to podcasts? What kind do you like?",
  ];
  React.useEffect(() => {
    setConvoStart(
      convStarters[Math.floor(Math.random() * convStarters.length)],
    );
  }, []);

  const handleSend = async (messageText: string) => {
    const start = convStart; // Replace with your generated conversation start
    const title = messageText.split(" ").slice(0, 4).join(" ");

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/conversations/?starterPrompt=${encodeURIComponent(start)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            target_lang: "spanish", // Replace with actual target language
            name: title,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      const convoData = await response.json();

      router.push({
        pathname: "/chat",
        params: {
          start,
          initialMessage: messageText,
          title,
          conversationId: convoData.id,
        },
      });
    } catch (error) {
      console.log("Error creating conversation:", error);
      Toast.show({
        type: "error",
        text1: "Error creating conversation",
        text2: "Please try again later.",
      });
    }
  };

  return (
    <View className="flex-1">
      <View style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
        <HamburgerButton onPress={() => setNavOpen(!navOpen)} />
      </View>

      <Navbar visible={navOpen} onClose={() => setNavOpen(false)} />

      <View className="flex-1 items-center justify-center bg-background-dark  p-6 gap-6">
        <Logo size="lg" />
        <Text weight="bold" className="text-4xl text-black-500">
          Hello, Learner{" "}
        </Text>
        <View className="flex-row items-center justify-between w-full gap-2 p-2 bg-white rounded-lg mt-4">
          <View className="flex-1">
            {/* Place generated conversation start in here*/}
            <Text className="text-1xl">{convStart}</Text>
          </View>
          <Pressable
            className="flex-row items-center gap-1 p-2"
            onPress={() =>
              setConvoStart(
                convStarters[Math.floor(Math.random() * convStarters.length)],
              )
            }
          >
            <RotateCcw size={14} color="#8C6E60" strokeWidth={1.75} />
          </Pressable>
        </View>
        <View className="w-full bg-white rounded-md">
          <ChatInputBar onSend={handleSend} showLanguagePicker={true} />
        </View>
      </View>
    </View>
  );
}
