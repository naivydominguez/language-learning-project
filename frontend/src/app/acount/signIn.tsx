import { View, Pressable } from "react-native";
import { Text } from "@/components/Text";
import { router } from "expo-router";

import {signInWithGoogle, signInWithApple} from "@/lib/socialAuth";
import GoogleButton from "@/components/GoogleButton";
import AppleButton from "@/components/AppleButton";




export default function SignIn() {

    const handleGoogleSignIn = async () =>{
        try{
            const session = await signInWithGoogle();
            //console.log("Sign-in user:",session?.user.email);
            if(session){router.replace('/home')}

        } catch(error){
            console.error("Google sign-in error", error);
        }
    };

    const handleAppleSignIn = async () => {
        try{
            const session = await signInWithApple();
            if(session){router.replace('/home')}
        } catch(error){
            console.error("Apple sign-in error", error);
        }

    };


  return (
    
    <View className="flex-1 bg-[#F8F3EF] px-6">
        <View className="flex-1 justify-center">
            <View className="mb-10">
                <Text className="text-[#201810] text-3xl text-center mb-2" style={{fontFamily:'Lora',fontWeight:600}}>
                    Immerbot 
                </Text>
                
                <Text className="text-[#8C6E60] text-center text-xl" style={{fontFamily:'DM Sans',fontWeight:400}}>
                    Learn through immersion 
                </Text>
            </View>
            
            <View className="bg-white rounded-[32px] px-6 py-8 mt-10" style={{shadowColor: "#000",shadowOffset: { width: 0, height: 8 },shadowOpacity: 0.08,shadowRadius: 20,elevation: 8,}}>
                <Text className="text-[#201810] text-[23px]" style={{fontFamily:'sans-serif', fontWeight:600}}>
                    Welcome back 
                </Text>
                
                <Text className="mt-2 text-[16px] text-[#8C6E60]"> Sign in to continue your practice</Text>
                
                <View className="mt-6 gap-3">
                    <AppleButton onPress={handleAppleSignIn}/>
                    <GoogleButton onPress={handleGoogleSignIn}/>
                    
                </View>
             </View>
        </View>

      <View className="mt-8 flex-row justify-center pb-6">
        <Text className="text-[16px] text-[#8C6E60]">
            Don't have an account?{" "}
        </Text>

        <Pressable onPress={()=> router.push("/acount/signUp")}>
            <Text weight="semibold"className="text-[16px] font-semibold text-[#BD6138]">Get started </Text>
        </Pressable>

      </View>
    </View>
  );
}
