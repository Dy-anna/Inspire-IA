// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface AppUser {
  id: string;
  email: string;
  full_name: string;
  role: "owner" | "admin" | "member";
  company_id: string;
  avatar_url: string | null;
  company_name: string;
  sector: "restaurant" | "real_estate" | "travel_agency" | "private_school" | "private_clinic" | "hotel" | "event";
  company_status: string;
  settings: Record<string, any>;
  logo_url: string | null;
  whatsapp_number: string | null;
  onboarding_completed: boolean;
}

const AuthContext = createContext<{
  user: AppUser | null;
  loading: boolean;
  refetch: () => Promise<void>;
  signOut: () => Promise<void>;
}>({ user: null, loading: true, refetch: async () => {}, signOut: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async (uid: string) => {
    const { data } = await supabase
      .from("users")
      .select(
        `id, email, full_name, role, company_id, avatar_url,
               companies(name, sector, status, settings, logo_url, whatsapp_number, onboarding_completed)`,
      )
      .eq("id", uid)
      .single();
    if (data) {
      const c = data.companies as any;
      setUser({
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        company_id: data.company_id,
        avatar_url: (data as any).avatar_url ?? null,
        company_name: c?.name,
        sector: c?.sector,
        company_status: c?.status,
        settings: c?.settings || {},
        logo_url: c?.logo_url,
        whatsapp_number: c?.whatsapp_number,
        onboarding_completed: !!c?.onboarding_completed,
      });
    }
    setLoading(false);
  };

  const refetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) await loadUser(session.user.id);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadUser(session.user.id);
      else setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) loadUser(session.user.id);
      else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, refetch, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
