import { supabase } from "@/lib/supabase";

export async function fetchClientSecret(): Promise<string> {
  const supabaseSession = await supabase.auth.getSession();
  const accessToken = supabaseSession.data.session?.access_token;

  const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/realtime/client_secret`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to create realtime client secret (${response.status})`);
  }

  const data = await response.json();
  if (!data?.value) {
    throw new Error("Realtime client secret response missing 'value'");
  }
  return data.value as string;
}
