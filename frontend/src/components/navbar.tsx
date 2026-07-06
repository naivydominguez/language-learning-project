import { View, Text, Pressable, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import ChatScreen from "./chatScreen";
import React, { useRef, useEffect } from "react";

const DRAWER_WIDTH = 220;

type Props = {
  visible: boolean;
  onClose: () => void;
};

const NAV_ITEMS = [
  { label: "New Conversation", path: "/" },
  { label: "Chat", path: "/chat" },
  { label: "Settings", path: "/settings" },
  { label: "Progress", path: "/progress" },
] as const;

const RECENT_ITEMS = ["Conversation 1", "Conversation 2"];

export default function Navbar({ visible, onClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();
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
    <View className="absolute top-0 left-0 h-full w-full" pointerEvents={visible ? "auto" : "none"}>
      {/* Backdrop */}
      <Animated.View className="absolute top-0 left-0 h-full w-full bg-black" style={{ opacity: overlayOpacity }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Sliding sidebar */}
      <Animated.View
        className="absolute top-0 left-0 h-full w-56 bg-sidebar rounded-r-lg border-r border-sidebar-border"
        style={{ transform: [{ translateX }] }}
      >
        <SafeAreaView className="flex-1">
          <View className="px-5 pl-4 py-4 border-b border-sidebar-border">
            <Text className="font-sans text-lg font-semibold text-sidebar-foreground">Immer bot</Text>
          </View>

          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Pressable
                key={item.label}
                onPress={() => navigate(item.path)}
                className={`px-5 pl-4 py-3 ${isActive ? "bg-sidebar-accent" : ""}`}
              >
                <Text
                  className={`font-sans text-base font-medium ${
                    isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground"
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}

          <Text className="font-sans px-5 pt-4 pb-1 text-sm text-sidebar-foreground/60">Recent</Text>

          <View className="px-5 pl-4">
            {RECENT_ITEMS.map((label) => (
              <Pressable key={label} onPress={() => navigate("/")} className="py-2">
                <Text className="font-sans text-base text-sidebar-foreground/60">{label}</Text>
              </Pressable>
            ))}
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}
