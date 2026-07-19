import { View } from 'react-native';
import { Text } from '@/components/Text';
import PageHeader from './_components/PageHeader';

export default function JpdbScreen() {
  return (
    <View className="flex-1 bg-background-light">
      <PageHeader title="JPDB" backButton="/settings/ConnectApp" />
      <View className="p-4">
        <Text className="text-lg font-bold text-foreground mb-4">JPDB</Text>
        <Text className="text-foreground">
          Connect your JPDB account to sync your flashcards.
        </Text>
      </View>
    </View>
  );
}