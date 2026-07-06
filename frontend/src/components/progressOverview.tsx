import { View, Text } from "react-native"

const ProgressOverview = () => {
  return (
    <View className="flex flex-row justify-around items-center">
    <OverviewPanel text="Words Learned" subtext="120" />
    <OverviewPanel text="Current Streak" subtext="5 days" />
    <OverviewPanel text="XP Earned" subtext="350 XP" />
    </View>
  )
}

interface OverviewPanelProps {
  text: string;
  subtext: string;
}

const OverviewPanel = ({ text, subtext }: OverviewPanelProps) => {
  return (
    <View className="flex flex-col items-center">
      <Text className="text-lg font-bold">{text}</Text>
      <Text className="text-sm text-gray-500">{subtext}</Text>
    </View>
  );
};

export default ProgressOverview