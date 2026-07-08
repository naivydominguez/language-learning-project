// src/app/index.tsx
import { View } from "react-native";
import ChatScreen from "@/components/chatScreen";

export default function HomeScreen() {
  return (
    <View className="flex-1 flex-row">
      <ChatScreen />
    </View>
  );
}
