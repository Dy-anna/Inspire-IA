// src/pages/AuthCallbackPage.tsx
// Reçoit le redirect OAuth Google → détecte nouveau ou ancien user → route correctement

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState("Connexion en cours...");

  useEffect(() => {
    const handle = async () => {
      try {
        // 1. Récupère la session depuis le hash/URL (Supabase gère ça automatiquement)
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          setStatus("Erreur de connexion. Redirection...");
          setTimeout(() => { window.location.href = "/login"; }, 1500);
          return;
        }

        const uid   = session.user.id;
        const email = session.user.email || "";
        const name  = session.user.user_metadata?.full_name
                   || session.user.user_metadata?.name
                   || email.split("@")[0];

        // 2. Vérifie si l'utilisateur a déjà un compte dans public.users
        const { data: existingUser } = await supabase
          .from("users")
          .select("company_id, companies(onboarding_completed)")
          .eq("id", uid)
          .maybeSingle();

        // 3a. Utilisateur existant avec onboarding complété → dashboard
        if (existingUser?.company_id && (existingUser.companies as any)?.onboarding_completed) {
          setStatus("Bienvenue ! Redirection vers votre espace...");
          window.location.href = "/app/dashboard";
          return;
        }

        // 3b. Utilisateur existant mais onboarding pas terminé → onboarding
        if (existingUser?.company_id) {
          setStatus("Finalisons votre configuration...");
          window.location.href = "/onboarding";
          return;
        }

        // 3c. Nouvel utilisateur — vérifie d'abord s'il a été invité dans une
        // équipe existante. Si oui, on le rattache directement et on saute
        // entièrement la création de company placeholder + onboarding.
        setStatus("Vérification des invitations...");

        const { data: inviteResult } = await supabase.rpc("accept_pending_invitations", {
          p_user_id: uid,
          p_email: email,
        });

        if (inviteResult?.joined) {
          setStatus("Invitation acceptée ! Redirection vers votre espace...");
          window.location.href = "/app/dashboard";
          return;
        }

        // 3d. Pas d'invitation → nouvel utilisateur classique → créer un
        // compte placeholder via RPC, puis direction onboarding.
        setStatus("Création de votre espace...");

        const { error: rpcError } = await supabase.rpc("register_company", {
          p_user_id:      uid,
          p_email:        email,
          p_full_name:    name,
          p_company_name: "Mon Entreprise",   // sera mis à jour pendant l'onboarding
          p_sector:       "restaurant",        // sera mis à jour pendant l'onboarding
          p_city:         "",
          p_country:      "Côte d'Ivoire",
        });

        if (rpcError) {
          // Si le user existe déjà (cas rare), on continue quand même
          console.warn("register_company warning:", rpcError.message);
        }

        setStatus("Bienvenue ! Configuration de votre espace...");
        window.location.href = "/onboarding";

      } catch (err) {
        console.error("Auth callback error:", err);
        setStatus("Une erreur est survenue. Redirection...");
        setTimeout(() => { window.location.href = "/login"; }, 2000);
      }
    };

    handle();
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#FAFAF8",
      fontFamily: "DM Sans, Inter, sans-serif",
      gap: 20,
    }}>
      {/* Spinner */}
      <div style={{ position: "relative", width: 48, height: 48 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" style={{ animation: "spin 1s linear infinite" }}>
          <style>{"@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"}</style>
          <circle cx="24" cy="24" r="20" stroke="#E8E8E5" strokeWidth="3" fill="none"/>
          <path d="M24 4a20 20 0 0 1 20 20" stroke="#6B3FA0" strokeWidth="3" strokeLinecap="round" fill="none"/>
        </svg>
      </div>

      {/* Logo text */}
      <div style={{ fontSize: 18, fontWeight: 800, color: "#1C1F3B", letterSpacing: "-0.4px" }}>
        inspire ia
      </div>

      {/* Status */}
      <p style={{ fontSize: 14, color: "#787774", margin: 0 }}>
        {status}
      </p>
    </div>
  );
}