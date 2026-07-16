import React from "react";
import { View, Pressable } from "react-native";
import { Mic } from "lucide-react-native";
export default function VoiceInputComponent() {
return (
     <Pressable className="w-10 h-10 rounded-lg items-center justify-center mb-1">
              <Mic size={16} color={"#8C6E60"} strokeWidth={2} />
            </Pressable>
)
}