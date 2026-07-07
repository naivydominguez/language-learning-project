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
    <View
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50}}
      pointerEvents={visible ? "auto" : "none"}
    >
      {/* Backdrop */}
      <Animated.View
        style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "100%", opacity: overlayOpacity }}
        className="bg-black"
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Sliding sidebar */}
        <Animated.View
  style={{
    position: "absolute",
    top: 30,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    transform: [{ translateX }],
  }}
  className="rounded-r-lg border-r border-sidebar-border shadow-lg"
>
      
        <SafeAreaView className="flex-1 bg-sidebar" >
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
