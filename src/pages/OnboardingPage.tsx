// src/pages/OnboardingPage.tsx
// Onboarding Inspire IA — style conversationnel Monday.com
// 5 étapes : secteur → description → entreprise → avatar → WhatsApp → lancement

import { useState, useEffect, useRef } from "react";
import { Logo } from "@/components/Logo";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Utensils, Home as HomeIcon, Plane, Stethoscope, GraduationCap, Hotel, PartyPopper, Building2, User, MessageCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AvatarPicker, buildAvatarUrl } from "@/components/AvatarPicker";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface OnboardingData {
  sector: string;
  description: string;
  usage: string;
  company_name: string;
  country: string;
  city: string;
  avatar_seed: string;
  whatsapp_phone_id: string;
  whatsapp_token: string;
}

// ─── Secteurs ─────────────────────────────────────────────────────────────────

const SECTORS = [
  { key: "restaurant",     label: "Restaurant",      icon: Utensils, color: "#B35000", desc: "Commandes, réservations, menu" },
  { key: "real_estate",    label: "Immobilier",       icon: HomeIcon, color: "#1D7F42", desc: "Biens, leads, agents" },
  { key: "travel_agency",  label: "Agence Voyage",    icon: Plane, color: "#0B6BCB", desc: "Packages, réservations, clients" },
  { key: "private_clinic", label: "Clinique Privée",  icon: Stethoscope, color: "#C0392B", desc: "Patients, RDV, médecins" },
  { key: "private_school", label: "École Privée",     icon: GraduationCap, color: "#6B3FA0", desc: "Élèves, notes, absences" },
  { key: "hotel",          label: "Hôtellerie",       icon: Hotel, color: "#FF6B35", desc: "Chambres, réservations, housekeeping" },
  { key: "event",          label: "Événementiel",     icon: PartyPopper, color: "#F59E0B", desc: "Traiteur, food stand, animation" },
];

const COUNTRIES = [
  "Côte d'Ivoire","Sénégal","Cameroun","Togo","Bénin","Mali",
  "Burkina Faso","Guinée","Niger","Gabon","Congo","RDC","Maroc",
  "Côte d'Ivoire","Kenya","Nigeria","Ghana","Autre"
];

const DESCRIPTIONS_PLACEHOLDER: Record<string, string> = {
  restaurant:     "Ex : Restaurant spécialisé en cuisine africaine avec service de livraison et réservation...",
  real_estate:    "Ex : Agence immobilière à Abidjan spécialisée dans la vente et location de villas...",
  travel_agency:  "Ex : Agence proposant des voyages groupés vers la Mecque et circuits touristiques...",
  private_clinic: "Ex : Clinique généraliste avec pédiatrie, gynécologie et laboratoire d'analyse...",
  private_school: "Ex : École privée bilingue maternelle et primaire français-anglais...",
  hotel:          "Ex : Hôtel 3 étoiles avec 40 chambres, restaurant et salle de conférence...",
  event:          "Ex : Traiteur événementiel spécialisé pancakes pour mariages, anniversaires et corporate...",
};

// ─── Atoms ────────────────────────────────────────────────────────────────────

function BotMsg({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [show, setShow] = useState(delay === 0);
  const [typing, setTyping] = useState(delay > 0);
  useEffect(() => {
    if (delay > 0) {
      const t = setTimeout(() => { setTyping(false); setShow(true); }, delay + 700);
      return () => clearTimeout(t);
    }
  }, [delay]);
  if (!show && !typing) return null;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 22, animation: "fadeUp 0.4s ease" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6B3FA0,#C0392B)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, boxShadow: "0 2px 8px rgba(107,63,160,0.3)" }}>
        <span style={{ color: "#fff", fontSize: 15 }}>✦</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#AFAFAC", marginBottom: 6, letterSpacing: "0.08em" }}>INSPIRE IA</div>
        {typing ? (
          <div style={{ display: "inline-flex", gap: 5, padding: "12px 16px", background: "#F1F1EF", borderRadius: "4px 14px 14px 14px" }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#CDCDCA", animation: "tdot 1.2s ease-in-out infinite", animationDelay: `${i*0.2}s` }}/>)}
          </div>
        ) : (
          <div style={{ fontSize: 15, color: "#1A1A1A", lineHeight: 1.7, maxWidth: 620 }}>{children}</div>
        )}
      </div>
    </div>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 22, animation: "fadeUp 0.3s ease" }}>
      <div style={{ background: "#1A1A1A", color: "#fff", padding: "12px 18px", borderRadius: "16px 4px 16px 16px", fontSize: 14, lineHeight: 1.6, maxWidth: 460 }}>
        {children}
      </div>
    </div>
  );
}

function Btn({ onClick, disabled, children, loading, variant = "dark" }: { onClick: () => void; disabled?: boolean; children: React.ReactNode; loading?: boolean; variant?: "dark" | "ghost" }) {
  if (variant === "ghost") return (
    <button onClick={onClick} disabled={disabled} style={{ padding: "10px 0", background: "none", border: "none", cursor: disabled ? "not-allowed" : "pointer", fontSize: 13, color: "#AFAFAC", fontFamily: "inherit" }}>
      {children}
    </button>
  );
  return (
    <button onClick={onClick} disabled={disabled || loading} style={{
      padding: "12px 28px", background: disabled ? "#E8E8E5" : "#1A1A1A", color: disabled ? "#AFAFAC" : "#fff",
      border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "inherit", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 8,
      boxShadow: disabled ? "none" : "0 4px 16px rgba(0,0,0,0.15)",
    }}
    onMouseEnter={e => { if (!disabled) { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.2)"; } }}
    onMouseLeave={e => { if (!disabled) { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)"; } }}>
      {loading ? <><svg width="15" height="15" viewBox="0 0 15 15" style={{ animation: "spin 1s linear infinite" }}><circle cx="7.5" cy="7.5" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none"/><path d="M7.5 2a5.5 5.5 0 0 1 5.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>Création...</> : children}
    </button>
  );
}

function Progress({ step, total = 6 }: { step: number; total?: number }) {
  return (
    <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 36 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ height: 3, borderRadius: 2, flex: 1, maxWidth: 56, background: i < step ? "#1A1A1A" : "#E8E8E5", transition: "background 0.4s ease" }} />
      ))}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", color }: any) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", display: "block", marginBottom: 7 }}>{label}</label>
      <input value={value} onChange={onChange} placeholder={placeholder} type={type}
        style={{ width: "100%", padding: "12px 16px", border: "2px solid #E8E8E5", borderRadius: 10, fontSize: 14, fontFamily: "inherit", outline: "none", color: "#1A1A1A", background: "#fff", transition: "border-color 0.15s" }}
        onFocus={e => e.target.style.borderColor = color || "#1A1A1A"}
        onBlur={e => e.target.style.borderColor = "#E8E8E5"} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const { user, refetch } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [saving, setSaving] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [d, setD] = useState<OnboardingData>({
    sector: "", description: "", usage: "",
    company_name: "", country: "Côte d'Ivoire", city: "",
    avatar_seed: "", whatsapp_phone_id: "", whatsapp_token: "",
  });

  const sec = SECTORS.find(s => s.key === d.sector);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  }, [step]);

  // ── Étape 1 : Secteur ──────────────────────────────────────────────────────

  const Step1 = () => (
    <div style={{ animation: "fadeUp 0.5s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: "#1A1A1A", letterSpacing: "-0.8px", marginBottom: 10 }}>
          Bienvenue sur Inspire IA 🎉
        </div>
        <div style={{ fontSize: 15, color: "#787774", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
          En 2 minutes, votre CRM sera configuré et prêt à l'emploi.<br />
          Quel est votre secteur d'activité ?
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 520, margin: "0 auto 36px" }}>
        {SECTORS.map(s => (
          <div key={s.key} onClick={() => setD(prev => ({ ...prev, sector: s.key }))}
            style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", border: d.sector === s.key ? `2px solid ${s.color}` : "2px solid #E8E8E5", borderRadius: 14, cursor: "pointer", background: d.sector === s.key ? `${s.color}08` : "#fff", transition: "all 0.15s" }}
            onMouseEnter={e => { if (d.sector !== s.key) e.currentTarget.style.borderColor = "#CDCDCA"; }}
            onMouseLeave={e => { if (d.sector !== s.key) e.currentTarget.style.borderColor = "#E8E8E5"; }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: `${s.color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>{s.label}</div>
              <div style={{ fontSize: 12, color: "#AFAFAC", marginTop: 1 }}>{s.desc}</div>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: d.sector === s.key ? s.color : "#E8E8E5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
              {d.sector === s.key && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Btn onClick={() => setStep(2)} disabled={!d.sector}>Continuer →</Btn>
      </div>
    </div>
  );

  // ── Étape 2 : Conversation ────────────────────────────────────────────────

  const Step2 = () => {
    const [localDesc, setLocalDesc] = useState(d.description);
    const [descSent, setDescSent] = useState(!!d.description);
    const [usageSent, setUsageSent] = useState(!!d.usage);
    const [showUsage, setShowUsage] = useState(!!d.description);
    const USAGES = ["Gestion commerciale", "Gestion interne", "Les deux"];

    const sendDesc = () => {
      if (!localDesc.trim()) return;
      setD(prev => ({ ...prev, description: localDesc }));
      setDescSent(true);
      setTimeout(() => setShowUsage(true), 400);
    };

    const sendUsage = (u: string) => {
      setD(prev => ({ ...prev, usage: u }));
      setUsageSent(true);
    };

    return (
      <div style={{ maxWidth: 640, margin: "0 auto", animation: "fadeUp 0.5s ease" }}>
        <BotMsg>
          Bienvenue ! Je vais configurer votre espace <strong>{sec?.label}</strong> sur mesure.
        </BotMsg>
        <BotMsg delay={600}>
          Décrivez brièvement votre activité. Plus c'est précis, mieux votre CRM sera adapté.
        </BotMsg>

        {/* Zone texte */}
        {!descSent && (
          <div style={{ marginBottom: 24, animation: "fadeUp 0.4s ease" }}>
            <div style={{ position: "relative" }}>
              <textarea value={localDesc} onChange={e => setLocalDesc(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) sendDesc(); }}
                placeholder={DESCRIPTIONS_PLACEHOLDER[d.sector] || "Décrivez votre activité..."}
                rows={4}
                style={{ width: "100%", padding: "16px 18px 36px", fontSize: 14, fontFamily: "inherit", border: "2px solid #E8E8E5", borderRadius: 14, outline: "none", resize: "none", lineHeight: 1.65, color: "#1A1A1A", background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "border-color 0.15s" }}
                onFocus={e => e.target.style.borderColor = sec?.color || "#1A1A1A"}
                onBlur={e => e.target.style.borderColor = "#E8E8E5"} />
              <div style={{ position: "absolute", bottom: 12, right: 14, fontSize: 11, color: "#CDCDCA" }}>Ctrl+Enter</div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button onClick={sendDesc} disabled={!localDesc.trim()} style={{ padding: "10px 20px", background: localDesc.trim() ? "#1A1A1A" : "#E8E8E5", color: localDesc.trim() ? "#fff" : "#AFAFAC", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: localDesc.trim() ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
                Envoyer →
              </button>
            </div>
          </div>
        )}

        {descSent && <UserBubble>{d.description}</UserBubble>}

        {showUsage && !usageSent && (
          <>
            <BotMsg>Parfait ! Et quel sera l'usage principal d'Inspire IA pour vous ?</BotMsg>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, animation: "fadeUp 0.4s ease" }}>
              {USAGES.map(u => (
                <button key={u} onClick={() => sendUsage(u)} style={{ padding: "9px 18px", border: "2px solid #E8E8E5", borderRadius: 100, fontSize: 13, fontWeight: 500, background: "#fff", color: "#787774", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = sec?.color || "#1A1A1A"; e.currentTarget.style.color = sec?.color || "#1A1A1A"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8E8E5"; e.currentTarget.style.color = "#787774"; }}>
                  {u}
                </button>
              ))}
            </div>
          </>
        )}

        {usageSent && <UserBubble>{d.usage}</UserBubble>}

        {usageSent && (
          <>
            <BotMsg delay={200}>
              Vous êtes au bon endroit ! Configurons maintenant les informations de votre entreprise.
            </BotMsg>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <Btn onClick={() => setStep(3)}>Configurer mon espace →</Btn>
            </div>
          </>
        )}

        <div ref={scrollRef} />
      </div>
    );
  };

  // ── Étape 3 : Entreprise ──────────────────────────────────────────────────

  const Step3 = () => (
    <div style={{ maxWidth: 500, margin: "0 auto", animation: "fadeUp 0.5s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 27, fontWeight: 900, color: "#1A1A1A", letterSpacing: "-0.5px", marginBottom: 8 }}>Votre entreprise</div>
        <div style={{ fontSize: 14, color: "#787774" }}>Ces informations apparaîtront dans votre espace et vos documents</div>
      </div>

      <Input label="Nom de l'entreprise *" value={d.company_name} onChange={(e: any) => setD(p => ({ ...p, company_name: e.target.value }))}
        placeholder={sec?.key === "restaurant" ? "Restaurant Le Baobab" : sec?.key === "real_estate" ? "Agence Soleil Immo" : sec?.key === "private_clinic" ? "Clinique Sainte Anne" : sec?.key === "private_school" ? "École Internationale de la Paix" : "Mon Entreprise"}
        color={sec?.color} />

      <Input label="Ville *" value={d.city} onChange={(e: any) => setD(p => ({ ...p, city: e.target.value }))}
        placeholder="Abidjan, Cocody" color={sec?.color} />

      <div style={{ marginBottom: 28 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", display: "block", marginBottom: 7 }}>Pays</label>
        <select value={d.country} onChange={e => setD(p => ({ ...p, country: e.target.value }))}
          style={{ width: "100%", padding: "12px 16px", border: "2px solid #E8E8E5", borderRadius: 10, fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff", color: "#1A1A1A" }}>
          {COUNTRIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Btn onClick={() => setStep(2)} variant="ghost">← Retour</Btn>
        <Btn onClick={() => setStep(4)} disabled={!d.company_name.trim() || !d.city.trim()}>Continuer →</Btn>
      </div>
    </div>
  );

  // ── Étape 4 : Avatar ─────────────────────────────────────────────────────

  const Step4 = () => (
    <div style={{ maxWidth: 680, margin: "0 auto", animation: "fadeUp 0.5s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 27, fontWeight: 900, color: "#1A1A1A", letterSpacing: "-0.5px", marginBottom: 8 }}>Choisissez votre avatar</div>
        <div style={{ fontSize: 14, color: "#787774" }}>Il apparaîtra sur votre profil et dans les conversations clients</div>
      </div>

      {/* Preview */}
      {d.avatar_seed && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ position: "relative" }}>
            <img src={buildAvatarUrl(d.avatar_seed)} width={76} height={76} alt="avatar"
              style={{ borderRadius: "50%", background: "#F1F1EF", border: `3px solid ${sec?.color || "#1A1A1A"}`, display: "block" }} />
            <div style={{ position: "absolute", bottom: 2, right: 2, width: 22, height: 22, borderRadius: "50%", background: sec?.color || "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>
      )}

      <AvatarPicker selected={d.avatar_seed} onSelect={seed => setD(p => ({ ...p, avatar_seed: seed }))} defaultSector={d.sector} size={60} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
        <Btn onClick={() => setStep(3)} variant="ghost">← Retour</Btn>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Btn onClick={() => setStep(5)} variant="ghost">Passer</Btn>
          <Btn onClick={() => setStep(5)} disabled={!d.avatar_seed}>Continuer →</Btn>
        </div>
      </div>
    </div>
  );

  // ── Étape 5 : WhatsApp ────────────────────────────────────────────────────

  const Step5 = () => {
    const [show, setShow] = useState(false);
    return (
      <div style={{ maxWidth: 520, margin: "0 auto", animation: "fadeUp 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 68, height: 68, borderRadius: 20, background: "#128C7E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", boxShadow: "0 8px 24px rgba(18,140,126,0.3)" }}>
            <svg viewBox="0 0 24 24" width="34" height="34" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div style={{ fontSize: 27, fontWeight: 900, color: "#1A1A1A", letterSpacing: "-0.5px", marginBottom: 8 }}>Connectez WhatsApp</div>
          <div style={{ fontSize: 14, color: "#787774", lineHeight: 1.7 }}>
            Recevez et répondez aux messages de vos clients<br />directement dans Inspire IA.
          </div>
        </div>

        {/* Guide */}
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "14px 18px", marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#15803D", marginBottom: 8 }}>📋 Comment obtenir vos identifiants :</div>
          <ol style={{ fontSize: 12, color: "#166534", margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
            <li>Rendez-vous sur <a href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer" style={{ color: "#15803D", fontWeight: 600, textDecoration: "underline" }}>developers.facebook.com</a></li>
            <li>Créez une App → WhatsApp → Configuration</li>
            <li>Copiez le <strong>Phone Number ID</strong> et le <strong>Token d'accès</strong></li>
          </ol>
        </div>

        {!show ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            <button onClick={() => setShow(true)} style={{ padding: "14px 20px", background: "#128C7E", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 16px rgba(18,140,126,0.25)" }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Entrer mes identifiants WhatsApp
            </button>
          </div>
        ) : (
          <div style={{ marginBottom: 28, animation: "fadeUp 0.3s ease" }}>
            <Input label="Phone Number ID" value={d.whatsapp_phone_id} onChange={(e: any) => setD(p => ({ ...p, whatsapp_phone_id: e.target.value }))} placeholder="123456789012345" color="#128C7E" />
            <Input label="Access Token" value={d.whatsapp_token} onChange={(e: any) => setD(p => ({ ...p, whatsapp_token: e.target.value }))} placeholder="EAAxxxxxxxxxxxxxxxx" color="#128C7E" />
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Btn onClick={() => setStep(4)} variant="ghost">← Retour</Btn>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Btn onClick={() => setStep(6)} variant="ghost">Passer pour l'instant</Btn>
            <Btn onClick={() => setStep(6)}>Continuer →</Btn>
          </div>
        </div>
      </div>
    );
  };

  // ── Étape 6 : Lancement ───────────────────────────────────────────────────

  const Step6 = () => {
    const avatarUrl = d.avatar_seed ? buildAvatarUrl(d.avatar_seed) : null;
    const items = [
      { ok: !!d.sector,             label: "Secteur",    value: sec?.label || "—",              icon: sec?.icon || Sparkles },
      { ok: !!d.company_name,       label: "Entreprise", value: `${d.company_name}, ${d.city}`, icon: Building2 },
      { ok: !!d.avatar_seed,        label: "Avatar",     value: "Avatar sélectionné",            icon: User },
      { ok: !!d.whatsapp_phone_id,  label: "WhatsApp",   value: d.whatsapp_phone_id ? "Connecté ✓" : "Non configuré", icon: MessageCircle },
    ];

    return (
      <div style={{ maxWidth: 560, margin: "0 auto", animation: "fadeUp 0.5s ease" }}>
        {/* Illustration */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          {/* Confettis SVG */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <div style={{ width: 96, height: 96, borderRadius: "50%", background: `linear-gradient(135deg, ${sec?.color || "#6B3FA0"}20, ${sec?.color || "#6B3FA0"}08)`, border: `3px solid ${sec?.color || "#6B3FA0"}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: `0 8px 32px ${sec?.color || "#6B3FA0"}20` }}>
              {avatarUrl ? (
                <img src={avatarUrl} width={90} height={90} style={{ borderRadius: "50%", display: "block" }} alt="avatar" />
              ) : (
                {(() => { const Icon = sec?.icon || PartyPopper; return <Icon size={42} color={sec?.color || "#6B3FA0"} />; })()}
              )}
            </div>
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: "#1A1A1A", letterSpacing: "-0.7px", marginBottom: 8 }}>
            Votre espace est prêt ! 🎉
          </div>
          <div style={{ fontSize: 15, color: "#787774", lineHeight: 1.6 }}>
            Voici ce qui a été configuré pour <strong style={{ color: "#1A1A1A" }}>{d.company_name || "votre entreprise"}</strong>
          </div>
        </div>

        {/* Résumé */}
        <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 14, overflow: "hidden", marginBottom: 28 }}>
          {items.map(({ ok, label, value, icon: Icon }, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: i < items.length - 1 ? "1px solid #F7F7F5" : "none" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: ok ? `${sec?.color}10` || "#F7F7F5" : "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={18} color={sec?.color || "#787774"} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#AFAFAC", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A" }}>{value}</div>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: ok ? "#F0FDF4" : "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {ok ? <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4.5L4.5 8L11 1" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                     : <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2L8 8M8 2L2 8" stroke="#CDCDCA" strokeWidth="1.5" strokeLinecap="round"/></svg>}
              </div>
            </div>
          ))}
        </div>

        {/* Note WhatsApp si non configuré */}
        {!d.whatsapp_phone_id && (
          <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "#92400E" }}>
            💡 Vous pourrez configurer WhatsApp plus tard dans <strong>Paramètres → Canaux</strong>
          </div>
        )}

        <Btn onClick={handleFinish} loading={saving}>
          Accéder à mon CRM →
        </Btn>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
          <Btn onClick={() => setStep(5)} variant="ghost">← Modifier</Btn>
        </div>
      </div>
    );
  };

  // ── Finish ────────────────────────────────────────────────────────────────

  const handleFinish = async () => {
    if (!user?.company_id) return;
    setSaving(true);
    try {
      const avatarUrl = d.avatar_seed ? buildAvatarUrl(d.avatar_seed) : null;

      const { error } = await supabase.from("companies").update({
        name: d.company_name || undefined,
        sector: d.sector || undefined,
        country: d.country,
        city: d.city,
        ...(d.whatsapp_phone_id ? { whatsapp_phone_number_id: d.whatsapp_phone_id } : {}),
        onboarding_completed: true,
        onboarding_status: "completed",
        settings: { onboarding_description: d.description, onboarding_usage: d.usage },
      }).eq("id", user.company_id);

      if (error) throw error;

      // Sensitive WhatsApp token goes into company_secrets (owner/admin only)
      if (d.whatsapp_token) {
        const { error: secretError } = await supabase
          .from("company_secrets")
          .upsert(
            { company_id: user.company_id, whatsapp_access_token: d.whatsapp_token },
            { onConflict: "company_id" }
          );
        if (secretError) throw secretError;
      }

      await supabase.from("users").update({
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      }).eq("id", user.id);

      toast.success("Espace configuré ! Bienvenue 🎉");
      await refetch();
      navigate({ to: "/app/crm" });
    } catch (e: any) {
      toast.error("Erreur : " + e.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const STEP_LABELS = ["Secteur","Activité","Entreprise","Avatar","WhatsApp","Lancement"];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#FAFAF8 0%,#F3F3F0 35%,#EEF2FF 70%,#F5F0FF 100%)", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes tdot { 0%,80%,100% { transform:scale(0.8); opacity:0.4; } 40% { transform:scale(1.1); opacity:1; } }
      `}</style>

      {/* Header */}
      <div style={{ padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo size="md" textColor="#1A1A1A" withBackground={false} />
        {step > 1 && step < 6 && (
          <button onClick={() => navigate({ to: "/app/crm" })} style={{ fontSize: 13, color: "#CDCDCA", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            Passer pour l'instant
          </button>
        )}
      </div>

      {/* Barre de progression */}
      <div style={{ padding: "0 32px" }}>
        <Progress step={step} />
      </div>

      {/* Contenu */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: step === 2 ? "flex-start" : "center", padding: "0 24px 60px", maxWidth: step === 2 ? 720 : 760, margin: "0 auto", width: "100%" }}>
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
        {step === 4 && <Step4 />}
        {step === 5 && <Step5 />}
        {step === 6 && <Step6 />}
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "#CDCDCA", letterSpacing: "0.04em" }}>
          {step} / 6 — {STEP_LABELS[step - 1]}
        </div>
      </div>
    </div>
  );
}
