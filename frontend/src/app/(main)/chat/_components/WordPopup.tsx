import { View,  Pressable, Modal } from "react-native";
import { Text } from "../../../../components/Text";
import { useUserProfile } from "@/hooks/use-user";
import React, { useState } from "react";
import { X } from "lucide-react-native";

import { Toast } from "react-native-toast-message/lib/src/Toast";
type WordPopupProps = {
  word: string;
  language: string;
  visible: boolean;
  OnDismiss: () => void;
};

export default function WordPopup({ word, language, visible, OnDismiss }: WordPopupProps) {
  const { data: profile } = useUserProfile();
  const  [translateWord, setTranslateWord] = useState("");

  const translate = async () => {
    const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/translate?text=${word}&target_lang=${profile?.native_language || 'en'}`,
      );
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Error translating word",
          text2: "Please try again later."
        });
        return;
      }
      const data = await response.json();

      setTranslateWord(data.translated_text);
  };

  React.useEffect(() => {
    if (visible && word) {
      translate();
    }
  }, [visible, word]);
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={OnDismiss} >
      <Pressable onPress={OnDismiss} className="flex-1 justify-end bg-black/30">
        <Pressable onPress={() => {}} className="bg-white rounded-t-2xl px-5 pt-5 pb-7">
          <View className="flex-row items-start justify-between mb-3">
            <View>
              <Text className="font-serif text-xl font-bold text-foreground mb-0.5">{word}</Text>
              <Text className="text-[11px] text-foreground-tertiary">{language}</Text>
            </View>
            <Pressable
              onPress={OnDismiss}
              className="w-10 h-10 items-center justify-center rounded-[10px]"
            >
              <X size={16} color="#BFAD9F" />
            </Pressable>
          </View>
          <View className="bg-background-light rounded-[10px] px-3.5 py-3 mb-3.5">
            <Text className="text-[11px] text-foreground-tertiary mb-1">Translation [{language} {"->"} {profile?.native_language || 'en'}]</Text>
            <Text className="text-[15px] text-foreground">{translateWord}</Text>
          </View>
          <View className="flex-row gap-2">
            <Pressable
              onPress={OnDismiss}
              className="flex-1 py-2.5 rounded-[10px] border border-foreground/10 items-center"
            >
              <Text className="text-[13px] font-medium text-foreground-secondary">Dismiss</Text>
            </Pressable>
            <Pressable className="flex-1 py-2.5 rounded-[10px] bg-primary items-center">
              <Text className="text-[13px] font-semi text-white">Save to vocab</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
