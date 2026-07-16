import * as AppleAuthentication from "expo-apple-authentication";
import { Pressable, View } from "react-native";

type AppleBittonProps = {
  onPress: () => void | Promise<void>;

};

export default function AppleButton ({
    onPress, 
}: AppleBittonProps) {
    return (
        <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={10}
        style={{width:"100%", height:50 }}
        onPress={onPress}
        />
    );
}



