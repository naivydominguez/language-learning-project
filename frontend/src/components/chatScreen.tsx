import { View } from "react-native";
import ChatInputBar from "./ui/chatInputBar";
import MessageBubble from "./messageBubble";
export default function ChatScreen() {
	return (

		<View className="flex-1 ">

            
			<ChatInputBar onSend={(message) => console.log(message)} />
		</View>
	);
}