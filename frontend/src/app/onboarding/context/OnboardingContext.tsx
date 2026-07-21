import { createContext, ReactNode, useContext, useState } from "react";
import type { OnboardingData } from "../types/onboarding";

export const defaultOnboardingData: OnboardingData ={
    targetLanguages:[],
    nativeLanguage:"",
    dailyGoal:15,
    preferredName:"",
    immerbotPersonality:"",
    selectedImportApps:[],
    jpdbApiKey:"",
};

type OnboardingContextType ={
    onboardingData:OnboardingData;
    updateOnboardingData:(updates:Partial<OnboardingData>) => void;
};

const OnboardingContext= createContext<OnboardingContextType | undefined>(undefined);

type OnboardingProviderProps = {
    children: ReactNode;
};

export function OnboardingProvider({
    children,
}: OnboardingProviderProps){
    const [onboardingData,setOnboardingData] = useState<OnboardingData>(defaultOnboardingData);

    function updateOnboardingData(updates: Partial<OnboardingData>){
        setOnboardingData((previousData) => ({
            ...previousData,
            ...updates,
        }));
    }

    return (
        <OnboardingContext.Provider value={{onboardingData, updateOnboardingData,}}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);

    if(context == undefined){
        throw new Error("useOnboarding must be used inside onboarding provider");
    }

    return context;
}

// Non-throwing variant for components that may render outside the
// onboarding flow (e.g. embedded in a settings screen).
export function useOptionalOnboarding() {
    return useContext(OnboardingContext);
}

