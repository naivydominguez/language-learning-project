import { View, Pressable, Animated, ScrollView } from "react-native";
import { Text } from "./Text";
import { useRouter, usePathname } from "expo-router";
import { useRef, useEffect, useState } from "react";

import {
  ChevronLeft,
  Plus,
  MessageCircle,
  Settings,
  TrendingUp,
} from "lucide-react-native";
import Toast from "react-native-toast-message";
import { Motion } from "@/constants/theme";
import { useQuery } from "@tanstack/react-query";
import Logo from "./Logo";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
const DRAWER_WIDTH = 220;

type Props = {
  visible: boolean;
  onClose: () => void;
};
const NAV_ITEMS = [
  { label: "Chat", path: "/", icon: MessageCircle },
  { label: "Settings", path: "/settings", icon: Settings },
  { label: "Progress", path: "/progress", icon: TrendingUp },
] as const;

type RecentConversation = {
  id: string;
  name?: string;
  created_at: string;
};

export default function Navbar({ visible, onClose }: Props) {
  const { session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [activePath, setActivePath] = useState(pathname);

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const recentConversationsData = useQuery({
    queryKey: ["recentConversations", visible],
    enabled: !!session,
    queryFn: async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/conversations/me`,
        {
          headers: {
            Authorization: `Bearer ${session!.access_token}`,
          },
        },
      );
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Couldn't load recent conversations",
          text2: "Please try again later.",
        });
      }
      if (!response.ok) return [];
      const data = await response.json();
      const errorHandledData = Array.isArray(data) ? data : [];
      return errorHandledData as RecentConversation[];
    },
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: visible ? 0 : -DRAWER_WIDTH,
        duration: Motion.duration.normal,
        easing: Motion.easing.easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: visible ? 0.6 : 0,
        duration: Motion.duration.normal,
        easing: Motion.easing.easeOut,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  const navigate = (path: Parameters<typeof router.push>[0]) => {
    setActivePath(path as string);
    onClose();
    router.push(path);
  };

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
      }}
      pointerEvents={visible ? "auto" : "none"}
    >
      {/* Backdrop */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          opacity: overlayOpacity,
          backgroundColor: "#000000",
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Sliding sidebar */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: DRAWER_WIDTH,
          transform: [{ translateX }],
        }}
        className="rounded-r-lg border-r border-background-dark shadow-lg"
      >
        <View className="flex-1 bg-background-light">
          <View className="px-5 pl-4 py-4 border-b border-background-dark">
            <View className="flex-row items-center justify-between">
              <Logo size="md" />
              <Text weight="semibold" className="text-lg text-foreground">
                {" "}
                Immerbot
              </Text>
              <Pressable onPress={onClose}>
                <ChevronLeft size={20} color="#BFAD9F" />
              </Pressable>
            </View>
            <Pressable
              onPress={() => navigate("/")}
              className="flex-row items-center justify-center gap-1.5 mt-3 px-2.5 py-2 rounded-lg border border-primary/25 bg-primary/10"
            >
              <Plus size={13} color="#B5613A" strokeWidth={2.5} />
              <Text weight="semibold" className="text-xs text-primary">
                New conversation
              </Text>
            </Pressable>
          </View>

          {NAV_ITEMS.map((item) => {
            const isActive = activePath === item.path;
            const Icon = item.icon;
            return (
              <Pressable
                key={item.label}
                onPress={() => navigate(item.path)}
                className={`flex-row items-center gap-2 px-5 pl-4 py-3 ${isActive ? "bg-primary/5" : ""}`}
              >
                {Icon && (
                  <Icon size={16} color={isActive ? "#B5613A" : "#201810"} />
                )}
                <Text
                  weight="medium"
                  className="text-base"
                  style={{
                    color: isActive ? "#B5613A" : "#201810",
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}

          <Text className="px-5 pt-4 pb-1 text-sm text-foreground/60">
            Recent
          </Text>

          <ScrollView className="px-5 pl-4">
            {recentConversationsData.data?.map((convo) => (
              <Pressable
                key={convo.id}
                onPress={() => {
                  onClose();
                  router.push({
                    pathname: "/chat",
                    params: { conversationId: convo.id, title: convo.name },
                  });
                }}
                className="py-2"
              >
                <Text className="text-base text-foreground/60">
                  {convo.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
}
