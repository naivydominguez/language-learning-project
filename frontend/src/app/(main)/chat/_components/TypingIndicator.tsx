import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const DOT_DELAYS = [0, 150, 300];

const Dot = ({ delay, color }: { delay: number; color: string }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 300, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
      ),
    );
  }, [delay, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { width: 6, height: 6, borderRadius: 3, backgroundColor: color },
        style,
      ]}
    />
  );
};

const TypingIndicator = ({ color }: { color: string }) => (
  <View className="flex-row items-center gap-1 py-1">
    {DOT_DELAYS.map((delay) => (
      <Dot key={delay} delay={delay} color={color} />
    ))}
  </View>
);

export default TypingIndicator;
