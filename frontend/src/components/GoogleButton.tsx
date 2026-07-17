import {Image, Pressable, Text, View,} from "react-native";

type GoogleButtonProps = {
  onPress: () => void | Promise<void>;
  text?: string;
};

export default function GoogleButton({
  onPress,
  text = "Continue with Google",
}: GoogleButtonProps) {
  return (
    
    <Pressable
    onPress={onPress}
    className="h-14 w-full items-center justify-center rounded-xl border border-[#DADCE0] bg-white"
    >
    <View className="flex-row items-center justify-center gap-3">
        <Image
        source={require("frontend/assets/images/googleLogo.png")}
        style={{ width: 22, height: 22 }}
        resizeMode="contain"
        />
        <Text className="text-base font-medium text-[#3C4043]">
           {text}
        </Text>
    </View>
  
  </Pressable>

  );
}
