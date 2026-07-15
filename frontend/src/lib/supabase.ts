// import "react-native-url-polyfill/auto";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createClient } from "@supabase/supabase-js";
// import { Platform } from "react-native";

// const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
// const supabasePublishableKey =
//   process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// if (!supabaseUrl || !supabasePublishableKey) {
//   throw new Error("Missing Supabase frontend environment variables.");
// }

// export const supabase = createClient(
//   supabaseUrl,
//   supabasePublishableKey,
//   {
//     auth: {
//       storage: AsyncStorage,
//       autoRefreshToken: true,
//       persistSession: true,
//       detectSessionInUrl: false,
//     },
//   }
// );

import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables.");
}

const isServer =
  Platform.OS === "web" && typeof window === "undefined";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      storage: isServer ? undefined : AsyncStorage,
      autoRefreshToken: !isServer,
      persistSession: !isServer,
      detectSessionInUrl: false,
    },
  }
);
