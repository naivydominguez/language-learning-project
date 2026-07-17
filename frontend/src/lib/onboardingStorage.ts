import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { OnboardingData } from "@/app/onboarding/types/onboarding";

const STORAGE_KEY = "pending_onboarding_data";

export async function savePendingOnboardingData(
  OnboardingData: OnboardingData,
) {
    console.log("Saving onboarding data: ", OnboardingData);
  const serializedData = JSON.stringify(OnboardingData);

  if (Platform.OS == "web") {
    localStorage.setItem(STORAGE_KEY, serializedData);
    return;
  }

  await SecureStore.setItemAsync(STORAGE_KEY, serializedData);
}

export async function getPendingOnboardingData(): Promise<OnboardingData | null> {
  let serializedData: string | null;

  if (Platform.OS == "web") {
    serializedData = localStorage.getItem(STORAGE_KEY);
  } else {
    serializedData = await SecureStore.getItemAsync(STORAGE_KEY);
  }

  if (!serializedData) {
    return null;
  }

  return JSON.parse(serializedData) as OnboardingData;
}

export async function clearPendingOnboardingData() {
  if (Platform.OS == "web") {
    localStorage.removeItem(STORAGE_KEY);
  }
  await SecureStore.deleteItemAsync(STORAGE_KEY);
}
