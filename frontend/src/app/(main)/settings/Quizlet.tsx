import { View } from 'react-native';
import { router } from 'expo-router';
import PageHeader from './_components/PageHeader';
import QuizletImport from '../../onboarding/quizlet';

export default function QuizletScreen() {
  return (
    <View className="flex-1 bg-background-light">
      <PageHeader title="Quizlet" backButton="/settings/ConnectApp" />
      <QuizletImport embedded onDone={() => router.push('/settings/ConnectApp')} />
    </View>
  );
}