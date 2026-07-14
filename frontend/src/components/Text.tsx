import { Text as RNText, TextProps as RNTextProps, TextInput as RNTextInput, TextInputProps as RNTextInputProps } from "react-native";

// Comes from _layout.tsx
const FONT_FAMILIES = {
  "sans-serif": {
    thin: "DMSans-Thin",
    extralight: "DMSans-ExtraLight",
    light: "DMSans-Light",
    normal: "DMSans-Regular",
    medium: "DMSans-Medium",
    semibold: "DMSans-SemiBold",
    bold: "DMSans-Bold",
  },
  serif: {
    thin: "Lora-Regular",
    extralight: "Lora-Regular",
    light: "Lora-Regular",
    normal: "Lora-Regular",
    medium: "Lora-Medium",
    semibold: "Lora-SemiBold",
    bold: "Lora-Bold",
  },
  monospace: {
    thin: "JetBrainsMono-Thin",
    extralight: "JetBrainsMono-ExtraLight",
    light: "JetBrainsMono-Light",
    normal: "JetBrainsMono-Regular",
    medium: "JetBrainsMono-Medium",
    semibold: "JetBrainsMono-SemiBold",
    bold: "JetBrainsMono-Bold",
  },
} as any;

type fontFamily = "serif" | "sans-serif" | "monospace";
type fontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | "thin" | "extralight" | "light" | "normal" | "medium" | "semibold" | "bold";


const WEIGHT_NUMBER_MAP: Record<number, string> = {
  100: "thin",
  200: "extralight",
  300: "light",
  400: "normal",
  500: "medium",
  600: "semibold",
  700: "bold",
  800: "bold",
  900: "bold",
};

interface TextProps extends RNTextProps {
  fontFamily?: fontFamily;
  weight?: fontWeight;
}

export function Text({
  fontFamily = "sans-serif",
  weight = "normal",
  style,
  ...props
}: TextProps) {
  const fontWeight = typeof weight === "number" ? WEIGHT_NUMBER_MAP[weight] : weight;
  const fontFamilyName = FONT_FAMILIES[fontFamily][fontWeight];

  return <RNText style={[{ fontFamily: fontFamilyName }, style]} {...props} />;
}

interface TextInputProps extends RNTextInputProps {
  fontFamily?: fontFamily;
  weight?: fontWeight;
}

export function TextInput({
  fontFamily = "sans-serif",
  weight = "normal",
  style,
  ...props
}: TextInputProps) {
  const fontWeight = typeof weight === "number" ? WEIGHT_NUMBER_MAP[weight] : weight;
  const fontFamilyName = FONT_FAMILIES[fontFamily][fontWeight];

  return <RNTextInput style={[{ fontFamily: fontFamilyName }, style]} {...props} />;
}

export default Text;
