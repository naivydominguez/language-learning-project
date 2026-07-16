import { View, Pressable } from "react-native";
import { Text } from "@/components/Text";
import { router } from "expo-router";
import { useState } from "react";
import SocialAuthButtons from "@/components/SocialAuthButtons";
import GoogleButton from "@/components/GoogleButton";
import {signInWithGoogle} from "@/lib/socialAuth";


export default function SignUp() {

    const handleGoogleSignIn = async () =>{
        try{

            const session = await signInWithGoogle();
            if(session){router.replace('/home')}

        } catch(error){
            console.error("Google sign-in error", error);
        }
    };

  return (
    
    <View className="flex-1 bg-[#F8F3EF] px-6 pt-10">
      <View>
        <Text className="text-[#201810] text-3xl mb-2" style={{fontFamily:'Lora',fontWeight:600}}>
          Create account
        </Text>
        <Text className="text-[#8C6E60] text-xl" style={{fontFamily:'DM Sans',fontWeight:400}}>
          Start your immersion journey  
        </Text>
      </View>

      <View className="px-6 py-8 ">

        <GoogleButton text={"Sign up"} onPress={handleGoogleSignIn}/>


      </View>

      <View className="mt-8 flex-row justify-center pb-6">
        <Text className="text-[16px] text-[#8C6E60]">
            Already have an account?{" "}
        </Text>

        <Pressable onPress={()=> router.push("/acount/signIn")}>
            <Text className="text-[16px] font-semibold text-[#BD6138]">Sign in</Text>
        </Pressable>

      </View>


    </View>
  );
}
