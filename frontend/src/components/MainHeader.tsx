import { View } from "react-native";
import { Text } from "@/components/Text";
import HamburgerButton from "./HamburgerBtn";
import { useNav } from "@/hooks/use-nav";

interface MainHeaderProps {
  title: string;
  border?: boolean;
}

export default function MainHeader({ title, border = true }: MainHeaderProps) {
  const { openNav } = useNav();

  return (
    <View
      className={`flex-row items-center h-[52px] px-1  ${
        border ? "border-b border-foreground/[0.1]" : ""
      }`}
    >
      <View className="w-10 h-10 items-center justify-center">
        <HamburgerButton onPress={openNav} />
      </View>

      <View className="flex-1 items-center">
        <Text weight="semibold" className="text-[16px] text-foreground tracking-tight">
          {title}
        </Text>
      </View>

      <View className="w-10" />
    </View>
  );
}
