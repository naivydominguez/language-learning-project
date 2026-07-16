import { View, Pressable } from "react-native";
import { Text } from "@/components/Text";
import { router } from "expo-router";
import { OnboardingColors } from "@/constants/onboardingTheme";
import { ArrowLeft } from "lucide-react-native";

import { signInWithGoogle, signInWithApple } from "@/lib/socialAuth";
import GoogleButton from "@/components/GoogleButton";
import AppleButton from "@/components/AppleButton";

export default function SignUp() {
  const handleGoogleSignIn = async () => {
    try {
      const session = await signInWithGoogle();
      //console.log("Sign-in user:",session?.user.email);
      if (session) {
        router.replace("/");
      }
    } catch (error) {
      console.error("Google sign-in error", error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const session = await signInWithApple();
      if (session) {
        router.replace("/");
      }
    } catch (error) {
      console.error("Apple sign-in error", error);
    }
  };

  return (
    <View className="flex-1 bg-background-light px-6 pt-8 pb-6">
      <Pressable
        onPress={() => router.push("/onboarding/import-vocab")}
        className="-ml-1 -mt-1 p-2 "
      >
        <ArrowLeft
          size={20}
          color={OnboardingColors.secondary}
          strokeWidth={1.75}
        />
      </Pressable>
      <View className="flex-1 justify-center">
        <View className="mb-10">
          <Text
            className="text-foreground text-3xl text-center mb-2"
            style={{ fontFamily: "Lora", fontWeight: 600 }}
          >
            Immerbot
          </Text>

          <Text
            className="text-foreground-secondary text-center text-xl"
            style={{ fontFamily: "DM Sans", fontWeight: 400 }}
          >
            Learn through immersion
          </Text>
        </View>

        <View
          className="bg-white rounded-3xl px-6 py-8 mt-10"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 20,
            elevation: 8,
          }}
        >
          <Text
            className="text-foreground text-2xl"
            style={{ fontFamily: "sans-serif", fontWeight: 600 }}
          >
            Create an acccount
          </Text>

          <Text className="mt-2 text-base text-foreground-secondary">
            {" "}
            Start your immersion journey
          </Text>

          <View className="mt-6 gap-3">
            <AppleButton onPress={handleAppleSignIn} />
            <GoogleButton onPress={handleGoogleSignIn} />
          </View>
        </View>
      </View>

      <View className="mt-8 flex-row justify-center pb-6">
        <Text className="text-base text-foreground-secondary">
          Already have an account{" "}
        </Text>

        <Pressable onPress={() => router.push("/account/signIn")}>
          <Text
            weight="semibold"
            className="text-base font-semibold text-primary"
          >
            Sign in{" "}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
