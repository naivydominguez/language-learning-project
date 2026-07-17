import { Pressable, View } from "react-native";
import { Text} from "@/components/Text";
export default function SaveChangeButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      className="mt-20 bg-primary-light rounded-lg pt-4 pb-4 items-center justify-center"
      onPress={onPress}
    >
      <Text weight="bold" className="text-lg text-white items-center">
        Save Changes
      </Text>
    </Pressable>
  );
}
