import { router } from "expo-router";

export type ImportType = 'jpdb'|'anki'|'quizlet';

export function goToNextImport(
    selectedApps:ImportType[],
    currentIndex:number,
    onFinished: () => void | Promise<void>
){
    const nextIndex = currentIndex + 1;
    if( nextIndex >= selectedApps.length){
        return onFinished();
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
