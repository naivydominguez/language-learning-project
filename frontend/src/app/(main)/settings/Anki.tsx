import { View } from 'react-native';
import { Text } from '@/components/Text';
import PageHeader from './_components/PageHeader';

export default function AnkiScreen() {
  return (
    <View className="flex-1 bg-background-light">
      <PageHeader title="Anki" backButton="/settings/ConnectApp" />
      <View className="p-4 flex items-center justify-center flex-1">
        <Text className="text-4xl font-bold text-primary-dark mb-4">Coming Soon</Text>
      </View>
    </View>
  );
}