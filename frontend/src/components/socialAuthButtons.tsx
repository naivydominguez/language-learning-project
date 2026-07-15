import { View, Text,Pressable, TextInput, Alert } from "react-native";
import * as AppleAuthentication from 'expo-apple-authentication';
import { signInWithApple, signInWithGoogle } from "@/lib/socialAuth";
import { router } from "expo-router";


export default function SocialAuthButtons() {
    const handleApplePress = async () =>{
        try{
            const data = await signInWithApple();
            console.log("Apple user: ",data.user);
            router.replace('/');
        } catch (error: unknown) {
            if(typeof error == 'object' && error !== null && 'code' in error && error.code === 'ERR_REQUEST_CANCELED'){
                return; 
            }
        }
    };

    return (
        <View>
            <AppleAuthentication.AppleAuthenticationButton 
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={16}
            style={{width:"100%", height:60 }}
            onPress={handleApplePress}/>

            <Pressable onPress={signInWithGoogle} className="mt-4 h-[60px] items-center justify-center rounded-[16px] border border-[#DDD8D5]">
                <Text className="text-[18px] text-[#201810]">
                    Continue with Google 
                </Text>
            </Pressable>
        </View>
    

    );
}


