import { View } from 'react-native';
import { router } from 'expo-router';
import PageHeader from './_components/PageHeader';
import AnkiImport from '../../onboarding/anki';

export default function AnkiScreen() {
  return (
    <View className="flex-1 bg-background-light">
      <PageHeader title="Anki" backButton="/settings/ConnectApp" />
      <AnkiImport embedded onDone={() => router.push('/settings/ConnectApp')} />
    </View>
  );
}