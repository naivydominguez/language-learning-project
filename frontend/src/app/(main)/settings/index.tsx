import { View, Pressable } from "react-native";
import { Text } from "../../../components/Text";
import { useRouter, usePathname } from "expo-router";
import { User, Globe, Puzzle, CreditCard, Info, ChevronRight } from "lucide-react-native";
import MainHeader from "@/components/MainHeader";
import { useUserProfile } from "@/hooks/use-user";
import { useUserLanguage } from "@/hooks/use-user-language";

const NAV_ITEMS = [
  { label: "Personalization", desc: "Bot name, personality", path: "/settings/Personalization", icon: User },
  { label: "Language Setting", desc: "Native & target languages", path: "/settings/LanguageSetting", icon: Globe },
  { label: "Connected Apps", desc: "Anki, JPDB, Youtube", path: "/settings/ConnectApp", icon: Puzzle },
  // { label: "Billing", desc: "Subscription & payment", path: "/settings/billings", icon: CreditCard },
  { label: "About", desc: "Methodology & research", path: "/settings/About", icon: Info },
] as const;
export default function SettingScreen() {
  const router = useRouter();
  const { data: profile } = useUserProfile();
  const { data: userLanguages } = useUserLanguage();
  
  const navigate = (path: Parameters<typeof router.push>[0]) => {
    router.push(path);
  };
  
  return (
    <View className="flex-1 bg-background">
      <MainHeader title="Settings" />
      <View
        className="flex-row items-center gap-3  px-4 py-3.5 border-b border-foreground/[0.06] mb-5"
      >
        <View className="w-[34px] h-[34px] rounded-[9px] bg-accent-light items-center justify-center">
          <User size={16} color="#B5613A" strokeWidth={1.75} />
        </View>
        <View className="flex-1">
          <Text weight="medium" className="text-[15px] text-foreground">
            {profile?.name ?? "Learner"}
          </Text>
          <Text className="text-xs text-foreground-tertiary mt-px">Free Plan - {userLanguages?.join(", ") || "English"}</Text>
        </View>
      </View>

      <View className="bg-white ml-4 mr-4 shadow-sm rounded-lg overflow-hidden">
        {NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === NAV_ITEMS.length - 1;
          return (
            <Pressable
              key={item.label}
              onPress={() => navigate(item.path)}
              className={`flex-row items-center gap-3 px-4 py-3.5 ${
                isLast ? "" : "border-b border-foreground/[0.06]"
              }`}
            >
              <View className="w-[34px] h-[34px] rounded-[9px] bg-accent-light items-center justify-center">
                {Icon && <Icon size={16} color="#B5613A" strokeWidth={1.75} />}
              </View>
              <View className="flex-1">
                <Text weight="medium" className="text-[15px] text-foreground">
                  {item.label}
                </Text>
                <Text className="text-xs text-foreground-tertiary mt-px">{item.desc}</Text>
              </View>
              <ChevronRight size={16} color="#BFAD9F" strokeWidth={1.75} />
            </Pressable>
          );
        })}
      </View>

      <View className="flex-1" />

      <Pressable onPress={() => router.replace("/onboarding")}>
        <View className="px-4 py-3.5 border-t border-foreground/[0.06] items-center">
          <Text className="text-xs text-primary-dark text-center" weight="medium">
            Sign out
          </Text>
        </View>
      </Pressable>
      <View className="px-4 py-3.5 border-t border-foreground/[0.06] items-center">
        <Text className="text-xs text-foreground-tertiary text-center" weight="medium">
          Immerbot v1.0.0
        </Text>
      </View>
    </View>
  );
}
    