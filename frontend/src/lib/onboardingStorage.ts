import *  as SecureStore from "expo-secure-store";
import type { OnboardingData } from "@/app/onboarding/types/onboarding";

const STORAGE_KEY = "pending_onboarding_data";

export async function savePendingOnboardingData(
    OnboardingData:OnboardingData
){
    const serializedData = JSON.stringify(OnboardingData);

    await SecureStore.setItemAsync(
        STORAGE_KEY,
        serializedData
    );
}

export async function getPendingOnboardingData():
Promise<OnboardingData | null >{
    const serializedData = await SecureStore.getItemAsync(STORAGE_KEY);

    if(!serializedData) {return null;}

    return JSON.parse(serializedData) as OnboardingData;
}

export async function clearPendingOnboardingData(){
    await SecureStore.deleteItemAsync(STORAGE_KEY);
}
