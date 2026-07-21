import { Pressable, View } from "react-native";
import { Text} from "@/components/Text";
import { useRef, useState, useEffect } from "react";

export default function SaveChangeButton({
  onPress,
  disabled
}: {
  onPress: () => void | boolean | Promise<void | boolean>;
  disabled?: boolean 
}) {
  const [justSaved, setJustSaved] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handlePress = async () => {
    const result = await onPress();
    if (result === false) return;

    setJustSaved(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setJustSaved(false), 1300);
  };

  return (
    <Pressable
      disabled={disabled}
      className={`mt-8 mb-4 rounded-lg pt-4 pb-4 items-center justify-center ${
        justSaved ? "bg-green-500" : "bg-primary-light"
      }`}
      onPress={handlePress}
    >
      <Text weight="bold" className="text-lg text-white items-center">
        {justSaved ? "Saved!" : "Save Changes"}
      </Text>
    </Pressable>
  );
}
