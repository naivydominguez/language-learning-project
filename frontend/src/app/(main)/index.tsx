import { View, Pressable } from "react-native";
import { Text } from "@/components/Text";
import { useRouter } from "expo-router";
import { RotateCcw } from "lucide-react-native";
import MainHeader from "@/components/MainHeader";
import Logo from "@/components/Logo";
import ChatInputBar from "./chat/_components/ChatInputBar";
import Toast from "react-native-toast-message";
import React from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import {useUserProfile} from "@/hooks/use-user";
import {useUserLanguage} from "@/hooks/use-user-language";
export default function HomePage() {
  const { data: userLanguages } = useUserLanguage();

  const [convStart, setConvoStart] = React.useState("");
  const [convStarters, setConvStarters] = React.useState<string[]>([]);
  const  [language, setLanguage] = React.useState( "english");
  const router = useRouter();
  React.useEffect(() => {
    if (userLanguages?.[0])  {
      setLanguage(userLanguages[0]);
    }
    }, [userLanguages]);
  const getConvStarters = async ()=>
  {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/conversation-starters?target_lang=${language.toLowerCase()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch conversation starters");
      }
      const data = await response.json();
      return data.starters as string[];
    } catch (error) {
      Toast .show({
        type: "error",
        text1: "Error fetching conversation starters",
        text2: "Please try again later.",
      });
      return [];
    }
  }

  React.useEffect(() => {
    getConvStarters().then((starters) => {
      setConvStarters(starters);
      setConvoStart(starters[Math.floor(Math.random() * starters.length)]);
    });
  }, [language]);
     const { data: profile } = useUserProfile();

  const handleSend = async (messageText: string) => {
    const start = convStart; // Replace with your generated conversation start
    const title = messageText.split(" ").slice(0, 4).join(" ");
    try {
      const { session } = useAuth();

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/conversations/?starterPrompt=${encodeURIComponent(start)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            target_lang: language, 
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
      Toast.show({
        type: "error",
        text1: "Error creating conversation",
        text2: "Please try again later.",
      });
    }
  };

  

  return (
    <View className="flex-1 bg-background-dark">
      <MainHeader title="" border={false} />
      <View className="flex-1 items-center justify-center bg-background-dark  p-6 gap-6">
        <Logo size="lg" />
        <Text weight="bold" className="text-4xl text-black-500">
          Hello, {profile?.name || "Learner"} !
        </Text>
        <View className="flex-row items-center justify-between w-full gap-2 p-2 bg-white rounded-lg mt-4">
          <View className="flex-1">
            {/* Place generated conversation start in here*/}
            <Text className="text-1xl">{convStart}</Text>
          </View>
          <Pressable
            className="flex-row items-center gap-1 p-2"
            onPress={() => setConvoStart(convStarters[Math.floor(Math.random() * convStarters.length)])}
          >
            <RotateCcw size={14} color="#8C6E60" strokeWidth={1.75} />
          </Pressable>
        </View>
        <View className="w-full bg-white rounded-md">
          <ChatInputBar onSend={handleSend} showLanguagePicker={true} selectedLanguage={language} onLanguageChange={(lang) => setLanguage(lang)}/>
        </View>
      </View>
    </View>
  );
}
