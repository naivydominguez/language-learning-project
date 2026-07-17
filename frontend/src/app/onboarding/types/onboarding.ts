export type ImportType = "jpdb" | "anki" | "quizlet";

export type OnboardingData = {
  targetLanguages: string[];
  nativeLanguage: string;
  dailyGoal: number;
  preferredName: string;
  immerbotPersonality: string;
  selectedImportApps: ImportType[];
  jpdbApiKey: string;
};
