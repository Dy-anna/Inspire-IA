// src/pages/SettingsPage.tsx
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Building2, User, MessageCircle, Bell, Lock,
  Upload, Check, X, Eye, EyeOff, ExternalLink,
  Loader2, CheckCircle, XCircle, Wifi
} from "lucide-react";
import { AvatarPickerModal } from "@/components/AvatarPicker";

type SettingsTab = "company" | "account" | "channels" | "chatbox" | "notifications";

const TABS: { id: SettingsTab; icon: any; label: string }[] = [
  { id: "company",       icon: Building2,    label: "Profil entreprise" },
  { id: "account",       icon: User,         label: "Mon compte" },
  { id: "channels",      icon: MessageCircle,label: "Canaux WhatsApp" },
  { id: "chatbox",       icon: MessageCircle,label: "Chatbox" },
  { id: "notifications", icon: Bell,         label: "Notifications" },
];

const COUNTRIES = ["Côte d'Ivoire","Sénégal","Cameroun","Togo","Bénin","Mali","Burkina Faso","Maroc","Kenya","Nigeria","Ghana","Autre"];

function Input({ label, value, onChange, placeholder, type = "text", disabled = false, readOnly = false }: any) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A", display: "block", marginBottom: 6 }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        disabled={disabled} readOnly={readOnly}
        style={{
          width: "100%", padding: "9px 12px",
          border: "1px solid #E8E8E5", borderRadius: 7,
          fontSize: 14, fontFamily: "inherit", outline: "none",
          background: disabled || readOnly ? "#F7F7F5" : "#fff",
          color: disabled || readOnly ? "#787774" : "#1A1A1A",
          transition: "border-color 0.15s",
        }}
        onFocus={e => { if (!disabled && !readOnly) e.target.style.borderColor = "#2383E2"; }}
        onBlur={e => { e.target.style.borderColor = "#E8E8E5"; }}
      />
    </div>
  );
}

// Bouton d'action principal — prend toujours la couleur du secteur,
// jamais de noir codé en dur (cohérence avec CRM / Catalogue / Équipe / Clients).
function SaveButton({ onClick, saving, label = "Enregistrer", color }: { onClick: () => void; saving: boolean; label?: string; color: string }) {
  return (
    <button onClick={onClick} disabled={saving} style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "9px 20px", background: color, color: "#fff",
      border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
      cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
      opacity: saving ? 0.7 : 1, transition: "opacity 0.15s",
    }}>
      {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={14} />}
      {saving ? "Enregistrement..." : label}
    </button>
  );
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #F7F7F5" }}>
      <span style={{ fontSize: 14, color: "#1A1A1A" }}>{label}</span>
      <button onClick={() => onChange(!value)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
        <div style={{ width: 42, height: 24, borderRadius: 12, background: value ? "#15803D" : "#E8E8E5", position: "relative", transition: "background 0.2s" }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: value ? 20 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
        </div>
      </button>
    </div>
  );
}

// ─── Company Tab ─────────────────────────────────────────────────────────────
function CompanyTab({ user, onRefetch, color }: { user: any; onRefetch: () => void; color: string }) {
  const [name, setName] = useState(user.company_name || "");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from("companies").select("*").eq("id", user.company_id).single().then(({ data }) => {
      if (data) {
        setName(data.name || ""); setCountry(data.country || ""); setCity(data.city || "");
        setPhone(data.phone || ""); setEmail(data.email || ""); setWebsite(data.website || "");
      }
    });
  }, [user.company_id]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("companies").update({ name, country, city, phone, email, website }).eq("id", user.company_id);
    if (error) { toast.error("Erreur lors de la sauvegarde"); } else { toast.success("Profil mis à jour"); onRefetch(); }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: 680 }}>
      {/* Logo */}
      <div style={{ marginBottom: 32 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A", display: "block", marginBottom: 10 }}>Logo</label>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 14, background: "#F7F7F5", border: "1px solid #E8E8E5", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
            {user.logo_url ? <img src={user.logo_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Logo" /> : <Building2 size={26} color="#CDCDCA" />}
          </div>
          <div>
            <button onClick={() => fileRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#fff", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              <Upload size={13} />Changer le logo
            </button>
            <div style={{ fontSize: 11, color: "#AFAFAC", marginTop: 4 }}>JPG, PNG · Max 2 Mo</div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 2 * 1024 * 1024) { toast.error("Le fichier dépasse 2 Mo"); return; }
              const tId = toast.loading("Upload en cours...");
              const ext = (file.name.split(".").pop() || "png").toLowerCase();
              const path = `${user.company_id}.${ext}`;
              const { error: upErr } = await supabase.storage.from("logos").upload(path, file, { upsert: true, contentType: file.type });
              if (upErr) { toast.dismiss(tId); toast.error("Erreur upload : " + upErr.message); return; }
              const { data: { publicUrl } } = supabase.storage.from("logos").getPublicUrl(path);
              const { error: updErr } = await supabase.from("companies").update({ logo_url: `${publicUrl}?t=${Date.now()}` }).eq("id", user.company_id);
              toast.dismiss(tId);
              if (updErr) { toast.error("Erreur enregistrement : " + updErr.message); return; }
              toast.success("Logo mis à jour"); onRefetch();
              if (fileRef.current) fileRef.current.value = "";
            }} />
          </div>
        </div>
      </div>

      {/* Section : Identité */}
      <div style={{ fontSize: 11, fontWeight: 700, color: "#AFAFAC", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14, paddingTop: 4, borderTop: "1px solid #F1F1EF" }}>
        Identité de l'entreprise
      </div>
      <Input label="Nom de l'entreprise *" value={name} onChange={(e: any) => setName(e.target.value)} placeholder="Restaurant Le Baobab" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A", display: "block", marginBottom: 6 }}>Pays</label>
          <select value={country} onChange={e => setCountry(e.target.value)}
            style={{ width: "100%", padding: "9px 12px", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff" }}>
            <option value="">Sélectionner...</option>
            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 0 }}>
          <Input label="Ville" value={city} onChange={(e: any) => setCity(e.target.value)} placeholder="Abidjan, Cocody" />
        </div>
      </div>

      {/* Section : Coordonnées */}
      <div style={{ fontSize: 11, fontWeight: 700, color: "#AFAFAC", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14, marginTop: 8, paddingTop: 20, borderTop: "1px solid #F1F1EF" }}>
        Coordonnées
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 0 }}>
        <Input label="Téléphone" value={phone} onChange={(e: any) => setPhone(e.target.value)} placeholder="+22507111222" />
        <Input label="Email professionnel" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="contact@entreprise.com" />
      </div>
      <Input label="Site web" value={website} onChange={(e: any) => setWebsite(e.target.value)} placeholder="https://monsite.com" />

      <div style={{ marginTop: 12, paddingTop: 20, borderTop: "1px solid #F1F1EF" }}>
        <SaveButton onClick={save} saving={saving} color={color} />
      </div>
    </div>
  );
}

// ─── Account Tab ─────────────────────────────────────────────────────────────
function AccountTab({ user, onRefetch, color }: { user: any; onRefetch: () => void; color: string }) {
  const [fullName, setFullName] = useState(user.full_name || "");
  const [saving, setSaving] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [oldPw, setOldPw] = useState(""); const [newPw, setNewPw] = useState(""); const [confirmPw, setConfirmPw] = useState("");
  const [showOld, setShowOld] = useState(false); const [showNew, setShowNew] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const saveName = async () => {
    setSaving(true);
    const { error } = await supabase.from("users").update({ full_name: fullName }).eq("id", user.id);
    if (error) { toast.error("Erreur"); } else { toast.success("Nom mis à jour"); }
    setSaving(false);
  };

  const changePassword = async () => {
    if (newPw.length < 8) { toast.error("Le mot de passe doit faire au moins 8 caractères"); return; }
    if (newPw !== confirmPw) { toast.error("Les mots de passe ne correspondent pas"); return; }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) { toast.error(error.message); } else { toast.success("Mot de passe mis à jour"); setShowPwModal(false); setOldPw(""); setNewPw(""); setConfirmPw(""); }
    setPwSaving(false);
  };

  return (
    <div style={{ maxWidth: 560 }}>
      {/* Avatar */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A", display: "block", marginBottom: 10 }}>Avatar</label>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#F7F7F5", border: "2px solid #E8E8E5", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
            {user.avatar_url ? (
              <img src={user.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Avatar" />
            ) : (
              <User size={28} color="#CDCDCA" />
            )}
          </div>
          <div>
            <button onClick={() => setShowAvatarModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#fff", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              <User size={13} />
              {user.avatar_url ? "Changer d'avatar" : "Choisir un avatar"}
            </button>
            <div style={{ fontSize: 11, color: "#AFAFAC", marginTop: 4 }}>26 personnages disponibles · Choisissez celui qui vous représente</div>
          </div>
        </div>
      </div>

      <Input label="Prénom et nom" value={fullName} onChange={(e: any) => setFullName(e.target.value)} placeholder="Kouamé Assi" />
      <Input label="Email" value={user.email} disabled />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <SaveButton onClick={saveName} saving={saving} label="Mettre à jour le nom" color={color} />
        <button onClick={() => setShowPwModal(true)} style={{ fontSize: 13, color, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
          Changer le mot de passe
        </button>
      </div>

      {/* Danger zone */}
      <div style={{ padding: 20, border: "1px solid #FECACA", borderRadius: 10, background: "#FFF5F5" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#B91C1C", marginBottom: 8 }}>Zone de danger</div>
        <div style={{ fontSize: 13, color: "#787774", marginBottom: 12 }}>La déconnexion vous redirigera vers la page de connexion.</div>
        <button onClick={() => supabase.auth.signOut()} style={{ padding: "7px 14px", background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          Se déconnecter
        </button>
      </div>

      {/* Password modal */}
      {showPwModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.25)" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, width: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Changer le mot de passe</div>
              <button onClick={() => setShowPwModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#AFAFAC" }}><X size={18} /></button>
            </div>
            {[
              { label: "Nouveau mot de passe *", val: newPw, set: setNewPw, show: showNew, toggle: () => setShowNew(!showNew) },
              { label: "Confirmer *", val: confirmPw, set: setConfirmPw, show: showNew, toggle: () => {} },
            ].map(({ label, val, set, show }) => (
              <div key={label} style={{ marginBottom: 14, position: "relative" }}>
                <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>{label}</label>
                <input type={show ? "text" : "password"} value={val} onChange={e => set(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
              </div>
            ))}
            <div style={{ fontSize: 11, color: "#AFAFAC", marginBottom: 16 }}>Minimum 8 caractères</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowPwModal(false)} style={{ flex: 1, padding: "9px", background: "#F7F7F5", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Annuler</button>
              <button onClick={changePassword} disabled={pwSaving} style={{ flex: 1, padding: "9px", background: color, color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {pwSaving ? "..." : "Mettre à jour"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar picker modal */}
      {showAvatarModal && (
        <AvatarPickerModal
          currentUrl={user.avatar_url}
          currentSector={user.sector}
          onClose={() => setShowAvatarModal(false)}
          onSave={async (url) => {
            const { error } = await supabase.from("users").update({ avatar_url: url }).eq("id", user.id);
            if (error) { toast.error("Erreur lors de la mise à jour"); return; }
            toast.success("Avatar mis à jour");
            setShowAvatarModal(false);
            onRefetch();
          }}
        />
      )}
    </div>
  );
}

// ─── Channels Tab (WhatsApp) ──────────────────────────────────────────────────
function ChannelsTab({ user, color }: { user: any; color: string }) {
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: c }, { data: s }] = await Promise.all([
        supabase.from("companies").select("whatsapp_phone_number_id").eq("id", user.company_id).single(),
        supabase.from("company_secrets").select("whatsapp_access_token").eq("company_id", user.company_id).maybeSingle(),
      ]);
      if (c) setPhoneNumberId(c.whatsapp_phone_number_id || "");
      if (s) setAccessToken(s.whatsapp_access_token || "");
    })();
  }, [user.company_id]);

  const save = async () => {
    setSaving(true);
    const { error: cErr } = await supabase.from("companies").update({
      whatsapp_phone_number_id: phoneNumberId.trim() || null,
    }).eq("id", user.company_id);
    const { error: sErr } = await supabase.from("company_secrets").upsert({
      company_id: user.company_id,
      whatsapp_access_token: accessToken.trim() || null,
    }, { onConflict: "company_id" });
    if (cErr || sErr) { toast.error("Erreur"); } else { toast.success("Configuration WhatsApp enregistrée"); }
    setSaving(false);
  };

  const testConnection = async () => {
    if (!phoneNumberId || !accessToken) { toast.error("Renseignez d'abord le Phone Number ID et le Token"); return; }
    setTesting(true); setTestResult(null);
    try {
      const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}?fields=verified_name,display_phone_number`, {
        headers: { "Authorization": `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      setTestResult("success");
      toast.success(`✓ Connecté : ${data.verified_name || data.display_phone_number}`);
    } catch (e: any) {
      setTestResult("error");
      toast.error("Connexion échouée : " + e.message);
    }
    setTesting(false);
  };

  const isConfigured = phoneNumberId && accessToken;

  return (
    <div style={{ maxWidth: 560 }}>
      {/* Status banner */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 8, marginBottom: 24, background: isConfigured ? "#F0FDF4" : "#FFF7ED", border: `1px solid ${isConfigured ? "#BBF7D0" : "#FED7AA"}` }}>
        {isConfigured ? <CheckCircle size={16} color="#15803D" /> : <XCircle size={16} color="#C2410C" />}
        <span style={{ fontSize: 13, fontWeight: 600, color: isConfigured ? "#15803D" : "#C2410C" }}>
          {isConfigured ? "WhatsApp configuré et actif" : "WhatsApp non configuré"}
        </span>
      </div>

      <div style={{ background: "#F7F7F5", borderRadius: 8, padding: "14px 16px", marginBottom: 24, fontSize: 13, color: "#787774", lineHeight: 1.6 }}>
        Obtenez vos credentials sur{" "}
        <a href="https://developers.facebook.com/apps" target="_blank" style={{ color, textDecoration: "none", fontWeight: 500 }}>
          developers.facebook.com <ExternalLink size={11} style={{ verticalAlign: "middle" }} />
        </a>
        <br />
        <strong style={{ color: "#1A1A1A" }}>Meta for Developers</strong> → Votre App → WhatsApp → Configuration
      </div>

      <Input label="Phone Number ID *" value={phoneNumberId} onChange={(e: any) => setPhoneNumberId(e.target.value)}
        placeholder="123456789012345" />

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A", display: "block", marginBottom: 6 }}>Access Token *</label>
        <div style={{ position: "relative" }}>
          <input type={showToken ? "text" : "password"} value={accessToken} onChange={e => setAccessToken(e.target.value)}
            placeholder="EAAxxxxxxxxxxxxxxxx"
            style={{ width: "100%", padding: "9px 40px 9px 12px", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
          <button onClick={() => setShowToken(!showToken)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex" }}>
            {showToken ? <EyeOff size={16} color="#AFAFAC" /> : <Eye size={16} color="#AFAFAC" />}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={testConnection} disabled={testing || !phoneNumberId || !accessToken} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "9px 16px",
          background: "#fff", border: "1px solid #E8E8E5", borderRadius: 8,
          fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
          color: testing ? "#787774" : "#1A1A1A",
        }}>
          {testing ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Wifi size={14} />}
          {testing ? "Test en cours..." : "Tester la connexion"}
          {testResult === "success" && <Check size={14} color="#15803D" />}
          {testResult === "error" && <X size={14} color="#B91C1C" />}
        </button>
        <SaveButton onClick={save} saving={saving} label="Enregistrer" color={color} />
      </div>
    </div>
  );
}

// ─── Chatbox Tab ──────────────────────────────────────────────────────────────
function ChatboxTab({ user, color }: { user: any; color: string }) {
  const [chatbot, setChatbot] = useState<any>(null);
  const [welcome, setWelcome] = useState("");
  const [offHours, setOffHours] = useState("");
  const [escalation, setEscalation] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("chatbots").select("*").eq("company_id", user.company_id).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setChatbot(data);
          setWelcome(data.welcome_message || "");
          setOffHours(data.off_hours_message || "");
          setEscalation(data.escalation_phone || "");
        }
      });
  }, [user.company_id]);

  const save = async () => {
    if (!chatbot) { toast.error("Aucun chatbot configuré"); return; }
    setSaving(true);
    const { error } = await supabase.from("chatbots").update({
      welcome_message: welcome,
      off_hours_message: offHours,
      escalation_phone: escalation,
    }).eq("id", chatbot.id);
    if (error) { toast.error("Erreur"); } else { toast.success("Chatbox mis à jour"); }
    setSaving(false);
  };

  const toggleActive = async () => {
    if (!chatbot) return;
    const { error } = await supabase.from("chatbots").update({ is_active: !chatbot.is_active }).eq("id", chatbot.id);
    if (error) { toast.error("Erreur"); return; }
    setChatbot((prev: any) => ({ ...prev, is_active: !prev.is_active }));
    toast.success(chatbot.is_active ? "Chatbot désactivé" : "Chatbot activé");
  };

  return (
    <div style={{ maxWidth: 560 }}>
      {chatbot && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: 8, marginBottom: 24, background: chatbot.is_active ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${chatbot.is_active ? "#BBF7D0" : "#FECACA"}` }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: chatbot.is_active ? "#15803D" : "#B91C1C" }}>
              {chatbot.is_active ? "Chatbot actif" : "Chatbot inactif"}
            </div>
            <div style={{ fontSize: 12, color: "#787774", marginTop: 2 }}>{chatbot.name}</div>
          </div>
          <button onClick={toggleActive} style={{ padding: "6px 14px", background: chatbot.is_active ? "#FEF2F2" : "#F0FDF4", color: chatbot.is_active ? "#B91C1C" : "#15803D", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {chatbot.is_active ? "Désactiver" : "Activer"}
          </button>
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A", display: "block", marginBottom: 6 }}>Message d'accueil</label>
        <div style={{ fontSize: 11, color: "#AFAFAC", marginBottom: 6 }}>Premier message envoyé à un nouveau contact</div>
        <textarea value={welcome} onChange={e => setWelcome(e.target.value)}
          placeholder="Bonjour ! Bienvenue chez nous. Comment puis-je vous aider ?"
          rows={3}
          style={{ width: "100%", padding: "9px 12px", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical" }} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A", display: "block", marginBottom: 6 }}>Message hors horaires</label>
        <textarea value={offHours} onChange={e => setOffHours(e.target.value)}
          placeholder="Nous sommes actuellement fermés. Nous vous répondrons dès que possible."
          rows={2}
          style={{ width: "100%", padding: "9px 12px", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical" }} />
      </div>

      <Input label="Numéro d'escalation" value={escalation} onChange={(e: any) => setEscalation(e.target.value)}
        placeholder="+22507111222" />
      <div style={{ fontSize: 11, color: "#AFAFAC", marginTop: -12, marginBottom: 20 }}>
        Ce numéro sera contacté pour les demandes complexes
      </div>

      <SaveButton onClick={save} saving={saving} color={color} />
    </div>
  );
}

// ─── Notifications Tab ────────────────────────────────────────────────────────
function NotificationsTab({ user, color }: { user: any; color: string }) {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    new_order: true, new_lead: true, new_booking: true, new_appointment: true,
    new_chat: true, daily_digest: false, weekly_report: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("companies").select("settings").eq("id", user.company_id).single()
      .then(({ data }) => {
        if (data?.settings?.notifications) setSettings(prev => ({ ...prev, ...data.settings.notifications }));
      });
  }, [user.company_id]);

  const save = async () => {
    setSaving(true);
    const { data: current } = await supabase.from("companies").select("settings").eq("id", user.company_id).single();
    const newSettings = { ...(current?.settings || {}), notifications: settings };
    const { error } = await supabase.from("companies").update({ settings: newSettings }).eq("id", user.company_id);
    if (error) { toast.error("Erreur"); } else { toast.success("Notifications mises à jour"); }
    setSaving(false);
  };

  const NOTIF_ITEMS = [
    { key: "new_order",       label: "Nouvelle commande reçue" },
    { key: "new_lead",        label: "Nouveau lead / prospect" },
    { key: "new_booking",     label: "Nouvelle réservation" },
    { key: "new_appointment", label: "Nouveau rendez-vous" },
    { key: "new_chat",        label: "Nouveau message WhatsApp" },
    { key: "daily_digest",    label: "Rapport quotidien par email" },
    { key: "weekly_report",   label: "Rapport hebdomadaire par email" },
  ];

  return (
    <div style={{ maxWidth: 500 }}>
      <div style={{ fontSize: 13, color: "#787774", marginBottom: 20, lineHeight: 1.6 }}>
        Choisissez les notifications que vous souhaitez recevoir par email sur <strong style={{ color: "#1A1A1A" }}>{user.email}</strong>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, padding: "0 20px", marginBottom: 24 }}>
        {NOTIF_ITEMS.map(({ key, label }) => (
          <Toggle key={key} label={label} value={settings[key] || false} onChange={v => setSettings(prev => ({ ...prev, [key]: v }))} />
        ))}
      </div>

      <SaveButton onClick={save} saving={saving} color={color} />
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, refetch } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("company");
  const [color, setColor] = useState("#2383E2");

  // Couleur du secteur récupérée une seule fois ici, transmise à tous les
  // onglets — évite la répétition et garantit la cohérence partout.
  useEffect(() => {
    if (!user?.sector) return;
    supabase.from("sector_configs").select("color").eq("sector", user.sector).single()
      .then(({ data }) => { if (data?.color) setColor(data.color); });
  }, [user?.sector]);

  if (!user) return null;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>Paramètres</h1>
        <p style={{ fontSize: 13, color: "#787774", margin: "3px 0 0" }}>Gérez votre compte et votre espace</p>
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Tabs sidebar — sticky : reste visible pendant le scroll du formulaire long */}
        <div style={{ width: 220, flexShrink: 0, position: "sticky", top: 24 }}>
          <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, padding: 6, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
            {TABS.map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => setActiveTab(id)} style={{
                display: "flex", alignItems: "center", gap: 9, width: "100%",
                padding: "8px 10px", border: "none", borderRadius: 6,
                background: activeTab === id ? color + "14" : "transparent",
                color: activeTab === id ? color : "#5C5C58",
                fontWeight: activeTab === id ? 600 : 500,
                fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                textAlign: "left", transition: "background 0.1s, color 0.1s",
                lineHeight: 1.2,
              }}
                onMouseEnter={e => { if (activeTab !== id) e.currentTarget.style.background = "#F7F7F5"; }}
                onMouseLeave={e => { if (activeTab !== id) e.currentTarget.style.background = "transparent"; }}>
                <Icon size={15} style={{ flexShrink: 0 }} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, padding: "32px 36px" }}>
          {activeTab === "company"       && <CompanyTab user={user} onRefetch={refetch} color={color} />}
          {activeTab === "account"       && <AccountTab user={user} onRefetch={refetch} color={color} />}
          {activeTab === "channels"      && <ChannelsTab user={user} color={color} />}
          {activeTab === "chatbox"       && <ChatboxTab user={user} color={color} />}
          {activeTab === "notifications" && <NotificationsTab user={user} color={color} />}
        </div>
      </div>
    </div>
  );
}