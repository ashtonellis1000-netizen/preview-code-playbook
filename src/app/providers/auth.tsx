import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { useSupabase } from "./supabase";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  status: AuthStatus;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const supabase = useSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error) {
        console.error("Failed to load session", error);
        setStatus("unauthenticated");
        setSession(null);
        return;
      }

      setSession(data.session);
      setStatus(data.session ? "authenticated" : "unauthenticated");
    };

    void loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setStatus(newSession ? "authenticated" : "unauthenticated");
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const loadProfile = useCallback(async () => {
    if (!session) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (error) {
      // Supabase returns PGRST116/406 when the row is missing – treat that as "no profile yet".
      if ((error as { code?: string; status?: number }).code === "PGRST116" || error.status === 406) {
        setProfile(null);
        return;
      }

      console.warn("Failed to load profile", error);
      setProfile(null);
      return;
    }

    setProfile(data ?? null);
  }, [session, supabase]);

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      if (cancelled) return;
      await loadProfile();
    };

    void fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [loadProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      status,
      signOut: () => supabase.auth.signOut(),
      refreshProfile: loadProfile,
    }),
    [session, profile, status, supabase, loadProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
