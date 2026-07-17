import { router } from "expo-router";

export type ImportType = 'jpdb'|'anki'|'quizlet';

export function goToNextImport(
    selectedApps:ImportType[],
    currentIndex:number
){
    const nextIndex = currentIndex + 1;
    if( nextIndex >= selectedApps.length){
        router.replace("/account/signUp");
        return;
    }

    const nextApp = selectedApps[nextIndex];

    router.replace({
        pathname: `/onboarding/${nextApp}`,
        params: {
            selectedApps: JSON.stringify(selectedApps),
            currentIndex: String(nextIndex),
    },
});

}
