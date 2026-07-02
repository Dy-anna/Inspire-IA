// src/pages/LoginPage.tsx
// Design : split layout — panneau gauche animé + formulaire droit
// Zéro react-router, zéro useNavigate

import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { supabase } from "@/lib/supabase";
import { setDemoMode } from "@/lib/supabase";
import { Utensils, Home as HomeIcon, Plane, Stethoscope, GraduationCap, Hotel } from "lucide-react";
import { toast } from "sonner";

// ─── Icônes secteurs qui défilent ─────────────────────────────────────────────
const TICKER = [
  { icon: Utensils, label: "Restaurant",   color: "#B35000" },
  { icon: HomeIcon, label: "Immobilier",    color: "#1D7F42" },
  { icon: Plane, label: "Voyage",        color: "#0B6BCB" },
  { icon: Stethoscope, label: "Clinique",      color: "#C0392B" },
  { icon: GraduationCap, label: "École",         color: "#6B3FA0" },
  { icon: Hotel, label: "Hôtellerie",    color: "#FF6B35" },
];

// ─── Témoignages ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { text: "Inspire IA a multiplié par 3 nos réservations en ligne.", author: "Adjoua K.", role: "Restaurant Le Baobab", color: "#B35000" },
  { text: "Toute notre gestion de leads immobiliers en un seul endroit.", author: "Ibrahima F.", role: "Prestige Immobilier", color: "#1D7F42" },
  { text: "Le chatbox WhatsApp nous fait gagner 2h par jour.", author: "Marie A.", role: "Évasion Voyages", color: "#0B6BCB" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [testIdx, setTestIdx] = useState(0);
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const t1 = setInterval(() => setTestIdx(i => (i + 1) % TESTIMONIALS.length), 4000);
    const t2 = setInterval(() => setTicker(i => (i + 1) % TICKER.length), 1200);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  const handleLogin = async () => {
    setDemoMode(false);
    if (!email.trim() || !password) { toast.error("Email et mot de passe requis"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Email ou mot de passe incorrect" : error.message);
      setLoading(false);
      return;
    }
    toast.success("Connexion réussie !");
    window.location.href = "/app/dashboard";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleLogin(); };

  const handleGoogleLogin = async () => {
    setDemoMode(false);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "https://inspire-ia.com/auth/callback" },
    });
    if (error) toast.error(error.message);
  };

  const cur = TESTIMONIALS[testIdx];
  const tick = TICKER[ticker];

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ fontFamily: "inherit" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatIn { from { opacity: 0; transform: scale(0.8) rotate(-4deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes slide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .login-input:focus { border-color: #6B3FA0 !important; box-shadow: 0 0 0 3px rgba(107,63,160,0.12) !important; outline: none; }
        .login-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(107,63,160,0.35) !important; }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
      `}</style>

      {/* ── PANNEAU GAUCHE ────────────────────────────────────────────────── */}
      <div className="w-full md:w-1/2 md:min-w-[480px] relative overflow-hidden flex flex-col justify-between p-7 md:p-10 md:pl-12" style={{
        background: "linear-gradient(145deg, #0D0D0D 0%, #1A0A2E 40%, #2D1052 70%, #1A0A2E 100%)",
      }}>
        {/* Orbs */}
        {[
          { top: "-80px", right: "-80px",  size: 320, color: "rgba(107,63,160,0.25)" },
          { bottom: "80px", left: "-60px", size: 260, color: "rgba(192,57,43,0.2)" },
          { top: "40%",    right: "10%",   size: 180, color: "rgba(11,107,203,0.15)" },
        ].map((o, i) => (
          <div key={i} style={{
            position: "absolute", width: o.size, height: o.size, borderRadius: "50%",
            background: o.color, filter: "blur(60px)",
            top: o.top, bottom: (o as any).bottom, left: (o as any).left, right: (o as any).right,
            pointerEvents: "none",
          }} />
        ))}

        {/* Logo */}
        <Logo size="lg" />

        {/* Centre — tagline + ticker */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
              Pour votre secteur
            </div>
            {/* Ticker animé */}
            <div key={tick.label} style={{ display: "flex", alignItems: "center", gap: 12, animation: "floatIn 0.4s ease" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${tick.color}22`, border: `1.5px solid ${tick.color}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <tick.icon size={26} color={tick.color} />
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>{tick.label}</div>
                <div style={{ width: 60, height: 3, borderRadius: 2, background: tick.color, marginTop: 4 }} />
              </div>
            </div>
          </div>

          <div className="login-tagline" style={{ fontSize: 38, fontWeight: 900, color: "#fff", lineHeight: 1.15, letterSpacing: "-1px", marginBottom: 20 }}>
            Votre CRM<br />
            <span style={{ background: "linear-gradient(90deg, #A855F7, #EF4444, #3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              intelligent
            </span><br />
            vous attend.
          </div>

          <div className="login-desc" style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 340 }}>
            Gérez clients, commandes et conversations WhatsApp depuis un seul espace.
          </div>
        </div>

        {/* Témoignage rotatif */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div key={testIdx} style={{ animation: "slide 0.5s ease" }}>
            <div style={{ padding: "20px 22px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, backdropFilter: "blur(10px)", marginBottom: 20 }}>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: 14, fontStyle: "italic" }}>
                "{cur.text}"
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${cur.color}33`, border: `1.5px solid ${cur.color}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{cur.author}</div>
                  <div style={{ fontSize: 11, color: cur.color, fontWeight: 600 }}>{cur.role}</div>
                </div>
              </div>
            </div>
            {/* Dots */}
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              {TESTIMONIALS.map((_, i) => (
                <div key={i} style={{ width: i === testIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === testIdx ? cur.color : "rgba(255,255,255,0.2)", transition: "all 0.3s ease" }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FORMULAIRE DROIT ──────────────────────────────────────────────── */}
      <div className="flex-1 bg-[#FAFAF8] flex items-center justify-center p-7 md:p-10 md:pr-12">
        <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp 0.5s ease" }}>

          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: "#0D0D0D", letterSpacing: "-0.7px", marginBottom: 8 }}>
              Bon retour 👋
            </div>
            <div style={{ fontSize: 15, color: "#787774" }}>
              Pas encore de compte ?{" "}
              <a href="/register" style={{ color: "#6B3FA0", fontWeight: 700, textDecoration: "none" }}>Créer un compte</a>
            </div>
          </div>

          {/* Champs */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", display: "block", marginBottom: 7 }}>Adresse e-mail</label>
            <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown}
              type="email" placeholder="vous@entreprise.com" autoComplete="email"
              className="login-input"
              style={{ width: "100%", padding: "13px 16px", border: "2px solid #E8E8E5", borderRadius: 11, fontSize: 14, fontFamily: "inherit", color: "#0D0D0D", background: "#fff", transition: "all 0.15s" }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>Mot de passe</label>
              <a href="/forgot-password" style={{ fontSize: 12, color: "#6B3FA0", textDecoration: "none", fontWeight: 600 }}>Mot de passe oublié ?</a>
            </div>
            <div style={{ position: "relative" }}>
              <input value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown}
                type={showPw ? "text" : "password"} placeholder="••••••••" autoComplete="current-password"
                className="login-input"
                style={{ width: "100%", padding: "13px 48px 13px 16px", border: "2px solid #E8E8E5", borderRadius: 11, fontSize: 14, fontFamily: "inherit", color: "#0D0D0D", background: "#fff", transition: "all 0.15s" }} />
              <button onClick={() => setShowPw(s => !s)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#AFAFAC", fontSize: 16, padding: 4, lineHeight: 1 }}>
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Bouton */}
          <button onClick={handleLogin} disabled={loading || !email.trim() || !password}
            className="login-btn"
            style={{
              width: "100%", padding: "14px", borderRadius: 11, border: "none",
              background: !email.trim() || !password ? "#E8E8E5" : "linear-gradient(135deg, #6B3FA0, #C0392B)",
              color: !email.trim() || !password ? "#AFAFAC" : "#fff",
              fontSize: 15, fontWeight: 800, cursor: !email.trim() || !password ? "not-allowed" : "pointer",
              fontFamily: "inherit", transition: "all 0.2s", letterSpacing: "0.01em",
              boxShadow: !email.trim() || !password ? "none" : "0 4px 20px rgba(107,63,160,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
            {loading
              ? <><svg width="17" height="17" viewBox="0 0 17 17" style={{ animation: "spin 1s linear infinite" }}><circle cx="8.5" cy="8.5" r="6" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none"/><path d="M8.5 2.5a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>Connexion...</>
              : "Se connecter →"}
          </button>

          {/* Google */}
<button onClick={handleGoogleLogin}
  style={{
    width: "100%", marginTop: 12, padding: "13px", borderRadius: 11,
    border: "1.5px solid #E8E8E5", background: "#fff",
    fontSize: 14, fontWeight: 700, color: "#1A1A1A",
    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
  }}
  onMouseEnter={e => e.currentTarget.style.borderColor = "#6B3FA0"}
  onMouseLeave={e => e.currentTarget.style.borderColor = "#E8E8E5"}
>
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
  Continuer avec Google
</button>

          {/* Séparateur */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "28px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#E8E8E5" }} />
            <span style={{ fontSize: 12, color: "#AFAFAC", fontWeight: 500 }}>Accès rapide</span>
            <div style={{ flex: 1, height: 1, background: "#E8E8E5" }} />
          </div>

          {/* Comptes démo */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "Restaurant", email: "restaurant@inspire-test.com" },
              { label: "Immobilier",  email: "immo@inspire-test.com" },
              { label: "Voyage",       email: "voyage@inspire-test.com" },
              { label: "Clinique",     email: "clinique@inspire-test.com" },
            ].map(acc => (
              <button key={acc.email} onClick={() => { setEmail(acc.email); setPassword("Test1234!"); }}
                style={{
                  padding: "10px 12px", background: email === acc.email ? "#F5F0FF" : "#fff",
                  border: email === acc.email ? "1.5px solid #6B3FA0" : "1.5px solid #E8E8E5",
                  borderRadius: 9, fontSize: 12, fontWeight: 600,
                  color: email === acc.email ? "#6B3FA0" : "#787774",
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textAlign: "left",
                }}>
                {acc.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "#AFAFAC", textAlign: "center", marginTop: 10 }}>
            Comptes de démonstration — mot de passe : Test1234!
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 36, fontSize: 12, color: "#CDCDCA" }}>
            En vous connectant, vous acceptez nos{" "}
            <a href="#" style={{ color: "#AFAFAC", textDecoration: "none" }}>CGU</a>{" "}et{" "}
            <a href="#" style={{ color: "#AFAFAC", textDecoration: "none" }}>Politique de confidentialité</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
