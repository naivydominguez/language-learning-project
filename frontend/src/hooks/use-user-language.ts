import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Toast } from "react-native-toast-message/lib/src/Toast";

export function useUserLanguage() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["userLanguages"],
    enabled: !!session,
    queryFn: async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/user_languages/me`,
        { headers: { Authorization: `Bearer ${session!.access_token}` } },
      );
      if (!response.ok) {
        Toast.show({ type: "error", text1: "Error fetching user language" });
        throw new Error("Failed to fetch user language");
      }

      const data = await response.json();
      return data as string[];
    },
  });
}
