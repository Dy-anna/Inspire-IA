// src/pages/admin/AdminCompanies.tsx
// Liste des entreprises + page détail /admin/companies/:id avec onglets

import { useState, useEffect, useCallback, useRef } from "react";
import { SectorIcon } from "@/components/SectorIcon";
import { supabase } from "@/lib/supabase";
import AdminLayout from "./AdminLayout";
import { toast } from "sonner";
import {
  Search, X, ChevronRight, CheckCircle, XCircle, RefreshCw,
  Check, Building2, Users, MessageSquare, Activity, Zap,
  ExternalLink, Plus, Clock, ChevronLeft, Edit3, Shield
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const SECTOR_CFG: Record<string, { label: string; color: string; icon: string }> = {
  restaurant:     { label: "Restaurant",    color: "#B35000", icon: "UtensilsCrossed" },
  real_estate:    { label: "Immobilier",    color: "#1D7F42", icon: "Building2" },
  travel_agency:  { label: "Voyage",        color: "#0B6BCB", icon: "Plane" },
  private_clinic: { label: "Clinique",      color: "#C0392B", icon: "Stethoscope" },
  private_school: { label: "École",         color: "#6B3FA0", icon: "GraduationCap" },
  hotel:          { label: "Hôtellerie",    color: "#FF6B35", icon: "Hotel" },
  event:          { label: "Événementiel",  color: "#F59E0B", icon: "PartyPopper" },
};

const STATUS: Record<string, { label: string; bg: string; text: string }> = {
  pending:   { label: "En attente",  bg: "#FFF7ED", text: "#C2410C" },
  active:    { label: "Actif",       bg: "#F0FDF4", text: "#15803D" },
  inactive:  { label: "Inactif",     bg: "#F1F1EF", text: "#787774" },
  suspended: { label: "Suspendu",    bg: "#FEF2F2", text: "#B91C1C" },
};

const ONBOARDING_STEPS = ["not_started","profile_complete","chatbot_configured","team_invited","completed"];
const ONBOARDING_LABELS: Record<string, string> = {
  not_started: "Non démarré", profile_complete: "Profil", chatbot_configured: "Chatbot",
  team_invited: "Équipe", completed: "Terminé",
};

const fmtDate = (iso: string | null) => iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtRel = (iso: string | null) => {
  if (!iso) return "—";
  const d = Date.now() - new Date(iso).getTime();
  if (d < 60000) return "À l'instant";
  if (d < 3600000) return `${Math.floor(d / 60000)} min`;
  if (d < 86400000) return `${Math.floor(d / 3600000)} h`;
  if (d < 7 * 86400000) return `${Math.floor(d / 86400000)} j`;
  return fmtDate(iso);
};

function Tag({ label, bg, text }: { label: string; bg: string; text: string }) {
  return <span style={{ padding: "2px 8px", borderRadius: 5, fontSize: 12, fontWeight: 600, background: bg, color: text, whiteSpace: "nowrap" }}>{label}</span>;
}

// ─── ONBOARDING PROGRESS ───────────────────────────────────────────────────────

function OnboardingBar({ status }: { status: string }) {
  const idx = ONBOARDING_STEPS.indexOf(status);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {ONBOARDING_STEPS.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: i <= idx ? "#15803D" : "#E8E8E5" }} />
          {i < ONBOARDING_STEPS.length - 1 && <div style={{ width: 12, height: 2, background: i < idx ? "#15803D" : "#E8E8E5", borderRadius: 1 }} />}
        </div>
      ))}
      <span style={{ fontSize: 11, color: idx === ONBOARDING_STEPS.length - 1 ? "#15803D" : "#AFAFAC", marginLeft: 4, fontWeight: 600 }}>
        {ONBOARDING_LABELS[status] || status}
      </span>
    </div>
  );
}

// ─── COMPANY LIST PAGE ─────────────────────────────────────────────────────────

export function AdminCompanies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("companies").select("*").order("created_at", { ascending: false });
    if (statusFilter !== "all") q = q.eq("status", statusFilter);
    if (sectorFilter !== "all") q = q.eq("sector", sectorFilter);
    const { data } = await q.limit(300);
    setCompanies(data || []);
    setLoading(false);
  }, [statusFilter, sectorFilter]);

  useEffect(() => { load(); }, [load]);

  const filtered = companies.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || (c.city || "").toLowerCase().includes(search.toLowerCase()) || (c.email || "").includes(search)
  );

  return (
    <AdminLayout currentPath="/admin/companies">
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: "-0.3px" }}>Entreprises</h1>
          <p style={{ fontSize: 13, color: "#787774", margin: "4px 0 0" }}>{companies.length} au total · {companies.filter(c => c.status === "active").length} actives</p>
        </div>
      </div>

      {/* Filtres */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #E8E8E5", borderRadius: 8, padding: "8px 12px", flex: 1, maxWidth: 320 }}>
          <Search size={13} color="#AFAFAC" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, ville, email..."
            style={{ border: "none", outline: "none", fontSize: 13, fontFamily: "inherit", flex: 1, background: "transparent" }} />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#AFAFAC", padding: 0 }}><X size={12} /></button>}
        </div>
        <div style={{ display: "flex", gap: 4, background: "#F7F7F5", padding: 4, borderRadius: 8 }}>
          {["all","pending","active","inactive","suspended"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "5px 12px", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", background: statusFilter === s ? "#1A1A1A" : "transparent", color: statusFilter === s ? "#fff" : "#787774" }}>
              {s === "all" ? "Tous" : STATUS[s]?.label || s}
            </button>
          ))}
        </div>
        <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} style={{ padding: "7px 12px", border: "1px solid #E8E8E5", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", background: "#fff" }}>
          <option value="all">Tous secteurs</option>
          {Object.entries(SECTOR_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <span style={{ fontSize: 12, color: "#AFAFAC" }}>{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Tableau */}
      <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", background: "#F7F7F5", borderBottom: "1px solid #E8E8E5", padding: "0 16px" }}>
          {[
            { l: "Entreprise",   w: 250 }, { l: "Secteur",    w: 120 },
            { l: "Localisation", w: 160 }, { l: "Statut",     w: 120 },
            { l: "Onboarding",   w: 200 }, { l: "Inscrit le", w: 110 },
            { l: "",             w: 40  },
          ].map(({ l, w }) => (
            <div key={l} style={{ width: w, padding: "9px 10px", fontSize: 11, fontWeight: 700, color: "#AFAFAC", textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>{l}</div>
          ))}
        </div>

        {loading
          ? Array(6).fill(0).map((_, i) => <div key={i} style={{ height: 52, borderBottom: "1px solid #F1F1EF", animation: "pulse 1.5s ease-in-out infinite" }} />)
          : filtered.length === 0
          ? <div style={{ padding: "56px 32px", textAlign: "center" }}>
              <Building2 size={36} color="#E8E8E5" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 4 }}>Aucune entreprise</div>
            </div>
          : filtered.map((c, i) => {
              const sec = SECTOR_CFG[c.sector] || { icon: "Building2", color: "#787774", label: c.sector };
              const st = STATUS[c.status] || STATUS.pending;
              return (
                <a key={c.id} href={`/admin/companies/${c.id}`} style={{ display: "flex", alignItems: "center", padding: "0 16px", height: 54, borderBottom: i < filtered.length - 1 ? "1px solid #F1F1EF" : "none", textDecoration: "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 250, padding: "0 10px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${sec.color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><SectorIcon name={sec.icon} size={16} color={sec.color} /></div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                      {c.email && <div style={{ fontSize: 11, color: "#AFAFAC", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email}</div>}
                    </div>
                  </div>
                  <div style={{ width: 120, padding: "0 10px", flexShrink: 0, fontSize: 12, color: "#787774", display: "flex", alignItems: "center", gap: 5 }}><SectorIcon name={sec.icon} size={13} color={sec.color} />{sec.label}</div>
                  <div style={{ width: 160, padding: "0 10px", flexShrink: 0, fontSize: 12, color: "#787774", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{[c.city, c.country].filter(Boolean).join(", ") || "—"}</div>
                  <div style={{ width: 120, padding: "0 10px", flexShrink: 0 }}><Tag {...st} /></div>
                  <div style={{ width: 200, padding: "0 10px", flexShrink: 0 }}><OnboardingBar status={c.onboarding_status || "not_started"} /></div>
                  <div style={{ width: 110, padding: "0 10px", flexShrink: 0, fontSize: 12, color: "#AFAFAC" }}>{fmtDate(c.created_at)}</div>
                  <div style={{ width: 40, padding: "0 4px", flexShrink: 0 }}><ChevronRight size={14} color="#AFAFAC" /></div>
                </a>
              );
            })}
      </div>
    </AdminLayout>
  );
}

// ─── COMPANY DETAIL PAGE ───────────────────────────────────────────────────────

type DetailTab = "profile" | "users" | "chatbots" | "activity" | "insight";

export function AdminCompanyDetail({ companyId }: { companyId: string }) {
  const [company, setCompany] = useState<any>(null);
  const [tab, setTab] = useState<DetailTab>("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [plan, setPlan] = useState("");

  useEffect(() => { loadCompany(); }, [companyId]);

  const loadCompany = async () => {
    const { data } = await supabase.from("companies").select("*").eq("id", companyId).single();
    if (data) { setCompany(data); setNotes(data.internal_notes || ""); setPlan(data.plan_notes || ""); }
    setLoading(false);
  };

  const updateCompany = async (patch: any) => {
    const { error } = await supabase.from("companies").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", companyId);
    if (error) { toast.error("Erreur"); return; }
    setCompany((prev: any) => ({ ...prev, ...patch }));
    toast.success("Mis à jour");
  };

  const activate = async () => {
    await updateCompany({ status: "active", activated_at: new Date().toISOString(), onboarding_status: "not_started" });
    toast.success("✓ Entreprise activée — l'onboarding peut démarrer");
  };

  const suspend = async () => {
    if (!confirm("Suspendre cet accès ?")) return;
    await updateCompany({ status: "suspended", deactivated_at: new Date().toISOString() });
  };

  const saveNotes = async () => {
    setSaving(true);
    await updateCompany({ internal_notes: notes, plan_notes: plan });
    setSaving(false);
  };

  if (loading) return <AdminLayout currentPath="/admin/companies"><div style={{ padding: "48px", textAlign: "center", color: "#AFAFAC" }}>Chargement...</div></AdminLayout>;
  if (!company) return <AdminLayout currentPath="/admin/companies"><div style={{ padding: "48px", textAlign: "center", color: "#AFAFAC" }}>Entreprise introuvable</div></AdminLayout>;

  const sec = SECTOR_CFG[company.sector] || { icon: "Building2", color: "#787774", label: company.sector };
  const st = STATUS[company.status] || STATUS.pending;

  const TABS: { id: DetailTab; label: string; icon: any }[] = [
    { id: "profile",  label: "Profil",      icon: Building2 },
    { id: "users",    label: "Utilisateurs", icon: Users },
    { id: "chatbots", label: "Chatbots",     icon: MessageSquare },
    { id: "activity", label: "Activité",     icon: Activity },
    { id: "insight",  label: "Insight",      icon: Zap },
  ];

  return (
    <AdminLayout currentPath="/admin/companies">
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>

      {/* Back */}
      <a href="/admin/companies" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#787774", textDecoration: "none", fontSize: 13, fontWeight: 500, marginBottom: 20 }}
        onMouseEnter={e => e.currentTarget.style.color = "#1A1A1A"} onMouseLeave={e => e.currentTarget.style.color = "#787774"}>
        <ChevronLeft size={14} />Retour aux entreprises
      </a>

      {/* Header entreprise */}
      <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 14, padding: "24px 28px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{ width: 54, height: 54, borderRadius: 14, background: `${sec.color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><SectorIcon name={sec.icon} size={26} color={sec.color} /></div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.3px" }}>{company.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <Tag {...st} />
              <span style={{ fontSize: 13, color: "#787774" }}>{sec.label}</span>
              {company.city && <span style={{ fontSize: 13, color: "#787774" }}>· {company.city}, {company.country}</span>}
              {company.onboarding_completed && <span style={{ background: "#F0FDF4", color: "#15803D", padding: "2px 8px", borderRadius: 5, fontSize: 12, fontWeight: 600 }}>Onboarding ✓</span>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {company.status !== "active" && (
              <button onClick={activate} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                <CheckCircle size={14} />Activer
              </button>
            )}
            {company.status === "active" && (
              <button onClick={suspend} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                <XCircle size={14} />Suspendre
              </button>
            )}
            <button onClick={() => window.open(`/app/dashboard`, "_blank")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#F7F7F5", color: "#787774", border: "1px solid #E8E8E5", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              <ExternalLink size={14} />Voir espace
            </button>
          </div>
        </div>
        {/* Onboarding progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {ONBOARDING_STEPS.map((s, i) => {
            const stepIdx = ONBOARDING_STEPS.indexOf(company.onboarding_status || "not_started");
            const done = i <= stepIdx;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: done ? "#15803D" : "#E8E8E5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {done ? <Check size={11} color="#fff" strokeWidth={3} /> : <span style={{ fontSize: 10, color: "#AFAFAC", fontWeight: 700 }}>{i + 1}</span>}
                  </div>
                  <span style={{ fontSize: 10, color: done ? "#15803D" : "#AFAFAC", fontWeight: 600, whiteSpace: "nowrap" }}>{ONBOARDING_LABELS[s]}</span>
                </div>
                {i < ONBOARDING_STEPS.length - 1 && <div style={{ width: 36, height: 2, background: done && ONBOARDING_STEPS.indexOf(company.onboarding_status) > i ? "#15803D" : "#E8E8E5", borderRadius: 1, marginBottom: 16 }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "#F7F7F5", padding: 4, borderRadius: 9, marginBottom: 20, width: "fit-content" }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 16px", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", background: tab === id ? "#fff" : "transparent", color: tab === id ? "#1A1A1A" : "#787774", boxShadow: tab === id ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s" }}>
            <Icon size={13} />{label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "profile" && <ProfileTab company={company} notes={notes} setNotes={setNotes} plan={plan} setPlan={setPlan} onSave={saveNotes} saving={saving} />}
      {tab === "users" && <UsersTab companyId={companyId} />}
      {tab === "chatbots" && <ChatbotsTab companyId={companyId} />}
      {tab === "activity" && <ActivityTab companyId={companyId} />}
      {tab === "insight" && <InsightTab companyId={companyId} />}
    </AdminLayout>
  );
}

// ─── Profile Tab ───────────────────────────────────────────────────────────────

function ProfileTab({ company, notes, setNotes, plan, setPlan, onSave, saving }: any) {
  const fmtDate = (iso: string | null) => iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Infos générales */}
      <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: "20px 22px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#AFAFAC", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Informations générales</div>
        {[
          ["Nom", company.name],
          ["Secteur", SECTOR_CFG[company.sector]?.label || company.sector],
          ["Email", company.email || "—"],
          ["Téléphone", company.phone || "—"],
          ["Site web", company.website || "—"],
          ["Ville", company.city || "—"],
          ["Pays", company.country || "—"],
          ["Inscrit le", fmtDate(company.created_at)],
          ["Activé le", fmtDate(company.activated_at)],
        ].map(([l, v]) => (
          <div key={l} style={{ display: "flex", gap: 16, padding: "8px 0", borderBottom: "1px solid #F7F7F5" }}>
            <span style={{ width: 130, fontSize: 13, color: "#787774", flexShrink: 0 }}>{l}</span>
            <span style={{ fontSize: 13, color: "#1A1A1A", fontWeight: 500, wordBreak: "break-word" }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Intégrations */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#AFAFAC", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Intégrations</div>
          {[
            ["WhatsApp Phone ID", company.whatsapp_phone_number_id || company.whatsapp_phone_id],
            ["WhatsApp Number", company.whatsapp_number],
            ["Gmail", company.gmail_address],
            ["Canal préféré", company.preferred_channel],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", gap: 16, padding: "8px 0", borderBottom: "1px solid #F7F7F5" }}>
              <span style={{ width: 160, fontSize: 13, color: "#787774", flexShrink: 0 }}>{l}</span>
              <span style={{ fontSize: 13, color: v ? "#1A1A1A" : "#AFAFAC", fontWeight: v ? 600 : 400, fontFamily: v ? "monospace" : "inherit", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {v || "—"}
              </span>
            </div>
          ))}
        </div>

        {/* Notes internes + plan */}
        <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#AFAFAC", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Notes internes</div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes équipe Inspire IA uniquement..."
            rows={3} style={{ width: "100%", padding: "10px 12px", border: "1px solid #E8E8E5", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", resize: "vertical", lineHeight: 1.6, marginBottom: 10 }} />
          <div style={{ fontSize: 12, fontWeight: 700, color: "#AFAFAC", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Plan / Tarification</div>
          <textarea value={plan} onChange={e => setPlan(e.target.value)} placeholder="Ex : Pack Pro 150k XOF/mois..." rows={2}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #E8E8E5", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", resize: "vertical", lineHeight: 1.6, marginBottom: 12 }} />
          <button onClick={onSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#1A1A1A", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            {saving ? <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} />Sauvegarde...</> : <><Check size={13} />Sauvegarder</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Users Tab ─────────────────────────────────────────────────────────────────

function UsersTab({ companyId }: { companyId: string }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("users").select("*").eq("company_id", companyId).order("created_at").then(({ data }) => { setUsers(data || []); setLoading(false); });
  }, [companyId]);

  if (loading) return <div style={{ padding: "32px", textAlign: "center", color: "#AFAFAC" }}>Chargement...</div>;

  return (
    <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #F1F1EF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>{users.length} utilisateur{users.length !== 1 ? "s" : ""}</div>
      </div>
      {users.length === 0
        ? <div style={{ padding: "48px", textAlign: "center", color: "#AFAFAC" }}>Aucun utilisateur</div>
        : users.map((u, i) => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: i < users.length - 1 ? "1px solid #F7F7F5" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#6B3FA014", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#6B3FA0", flexShrink: 0 }}>
                {u.full_name?.[0] || u.email?.[0] || "?"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{u.full_name || "—"}</div>
                <div style={{ fontSize: 11, color: "#787774" }}>{u.email}</div>
              </div>
              <span style={{ background: "#F7F7F5", color: "#787774", padding: "2px 8px", borderRadius: 5, fontSize: 12, fontWeight: 600 }}>{u.role}</span>
              {u.is_active
                ? <span style={{ background: "#F0FDF4", color: "#15803D", padding: "2px 8px", borderRadius: 5, fontSize: 12, fontWeight: 600 }}>Actif</span>
                : <span style={{ background: "#FEF2F2", color: "#B91C1C", padding: "2px 8px", borderRadius: 5, fontSize: 12, fontWeight: 600 }}>Inactif</span>}
              <div style={{ fontSize: 11, color: "#AFAFAC" }}>{fmtRel(u.last_seen_at)}</div>
            </div>
          ))}
    </div>
  );
}

// ─── Chatbots Tab ──────────────────────────────────────────────────────────────

function ChatbotsTab({ companyId }: { companyId: string }) {
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("chatbots").select("*").eq("company_id", companyId).then(({ data }) => { setBots(data || []); setLoading(false); });
  }, [companyId]);

  const toggle = async (bot: any) => {
    await supabase.from("chatbots").update({ is_active: !bot.is_active }).eq("id", bot.id);
    setBots(prev => prev.map(b => b.id === bot.id ? { ...b, is_active: !b.is_active } : b));
    toast.success(bot.is_active ? "Chatbot désactivé" : "Chatbot activé");
  };

  if (loading) return <div style={{ padding: "32px", textAlign: "center", color: "#AFAFAC" }}>Chargement...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {bots.length === 0
        ? <div style={{ padding: "48px", textAlign: "center", background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, color: "#AFAFAC" }}>Aucun chatbot configuré</div>
        : bots.map(bot => (
            <div key={bot.id} style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{bot.name}</div>
                  <div style={{ fontSize: 12, color: "#787774" }}>Canal : {bot.channel || "—"} · Template : {bot.sector_template || "—"}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button onClick={() => toggle(bot)} style={{ padding: "6px 14px", background: bot.is_active ? "#FEF2F2" : "#F0FDF4", color: bot.is_active ? "#B91C1C" : "#15803D", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                    {bot.is_active ? "Désactiver" : "Activer"}
                  </button>
                  <span style={{ background: bot.is_active ? "#F0FDF4" : "#F1F1EF", color: bot.is_active ? "#15803D" : "#AFAFAC", padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                    {bot.is_active ? "● Actif" : "○ Inactif"}
                  </span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {[
                  { label: "Interactions", value: bot.total_interactions || 0, color: "#0B6BCB" },
                  { label: "Conversions",  value: bot.total_conversions  || 0, color: "#1D7F42" },
                  { label: "Escalades",    value: bot.total_escalations  || 0, color: "#C0392B" },
                  { label: "Taux esc.",    value: bot.total_interactions > 0 ? `${Math.round((bot.total_escalations / bot.total_interactions) * 100)}%` : "—", color: "#B35000" },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: "#F7F7F5", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, color: "#AFAFAC", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
    </div>
  );
}

// ─── Activity Tab ──────────────────────────────────────────────────────────────

function ActivityTab({ companyId }: { companyId: string }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("analytics_logs").select("*").eq("company_id", companyId).order("created_at", { ascending: false }).limit(50).then(({ data }) => { setEvents(data || []); setLoading(false); });
  }, [companyId]);

  const TYPE_ICON: Record<string, string> = {
    message: "MessageCircle", order: "Package", reservation: "Calendar", login: "Lock", activation: "Zap", automation: "Bot",
  };

  if (loading) return <div style={{ padding: "32px", textAlign: "center", color: "#AFAFAC" }}>Chargement...</div>;

  return (
    <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #F1F1EF" }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Journal d'activité</div>
      </div>
      {events.length === 0
        ? <div style={{ padding: "48px", textAlign: "center", color: "#AFAFAC" }}>Aucune activité enregistrée</div>
        : events.map((ev, i) => (
            <div key={ev.id} style={{ display: "flex", gap: 12, padding: "12px 20px", borderBottom: i < events.length - 1 ? "1px solid #F7F7F5" : "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                <SectorIcon name={TYPE_ICON[ev.event_type] || "Clipboard"} size={14} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{ev.event_type?.replace("_", " ") || "Événement"}</div>
                <div style={{ fontSize: 11, color: "#787774" }}>
                  {ev.entity_type && <span style={{ marginRight: 8 }}>Entité : {ev.entity_type}</span>}
                  {ev.channel && <span>Canal : {ev.channel}</span>}
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#AFAFAC", flexShrink: 0 }}>{fmtRel(ev.created_at)}</div>
            </div>
          ))}
    </div>
  );
}

// ─── Insight Tab ───────────────────────────────────────────────────────────────

function InsightTab({ companyId }: { companyId: string }) {
  const [scores, setScores] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("insight_scores").select("*").eq("company_id", companyId).order("score_date", { ascending: false }).limit(30),
      supabase.from("insight_alerts").select("*").eq("company_id", companyId).eq("is_resolved", false).order("created_at", { ascending: false }).limit(10),
    ]).then(([s, a]) => { setScores(s.data || []); setAlerts(a.data || []); setLoading(false); });
  }, [companyId]);

  const latest = scores[0];
  const scoreColor = (v: number) => v >= 75 ? "#15803D" : v >= 50 ? "#1D4ED8" : v >= 30 ? "#C2410C" : "#B91C1C";

  const resolveAlert = async (id: string) => {
    await supabase.from("insight_alerts").update({ is_resolved: true, resolved_at: new Date().toISOString() }).eq("id", id);
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast.success("Alerte résolue");
  };

  if (loading) return <div style={{ padding: "32px", textAlign: "center", color: "#AFAFAC" }}>Chargement...</div>;

  const chartData = [...scores].reverse().map(s => ({ date: s.score_date, score: s.overall_score, engagement: s.engagement_score, growth: s.growth_score }));
  const SEVERITY_CFG: Record<string, { bg: string; text: string; dot: string }> = {
    info: { bg: "#EFF6FF", text: "#1D4ED8", dot: "#1D4ED8" },
    warning: { bg: "#FFF7ED", text: "#C2410C", dot: "#C2410C" },
    critical: { bg: "#FEF2F2", text: "#B91C1C", dot: "#B91C1C" },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Score actuel */}
      {latest && (
        <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Score Insight — {latest.score_date}</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: scoreColor(latest.overall_score), lineHeight: 1 }}>{latest.overall_score}<span style={{ fontSize: 16, color: "#AFAFAC", fontWeight: 500 }}>/100</span></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Engagement",    value: latest.engagement_score,  color: "#0B6BCB" },
              { label: "Automatisation",value: latest.automation_score,  color: "#6B3FA0" },
              { label: "Croissance",    value: latest.growth_score,      color: "#1D7F42" },
              { label: "Rétention",     value: latest.retention_score,   color: "#B35000" },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "#787774" }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}/100</span>
                </div>
                <div style={{ height: 5, background: "#F1F1EF", borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Évolution 30j */}
      {chartData.length > 1 && (
        <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Évolution — 30 jours</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6B3FA0" stopOpacity={0.15} /><stop offset="95%" stopColor="#6B3FA0" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F1EF" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#AFAFAC" }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#AFAFAC" }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#6B3FA0" strokeWidth={2.5} fill="url(#scoreG)" name="Score global" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Alertes ouvertes */}
      {alerts.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #F1F1EF" }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Alertes ouvertes ({alerts.length})</div>
          </div>
          {alerts.map(a => {
            const sev = SEVERITY_CFG[a.severity] || SEVERITY_CFG.info;
            return (
              <div key={a.id} style={{ display: "flex", gap: 12, padding: "12px 20px", borderBottom: "1px solid #F7F7F5", alignItems: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: sev.dot, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</div>
                  {a.description && <div style={{ fontSize: 11, color: "#787774" }}>{a.description}</div>}
                </div>
                <button onClick={() => resolveAlert(a.id)} style={{ padding: "5px 12px", background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Résoudre
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!latest && alerts.length === 0 && (
        <div style={{ padding: "48px", textAlign: "center", background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, color: "#AFAFAC" }}>
          Aucune donnée Insight disponible pour cette entreprise.
        </div>
      )}
    </div>
  );
}
