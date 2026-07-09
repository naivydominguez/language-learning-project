import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { RotateCcw } from "lucide-react-native";
import Logo from "./logo";
import ChatInputBar from "./ui/chatInputBar";

export default function HomePage() {
  const router = useRouter();
    const convStarter="hello, how are you?"; // Replace with your generated conversation start
  const handleSend = (messageText: string) => {
    const start = convStarter; // Replace with your generated conversation start
    const title = messageText.split(" ").slice(0, 4).join(" ");
    const conversationId = Date.now().toString();
    
    router.push({
      pathname: "/chatScreen",
      params: { start, initialMessage: messageText, title, conversationId },
    });
  };

  return (
    <View className="flex-1 items-center justify-center bg-background m-4 p-4 gap-6" >
      <Logo size="lg" />
      <Text className="text-4xl font-bold text-black-500"> Hello, Learner </Text>
      <View className="flex-row items-center justify-between w-full gap-2 p-2 bg-gray-200 rounded-lg mt-4">
        <View>
            {/* Place generated conversation start in here*/}
          <Text className="text-1xl">{convStarter}</Text>
        </View>
        <Pressable className="flex-row items-center gap-1 p-2" onPress={() => {}}>
          <RotateCcw size={14} color="#8C6E60" strokeWidth={1.75} />
        </Pressable>
      </View>
      <View className="w-full" >
      <ChatInputBar onSend={handleSend} />
      </View>
    </View>
  );
}
