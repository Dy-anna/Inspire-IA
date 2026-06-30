// src/pages/AnalyticsPage.tsx
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart2, RefreshCw, TrendingUp, Users, MessageCircle, ShoppingBag } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import ExportStatsButtons from "@/components/ExportStatsButtons";
import type { StatsSection } from "@/lib/exportStats";

const SECTOR_COLOR: Record<string, string> = {
  restaurant:     "#B35000",
  real_estate:    "#1D7F42",
  travel_agency:  "#0B6BCB",
  private_school: "#6B3FA0",
  private_clinic: "#C0392B",
  hotel:          "#FF6B35",
  event:          "#F59E0B",
};
const PIE_COLORS = ["#2383E2","#1D7F42","#B35000","#6B3FA0","#C0392B","#0891B2"];
const fmt = (n: number) => Math.round(n).toLocaleString("fr-FR");

export default function AnalyticsPage() {
  const { user } = useAuth();
  const cid = user?.company_id || "";
  const sector = user?.sector || "restaurant";
  const color = SECTOR_COLOR[sector] || "#2383E2";

  const [period, setPeriod] = useState<"7d"|"30d"|"3m">("30d");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const now = new Date();
    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const pStart = new Date(now.getTime() - days * 86400000).toISOString();

    // Clients par jour
    const { data: clientsRaw } = await supabase.from("clients").select("created_at").eq("company_id", cid).gte("created_at", pStart);
    const clientsByDay: Record<string, number> = {};
    (clientsRaw || []).forEach((c: any) => {
      const d = c.created_at.split("T")[0];
      clientsByDay[d] = (clientsByDay[d] || 0) + 1;
    });
    const clientsChart = Object.entries(clientsByDay).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }), count,
    }));

    // Chat sessions
    const { data: chatRaw } = await supabase.from("chat_sessions").select("created_at,status").eq("company_id", cid).gte("created_at", pStart);
    const chatByDay: Record<string, number> = {};
    (chatRaw || []).forEach((c: any) => {
      const d = c.created_at.split("T")[0];
      chatByDay[d] = (chatByDay[d] || 0) + 1;
    });
    const chatChart = Object.entries(chatByDay).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }), count,
    }));

    // KPIs
    const { count: totalClients } = await supabase.from("clients").select("id", { count: "exact", head: true }).eq("company_id", cid);
    const { count: totalSessions } = await supabase.from("chat_sessions").select("id", { count: "exact", head: true }).eq("company_id", cid);
    const { count: newClients } = await supabase.from("clients").select("id", { count: "exact", head: true }).eq("company_id", cid).gte("created_at", pStart);
    const { count: newSessions } = await supabase.from("chat_sessions").select("id", { count: "exact", head: true }).eq("company_id", cid).gte("created_at", pStart);

    // Données secteur
    let sectorChart: any[] = [];
    let sectorRevenue = 0;
    let sectorLabel = "Activité";
    let statusBreakdown: { name: string; value: number }[] = [];
    let channelBreakdown: { name: string; value: number }[] = [];

    if (sector === "restaurant") {
      const { data: ordersRaw } = await supabase.from("orders").select("total_amount,status,created_at,channel").eq("company_id", cid).gte("created_at", pStart);
      const byDay: Record<string, { revenue: number; orders: number }> = {};
      const byStatus: Record<string, number> = {};
      const byChannel: Record<string, number> = {};
      (ordersRaw || []).forEach((o: any) => {
        const d = o.created_at.split("T")[0];
        if (!byDay[d]) byDay[d] = { revenue: 0, orders: 0 };
        byDay[d].revenue += Number(o.total_amount);
        byDay[d].orders += 1;
        byStatus[o.status] = (byStatus[o.status] || 0) + 1;
        if (o.channel) byChannel[o.channel] = (byChannel[o.channel] || 0) + 1;
      });
      sectorChart = Object.entries(byDay).map(([date, v]) => ({
        date: new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }), ...v,
      }));
      sectorRevenue = (ordersRaw || []).filter((o: any) => o.status !== "cancelled").reduce((s: number, o: any) => s + Number(o.total_amount), 0);
      sectorLabel = "CA (XOF)";
      statusBreakdown = Object.entries(byStatus).map(([name, value]) => ({ name, value }));
      channelBreakdown = Object.entries(byChannel).map(([name, value]) => ({ name, value }));
    } else if (sector === "travel_agency") {
      const { data: bookingsRaw } = await supabase.from("trip_bookings").select("total_amount,status,created_at").eq("company_id", cid).gte("created_at", pStart);
      const byDay: Record<string, number> = {};
      const byStatus: Record<string, number> = {};
      (bookingsRaw || []).forEach((b: any) => {
        const d = b.created_at.split("T")[0];
        byDay[d] = (byDay[d] || 0) + 1;
        byStatus[b.status] = (byStatus[b.status] || 0) + 1;
      });
      sectorChart = Object.entries(byDay).map(([date, count]) => ({
        date: new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }), count,
      }));
      sectorRevenue = (bookingsRaw || []).reduce((s: number, b: any) => s + Number(b.total_amount), 0);
      sectorLabel = "Réservations";
      statusBreakdown = Object.entries(byStatus).map(([name, value]) => ({ name, value }));
    } else if (sector === "private_clinic") {
      const { data: apptsRaw } = await supabase.from("appointments").select("appointment_date,status,created_at").eq("company_id", cid).gte("created_at", pStart);
      const byDay: Record<string, number> = {};
      const byStatus: Record<string, number> = {};
      (apptsRaw || []).forEach((a: any) => {
        byDay[a.appointment_date] = (byDay[a.appointment_date] || 0) + 1;
        byStatus[a.status] = (byStatus[a.status] || 0) + 1;
      });
      sectorChart = Object.entries(byDay).map(([date, count]) => ({
        date: new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }), count,
      }));
      sectorLabel = "Rendez-vous";
      statusBreakdown = Object.entries(byStatus).map(([name, value]) => ({ name, value }));
    } else if (sector === "real_estate") {
      const { data: leadsRaw } = await supabase.from("property_leads").select("pipeline_stage,lead_type,created_at,budget_max").eq("company_id", cid).gte("created_at", pStart);
      const STAGES: Record<string, string> = {
        new: "Nouveau", contacted: "Contacté", qualified: "Qualifié",
        visit: "Visite", offer_made: "Offre faite", negotiating: "Négociation",
        closed_won: "Gagné", closed_lost: "Perdu",
      };
      const byDay: Record<string, number> = {};
      const byStage: Record<string, number> = Object.keys(STAGES).reduce((a, k) => ({ ...a, [k]: 0 }), {});
      const byType: Record<string, number> = {};
      (leadsRaw || []).forEach((l: any) => {
        const d = l.created_at.split("T")[0];
        byDay[d] = (byDay[d] || 0) + 1;
        byStage[l.pipeline_stage] = (byStage[l.pipeline_stage] || 0) + 1;
        if (l.lead_type) byType[l.lead_type] = (byType[l.lead_type] || 0) + 1;
      });
      sectorChart = Object.entries(byDay).map(([date, count]) => ({
        date: new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }), count,
      }));
      sectorLabel = "Leads immobilier";
      statusBreakdown = Object.entries(byStage).map(([k, value]) => ({ name: STAGES[k] || k, value }));
      channelBreakdown = Object.entries(byType).map(([name, value]) => ({ name, value }));
    }

    // Activité horaire (chat_messages par heure de la journée)
    const { data: msgsRaw } = await supabase.from("chat_messages").select("created_at").eq("company_id", cid).gte("created_at", pStart);
    const byHour: Record<number, number> = {};
    for (let h = 0; h < 24; h++) byHour[h] = 0;
    (msgsRaw || []).forEach((m: any) => {
      const h = new Date(m.created_at).getHours();
      byHour[h] = (byHour[h] || 0) + 1;
    });
    const hourlyChart = Object.entries(byHour).map(([h, v]) => ({ hour: `${h}h`, count: v }));

    // Cumul clients
    const sortedDates = Object.keys(clientsByDay).sort();
    let acc = 0;
    const cumulativeClients = sortedDates.map(d => {
      acc += clientsByDay[d];
      return { date: new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }), total: acc };
    });

    setData({ clientsChart, chatChart, sectorChart, totalClients: totalClients||0, totalSessions: totalSessions||0, newClients: newClients||0, newSessions: newSessions||0, sectorRevenue, sectorLabel, statusBreakdown, channelBreakdown, hourlyChart, cumulativeClients });
    setLoading(false);
  }, [cid, period, sector]);


  useEffect(() => { load(); }, [load]);

  const getSections = (): StatsSection[] => {
    if (!data) return [];
    const sections: StatsSection[] = [
      {
        title: `KPIs — ${period === "7d" ? "7 jours" : period === "30d" ? "30 jours" : "3 mois"}`,
        headers: ["Indicateur", "Valeur"],
        rows: [
          ["Clients total", String(data.totalClients)],
          ["Nouveaux clients (période)", String(data.newClients)],
          ["Sessions chat total", String(data.totalSessions)],
          ["Nouvelles sessions (période)", String(data.newSessions)],
          [data.sectorLabel, String(data.sectorChart.reduce((s: number, r: any) => s + (r.count || r.orders || 0), 0))],
          ["Revenu / CA (XOF)", data.sectorRevenue > 0 ? fmt(data.sectorRevenue) : "—"],
        ],
      },
    ];
    if (sector === "real_estate") {
      sections.push({
        title: "Pipeline",
        headers: ["Étape", "Nombre"],
        rows: data.statusBreakdown.map((r: any) => [r.name, String(r.value)]),
      });
      const periodLabel = period === "7d" ? "7 jours" : period === "30d" ? "30 jours" : "3 mois";
      sections.push({
        title: `Nouveaux leads — ${periodLabel}`,
        headers: ["Date", "Leads"],
        rows: data.sectorChart.map((r: any) => [String(r.date), String(r.count ?? 0)]),
      });
    } else {
      if (data.statusBreakdown?.length) {
        sections.push({
          title: "Répartition par statut",
          headers: ["Statut", "Nombre"],
          rows: data.statusBreakdown.map((r: any) => [r.name, String(r.value)]),
        });
      }
      if (data.sectorChart.length) {
        const keys = Object.keys(data.sectorChart[0]);
        sections.push({
          title: `${data.sectorLabel} par jour`,
          headers: keys,
          rows: data.sectorChart.map((r: any) => keys.map(k => String(r[k] ?? ""))),
        });
      }
    }
    if (data.chatChart.length) {
      sections.push({
        title: "Sessions WhatsApp par jour",
        headers: ["Date", "Sessions"],
        rows: data.chatChart.map((r: any) => [r.date, String(r.count)]),
      });
    }
    if (data.clientsChart.length) {
      sections.push({
        title: "Nouveaux clients par jour",
        headers: ["Date", "Clients"],
        rows: data.clientsChart.map((r: any) => [r.date, String(r.count)]),
      });
    }
    return sections;
  };

  const CTT = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ fontSize: 12, color: "#787774", display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: p.color }} />
            {p.name}: <strong style={{ color: "#1A1A1A" }}>{typeof p.value === "number" && p.dataKey === "revenue" ? `${fmt(p.value)} XOF` : p.value}</strong>
          </div>
        ))}
      </div>
    );
  };

  const Skeleton = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
      {[...Array(4)].map((_, i) => <div key={i} style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, height: 110, animation: "pulse 1.5s ease-in-out infinite" }} />)}
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>Analytics</h1>
          <p style={{ fontSize: 13, color: "#787774", margin: "3px 0 0" }}>Statistiques et performances</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Period selector */}
          <div style={{ display: "flex", gap: 4, background: "#F7F7F5", padding: 4, borderRadius: 8 }}>
            {(["7d","30d","3m"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding: "5px 12px", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600,
                background: period===p?"#fff":"transparent", color: period===p?"#1A1A1A":"#787774",
                cursor: "pointer", fontFamily: "inherit", boxShadow: period===p?"0 1px 4px rgba(0,0,0,0.08)":"none",
              }}>{p==="7d"?"7 j":p==="30d"?"30 j":"3 mois"}</button>
            ))}
          </div>
          <button onClick={load} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", background: "#fff", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 13, cursor: "pointer", color: "#787774", fontFamily: "inherit" }}>
            <RefreshCw size={13} />
          </button>
          <ExportStatsButtons title="Analytics" filenameBase={`inspire-ia-analytics-${period}`} getSections={getSections} disabled={!data} />

        </div>
      </div>

      {loading ? <Skeleton /> : !data ? null : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {[
              { icon: Users, label: "Clients total", value: fmt(data.totalClients), sub: `+${data.newClients} sur la période`, color: "#6B3FA0" },
              { icon: MessageCircle, label: "Sessions chat", value: fmt(data.totalSessions), sub: `+${data.newSessions} sur la période`, color: "#0B6BCB" },
              { icon: ShoppingBag, label: data.sectorLabel, value: data.sectorChart.reduce((s: number, r: any) => s + (r.count || r.orders || 0), 0), sub: "Sur la période", color },
              { icon: TrendingUp, label: "Revenu / CA", value: data.sectorRevenue > 0 ? `${fmt(data.sectorRevenue)} XOF` : "—", sub: "Sur la période", color: "#1D7F42" },
            ].map(({ icon: Icon, label, value, sub, color: c }) => (
              <div key={label} style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, padding: "18px 20px", borderTop: `3px solid ${c}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#787774" }}>{label}</span>
                  <div style={{ width: 30, height: 30, borderRadius: 7, background: `${c}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={14} color={c} />
                  </div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#1A1A1A", margin: "8px 0 4px" }}>{value}</div>
                <div style={{ fontSize: 11, color: "#AFAFAC" }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Charts row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
            <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
                {data.sectorLabel} — {period==="7d"?"7 jours":period==="30d"?"30 jours":"3 mois"}
              </div>
              {data.sectorChart.length === 0 ? (
                <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#AFAFAC", fontSize: 13 }}>Pas encore de données</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={data.sectorChart} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F1EF" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#AFAFAC" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#AFAFAC" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CTT />} />
                    <Area type="monotone" dataKey={data.sectorChart[0]?.revenue !== undefined ? "revenue" : "count"} stroke={color} strokeWidth={2.5} fill="url(#sGrad)" name={data.sectorLabel} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Sessions WhatsApp</div>
              {data.chatChart.length === 0 ? (
                <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#AFAFAC", fontSize: 13 }}>Pas encore de données</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.chatChart} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F1EF" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#AFAFAC" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#AFAFAC" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CTT />} />
                    <Bar dataKey="count" fill="#128C7E" radius={[3,3,0,0]} name="Sessions" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Clients chart */}
          <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Nouveaux clients</div>
            {data.clientsChart.length === 0 ? (
              <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", color: "#AFAFAC", fontSize: 13 }}>Pas encore de données</div>
            ) : (
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={data.clientsChart} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F1EF" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#AFAFAC" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#AFAFAC" }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CTT />} />
                  <Bar dataKey="count" fill="#6B3FA0" radius={[3,3,0,0]} name="Clients" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Row: Status pie + Hourly activity */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14 }}>
            <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Répartition par statut</div>
              {data.statusBreakdown.length === 0 ? (
                <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "#AFAFAC", fontSize: 13 }}>Pas encore de données</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={data.statusBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2}>
                      {data.statusBreakdown.map((_: any, i: number) => (<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />))}
                    </Pie>
                    <Tooltip content={<CTT />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {data.statusBreakdown.map((s: any, i: number) => (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#787774" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[i % PIE_COLORS.length] }} />{s.name} ({s.value})
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Activité par heure (messages)</div>
              {(data.hourlyChart || []).every((h: any) => h.count === 0) ? (
                <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "#AFAFAC", fontSize: 13 }}>Pas encore de données</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.hourlyChart} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F1EF" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#AFAFAC" }} tickLine={false} axisLine={false} interval={1} />
                    <YAxis tick={{ fontSize: 11, fill: "#AFAFAC" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CTT />} />
                    <Bar dataKey="count" fill={color} radius={[3,3,0,0]} name="Messages" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Row: Cumulative growth + Channel breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
            <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Croissance cumulée des clients</div>
              {(data.cumulativeClients || []).length === 0 ? (
                <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#AFAFAC", fontSize: 13 }}>Pas encore de données</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data.cumulativeClients} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F1EF" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#AFAFAC" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#AFAFAC" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CTT />} />
                    <Line type="monotone" dataKey="total" stroke="#1D7F42" strokeWidth={2.5} dot={{ r: 3 }} name="Total" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Répartition par canal/type</div>
              {(data.channelBreakdown || []).length === 0 ? (
                <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#AFAFAC", fontSize: 13 }}>Pas encore de données</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={data.channelBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75}>
                      {data.channelBreakdown.map((_: any, i: number) => (<Cell key={i} fill={PIE_COLORS[(i+2) % PIE_COLORS.length]} />))}
                    </Pie>
                    <Tooltip content={<CTT />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
