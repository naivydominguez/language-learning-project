import { View } from 'react-native';
import { Text, TextInput } from '@/components/Text';
import { useState } from 'react';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useAuth } from '@/hooks/use-auth';
import PageHeader from './_components/PageHeader';
import SaveChangeButton from './_components/SaveChangeButton';

export default function JpdbScreen() {
  const { session } = useAuth();
  const [apiKey, setApiKey] = useState('');

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/jpdb/register-key`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ api_key: apiKey }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to register JPDB key');
      }
      return true;
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error connecting JPDB',
        text2: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  };

  return (
    <View className="flex-1 bg-background-light">
      <PageHeader title="JPDB" backButton="/settings/ConnectApp" />
      <View className="flex-1 px-6 pt-8 pb-6">
        <Text weight="bold" className="text-lg mb-3">
          Connect your JPDB account
        </Text>
        <Text className="text-[15px] leading-[26px] text-foreground-secondary mb-6">
          Paste your JPDB API key below. You can find it on the JPDB settings
          page. This will sync your known words automatically.
        </Text>

        <TextInput
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="JPDB API key"
          placeholderTextColor="#9B9692"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          style={{ outlineWidth: 0 } as any}
          className="rounded-xl border border-gray-200 bg-background-light px-5 py-4 text-base text-foreground"
        />

        <SaveChangeButton onPress={handleSaveChanges} />
      </View>
    </View>
  );
}
