import { View } from "react-native";
import { Text } from "./Text";
import { LucideIcon } from "lucide-react-native";
import { OnboardingColors } from "@/constants/onboardingTheme";

type InfoCardProps = {
  title: string;
  body: string;
  Icon: LucideIcon;
};

export default function InfoCard({
  title,
  body,
  Icon,
}: InfoCardProps) {
  return (
    <View
      className="flex-row rounded-lg border p-3 mb-2"
      style={{
        backgroundColor: OnboardingColors.surface,
        borderColor: OnboardingColors.border,
      }}
    >
      <View
        className="w-8 h-8 rounded-lg items-center justify-center mr-4"
        style={{
          backgroundColor: OnboardingColors.accentSubtle,
        }}
      >
        <Icon
          size={16}
          color={OnboardingColors.accent}
          strokeWidth={1.75}
        />
      </View>

      <View className="flex-1">
        <Text
          weight={500}
          style={{
            fontSize: 18,
            color: OnboardingColors.text,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            fontSize: 15,
            color: OnboardingColors.secondary,
            marginTop: 5,
          }}
        >
          {body}
        </Text>
      </View>
    </View>
  );
}
