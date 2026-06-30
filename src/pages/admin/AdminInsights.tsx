// src/pages/admin/AdminInsights.tsx  — Insight Engine global
import { useState, useEffect } from "react";
import { SectorIcon } from "@/components/SectorIcon";
import { supabase } from "@/lib/supabase";
import AdminLayout from "./AdminLayout";
import { toast } from "sonner";
import { Zap, ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle, RefreshCw, TrendingUp, Star, Activity, Shield, Bell, Users, Settings, LogOut, X, Check, Search, Plus, Edit3, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const SECTOR_CFG: Record<string, { label: string; color: string; icon: string }> = {
  restaurant:     { label: "Restaurant",  color: "#B35000", icon: "UtensilsCrossed" },
  real_estate:    { label: "Immobilier",  color: "#1D7F42", icon: "Building2" },
  travel_agency:  { label: "Voyage",      color: "#0B6BCB", icon: "Plane" },
  private_clinic: { label: "Clinique",    color: "#C0392B", icon: "Stethoscope" },
  private_school: { label: "École",       color: "#6B3FA0", icon: "GraduationCap" },
  hotel:          { label: "Hôtellerie",   color: "#FF6B35", icon: "Hotel" },
  event:          { label: "Événementiel", color: "#F59E0B", icon: "PartyPopper" },
};
const SEVERITY: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  info:     { label: "Info",      bg: "#EFF6FF", text: "#1D4ED8", dot: "#1D4ED8" },
  warning:  { label: "Attention", bg: "#FFF7ED", text: "#C2410C", dot: "#C2410C" },
  critical: { label: "Critique",  bg: "#FEF2F2", text: "#B91C1C", dot: "#B91C1C" },
};
const fmtRel = (iso: string | null) => {
  if (!iso) return "—";
  const d = Date.now() - new Date(iso).getTime();
  if (d < 3600000) return `${Math.floor(d / 60000)} min`;
  if (d < 86400000) return `${Math.floor(d / 3600000)} h`;
  return `${Math.floor(d / 86400000)} j`;
};
const scoreColor = (v: number) => v >= 75 ? "#15803D" : v >= 50 ? "#1D4ED8" : v >= 30 ? "#C2410C" : "#B91C1C";
const scoreBg = (v: number) => v >= 75 ? "#F0FDF4" : v >= 50 ? "#EFF6FF" : v >= 30 ? "#FFF7ED" : "#FEF2F2";

export function AdminInsights() {
  const [scores, setScores] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"overall"|"growth"|"engagement">("overall");

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("insight_scores").select("*, companies(name, sector)").order("score_date", { ascending: false }).limit(500);
    const raw = data || [];
    const seen = new Set<string>();
    const latest = raw.filter((s: any) => {
      if (seen.has(s.company_id)) return false;
      seen.add(s.company_id); return true;
    }).map((s: any) => ({ ...s, company_name: s.companies?.name || "—", sector: s.companies?.sector || "" }));
    setScores(latest);

    const avg = latest.length > 0 ? Math.round(latest.reduce((a: number, s: any) => a + s.overall_score, 0) / latest.length) : 0;
    const critical = latest.filter((s: any) => s.overall_score < 30).length;
    const atRisk = latest.filter((s: any) => s.overall_score >= 30 && s.overall_score < 50).length;
    const performing = latest.filter((s: any) => s.overall_score >= 75).length;
    setHealth({ avg, critical, atRisk, performing, total: latest.length });
    setLoading(false);
  };

  const filtered = scores
    .filter(s => !search || (s.company_name || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const k = sort === "overall" ? "overall_score" : sort === "growth" ? "growth_score" : "engagement_score";
      return b[k] - a[k];
    });

  const distData = [
    { range: "0-30 🔴",  count: scores.filter(s => s.overall_score < 30).length,                               color: "#B91C1C" },
    { range: "30-50 🟡", count: scores.filter(s => s.overall_score >= 30 && s.overall_score < 50).length,     color: "#C2410C" },
    { range: "50-75 🔵", count: scores.filter(s => s.overall_score >= 50 && s.overall_score < 75).length,     color: "#1D4ED8" },
    { range: "75-100 🟢",count: scores.filter(s => s.overall_score >= 75).length,                             color: "#15803D" },
  ];

  return (
    <AdminLayout currentPath="/admin/insights">
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: "-0.3px" }}>Insight Engine</h1>
        <p style={{ fontSize: 13, color: "#787774", margin: "4px 0 0" }}>Santé globale de la plateforme</p>
      </div>

      {/* Health cards */}
      {health && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
          {[
            { label: "Score moyen",          value: health.avg,        unit: "/100", color: scoreColor(health.avg) },
            { label: "Entreprises critiques", value: health.critical,   unit: "",     color: "#B91C1C" },
            { label: "À risque",              value: health.atRisk,     unit: "",     color: "#C2410C" },
            { label: "Performantes",          value: health.performing, unit: "",     color: "#15803D" },
          ].map(({ label, value, unit, color }) => (
            <div key={label} style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: "18px 20px", borderTop: `3px solid ${color}` }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#787774", marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color, lineHeight: 1 }}>{value}<span style={{ fontSize: 14, color: "#AFAFAC", fontWeight: 400 }}>{unit}</span></div>
              <div style={{ fontSize: 11, color: "#AFAFAC", marginTop: 3 }}>sur {health.total} entreprises scorées</div>
            </div>
          ))}
        </div>
      )}

      {/* Distribution chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14, marginBottom: 20 }}>
        <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Distribution des scores</div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={distData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#AFAFAC" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#AFAFAC" }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Entreprises">
                {distData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top performers / Critical */}
        <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>À surveiller immédiatement</div>
          {scores.filter(s => s.overall_score < 40).slice(0, 5).map(s => (
            <a key={s.id} href={`/admin/companies/${s.company_id}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid #F7F7F5", textDecoration: "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${SECTOR_CFG[s.sector]?.color || "#787774"}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><SectorIcon name={SECTOR_CFG[s.sector]?.icon || "Building2"} size={16} color={SECTOR_CFG[s.sector]?.color || "#787774"} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{s.company_name}</div>
                <div style={{ fontSize: 11, color: "#787774" }}>{SECTOR_CFG[s.sector]?.label || "—"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: scoreColor(s.overall_score) }}>{s.overall_score}</div>
                <div style={{ fontSize: 10, color: "#AFAFAC" }}>/100</div>
              </div>
            </a>
          ))}
          {scores.filter(s => s.overall_score < 40).length === 0 && (
            <div style={{ padding: "20px 0", textAlign: "center", color: "#AFAFAC", fontSize: 13 }}>✅ Aucune entreprise critique</div>
          )}
        </div>
      </div>

      {/* Tableau complet */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #E8E8E5", borderRadius: 8, padding: "8px 12px", maxWidth: 280 }}>
          <Search size={13} color="#AFAFAC" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom d'entreprise..." style={{ border: "none", outline: "none", fontSize: 13, fontFamily: "inherit", flex: 1, background: "transparent" }} />
        </div>
        <div style={{ display: "flex", gap: 4, background: "#F7F7F5", padding: 4, borderRadius: 8 }}>
          {[["overall","Score global"],["growth","Croissance"],["engagement","Engagement"]].map(([k, l]) => (
            <button key={k} onClick={() => setSort(k as any)} style={{ padding: "5px 12px", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", background: sort === k ? "#1A1A1A" : "transparent", color: sort === k ? "#fff" : "#787774" }}>{l}</button>
          ))}
        </div>
        <button onClick={load} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", background: "#fff", border: "1px solid #E8E8E5", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "inherit", color: "#787774" }}>
          <RefreshCw size={13} />Actualiser
        </button>
      </div>

      {loading
        ? <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>{Array(6).fill(0).map((_, i) => <div key={i} style={{ height: 200, background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, animation: "pulse 1.5s ease-in-out infinite" }} />)}</div>
        : filtered.length === 0
        ? <div style={{ padding: "48px", textAlign: "center", color: "#AFAFAC" }}>Aucune donnée Insight</div>
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {filtered.map(s => {
              const sec = SECTOR_CFG[s.sector] || { icon: "Building2", color: "#787774" };
              const trend = s.previous_overall !== null ? s.overall_score - s.previous_overall : null;
              return (
                <a key={s.id} href={`/admin/companies/${s.company_id}`} style={{ textDecoration: "none", background: "#fff", border: `1px solid ${s.overall_score < 30 ? "#FECACA" : "#E8E8E5"}`, borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12, borderTop: `3px solid ${scoreColor(s.overall_score)}`, transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: `${sec.color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><SectorIcon name={sec.icon} size={18} color={sec.color} /></div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 130 }}>{s.company_name}</div>
                        <div style={{ fontSize: 11, color: "#AFAFAC" }}>{s.score_date}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 28, fontWeight: 900, color: scoreColor(s.overall_score), lineHeight: 1 }}>{s.overall_score}</div>
                      {trend !== null && (
                        <div style={{ display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end" }}>
                          {trend > 0 ? <ArrowUpRight size={11} color="#15803D" /> : <ArrowDownRight size={11} color="#B91C1C" />}
                          <span style={{ fontSize: 11, color: trend > 0 ? "#15803D" : "#B91C1C", fontWeight: 700 }}>{Math.abs(trend)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {[
                    { l: "Engagement",    v: s.engagement_score,  c: "#0B6BCB" },
                    { l: "Automatisation",v: s.automation_score,  c: "#6B3FA0" },
                    { l: "Croissance",    v: s.growth_score,      c: "#1D7F42" },
                    { l: "Rétention",     v: s.retention_score,   c: "#B35000" },
                  ].map(({ l, v, c }) => (
                    <div key={l}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 11, color: "#787774" }}>{l}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: c }}>{v}</span>
                      </div>
                      <div style={{ height: 4, background: "#F1F1EF", borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${v}%`, background: c, borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </a>
              );
            })}
          </div>}
    </AdminLayout>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// ALERTS PAGE
// ────────────────────────────────────────────────────────────────────────────────

export function AdminAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all"|"critical"|"warning"|"info">("all");
  const [showResolved, setShowResolved] = useState(false);

  const load = async () => {
    setLoading(true);
    let q = supabase.from("insight_alerts").select("*, companies(name, sector)").eq("is_resolved", showResolved).order("created_at", { ascending: false }).limit(200);
    if (filter !== "all") q = q.eq("severity", filter);
    const { data } = await q;
    setAlerts((data || []).map((a: any) => ({ ...a, company_name: a.companies?.name || "—", sector: a.companies?.sector || "" })));
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter, showResolved]);

  const resolve = async (id: string) => {
    await supabase.from("insight_alerts").update({ is_resolved: true, resolved_at: new Date().toISOString() }).eq("id", id);
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast.success("Alerte résolue");
  };

  const markRead = async (id: string) => {
    await supabase.from("insight_alerts").update({ is_read: true, read_at: new Date().toISOString() }).eq("id", id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
  };

  const critCount = alerts.filter(a => a.severity === "critical").length;

  return (
    <AdminLayout currentPath="/admin/alerts">
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: "-0.3px" }}>Alertes</h1>
          <p style={{ fontSize: 13, color: "#787774", margin: "4px 0 0" }}>Problèmes détectés automatiquement</p>
        </div>
        {critCount > 0 && !showResolved && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 9 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#B91C1C", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#B91C1C" }}>{critCount} alerte{critCount > 1 ? "s" : ""} critique{critCount > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4, background: "#F7F7F5", padding: 4, borderRadius: 8 }}>
          {(["all","critical","warning","info"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "5px 12px", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", background: filter === f ? "#1A1A1A" : "transparent", color: filter === f ? "#fff" : "#787774" }}>
              {f === "all" ? "Toutes" : SEVERITY[f]?.label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowResolved(!showResolved)} style={{ padding: "7px 14px", background: showResolved ? "#1A1A1A" : "#fff", color: showResolved ? "#fff" : "#787774", border: "1px solid #E8E8E5", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          {showResolved ? "← Voir ouvertes" : "Voir résolues"}
        </button>
        <span style={{ fontSize: 12, color: "#AFAFAC" }}>{alerts.length} alerte{alerts.length !== 1 ? "s" : ""}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {loading
          ? Array(5).fill(0).map((_, i) => <div key={i} style={{ height: 80, background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, animation: "pulse 1.5s ease-in-out infinite" }} />)
          : alerts.length === 0
          ? <div style={{ padding: "64px 32px", textAlign: "center", background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12 }}>
              <CheckCircle size={36} color="#BBF7D0" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 4 }}>Aucune alerte {showResolved ? "résolue" : "ouverte"}</div>
            </div>
          : alerts.map(a => {
              const sev = SEVERITY[a.severity] || SEVERITY.info;
              const sec = SECTOR_CFG[a.sector] || { icon: "Building2", color: "#787774" };
              return (
                <div key={a.id} onClick={() => !a.is_read && markRead(a.id)}
                  style={{ background: "#fff", border: `1px solid ${a.severity === "critical" ? "#FECACA" : "#E8E8E5"}`, borderLeft: `4px solid ${sev.dot}`, borderRadius: 10, padding: "14px 18px", display: "flex", gap: 12, alignItems: "center", cursor: a.is_read ? "default" : "pointer" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: sev.dot, flexShrink: 0, ...(a.severity === "critical" && !showResolved ? { boxShadow: `0 0 8px ${sev.dot}`, animation: "pulse 2s ease-in-out infinite" } : {}) }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 14, fontWeight: !a.is_read ? 800 : 600, color: "#1A1A1A" }}>{a.title}</span>
                      <span style={{ padding: "1px 7px", borderRadius: 5, fontSize: 11, fontWeight: 700, background: sev.bg, color: sev.text }}>{sev.label}</span>
                      {!a.is_read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6B3FA0", display: "inline-block" }} />}
                    </div>
                    <div style={{ fontSize: 12, color: "#787774" }}>
                      <a href={`/admin/companies/${a.company_id}`} style={{ color: "#6B3FA0", fontWeight: 600, textDecoration: "none" }}>{a.company_name}</a>
                      
                      {a.description && ` · ${a.description}`}
                    </div>
                    <div style={{ fontSize: 11, color: "#AFAFAC", marginTop: 3 }}>
                      {fmtRel(a.created_at)}
                      {a.metric_value !== null && ` · Valeur : ${a.metric_value}`}
                      {a.threshold_value !== null && ` (seuil : ${a.threshold_value})`}
                    </div>
                  </div>
                  {!showResolved && (
                    <button onClick={e => { e.stopPropagation(); resolve(a.id); }} style={{ padding: "6px 14px", background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
                      ✓ Résoudre
                    </button>
                  )}
                </div>
              );
            })}
      </div>
    </AdminLayout>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// ACTIVITY LOG
// ────────────────────────────────────────────────────────────────────────────────

export function AdminActivity() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => { load(); }, [typeFilter]);

  const load = async () => {
    setLoading(true);
    let q = supabase.from("analytics_logs").select("*, companies(name, sector)").order("created_at", { ascending: false }).limit(200);
    if (typeFilter !== "all") q = q.eq("event_type", typeFilter);
    const { data } = await q;
    setEvents((data || []).map((e: any) => ({ ...e, company_name: e.companies?.name || "—", sector: e.companies?.sector || "" })));
    setLoading(false);
  };

  const filtered = events.filter(e =>
    !search || (e.company_name || "").toLowerCase().includes(search.toLowerCase()) || (e.event_type || "").includes(search)
  );

  const types = ["all", ...Array.from(new Set(events.map(e => e.event_type).filter(Boolean)))];
  const TYPE_ICON: Record<string, string> = {
    message: "MessageCircle", order: "Package", reservation: "Calendar", login: "Lock", activation: "Zap",
    automation: "Bot", lead: "Target", payment: "CreditCard", chatbot: "Bot", admin_action: "Shield",
  };
  const fmtFull = (iso: string) => iso ? new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <AdminLayout currentPath="/admin/activity">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Journal d'activité</h1>
        <p style={{ fontSize: 13, color: "#787774", margin: "4px 0 0" }}>Toutes les actions de la plateforme</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #E8E8E5", borderRadius: 8, padding: "8px 12px", maxWidth: 280 }}>
          <Search size={13} color="#AFAFAC" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Entreprise, type..." style={{ border: "none", outline: "none", fontSize: 13, fontFamily: "inherit", flex: 1, background: "transparent" }} />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ padding: "7px 12px", border: "1px solid #E8E8E5", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", background: "#fff" }}>
          {types.map(t => <option key={t} value={t}>{t === "all" ? "Tous types" : t.replace(/_/g, " ")}</option>)}
        </select>
        <span style={{ fontSize: 12, color: "#AFAFAC" }}>{filtered.length} événements</span>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, overflow: "hidden" }}>
        {loading
          ? <div style={{ padding: "48px", textAlign: "center", color: "#AFAFAC" }}>Chargement...</div>
          : filtered.length === 0
          ? <div style={{ padding: "48px", textAlign: "center", color: "#AFAFAC" }}>Aucun événement</div>
          : filtered.map((ev, i) => {
              const sec = SECTOR_CFG[ev.sector] || { icon: "Building2", color: "#787774" };
              return (
                <div key={ev.id} style={{ display: "flex", gap: 12, padding: "12px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #F7F7F5" : "none", alignItems: "center" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>
                    <SectorIcon name={TYPE_ICON[ev.event_type] || "Clipboard"} size={14} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{ev.event_type?.replace(/_/g, " ") || "Événement"}</span>
                      {ev.channel && <span style={{ background: "#F7F7F5", color: "#787774", padding: "1px 7px", borderRadius: 100, fontSize: 11, fontWeight: 600 }}>{ev.channel}</span>}
                    </div>
                    <div style={{ fontSize: 11, color: "#787774" }}>
                      <SectorIcon name={sec.icon} size={13} color={sec.color} /> <a href={`/admin/companies/${ev.company_id}`} style={{ color: "#6B3FA0", fontWeight: 600, textDecoration: "none" }}>{ev.company_name}</a>
                      {ev.entity_type && ` · ${ev.entity_type}`}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#AFAFAC", flexShrink: 0 }}>{fmtFull(ev.created_at)}</div>
                </div>
              );
            })}
      </div>
    </AdminLayout>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// SETTINGS
// ────────────────────────────────────────────────────────────────────────────────

export function AdminSettings() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({ email: "", full_name: "", role: "sales" });

  useEffect(() => {
    supabase.from("admin_users").select("*").order("created_at").then(({ data }) => { setAdmins(data || []); setLoading(false); });
  }, []);

  const toggleAdmin = async (admin: any) => {
    await supabase.from("admin_users").update({ is_active: !admin.is_active }).eq("id", admin.id);
    setAdmins(prev => prev.map(a => a.id === admin.id ? { ...a, is_active: !a.is_active } : a));
    toast.success(admin.is_active ? "Admin désactivé" : "Admin activé");
  };

  const ROLES = ["super_admin","sales","support","analyst"];
  const fmtDate = (iso: string | null) => iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const fmtRel2 = (iso: string | null) => {
    if (!iso) return "Jamais";
    const d = Date.now() - new Date(iso).getTime();
    if (d < 3600000) return `${Math.floor(d / 60000)} min`;
    if (d < 86400000) return `${Math.floor(d / 3600000)} h`;
    return `${Math.floor(d / 86400000)} j`;
  };

  return (
    <AdminLayout currentPath="/admin/settings">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Paramètres</h1>
        <p style={{ fontSize: 13, color: "#787774", margin: "4px 0 0" }}>Configuration globale de la plateforme</p>
      </div>

      {/* Admins */}
      <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F1EF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Administrateurs</div>
            <div style={{ fontSize: 12, color: "#787774" }}>{admins.filter(a => a.is_active).length} actifs sur {admins.length}</div>
          </div>
          <button onClick={() => setShowNew(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#1A1A1A", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            <Plus size={13} />Ajouter admin
          </button>
        </div>
        {loading
          ? <div style={{ padding: "32px", textAlign: "center", color: "#AFAFAC" }}>Chargement...</div>
          : admins.map((admin, i) => (
              <div key={admin.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: i < admins.length - 1 ? "1px solid #F7F7F5" : "none" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #6B3FA0, #C0392B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                  {admin.full_name?.[0] || admin.email?.[0] || "A"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{admin.full_name || "—"}</div>
                  <div style={{ fontSize: 11, color: "#787774" }}>{admin.email}</div>
                </div>
                <span style={{ background: "#F5F0FF", color: "#6B3FA0", padding: "2px 8px", borderRadius: 5, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{admin.role}</span>
                <div style={{ fontSize: 11, color: "#AFAFAC", minWidth: 80, textAlign: "right" }}>
                  <div>Vu: {fmtRel2(admin.last_seen_at)}</div>
                  <div>Inscrit {fmtDate(admin.created_at)}</div>
                </div>
                <button onClick={() => toggleAdmin(admin)} style={{ padding: "5px 12px", background: admin.is_active ? "#FEF2F2" : "#F0FDF4", color: admin.is_active ? "#B91C1C" : "#15803D", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {admin.is_active ? "Désactiver" : "Activer"}
                </button>
              </div>
            ))}
      </div>

      {/* Infos plateforme */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Informations plateforme</div>
          {[
            ["Version", "v2.0"],
            ["Stack", "React + Supabase + Make"],
            ["Région DB", "eu-west-1 (Paris)"],
            ["Auth", "Supabase Auth"],
            ["Automatisations", "Make.com"],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", gap: 16, padding: "8px 0", borderBottom: "1px solid #F7F7F5" }}>
              <span style={{ width: 140, fontSize: 13, color: "#787774", flexShrink: 0 }}>{l}</span>
              <span style={{ fontSize: 13, color: "#1A1A1A", fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Secteurs configurés</div>
          {Object.entries(SECTOR_CFG).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #F7F7F5" }}>
              <SectorIcon name={v.icon} size={18} color={v.color} />
              <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{v.label}</span>
              <span style={{ padding: "2px 8px", borderRadius: 5, background: `${v.color}12`, color: v.color, fontSize: 11, fontWeight: 700 }}>Actif</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal nouvel admin */}
      {showNew && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.25)" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: 420, maxWidth: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Ajouter un administrateur</div>
              <button onClick={() => setShowNew(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#AFAFAC" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              {[
                { l: "Prénom et nom", k: "full_name", ph: "Kouadio Marc" },
                { l: "Email", k: "email", ph: "marc@inspire-ia.com" },
              ].map(({ l, k, ph }) => (
                <div key={k}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 5 }}>{l}</label>
                  <input value={(newForm as any)[k]} onChange={e => setNewForm(p => ({ ...p, [k]: e.target.value }))} placeholder={ph}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 5 }}>Rôle</label>
                <select value={newForm.role} onChange={e => setNewForm(p => ({ ...p, role: e.target.value }))} style={{ width: "100%", padding: "9px 12px", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff" }}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 9, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: "#C2410C" }}>
              ⚠️ L'utilisateur doit d'abord créer un compte via Supabase Auth avec cet email, puis son ID sera ajouté ici.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowNew(false)} style={{ flex: 1, padding: "9px", background: "#F7F7F5", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Annuler</button>
              <button onClick={() => { toast.success("Pour créer un admin : l'utilisateur doit d'abord s'inscrire, puis son UUID est inséré manuellement dans admin_users"); setShowNew(false); }} style={{ flex: 1, padding: "9px", background: "#6B3FA0", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Voir instructions
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
