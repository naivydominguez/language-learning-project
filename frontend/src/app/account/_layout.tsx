import { Stack } from "expo-router";
import { HeaderShownContext } from "expo-router/build/react-navigation";

 export default function AccountLayout() {

    return (<Stack screenOptions={{headerShown: false, animation: "slide_from_right", }}/>);

 }
