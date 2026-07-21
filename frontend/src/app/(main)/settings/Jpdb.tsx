import { View } from 'react-native';
import { router } from 'expo-router';
import PageHeader from './_components/PageHeader';
import JPDBImport from '../../onboarding/jpdb';

export default function JpdbScreen() {
  return (
    <View className="flex-1 bg-background-light">
      <PageHeader title="JPDB" backButton="/settings/ConnectApp" />
      <JPDBImport embedded onDone={() => router.push('/settings/ConnectApp')} />
    </View>
  );
}
