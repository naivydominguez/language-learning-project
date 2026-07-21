import { View, Pressable, ActivityIndicator } from "react-native";
import { Text } from "@/components/Text";
import { useRouter } from "expo-router";
import { RotateCcw } from "lucide-react-native";
import MainHeader from "@/components/MainHeader";
import Logo from "@/components/Logo";
import ChatInputBar from "./chat/_components/ChatInputBar";
import Toast from "react-native-toast-message";
import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useUserProfile } from "@/hooks/use-user";
import { useUserLanguage } from "@/hooks/use-user-language";
import { useRealtimeVoiceContext } from "@/context/RealtimeVoiceContext";
import { getPendingOnboardingData } from "@/lib/onboardingStorage";

export default function HomePage() {
  const { session, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthLoading || session) return;

    getPendingOnboardingData().then((pendingData) => {
      if (!pendingData) {
        router.replace("/onboarding");
      } else {
        router.replace("/account/sign-up");
      }
    });
  }, [isAuthLoading, session]);
  const { setHistoryProvider } = useRealtimeVoiceContext();
  const { data: userLanguages, isLoading: isLoadingUserLanguages } =
    useUserLanguage();
  const { data: profile } = useUserProfile();

  const [convStart, setConvoStart] = useState("");
  const [convStarters, setConvStarters] = useState<string[]>([]);
  const [preLanguage, setPreLanguage] = useState("english");
  const language = preLanguage ?? userLanguages?.[0] ?? "english";

  // A voice turn started here belongs to a conversation that doesn't exist
  // yet, so it must never inherit whatever history a previously visited
  // chat screen left registered on the shared realtime voice session.
  // Seed the starter prompt itself as a prior assistant turn so the model
  // knows what it's being answered — text mode gets this for free because
  // the backend writes it to the DB before the first real message, but a
  // voice session never touches the DB until the turn is already over.
  React.useEffect(() => {
    setHistoryProvider(async () =>
      convStart ? [{ role: "assistant", content: convStart }] : [],
    );
  }, [convStart, setHistoryProvider]);

  React.useEffect(() => {
    if (userLanguages?.[0]) {
      setPreLanguage(userLanguages[0]);
    }
  }, [userLanguages]);

  const getConvStarters = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/conversation-starters?target_lang=${language.toLowerCase()}`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch conversation starters");
      }
      const data = await response.json();
      return data.starters as string[];
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error fetching conversation starters",
        text2: "Please try again later.",
      });
      return [];
    }
  };

  const requestIdRef = React.useRef(0);
  React.useEffect(() => {
    if (isLoadingUserLanguages) return;
    const requestId = ++requestIdRef.current;

    getConvStarters().then((starters) => {
      if (requestId !== requestIdRef.current) return; // Ignore if a newer request has been made
      setConvStarters(starters);
      setConvoStart(starters[Math.floor(Math.random() * starters.length)]);
    });
  }, [language, isLoadingUserLanguages]);

  const createConversation = async (title: string, start: string) => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/conversations/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          target_lang: language,
          name: title,
          starting_prompt: start,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to create conversation");
    }

    return await response.json();
  };

  const handleSend = async (messageText: string, voice: boolean = false) => {
    const starterPrompt = convStart;
    const title = messageText.split(" ").slice(0, 4).join(" ");
    try {
      const convoData = await createConversation(title, starterPrompt);

      router.push({
        pathname: "/chat",
        params: {
          starterPrompt,
          title,
          conversationId: convoData.id,
          initialMessage: messageText,
          voice: voice ? "true" : "false",
        },
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
      Toast.show({
        type: "error",
        text1: "Error creating conversation",
        text2: "Please try again later.",
      });
    }
  };

  if (isAuthLoading || !session) {
    return (
      <View className="flex-1 items-center justify-center bg-background-dark">
        <ActivityIndicator size="small" color="#8C6E60" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-dark">
      <MainHeader title="" border={false} />
      <View className="flex-1 items-center justify-center bg-background-dark  p-6 gap-6">
        <Logo size="lg" />
        <Text weight="bold" className="text-4xl text-black-500">
          Hello, {profile?.name || "Learner"}!
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
          <ChatInputBar
            onSend={handleSend}
            showLanguagePicker={true}
            selectedLanguage={language}
            onLanguageChange={(lang) => setPreLanguage(lang)}
            onVoiceUserTranscript={(transcript) => handleSend(transcript, true)}
          />
        </View>
      </View>
    </View>
  );
}
