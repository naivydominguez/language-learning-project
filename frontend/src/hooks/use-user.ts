import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Toast } from "react-native-toast-message/lib/src/Toast";

export type UserProfile = {
  name: string;
  target_languages: string;
  native_language: string;
  personality_prompt: string;
};

export function useUserProfile() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["userProfile"],
    enabled: !!session,
    queryFn: async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/me`,
        { headers: { Authorization: `Bearer ${session!.access_token}` } },
      );
      if (!response.ok) {
        Toast.show({ type: "error", text1: "Error fetching user profile" });
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      const profile = Array.isArray(data) ? data[0] : data;
      return profile as UserProfile;
    },
  });
}
