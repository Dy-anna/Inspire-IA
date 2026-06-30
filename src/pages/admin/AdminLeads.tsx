// src/pages/admin/AdminLeads.tsx
import { useState, useEffect, useCallback } from "react";
import { SectorIcon } from "@/components/SectorIcon";
import { supabase } from "@/lib/supabase";
import AdminLayout from "./AdminLayout";
import { toast } from "sonner";
import { Search, X, ChevronRight, Plus, RefreshCw, ArrowUpRight, TrendingUp, Users, Star, CheckCircle } from "lucide-react";

const SECTOR_CFG: Record<string, { label: string; color: string; icon: string }> = {
  restaurant:     { label: "Restaurant",  color: "#B35000", icon: "UtensilsCrossed" },
  real_estate:    { label: "Immobilier",  color: "#1D7F42", icon: "Building2" },
  travel_agency:  { label: "Voyage",      color: "#0B6BCB", icon: "Plane" },
  private_clinic: { label: "Clinique",    color: "#C0392B", icon: "Stethoscope" },
  private_school: { label: "École",       color: "#6B3FA0", icon: "GraduationCap" },
  hotel:          { label: "Hôtellerie",   color: "#FF6B35", icon: "Hotel" },
  event:          { label: "Événementiel", color: "#F59E0B", icon: "PartyPopper" },
};

const STATUS: Record<string, { label: string; bg: string; text: string }> = {
  new:            { label: "Nouveau",      bg: "#EFF6FF", text: "#1D4ED8" },
  contacted:      { label: "Contacté",     bg: "#F0FDFA", text: "#0F766E" },
  qualified:      { label: "Qualifié",     bg: "#F5F3FF", text: "#7C3AED" },
  demo_scheduled: { label: "Démo prévue", bg: "#FFF7ED", text: "#C2410C" },
  converted:      { label: "Converti ✓",  bg: "#F0FDF4", text: "#15803D" },
  lost:           { label: "Perdu",        bg: "#FEF2F2", text: "#B91C1C" },
};

const fmt = (n: number) => Math.round(n).toLocaleString("fr-FR");
const fmtDate = (iso: string | null) => iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtRel = (iso: string | null) => {
  if (!iso) return "—";
  const d = Date.now() - new Date(iso).getTime();
  if (d < 3600000) return `${Math.floor(d / 60000)} min`;
  if (d < 86400000) return `${Math.floor(d / 3600000)} h`;
  return `${Math.floor(d / 86400000)} j`;
};

function Tag({ label, bg, text }: { label: string; bg: string; text: string }) {
  return <span style={{ padding: "2px 8px", borderRadius: 5, fontSize: 12, fontWeight: 600, background: bg, color: text, whiteSpace: "nowrap" }}>{label}</span>;
}

// ─── Lead Panel ────────────────────────────────────────────────────────────────

function LeadPanel({ lead, onClose, onUpdate }: { lead: any; onClose: () => void; onUpdate: (id: string, p: any) => Promise<void> }) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [score, setScore] = useState(lead.score?.toString() || "");
  const [converting, setConverting] = useState(false);
  const [showConvert, setShowConvert] = useState(false);
  const [convertForm, setConvertForm] = useState({ name: lead.business_name || "", city: "", country: lead.country || "Côte d'Ivoire" });
  const sec = SECTOR_CFG[lead.sector] || { icon: "Building2", color: "#787774", label: lead.sector };

  const saveNotes = () => onUpdate(lead.id, { notes, score: score ? parseInt(score) : null, last_followup_at: new Date().toISOString() });

  const convertToCompany = async () => {
    if (!convertForm.name.trim()) { toast.error("Nom requis"); return; }
    setConverting(true);
    try {
      const { data: company, error: compError } = await supabase.from("companies").insert({
        name: convertForm.name.trim(),
        sector: lead.sector,
        country: convertForm.country,
        city: convertForm.city,
        email: lead.email,
        phone: lead.phone,
        status: "pending",
        onboarding_status: "not_started",
        onboarding_completed: false,
        settings: {},
        metadata: { converted_from_lead: lead.id },
      }).select("id").single();
      if (compError) throw compError;

      await onUpdate(lead.id, { status: "converted", converted_at: new Date().toISOString(), converted_company_id: company.id });
      toast.success("Lead converti ✓ — Entreprise créée en statut «En attente»");
      setShowConvert(false);
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de la conversion");
    } finally {
      setConverting(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex" }}>
      <div onClick={onClose} style={{ flex: 1, background: "rgba(0,0,0,0.25)", cursor: "pointer" }} />
      <div style={{ width: 500, background: "#fff", borderLeft: "1px solid #E8E8E5", display: "flex", flexDirection: "column", overflow: "hidden", animation: "panelIn 0.22s cubic-bezier(0.22,1,0.36,1)" }}>
        <div style={{ padding: "22px 26px 18px", borderBottom: "1px solid #E8E8E5" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: `${sec.color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><SectorIcon name={sec.icon} size={22} color={sec.color} /></div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#1A1A1A" }}>{lead.business_name}</div>
                <div style={{ fontSize: 12, color: "#787774" }}>{sec.label} · {lead.country}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#AFAFAC", padding: 4 }}><X size={18} /></button>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
            <Tag {...STATUS[lead.status] || STATUS.new} />
            {lead.source && <span style={{ background: "#F7F7F5", color: "#AFAFAC", padding: "2px 8px", borderRadius: 5, fontSize: 12 }}>{lead.source.replace(/_/g, " ")}</span>}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 26px 26px" }}>
          {/* Infos */}
          <div style={{ marginTop: 18 }}>
            {[
              ["Téléphone",       lead.phone  || "—"],
              ["Email",           lead.email  || "—"],
              ["Besoin principal",lead.main_need || "—"],
              ["Suivis effectués",`${lead.followup_count || 0} fois`],
              ["Dernier contact", fmtRel(lead.last_followup_at)],
              ["Créé le",         fmtDate(lead.created_at)],
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", gap: 16, padding: "8px 0", borderBottom: "1px solid #F7F7F5" }}>
                <span style={{ width: 150, fontSize: 13, color: "#787774", flexShrink: 0 }}>{l}</span>
                <span style={{ fontSize: 13, color: "#1A1A1A", fontWeight: 500, wordBreak: "break-word" }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Score + Notes */}
          <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "100px 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#AFAFAC", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Score /100</label>
              <input value={score} onChange={e => setScore(e.target.value)} type="number" min="0" max="100" placeholder="—"
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #E8E8E5", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", textAlign: "center", fontWeight: 700 }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#AFAFAC", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Notes internes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #E8E8E5", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", resize: "none", lineHeight: 1.5 }} />
            </div>
          </div>

          {/* Changer statut */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#AFAFAC", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Changer le statut</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.entries(STATUS).filter(([k]) => k !== lead.status).map(([k, v]) => (
                <button key={k} onClick={() => onUpdate(lead.id, { status: k, last_followup_at: new Date().toISOString(), followup_count: (lead.followup_count || 0) + 1 })}
                  style={{ padding: "6px 12px", background: v.bg, color: v.text, border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  → {v.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={saveNotes} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#1A1A1A", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            <CheckCircle size={13} />Sauvegarder
          </button>

          {/* Contact rapide */}
          {lead.phone && (
            <a href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`} target="_blank"
              style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, padding: "11px 16px", background: "#128C7E14", border: "1px solid #128C7E30", borderRadius: 9, color: "#15803D", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="#15803D"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
              Contacter sur WhatsApp · {lead.phone}
            </a>
          )}

          {/* Conversion */}
          {lead.status !== "converted" && (
            <div style={{ marginTop: 16 }}>
              <button onClick={() => setShowConvert(!showConvert)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 16px", background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
                <TrendingUp size={14} />Convertir en entreprise cliente
              </button>
              {showConvert && (
                <div style={{ marginTop: 12, padding: "16px", background: "#F7F7F5", borderRadius: 10, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>Créer l'entreprise</div>
                  {[
                    { label: "Nom", key: "name", ph: lead.business_name },
                    { label: "Ville", key: "city", ph: "Abidjan" },
                    { label: "Pays", key: "country", ph: "Côte d'Ivoire" },
                  ].map(({ label, key, ph }) => (
                    <div key={key}>
                      <label style={{ fontSize: 12, color: "#787774", display: "block", marginBottom: 4 }}>{label}</label>
                      <input value={(convertForm as any)[key]} onChange={e => setConvertForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph}
                        style={{ width: "100%", padding: "8px 12px", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none", background: "#fff" }} />
                    </div>
                  ))}
                  <button onClick={convertToCompany} disabled={converting} style={{ padding: "9px 16px", background: "#15803D", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    {converting ? <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} />Conversion...</> : "✓ Confirmer la conversion"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function AdminLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [selected, setSelected] = useState<any | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (statusFilter !== "all") q = q.eq("status", statusFilter);
    if (sectorFilter !== "all") q = q.eq("sector", sectorFilter);
    const { data } = await q.limit(300);
    const all = data || [];
    setLeads(all);

    const mStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const [newM, convertedM, total] = await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", mStart),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "converted").gte("created_at", mStart),
      supabase.from("leads").select("id", { count: "exact", head: true }),
    ]);
    const convRate = (total.count || 0) > 0 ? Math.round(((convertedM.count || 0) / (total.count || 1)) * 100) : 0;
    const byStatus = Object.keys(STATUS).map(k => ({ key: k, count: all.filter(l => l.status === k).length, ...STATUS[k] }));
    setStats({ new: newM.count || 0, converted: convertedM.count || 0, total: total.count || 0, convRate, byStatus });
    setLoading(false);
  }, [statusFilter, sectorFilter]);

  useEffect(() => { load(); }, [load]);

  const filtered = leads.filter(l =>
    !search || l.business_name?.toLowerCase().includes(search.toLowerCase()) || (l.phone || "").includes(search) || (l.email || "").includes(search)
  );

  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("leads").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) { toast.error("Erreur"); return; }
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
    if (selected?.id === id) setSelected((p: any) => p ? { ...p, ...patch } : p);
  };

  return (
    <AdminLayout currentPath="/admin/leads">
      <style>{`@keyframes panelIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: "-0.3px" }}>Leads</h1>
          <p style={{ fontSize: 13, color: "#787774", margin: "4px 0 0" }}>Pipeline commercial Inspire IA</p>
        </div>
        <button onClick={() => setShowNew(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#1D7F42", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          <Plus size={14} />Nouveau lead
        </button>
      </div>

      {/* KPIs pipeline */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10, marginBottom: 18 }}>
          {stats.byStatus.map(({ key, label, bg, text, count }: any) => (
            <button key={key} onClick={() => setStatusFilter(key === statusFilter ? "all" : key)}
              style={{ padding: "12px 10px", background: statusFilter === key ? bg : "#fff", border: `1px solid ${statusFilter === key ? text : "#E8E8E5"}`, borderRadius: 10, cursor: "pointer", fontFamily: "inherit", textAlign: "center", transition: "all 0.15s" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: text, lineHeight: 1 }}>{count}</div>
              <div style={{ fontSize: 11, color: "#787774", marginTop: 3 }}>{label}</div>
            </button>
          ))}
        </div>
      )}

      {/* Filtres */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #E8E8E5", borderRadius: 8, padding: "8px 12px", flex: 1, maxWidth: 300 }}>
          <Search size={13} color="#AFAFAC" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, téléphone, email..."
            style={{ border: "none", outline: "none", fontSize: 13, fontFamily: "inherit", flex: 1, background: "transparent" }} />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#AFAFAC", padding: 0 }}><X size={12} /></button>}
        </div>
        <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} style={{ padding: "7px 12px", border: "1px solid #E8E8E5", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", background: "#fff" }}>
          <option value="all">Tous secteurs</option>
          {Object.entries(SECTOR_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <button onClick={() => setStatusFilter("all")} style={{ padding: "7px 12px", background: "#F7F7F5", border: "1px solid #E8E8E5", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#787774" }}>
          Réinitialiser
        </button>
        <span style={{ fontSize: 12, color: "#AFAFAC" }}>{filtered.length} lead{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Tableau */}
      <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", background: "#F7F7F5", borderBottom: "1px solid #E8E8E5", padding: "0 16px" }}>
          {[
            { l: "Entreprise",  w: 220 }, { l: "Secteur",  w: 110 }, { l: "Pays",    w: 110 },
            { l: "Contact",     w: 160 }, { l: "Statut",   w: 120 }, { l: "Score",   w: 80  },
            { l: "Source",      w: 110 }, { l: "Relances", w: 80  }, { l: "Créé",    w: 90  },
            { l: "",            w: 40  },
          ].map(({ l, w }) => (
            <div key={l} style={{ width: w, padding: "9px 10px", fontSize: 11, fontWeight: 700, color: "#AFAFAC", textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>{l}</div>
          ))}
        </div>

        {loading
          ? Array(5).fill(0).map((_, i) => <div key={i} style={{ height: 52, borderBottom: "1px solid #F1F1EF", animation: "pulse 1.5s ease-in-out infinite" }} />)
          : filtered.length === 0
          ? <div style={{ padding: "56px", textAlign: "center", color: "#AFAFAC" }}>Aucun lead</div>
          : filtered.map((l, i) => {
              const sec = SECTOR_CFG[l.sector] || { icon: "Building2", color: "#787774", label: l.sector };
              const st = STATUS[l.status] || STATUS.new;
              const scoreColor = l.score !== null ? (l.score >= 70 ? "#15803D" : l.score >= 40 ? "#C2410C" : "#B91C1C") : "#AFAFAC";
              return (
                <div key={l.id} onClick={() => setSelected(l)}
                  style={{ display: "flex", alignItems: "center", padding: "0 16px", height: 52, borderBottom: i < filtered.length - 1 ? "1px solid #F1F1EF" : "none", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 220, padding: "0 10px", flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.business_name}</div>
                    {l.main_need && <div style={{ fontSize: 11, color: "#AFAFAC", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.main_need}</div>}
                  </div>
                  <div style={{ width: 110, padding: "0 10px", flexShrink: 0, fontSize: 12, color: "#787774", display: "flex", alignItems: "center", gap: 5 }}><SectorIcon name={sec.icon} size={13} color={sec.color} />{sec.label}</div>
                  <div style={{ width: 110, padding: "0 10px", flexShrink: 0, fontSize: 12, color: "#787774" }}>{l.country || "—"}</div>
                  <div style={{ width: 160, padding: "0 10px", flexShrink: 0 }}>
                    {l.phone
                      ? <a href={`https://wa.me/${l.phone.replace(/\D/g,"")}`} target="_blank" onClick={e => e.stopPropagation()} style={{ fontSize: 12, color: "#15803D", textDecoration: "none" }}>{l.phone}</a>
                      : <span style={{ fontSize: 12, color: "#AFAFAC" }}>{l.email || "—"}</span>}
                  </div>
                  <div style={{ width: 120, padding: "0 10px", flexShrink: 0 }}><Tag {...st} /></div>
                  <div style={{ width: 80, padding: "0 10px", flexShrink: 0 }}>
                    {l.score !== null ? <span style={{ fontSize: 14, fontWeight: 800, color: scoreColor }}>{l.score}</span> : <span style={{ color: "#AFAFAC", fontSize: 12 }}>—</span>}
                  </div>
                  <div style={{ width: 110, padding: "0 10px", flexShrink: 0, fontSize: 11, color: "#AFAFAC" }}>{l.source?.replace(/_/g, " ") || "—"}</div>
                  <div style={{ width: 80, padding: "0 10px", flexShrink: 0, fontSize: 13, fontWeight: 600, color: (l.followup_count || 0) > 3 ? "#C2410C" : "#787774" }}>{l.followup_count || 0}</div>
                  <div style={{ width: 90, padding: "0 10px", flexShrink: 0, fontSize: 11, color: "#AFAFAC" }}>{fmtRel(l.created_at)}</div>
                  <div style={{ width: 40, flexShrink: 0 }}><ChevronRight size={14} color="#AFAFAC" /></div>
                </div>
              );
            })}
      </div>

      {selected && <LeadPanel lead={selected} onClose={() => setSelected(null)} onUpdate={update} />}

      {/* New lead modal */}
      {showNew && <NewLeadModal onClose={() => setShowNew(false)} onSave={async (d) => {
        const { data, error } = await supabase.from("leads").insert(d).select().single();
        if (error) { toast.error("Erreur"); return; }
        toast.success("Lead créé");
        setLeads(prev => [data, ...prev]);
        setShowNew(false);
      }} />}
    </AdminLayout>
  );
}

function NewLeadModal({ onClose, onSave }: { onClose: () => void; onSave: (d: any) => Promise<void> }) {
  const [form, setForm] = useState({ business_name: "", sector: "restaurant", country: "Côte d'Ivoire", phone: "", email: "", main_need: "", source: "website_form" });
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!form.business_name.trim()) { toast.error("Nom requis"); return; }
    setSaving(true);
    await onSave({ ...form, status: "new" });
    setSaving(false);
  };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.25)" }}>
      <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: 480, maxWidth: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Nouveau lead</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#AFAFAC" }}><X size={18} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          {[
            { l: "Nom de l'entreprise *", k: "business_name", ph: "Restaurant Le Baobab" },
            { l: "Pays",                  k: "country",       ph: "Côte d'Ivoire" },
            { l: "Téléphone",             k: "phone",         ph: "+225..." },
            { l: "Email",                 k: "email",         ph: "contact@..." },
          ].map(({ l, k, ph }) => (
            <div key={k}>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 5 }}>{l}</label>
              <input value={(form as any)[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} placeholder={ph}
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 5 }}>Secteur</label>
            <select value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))} style={{ width: "100%", padding: "9px 12px", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff" }}>
              {Object.entries(SECTOR_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 5 }}>Source</label>
            <select value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} style={{ width: "100%", padding: "9px 12px", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff" }}>
              {["website_form","whatsapp_inbound","referral","social_media","event","other"].map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 5 }}>Besoin principal</label>
          <textarea value={form.main_need} onChange={e => setForm(p => ({ ...p, main_need: e.target.value }))} rows={2} placeholder="CRM + chatbot WhatsApp..."
            style={{ width: "100%", padding: "9px 12px", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical" }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "9px", background: "#F7F7F5", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Annuler</button>
          <button onClick={save} disabled={saving} style={{ flex: 1, padding: "9px", background: "#1D7F42", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            {saving ? <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} />Création...</> : "Créer le lead"}
          </button>
        </div>
      </div>
    </div>
  );
}
