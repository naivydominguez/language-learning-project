import { View, Pressable } from "react-native";
import { Text } from "@/components/Text";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
}

export default function PageHeader({ title, onBack }: PageHeaderProps) {
  return (
    <View className="flex-row items-center h-[52px] px-1 bg-background-light border-b border-foreground/[0.1]">
      <Pressable
        onPress={onBack ?? (() => router.back())}
        className="w-10 h-10 items-center justify-center rounded-[10px]"
      >
        <ChevronLeft size={22} color="#201810" strokeWidth={1.75} />
      </Pressable>

      <View className="flex-1 items-center">
        <Text weight="semibold" className="text-[16px] text-foreground tracking-tight">
          {title}
        </Text>
      </View>

      <View className="w-10" />
    </View>
  );
}