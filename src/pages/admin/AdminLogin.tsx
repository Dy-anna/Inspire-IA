// src/pages/admin/AdminLogin.tsx
// Connexion sécurisée — vérifie la présence dans admin_users après auth

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Shield, Eye, EyeOff } from "lucide-react";
import inspireLogo from "@/assets/inspire-ia-logo.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) { toast.error("Email et mot de passe requis"); return; }
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authError) throw new Error("Email ou mot de passe incorrect");

      // Vérifier que cet utilisateur est bien dans admin_users
      const { data: adminData, error: adminError } = await supabase
        .from("admin_users")
        .select("id, role, is_active, full_name")
        .eq("id", authData.user.id)
        .single();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        throw new Error("Accès non autorisé. Vous n'êtes pas administrateur Inspire IA.");
      }

      if (!adminData.is_active) {
        await supabase.auth.signOut();
        throw new Error("Votre compte admin a été désactivé.");
      }

      // Mettre à jour last_seen_at
      await supabase.from("admin_users").update({ last_seen_at: new Date().toISOString() }).eq("id", authData.user.id);

      toast.success(`Bienvenue ${adminData.full_name || "Admin"} 👋`);
      window.location.href = "/admin/dashboard";
    } catch (e: any) {
      toast.error(e.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .admin-input:focus { border-color: #6B3FA0 !important; box-shadow: 0 0 0 3px rgba(107,63,160,0.15) !important; outline: none; }
      `}</style>
      {/* Orbs */}
      <div style={{ position: "absolute", top: "-20%", left: "20%", width: 500, height: 500, borderRadius: "50%", background: "rgba(107,63,160,0.12)", filter: "blur(100px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "15%", width: 400, height: 400, borderRadius: "50%", background: "rgba(192,57,43,0.1)", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ width: 420, maxWidth: "95vw", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <img src={inspireLogo} alt="Inspire IA" style={{ height: 64, margin: "0 auto 16px", display: "block", objectFit: "contain", filter: "brightness(1.24) contrast(1.28) saturate(1.3) drop-shadow(0 0 2px rgba(255,255,255,0.88)) drop-shadow(0 0 14px rgba(245,158,11,0.6)) drop-shadow(0 0 26px rgba(59,130,246,0.55))" }} />
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.4px" }}>Inspire IA — Admin</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>Accès réservé à l'équipe interne</div>
        </div>

        {/* Formulaire */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "32px 28px", backdropFilter: "blur(12px)" }}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 7 }}>Email administrateur</label>
            <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
              type="email" placeholder="admin@inspire-ia.com" autoComplete="email"
              className="admin-input"
              style={{ width: "100%", padding: "12px 16px", border: "2px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: "#fff", background: "rgba(255,255,255,0.06)", transition: "all 0.15s" }} />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 7 }}>Mot de passe</label>
            <div style={{ position: "relative" }}>
              <input value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
                type={showPw ? "text" : "password"} placeholder="••••••••" autoComplete="current-password"
                className="admin-input"
                style={{ width: "100%", padding: "12px 48px 12px 16px", border: "2px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: "#fff", background: "rgba(255,255,255,0.06)", transition: "all 0.15s" }} />
              <button onClick={() => setShowPw(s => !s)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 4 }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button onClick={handleLogin} disabled={loading || !email.trim() || !password}
            style={{
              width: "100%", padding: "14px", borderRadius: 11, border: "none",
              background: !email.trim() || !password ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #6B3FA0, #C0392B)",
              color: !email.trim() || !password ? "rgba(255,255,255,0.2)" : "#fff",
              fontSize: 15, fontWeight: 800, cursor: !email.trim() || !password ? "not-allowed" : "pointer",
              fontFamily: "inherit", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: !email.trim() || !password ? "none" : "0 4px 20px rgba(107,63,160,0.3)",
            }}>
            {loading
              ? <><svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: "spin 1s linear infinite" }}><circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" /><path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" /></svg>Vérification...</>
              : <><Shield size={15} />Accéder au panel</>}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.15)" }}>
          Panel réservé à l'équipe Inspire IA · v2.0
        </div>
      </div>
    </div>
  );
}
