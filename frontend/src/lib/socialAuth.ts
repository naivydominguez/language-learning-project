import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "@/lib/supabase";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export async function signInWithApple() {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!credential.identityToken) {
    throw new Error("Apple did not return an identity token.");
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "apple",
    token: credential.identityToken,
  });

  if (error) {
    throw error;
  }

  return data;
}

const redirectTo =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_REDIRECT_URL ?? window.location.origin
    : makeRedirectUri({ scheme: "frontend" });

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    throw error;
  }

  if (!data.url) {
    throw new Error("Supabase did not return a Google login URL");
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type !== "success") {
    throw new Error("Google authentication failed");
  }

  const { params, errorCode } = QueryParams.getQueryParams(result.url);

  if (errorCode) {
    throw new Error(errorCode);
  }

  const accessToken = params.access_token;
  const refreshToken = params.refresh_token;

  if (typeof accessToken !== "string" || typeof refreshToken !== "string") {
    throw new Error(
      "Google authentication complete but no token were returned",
    );
  }

  const { data: sessionData, error: sessionError } =
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

  if (sessionError) {
    throw sessionError;
  }

  return sessionData.session;
}
