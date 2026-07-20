import { useContext, useEffect, useState, createContext } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type SupabaseAuthContextType = {
  session: Session | null;
  isLoading: boolean;
};

export const SupabaseAuthContext = createContext<SupabaseAuthContextType>({
  session: null,
  isLoading: true,
});

export function useAuth() {
  return useContext(SupabaseAuthContext);
}

export function useAuthProvider(): SupabaseAuthContextType {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const supabaseSession = await supabase.auth.getSession();
      setSession(supabaseSession.data.session);
      setIsLoading(false);
    };

    getSession();

    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => authListener.data.subscription.unsubscribe();
  }, []);

  return { session, isLoading };
}
