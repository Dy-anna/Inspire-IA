// src/pages/admin/AdminDashboard.tsx
import { useState, useEffect } from "react";
import { SectorIcon } from "@/components/SectorIcon";
import { supabase } from "@/lib/supabase";
import AdminLayout from "./AdminLayout";
import {
  Building2, Users, MessageSquare, Globe,
  ArrowUpRight, ArrowDownRight, AlertTriangle, TrendingUp, CheckCircle
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend
} from "recharts";

const SECTOR_CFG: Record<string, { label: string; color: string; icon: string }> = {
  restaurant:     { label: "Restaurant",  color: "#B35000", icon: "UtensilsCrossed" },
  real_estate:    { label: "Immobilier",  color: "#1D7F42", icon: "Building2" },
  travel_agency:  { label: "Voyage",      color: "#0B6BCB", icon: "Plane" },
  private_clinic: { label: "Clinique",    color: "#C0392B", icon: "Stethoscope" },
  private_school: { label: "École",       color: "#6B3FA0", icon: "GraduationCap" },
  hotel:          { label: "Hôtellerie",   color: "#FF6B35", icon: "Hotel" },
  event:          { label: "Événementiel", color: "#F59E0B", icon: "PartyPopper" },
};

const STATUS_COMPANY: Record<string, { label: string; bg: string; text: string }> = {
  pending:   { label: "En attente",  bg: "#FFF7ED", text: "#C2410C" },
  active:    { label: "Actif",       bg: "#F0FDF4", text: "#15803D" },
  inactive:  { label: "Inactif",     bg: "#F1F1EF", text: "#787774" },
  suspended: { label: "Suspendu",    bg: "#FEF2F2", text: "#B91C1C" },
};

const SEVERITY_CFG: Record<string, { bg: string; text: string; dot: string }> = {
  info:     { bg: "#EFF6FF", text: "#1D4ED8", dot: "#1D4ED8" },
  warning:  { bg: "#FFF7ED", text: "#C2410C", dot: "#C2410C" },
  critical: { bg: "#FEF2F2", text: "#B91C1C", dot: "#B91C1C" },
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

function KPI({ label, value, sub, icon: Icon, color, trend, up }: { label: string; value: string | number; sub?: string; icon: any; color: string; trend?: string; up?: boolean }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: "18px 20px", borderTop: `3px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: "#787774" }}>{label}</span>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={16} color={color} /></div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color: "#1A1A1A", margin: "8px 0 3px", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#AFAFAC" }}>{sub}</div>}
      {trend && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
          {up ? <ArrowUpRight size={13} color="#15803D" /> : <ArrowDownRight size={13} color="#B91C1C" />}
          <span style={{ fontSize: 12, color: up ? "#15803D" : "#B91C1C", fontWeight: 600 }}>{trend}</span>
          <span style={{ fontSize: 11, color: "#AFAFAC" }}>vs M-1</span>
        </div>
      )}
    </div>
  );
}

const CTT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ fontSize: 12, color: "#787774", display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: p.color, marginTop: 2 }} />
          {p.name}: <strong style={{ color: "#1A1A1A" }}>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentCompanies, setRecentCompanies] = useState<any[]>([]);
  const [criticalAlerts, setCriticalAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const now = new Date();
    const mStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lmStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const lmEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();
    const wStart = new Date(now.getTime() - 7 * 86400000).toISOString();

    const [total, active, thisMonth, lastMonth, totalLeads, weekLeads, converted, totalChatbots, activeChatbots, totalClients, alerts, lmLeads] = await Promise.all([
      supabase.from("companies").select("id", { count: "exact", head: true }),
      supabase.from("companies").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("companies").select("id", { count: "exact", head: true }).gte("created_at", mStart),
      supabase.from("companies").select("id", { count: "exact", head: true }).gte("created_at", lmStart).lte("created_at", lmEnd),
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", wStart),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "converted").gte("created_at", mStart),
      supabase.from("chatbots").select("id", { count: "exact", head: true }),
      supabase.from("chatbots").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("clients").select("id", { count: "exact", head: true }).then(r => r, () => ({ count: 0 })),
      supabase.from("insight_alerts").select("id, alert_type, severity, title, description, created_at, companies(name)").eq("is_resolved", false).in("severity", ["critical", "warning"]).order("created_at", { ascending: false }).limit(6),
      supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", lmStart).lte("created_at", lmEnd),
    ]);

    // Secteur
    const { data: bySector } = await supabase.from("companies").select("sector").eq("status", "active");
    const sMap: Record<string, number> = {};
    (bySector || []).forEach((c: any) => { sMap[c.sector] = (sMap[c.sector] || 0) + 1; });
    const sectorBar = Object.entries(SECTOR_CFG).map(([k, v]) => ({ name: v.label, count: sMap[k] || 0, color: v.color, icon: v.icon }));

    // Inscriptions 30j
    const { data: last30 } = await supabase.from("companies").select("created_at").gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString()).order("created_at");
    const dMap: Record<string, number> = {};
    (last30 || []).forEach((c: any) => { const d = new Date(c.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }); dMap[d] = (dMap[d] || 0) + 1; });
    const growthData = Object.entries(dMap).map(([date, count]) => ({ date, count }));

    // Leads par semaine 8s
    const { data: leadsWeek } = await supabase.from("leads").select("created_at, status").gte("created_at", new Date(Date.now() - 56 * 86400000).toISOString());
    const wMap: Record<string, { total: number; converted: number }> = {};
    (leadsWeek || []).forEach((l: any) => {
      const wDate = new Date(l.created_at);
      const weekKey = `S${Math.floor((Date.now() - wDate.getTime()) / (7 * 86400000)) + 1}`;
      if (!wMap[weekKey]) wMap[weekKey] = { total: 0, converted: 0 };
      wMap[weekKey].total++;
      if (l.status === "converted") wMap[weekKey].converted++;
    });
    const leadsData = Object.entries(wMap).reverse().slice(0, 6).map(([name, v]) => ({ name, ...v }));

    // Récentes entreprises
    const { data: recent } = await supabase.from("companies").select("id,name,sector,status,city,country,activated_at,created_at").order("created_at", { ascending: false }).limit(6);

    setStats({
      total: total.count || 0,
      active: active.count || 0,
      thisMonth: thisMonth.count || 0,
      lastMonth: lastMonth.count || 0,
      totalLeads: totalLeads.count || 0,
      weekLeads: weekLeads.count || 0,
      converted: converted.count || 0,
      totalChatbots: totalChatbots.count || 0,
      activeChatbots: activeChatbots.count || 0,
      totalClients: (totalClients as any)?.count || 0,
      lmLeads: lmLeads.count || 0,
      sectorBar, growthData, leadsData,
    });
    setRecentCompanies(recent || []);
    setCriticalAlerts((alerts.data || []).map((a: any) => ({ ...a, company_name: a.companies?.name || "—" })));
    setLoading(false);
  };

  if (loading) return (
    <AdminLayout currentPath="/admin/dashboard">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {Array(8).fill(0).map((_, i) => <div key={i} style={{ height: 110, background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, animation: "pulse 1.5s ease-in-out infinite" }} />)}
      </div>
    </AdminLayout>
  );

  const convRate = stats.totalLeads > 0 ? `${Math.round((stats.converted / stats.totalLeads) * 100)}%` : "—";
  const compTrend = stats.lastMonth > 0 ? `${stats.thisMonth >= stats.lastMonth ? "+" : ""}${Math.round(((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100)}%` : undefined;
  const leadTrend = stats.lmLeads > 0 ? `${stats.weekLeads >= stats.lmLeads / 4 ? "+" : ""}${Math.round(((stats.weekLeads - stats.lmLeads / 4) / (stats.lmLeads / 4)) * 100)}%` : undefined;

  return (
    <AdminLayout currentPath="/admin/dashboard">
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <KPI icon={Building2}    label="Entreprises"        value={fmt(stats.total)}           color="#6B3FA0" sub={`${stats.active} actives · +${stats.thisMonth} ce mois`} trend={compTrend} up={stats.thisMonth >= stats.lastMonth} />
        <KPI icon={Users}        label="Leads actifs"       value={fmt(stats.totalLeads)}      color="#1D7F42" sub={`+${stats.weekLeads} cette semaine · conv. ${convRate}`} trend={leadTrend} up />
        <KPI icon={MessageSquare}label="Chatbots déployés"  value={stats.totalChatbots}        color="#0B6BCB" sub={`${stats.activeChatbots} actifs`} />
        <KPI icon={Globe}        label="Clients totaux"     value={fmt(stats.totalClients)}    color="#B35000" sub="Toutes entreprises confondues" />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Inscriptions 30j */}
        <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Inscriptions — 30 jours</div>
            <div style={{ fontSize: 12, color: "#AFAFAC" }}>{stats.growthData.length} jours d'activité</div>
          </div>
          {stats.growthData.length === 0
            ? <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#AFAFAC", fontSize: 13 }}>Pas encore de données</div>
            : <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={stats.growthData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6B3FA0" stopOpacity={0.15} /><stop offset="95%" stopColor="#6B3FA0" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F1EF" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#AFAFAC" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#AFAFAC" }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<CTT />} />
                  <Area type="monotone" dataKey="count" stroke="#6B3FA0" strokeWidth={2.5} fill="url(#g1)" name="Inscriptions" />
                </AreaChart>
              </ResponsiveContainer>}
        </div>

        {/* Répartition secteurs */}
        <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Répartition sectorielle</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {stats.sectorBar.map((s: any) => {
              const maxCount = Math.max(...stats.sectorBar.map((x: any) => x.count), 1);
              return (
                <div key={s.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#787774", display: "flex", alignItems: "center", gap: 5 }}>
                      <SectorIcon name={s.icon} size={14} color={s.color} />{s.name}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.count}</span>
                  </div>
                  <div style={{ height: 5, background: "#F1F1EF", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: s.color, borderRadius: 3, width: `${(s.count / maxCount) * 100}%`, transition: "width 0.4s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Leads par semaine */}
        <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Leads — 8 semaines</div>
          {stats.leadsData.length === 0
            ? <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: "#AFAFAC", fontSize: 13 }}>Pas encore de données</div>
            : <ResponsiveContainer width="100%" height={160}>
                <BarChart data={stats.leadsData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F1EF" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#AFAFAC" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#AFAFAC" }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CTT />} />
                  <Bar dataKey="total" fill="#1D7F42" radius={[4, 4, 0, 0]} name="Total" />
                  <Bar dataKey="converted" fill="#B35000" radius={[4, 4, 0, 0]} name="Convertis" />
                </BarChart>
              </ResponsiveContainer>}
        </div>

        {/* Alertes critiques */}
        <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Alertes actives</div>
            <a href="/admin/alerts" style={{ fontSize: 12, color: "#6B3FA0", fontWeight: 600, textDecoration: "none" }}>Voir tout →</a>
          </div>
          {criticalAlerts.length === 0
            ? <div style={{ padding: "24px 0", textAlign: "center" }}>
                <CheckCircle size={28} color="#BBF7D0" style={{ marginBottom: 8 }} />
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>Aucune alerte</div>
                <div style={{ fontSize: 12, color: "#787774" }}>Tout est en ordre 👍</div>
              </div>
            : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {criticalAlerts.map(a => {
                  const sev = SEVERITY_CFG[a.severity] || SEVERITY_CFG.info;
                  return (
                    <div key={a.id} style={{ display: "flex", gap: 10, padding: "10px 12px", background: sev.bg, borderRadius: 9, border: `1px solid ${sev.dot}22` }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: sev.dot, marginTop: 5, flexShrink: 0, ...(a.severity === "critical" ? { boxShadow: `0 0 6px ${sev.dot}` } : {}) }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#1A1A1A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                        <div style={{ fontSize: 11, color: "#787774" }}>{a.company_name} · {fmtRel(a.created_at)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>}
        </div>
      </div>

      {/* Activations récentes */}
      <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F1EF", display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Dernières inscriptions</div>
          <a href="/admin/companies" style={{ fontSize: 12, color: "#6B3FA0", fontWeight: 600, textDecoration: "none" }}>Voir toutes →</a>
        </div>
        {recentCompanies.map((c, i) => {
          const s = SECTOR_CFG[c.sector] || { icon: "Building2", color: "#787774", label: c.sector };
          const st = STATUS_COMPANY[c.status] || STATUS_COMPANY.pending;
          return (
            <a key={c.id} href={`/admin/companies/${c.id}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: i < recentCompanies.length - 1 ? "1px solid #F7F7F5" : "none", textDecoration: "none", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: `${s.color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><SectorIcon name={s.icon} size={18} color={s.color} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "#787774" }}>{s.label} · {[c.city, c.country].filter(Boolean).join(", ") || "—"}</div>
              </div>
              <Tag {...st} />
              <div style={{ fontSize: 11, color: "#AFAFAC", minWidth: 50, textAlign: "right" }}>{fmtRel(c.created_at)}</div>
            </a>
          );
        })}
      </div>
    </AdminLayout>
  );
}
