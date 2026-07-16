import * as AppleAuthentication from "expo-apple-authentication";
import { Pressable, View } from "react-native";

type AppleButtonProps = {
  onPress: () => void | Promise<void>;
};

export default function AppleButton({ onPress }: AppleButtonProps) {
  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={10}
      style={{ width: "100%", height: 50 }}
      onPress={onPress}
    />
  );
}
