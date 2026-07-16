import { View, Pressable } from "react-native";
import { Text } from "@/components/Text";
import { router } from "expo-router";


import {signInWithGoogle, signInWithApple} from "@/lib/socialAuth";
import GoogleButton from "@/components/GoogleButton";
import AppleButton from "@/components/AppleButton";


export default function SignUp() {

    const handleGoogleSignIn = async () =>{
        try{

            const session = await signInWithGoogle();
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
    
    <View className="flex-1 bg-[#F8F3EF] px-6 pt-10">
      <View className="flex-1 justify-center">
        <View className="mb-10">
            <Text className="text-[#201810] text-3xl mb-2 text-center" style={{fontFamily:'Lora', fontWeight:600}}>
                Create account
            </Text>
            
            <Text weight="bold" className="text-[#8C6E60] text-xl text-center" style={{fontFamily:'DM Sans'}}>
                Start your immersion journey  
            </Text>
        </View>
        
      

      <View className="px-6 py-8 gap-5">

        <AppleButton onPress={handleAppleSignIn}/>

        <GoogleButton text={"Sign up"} onPress={handleGoogleSignIn}/>
      </View>

      </View>

      <View className="mt-8 flex-row justify-center pb-6">
        <Text className="text-[16px] text-[#8C6E60]">
            Already have an account?{" "}
        </Text>

        <Pressable onPress={()=> router.push("/acount/signIn")}>
            <Text weight="semibold" className="text-[16px] text-[#BD6138]">Sign in</Text>
        </Pressable>

      </View>


    </View>
  );
}
