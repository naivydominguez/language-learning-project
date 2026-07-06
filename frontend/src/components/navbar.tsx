import { View, Text, Pressable, Animated, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import React, { useRef, useEffect } from "react";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = 220;

type Props = {
  visible: boolean;
  onClose: () => void;
};
export default function Navbar({ visible, onClose }: Props) {
  const router = useRouter();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
     useEffect(() => {
       Animated.parallel([
         Animated.timing(translateX, {
           toValue: visible ? 0 : -DRAWER_WIDTH,
           duration: 250,
           useNativeDriver: true,
         }),
         Animated.timing(overlayOpacity, {
           toValue: visible ? 1 : 0,
           duration: 250,
           useNativeDriver: true,
         }),
       ]).start();
     }, [visible]);

      const navigate = (path: Parameters<typeof router.push>[0]) => {
        onClose();
        router.push(path);
     };
  return (
    <Animated.View className="absolute top-0 left-0 h-full w-full" style={{ opacity: overlayOpacity }}>
      <View className="flex-1 flex-row">
        {/* Sidebar */}
        <SafeAreaView className="flex-col bg-background-element w-48">
          <View className="p-2">
            <Text className="text-lg font-bold">Immer bot</Text>
          </View>
          <Pressable onPress={() => navigate("/")} className="pl-2 py-1">
            <Text className="text-lg font-bold">New Conversation</Text>
          </Pressable>
          <Pressable onPress={() => navigate("/")} className="pl-2 py-1">
            <Text className="text-lg font-bold">Chat</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/settings")} className="pl-2 py-1">
            <Text className="text-lg font-bold">Settings</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/progress")} className="pl-2 py-1">
            <Text className="text-lg font-bold">Progress</Text>
          </Pressable>
          <Text className="pl-2 text-md">Recent</Text>

          {/* Recent conversations list */}
          <View className="pl-2">
            <Pressable onPress={() => router.push("/")} className="py-1">
              <Text className="text-lg">Conversation 1</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/")} className="py-1">
              <Text className="text-lg">Conversation 2</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Animated.View>
  );
}
