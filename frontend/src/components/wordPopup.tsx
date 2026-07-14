import { View, Text, Pressable, Modal } from "react-native";

type WordPopupProps = {
  word: string,
  language: string,
  visible: boolean,
  OnDismiss: () => void
};
export default function WordPopup({ word, language, visible, OnDismiss }: WordPopupProps) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={OnDismiss}>
      <Pressable onPress={OnDismiss} className="flex-1 justify-end bg-black/30">
        <Pressable onPress={() => {}} className="bg-surface rounded-t-2xl px-6 py-6">
          <View>
            <Text className="font-sans text-lg text-foreground">{word}</Text>
            <Text className="font-sans text-md text-foreground">{language}</Text>
          </View>
          <View className="bg-background-light">
            <Text className="text-foreground  mt-2">word english definition endpoint </Text>
          </View>
          <View className="flex-row justify-between mt-4">
            <Pressable onPress={OnDismiss} className="bg-background-light rounded-full px-4 py-2">
              <Text className="text-foreground">Dismiss</Text>
            </Pressable>
            <Pressable className="bg-primary rounded-full px-4 py-2">
              <Text className="text-foreground">Save to Vocab</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
