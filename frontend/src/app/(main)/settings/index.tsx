import { View } from "react-native";
import { Text } from "../../../components/Text";
export default function settingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text weight="bold" className="text-xl text-blue-500">Settings</Text>
    </View>);
}