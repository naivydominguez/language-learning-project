import { View, Pressable } from "react-native";
import { Text } from "../../../components/Text";
import { useRouter, usePathname } from "expo-router";
import { User, Globe, Puzzle, CreditCard, Info, ChevronRight } from "lucide-react-native";

const NAV_ITEMS = [
  { label: "Personalization", desc: "Bot name, personality", path: "/", icon: User },
  { label: "Language Setting", desc: "Native & target languages", path: "/settings", icon: Globe },
  { label: "Connected Apps", desc: "Anki, JPBD, Youtube", path: "/progress", icon: Puzzle },
  { label: "Billings", desc: "Subscription & payment", path: "/progress", icon: CreditCard },
  { label: "About", desc: "Methodology & research", path: "/progress", icon: Info },
] as const;

export default function settingScreen() {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (path: Parameters<typeof router.push>[0]) => {
    router.push(path);
  };

  return (
    <View className="flex-1 bg-background">
      <View
        className="flex-row items-center gap-3 px-4 py-3.5 border-b border-foreground/[0.06]"
      >
        <View className="w-[34px] h-[34px] rounded-[9px] bg-accent-light items-center justify-center">
          <User size={16} color="#B5613A" strokeWidth={1.75} />
        </View>
        <View className="flex-1">
          <Text weight="medium" className="text-[15px] text-foreground">
            Leaner
          </Text>
          <Text className="text-xs text-foreground-tertiary mt-px">Free Plan - Language</Text>
        </View>
      </View>
      <View className="flex-1 bg-white">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Pressable
              key={item.label}
              onPress={() => navigate(item.path)}
              className="flex-row items-center gap-3 px-4 py-3.5 border-b border-foreground/[0.06]"
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
    </View>
  );
}