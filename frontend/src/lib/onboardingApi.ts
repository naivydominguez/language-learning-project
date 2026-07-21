import { supabase } from "@/lib/supabase";
import { getPendingOnboardingData, clearPendingOnboardingData } from "./onboardingStorage";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export async function submitOnboardingData() {
  const onboardingData = await getPendingOnboardingData();

  if (!onboardingData) {
    throw new Error("No onboarding data found");
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!session?.user) {
    throw new Error("The user must be signed in");
  }

  console.log("Sending onboarding data:",{
    user_id :session.user.id,
    ...onboardingData,
  });

  console.log("Backed url:", BACKEND_URL);

  const response = await fetch(`${BACKEND_URL}/onboarding`, {
    method: "POST",
    headers: {"Content-Type": "application/json",

    },
    body: JSON.stringify({
        user_id:session.user.id,
        ...onboardingData,
    }),
  },);

  console.log("Backend status:", response.status);

  await clearPendingOnboardingData();
}
