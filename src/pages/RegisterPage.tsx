// src/pages/RegisterPage.tsx
// Inscription 2 étapes : Compte → Entreprise
// Crée auth.user + companies + users dans Supabase
// Redirige vers /onboarding après inscription

import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Utensils, Home as HomeIcon, Plane, Stethoscope, GraduationCap, Hotel, PartyPopper } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const SECTORS = [
  { key: "restaurant",     label: "Restaurant",     icon: Utensils, color: "#B35000", gradient: "linear-gradient(135deg, #B35000, #E87D3E)" },
  { key: "real_estate",    label: "Immobilier",      icon: HomeIcon, color: "#1D7F42", gradient: "linear-gradient(135deg, #1D7F42, #2ECC71)" },
  { key: "travel_agency",  label: "Agence Voyage",   icon: Plane, color: "#0B6BCB", gradient: "linear-gradient(135deg, #0B6BCB, #3B9EFF)" },
  { key: "private_clinic", label: "Clinique Privée", icon: Stethoscope, color: "#C0392B", gradient: "linear-gradient(135deg, #C0392B, #E74C3C)" },
  { key: "private_school", label: "École Privée",    icon: GraduationCap, color: "#6B3FA0", gradient: "linear-gradient(135deg, #6B3FA0, #9B59B6)" },
  { key: "hotel",          label: "Hôtellerie",      icon: Hotel, color: "#FF6B35", gradient: "linear-gradient(135deg, #FF6B35, #FF9A6C)" },
  { key: "event",          label: "Événementiel",    icon: PartyPopper, color: "#F59E0B", gradient: "linear-gradient(135deg, #F59E0B, #FCD34D)" },
];

const COUNTRIES = [
  "Côte d'Ivoire","Sénégal","Cameroun","Togo","Bénin","Mali","Burkina Faso",
  "Guinée","Niger","Gabon","Congo","RDC","Maroc","Kenya","Nigeria","Ghana","Autre"
];

// ─── Indicateur de force mot de passe ────────────────────────────────────────

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Faible", "Moyen", "Bien", "Fort"];
  const colors = ["", "#E74C3C", "#E67E22", "#3498DB", "#27AE60"];
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= score ? colors[score] : "#E8E8E5", transition: "background 0.3s" }} />
        ))}
      </div>
      <div style={{ fontSize: 11, color: colors[score], fontWeight: 600 }}>{labels[score]}</div>
    </div>
  );
}

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // Step 1
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2
  const [sector, setSector] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Côte d'Ivoire");

  const selectedSector = SECTORS.find(s => s.key === sector);

  const step1Valid = fullName.trim().length >= 2 && email.includes("@") && password.length >= 8;
  const step2Valid = !!sector && companyName.trim().length >= 2 && city.trim().length >= 2;

  // ── Inscription ──────────────────────────────────────────────────────────────

  const handleRegister = async () => {
    if (!step2Valid) return;
    setLoading(true);
    try {
      // 1. Créer le compte auth Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName.trim() } },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error("Erreur création du compte");

      // 2. Créer company + user via RPC (SECURITY DEFINER)
      // Fonctionne même si la confirmation email est activée (pas de session JWT)
      const { data: rpcData, error: rpcError } = await supabase.rpc("register_company", {
        p_user_id:      authData.user.id,
        p_email:        email.trim(),
        p_full_name:    fullName.trim(),
        p_company_name: companyName.trim(),
        p_sector:       sector,
        p_city:         city.trim(),
        p_country:      country,
      });

      if (rpcError) throw rpcError;

      toast.success("Compte créé avec succès ! 🎉");

      // Si email confirmation activé → informer l'utilisateur
      if (!authData.session) {
        toast("Vérifiez votre email pour confirmer votre compte.", { duration: 6000 });
        setTimeout(() => { window.location.href = "/login"; }, 2000);
      } else {
        window.location.href = "/onboarding";
      }
    } catch (e: any) {
      const msg = e?.message || "Erreur lors de l'inscription";
      if (msg.includes("already registered") || msg.includes("User already registered")) {
        toast.error("Cette adresse email est déjà utilisée.");
      } else if (msg.includes("already registered") || msg.includes("existe déjà")) {
        toast.error("Un compte existe déjà avec cet email.");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ fontFamily: "inherit" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatUp { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .reg-input { transition: all 0.15s; }
        .reg-input:focus { border-color: ${selectedSector?.color || "#6B3FA0"} !important; box-shadow: 0 0 0 3px ${selectedSector?.color || "#6B3FA0"}18 !important; outline: none; }
        .sector-card:hover { transform: translateY(-2px); }
      `}</style>

      {/* ── PANNEAU GAUCHE ────────────────────────────────────────────────── */}
      <div className="w-full md:w-[44%] md:min-w-[420px] relative overflow-hidden flex flex-col justify-between p-7 md:p-10 md:pl-11" style={{
        background: selectedSector
          ? `linear-gradient(145deg, #050505 0%, #0A0A0A 55%, ${selectedSector.color}22 100%)`
          : "linear-gradient(145deg, #0D0D0D 0%, #1A0A2E 50%, #2D1052 100%)",
        transition: "background 0.6s ease",
      }}>
        {/* Orbs dynamiques selon secteur */}
        <div style={{ position: "absolute", top: "-100px", right: "-80px", width: 380, height: 380, borderRadius: "50%", background: `${selectedSector?.color || "#6B3FA0"}1A`, filter: "blur(100px)", transition: "background 0.6s ease", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "60px", left: "-60px", width: 280, height: 280, borderRadius: "50%", background: `${selectedSector?.color || "#C0392B"}12`, filter: "blur(80px)", transition: "background 0.6s ease", pointerEvents: "none" }} />

        {/* Logo */}
        <Logo size="lg" />

        {/* Centre */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {selectedSector ? (
            <div style={{ animation: "slideRight 0.4s ease" }}>
              {/* Icône secteur */}
              <div style={{ marginBottom: 20, animation: "floatUp 3s ease-in-out infinite", display: "flex" }}>
                <selectedSector.icon size={64} color="#fff" />
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 12 }}>
                {selectedSector.label}
              </div>
              <div style={{ width: 50, height: 4, borderRadius: 2, background: selectedSector.gradient, marginBottom: 20 }} />
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.92)", lineHeight: 1.7, maxWidth: 300, textShadow: "0 1px 3px rgba(0,0,0,0.6)", fontWeight: 500 }}>
                Un CRM complet dédié à votre activité, avec chatbox WhatsApp, analytics et gestion client.
              </div>
            </div>
          ) : (
            <div>
              <div className="register-headline" style={{ fontSize: 40, fontWeight: 900, color: "#fff", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 16 }}>
                Rejoignez<br />
                <span style={{ background: "linear-gradient(90deg, #A855F7, #EF4444, #3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Inspire IA
                </span>
              </div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 28, maxWidth: 300 }}>
                Le CRM africain pensé pour votre secteur, votre langue et vos clients.
              </div>
              {/* Mini grille secteurs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {SECTORS.map(s => (
                  <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "rgba(255,255,255,0.06)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
                    <s.icon size={17} color={s.color} />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step indicator */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: step >= s ? 28 : 28, height: 28, borderRadius: "50%",
                  background: step >= s ? (selectedSector?.gradient || "linear-gradient(135deg, #6B3FA0, #C0392B)") : "rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, color: step >= s ? "#fff" : "rgba(255,255,255,0.3)",
                  transition: "all 0.3s",
                }}>
                  {step > s ? "✓" : s}
                </div>
                <span style={{ fontSize: 12, color: step >= s ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)", fontWeight: step >= s ? 600 : 400 }}>
                  {s === 1 ? "Mon compte" : "Mon entreprise"}
                </span>
                {s < 2 && <div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.15)", margin: "0 4px" }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FORMULAIRE DROIT ──────────────────────────────────────────────── */}
      <div className="flex-1 bg-[#FAFAF8] flex items-center justify-center p-7 md:p-10 md:pr-12 overflow-y-auto">
        <div style={{ width: "100%", maxWidth: 440 }}>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <div style={{ marginBottom: 36 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#0D0D0D", letterSpacing: "-0.6px", marginBottom: 8 }}>
                  Créer votre compte
                </div>
                <div style={{ fontSize: 15, color: "#787774" }}>
                  Déjà inscrit ?{" "}
                  <a href="/login" style={{ color: "#6B3FA0", fontWeight: 700, textDecoration: "none" }}>Se connecter</a>
                </div>
              </div>

              {[
                { label: "Prénom et nom *", val: fullName, set: setFullName, ph: "Kofi Mensah", type: "text", auto: "name" },
                { label: "Adresse e-mail *", val: email, set: setEmail, ph: "vous@entreprise.com", type: "email", auto: "email" },
              ].map(({ label, val, set, ph, type, auto }) => (
                <div key={label} style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", display: "block", marginBottom: 7 }}>{label}</label>
                  <input value={val} onChange={e => set(e.target.value)} placeholder={ph} type={type} autoComplete={auto}
                    className="reg-input"
                    style={{ width: "100%", padding: "13px 16px", border: "2px solid #E8E8E5", borderRadius: 11, fontSize: 14, fontFamily: "inherit", color: "#0D0D0D", background: "#fff" }} />
                </div>
              ))}

              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", display: "block", marginBottom: 7 }}>Mot de passe *</label>
                <div style={{ position: "relative" }}>
                  <input value={password} onChange={e => setPassword(e.target.value)} type={showPw ? "text" : "password"}
                    placeholder="Minimum 8 caractères" autoComplete="new-password"
                    className="reg-input"
                    style={{ width: "100%", padding: "13px 48px 13px 16px", border: "2px solid #E8E8E5", borderRadius: 11, fontSize: 14, fontFamily: "inherit", color: "#0D0D0D", background: "#fff" }} />
                  <button onClick={() => setShowPw(s => !s)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#AFAFAC", fontSize: 16, padding: 4 }}>
                    {showPw ? "🙈" : "👁"}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              <button onClick={() => setStep(2)} disabled={!step1Valid}
                style={{
                  width: "100%", padding: "14px", borderRadius: 11, border: "none",
                  background: step1Valid ? "linear-gradient(135deg, #6B3FA0, #C0392B)" : "#E8E8E5",
                  color: step1Valid ? "#fff" : "#AFAFAC",
                  fontSize: 15, fontWeight: 800, cursor: step1Valid ? "pointer" : "not-allowed",
                  fontFamily: "inherit", transition: "all 0.2s",
                  boxShadow: step1Valid ? "0 4px 20px rgba(107,63,160,0.25)" : "none",
                }}
                onMouseEnter={e => { if (step1Valid) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(107,63,160,0.35)"; }}}
                onMouseLeave={e => { if (step1Valid) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(107,63,160,0.25)"; }}}>
                Continuer →
              </button>

              <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#CDCDCA" }}>
                En créant un compte, vous acceptez nos{" "}
                <a href="#" style={{ color: "#AFAFAC" }}>CGU</a>.
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <div style={{ marginBottom: 32 }}>
                <button onClick={() => setStep(1)} style={{ fontSize: 13, color: "#AFAFAC", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", marginBottom: 12, display: "flex", alignItems: "center", gap: 4, padding: 0 }}>
                  ← Retour
                </button>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#0D0D0D", letterSpacing: "-0.6px", marginBottom: 8 }}>
                  Votre entreprise
                </div>
                <div style={{ fontSize: 14, color: "#787774" }}>Choisissez votre secteur pour personnaliser votre CRM</div>
              </div>

              {/* Sélection secteur */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", display: "block", marginBottom: 10 }}>Secteur d'activité *</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {SECTORS.map(s => (
                    <div key={s.key} onClick={() => setSector(s.key)}
                      className="sector-card"
                      style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                        border: sector === s.key ? `2px solid ${s.color}` : "2px solid #E8E8E5",
                        borderRadius: 12, cursor: "pointer",
                        background: sector === s.key ? `${s.color}08` : "#fff",
                        transition: "all 0.15s",
                      }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: `${s.color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <s.icon size={17} color={s.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: sector === s.key ? s.color : "#1A1A1A" }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nom entreprise */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", display: "block", marginBottom: 7 }}>Nom de l'entreprise *</label>
                <input value={companyName} onChange={e => setCompanyName(e.target.value)}
                  placeholder={
                    sector === "restaurant" ? "Restaurant Le Baobab"
                    : sector === "real_estate" ? "Agence Soleil Immo"
                    : sector === "travel_agency" ? "Évasion Voyages"
                    : sector === "private_clinic" ? "Clinique Lumière"
                    : sector === "private_school" ? "École Excellence"
                    : "Mon entreprise"
                  }
                  className="reg-input"
                  style={{ width: "100%", padding: "13px 16px", border: "2px solid #E8E8E5", borderRadius: 11, fontSize: 14, fontFamily: "inherit", color: "#0D0D0D", background: "#fff" }} />
              </div>

              {/* Ville + Pays */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", display: "block", marginBottom: 7 }}>Ville *</label>
                  <input value={city} onChange={e => setCity(e.target.value)} placeholder="Abidjan"
                    className="reg-input"
                    style={{ width: "100%", padding: "13px 16px", border: "2px solid #E8E8E5", borderRadius: 11, fontSize: 14, fontFamily: "inherit", color: "#0D0D0D", background: "#fff" }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", display: "block", marginBottom: 7 }}>Pays</label>
                  <select value={country} onChange={e => setCountry(e.target.value)}
                    style={{ width: "100%", padding: "13px 12px", border: "2px solid #E8E8E5", borderRadius: 11, fontSize: 14, fontFamily: "inherit", color: "#0D0D0D", background: "#fff", cursor: "pointer", outline: "none" }}>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Bouton */}
              <button onClick={handleRegister} disabled={!step2Valid || loading}
                style={{
                  width: "100%", padding: "14px", borderRadius: 11, border: "none",
                  background: !step2Valid ? "#E8E8E5" : (selectedSector?.gradient || "linear-gradient(135deg, #6B3FA0, #C0392B)"),
                  color: !step2Valid ? "#AFAFAC" : "#fff",
                  fontSize: 15, fontWeight: 800, cursor: !step2Valid ? "not-allowed" : "pointer",
                  fontFamily: "inherit", transition: "all 0.2s",
                  boxShadow: !step2Valid ? "none" : `0 4px 20px ${selectedSector?.color || "#6B3FA0"}33`,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
                onMouseEnter={e => { if (step2Valid) { e.currentTarget.style.transform = "translateY(-1px)"; }}}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
                {loading
                  ? <><svg width="17" height="17" viewBox="0 0 17 17" style={{ animation: "spin 1s linear infinite" }}><circle cx="8.5" cy="8.5" r="6" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none"/><path d="M8.5 2.5a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>Création de votre espace...</>
                  : <>Créer mon espace {selectedSector?.label || ""}</>}
              </button>

              {/* Récap compte */}
              <div style={{ marginTop: 20, padding: "12px 16px", background: "#F5F0FF", borderRadius: 10, border: "1px solid #E9D5FF" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#6B3FA0", marginBottom: 3 }}>Compte</div>
                <div style={{ fontSize: 13, color: "#787774" }}>{fullName} · {email}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
