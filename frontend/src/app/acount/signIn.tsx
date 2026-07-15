import { View, Text,Pressable, TextInput } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import SocialAuthButtons from "@/components/socialAuthButtons";



export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  return (
    
    <View className="flex-1 bg-[#F8F3EF] px-6 pt-10">
      <View className=" items-center">
        <Text className="text-[#201810] text-3xl text-center mb-2" style={{fontFamily:'Lora',fontWeight:600}}>
          Immerbot 
        </Text>
        <Text className="text-[#8C6E60] text-center text-xl" style={{fontFamily:'DM Sans',fontWeight:400}}>
          Learn through immersion 
        </Text>
      </View>

      <View className="bg-white rounded-[32px] px-6 py-8 mt-10" style={{shadowColor: "#000",shadowOffset: { width: 0, height: 8 },shadowOpacity: 0.08,shadowRadius: 20,elevation: 8,}}>
        <Text className="text-[#201810] text-[23px]" style={{fontFamily:'sans-serif', fontWeight:600}}>
            Welcome back </Text>

        <Text className="mt-2 text-[16px] text-[#8C6E60]"> Sign in to continue your practice</Text>

        
        <View className="mt-8">
            <Text className="mb-2 text-[16px] text-[#8C6E60]">Email</Text>

            <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#918A84"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="h-[64px] rounded-[18px] bg-[#EAE1DA] px-5 text-[18px] text-[#201810]"
                />
        </View>
        
        <View className="mt-5">
            <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-[16px] text-[#8C6E60]">Password</Text>

                <Pressable>
                    <Text className="text-[16px] text-[#8C6E60]">Forgot?</Text>
                </Pressable>
            </View>

            <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#918A84"   
                  secureTextEntry      
                  className="h-[64px] rounded-[18px] bg-[#EAE1DA] px-5 text-[18px] text-[#201810]"
                />

            <Pressable className="mt-8 h-[60px] items-center justify-center rounded-[16px] bg-[#BD6138]"
            onPress={()=> {console.log(email,password)}}>
                <Text className="text-[20px] font-semibold text-white"> Sign In</Text>
            </Pressable>
        </View>

        <View className="my-7 flex-row items-center">
            <View className="h-px flex-1 bg-[#DED8D4]"/>
            <Text className="mx-4 text-[16px] text-[#B49A8B]"> or </Text>

            <View className="h-px flex-1 bg-[#DED8D4]"/>
        </View>

        <SocialAuthButtons/>



      </View>

      <View className="mt-8 flex-row justify-center pb-6">
        <Text className="text-[16px] text-[#8C6E60]">
            Don't have an account?{" "}
        </Text>

        <Pressable onPress={()=> router.push("/acount/signUp")}>
            <Text className="text-[16px] font-semibold text-[#BD6138]">Get started </Text>
        </Pressable>

      </View>

      






    </View>
  );
}
