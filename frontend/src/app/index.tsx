// src/app/index.tsx
import { View } from "react-native";
import { Redirect } from "expo-router"; // N


// import ChatScreen from "@/components/chatScreen";

export default function Index(){
    return <Redirect href="/onboarding" />;

}

// export default function HomeScreen() {
//   return (
//     <View className="flex-1 flex-row">
//       <ChatScreen />
//     </View>
//   );
// }
