// src/pages/DashboardPage.tsx
// Zéro useNavigate, zéro Link — uniquement <a href> pour éviter tout problème de contexte Router
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  ShoppingBag, Users, MessageCircle, BarChart2,
  ArrowRight, Calendar, Package, TrendingUp, Plane, Heart,
  GraduationCap, Home, Clock
} from "lucide-react";

const SECTOR_CONFIG: Record<string, { label: string; color: string; crmLabel: string }> = {
  restaurant:     { label: "Restaurant",     color: "#B35000", crmLabel: "Voir les commandes" },
  real_estate:    { label: "Immobilier",     color: "#1D7F42", crmLabel: "Voir les leads" },
  travel_agency:  { label: "Agence Voyage",  color: "#0B6BCB", crmLabel: "Voir les réservations" },
  private_school: { label: "École privée",   color: "#6B3FA0", crmLabel: "Voir les élèves" },
  private_clinic: { label: "Clinique",       color: "#C0392B", crmLabel: "Voir l'agenda" },
  hotel:          { label: "Hôtellerie",     color: "#FF6B35", crmLabel: "Voir les chambres" },
  event:          { label: "Événementiel",   color: "#F59E0B", crmLabel: "Voir les événements" },
};

const fmt = (n: number) => Math.round(n).toLocaleString("fr-FR");

const avColor = (s: string) => {
  const colors = ["#2383E2","#1D7F42","#B35000","#C0392B","#6B3FA0"];
  return colors[(s?.charCodeAt(0) || 0) % colors.length];
};

const initials = (n: string) =>
  (n || "?").split(" ").map((x: string) => x[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

const fmtRel = (iso: string) => {
  const d = Date.now() - new Date(iso).getTime();
  if (d < 60000) return "À l'instant";
  if (d < 3600000) return `${Math.floor(d / 60000)} min`;
  if (d < 86400000) return `${Math.floor(d / 3600000)} h`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
};

// Lien sans React Router — compatible Lovable
function NavLink({ href, children, style }: { href: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <a href={href} style={{ textDecoration: "none", color: "inherit", display: "block", ...style }}>
      {children}
    </a>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);

  const sector = user?.sector || "restaurant";
  const sectorCfg = SECTOR_CONFIG[sector] || SECTOR_CONFIG.restaurant;
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  useEffect(() => {
    if (!user?.company_id) return;
    loadStats();
    loadSessions();
  }, [user?.company_id]);

  const loadStats = async () => {
    const cid = user!.company_id;
    const todayStr = new Date().toISOString().split("T")[0];
    const s: any = {};

    const { count: clientsCount } = await supabase
      .from("clients").select("id", { count: "exact", head: true }).eq("company_id", cid);
    s.clients = clientsCount || 0;

    const { count: chatCount } = await supabase
      .from("chat_sessions").select("id", { count: "exact", head: true })
      .eq("company_id", cid).eq("status", "active");
    s.activeSessions = chatCount || 0;

    if (sector === "restaurant") {
      const { count: orders } = await supabase.from("orders").select("id", { count: "exact", head: true })
        .eq("company_id", cid).gte("created_at", todayStr).neq("status", "cancelled");
      const { data: rev } = await supabase.from("orders").select("total_amount")
        .eq("company_id", cid).eq("payment_status", "paid").gte("created_at", todayStr);
      s.main = orders || 0;
      s.mainLabel = "Commandes auj.";
      s.revenue = (rev || []).reduce((acc: number, o: any) => acc + Number(o.total_amount), 0);
    } else if (sector === "travel_agency") {
      const { count: bookings } = await supabase.from("trip_bookings").select("id", { count: "exact", head: true })
        .eq("company_id", cid).in("status", ["confirmed", "deposit_paid", "fully_paid"]);
      s.main = bookings || 0; s.mainLabel = "Réservations actives";
    } else if (sector === "real_estate") {
      const { count: leads } = await supabase.from("property_leads").select("id", { count: "exact", head: true })
        .eq("company_id", cid).eq("pipeline_stage", "new");
      s.main = leads || 0; s.mainLabel = "Nouveaux leads";
    } else if (sector === "private_school") {
      const { count: students } = await supabase.from("students").select("id", { count: "exact", head: true })
        .eq("company_id", cid).eq("status", "active");
      s.main = students || 0; s.mainLabel = "Élèves actifs";
    } else if (sector === "private_clinic") {
      const { count: appts } = await supabase.from("appointments").select("id", { count: "exact", head: true })
        .eq("company_id", cid).eq("appointment_date", todayStr);
      s.main = appts || 0; s.mainLabel = "RDV aujourd'hui";
    } else if (sector === "hotel") {
      const { count: bookings } = await supabase.from("hotel_bookings").select("id", { count: "exact", head: true })
        .eq("company_id", cid).in("status", ["confirmed", "checked_in"]);
      s.main = bookings || 0; s.mainLabel = "Réservations actives";
    } else if (sector === "event") {
      const { count: events } = await supabase.from("events").select("id", { count: "exact", head: true })
        .eq("company_id", cid).in("status", ["planned", "ongoing"]);
      const { data: rev } = await supabase.from("event_revenues").select("amount").eq("company_id", cid)
        .gte("recorded_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
      const { data: exp } = await supabase.from("event_expenses").select("amount").eq("company_id", cid)
        .gte("paid_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
      s.main = events || 0; s.mainLabel = "Événements à venir";
      s.revenue = (rev || []).reduce((acc: number, r: any) => acc + Number(r.amount), 0);
      s.expenses = (exp || []).reduce((acc: number, e: any) => acc + Number(e.amount), 0);
      s.profit = s.revenue - s.expenses;
    }

    setStats(s);
  };

  const loadSessions = async () => {
    const { data } = await supabase
      .from("chat_sessions")
      .select("id,client_name,client_phone,last_message_at,status")
      .eq("company_id", user!.company_id)
      .order("last_message_at", { ascending: false })
      .limit(5);
    setSessions(data || []);
  };

  const kpis = stats ? [
    { label: stats.mainLabel || "Activité", value: stats.main ?? 0, color: sectorCfg.color, href: "/app/crm" },
    ...(stats.revenue != null && sector !== "event"
      ? [{ label: "CA du jour", value: `${fmt(stats.revenue)} XOF`, color: "#1D7F42", href: "/app/crm" }]
      : []),
    ...(sector === "event" && stats.revenue != null
      ? [
          { label: "Revenus du mois", value: `${fmt(stats.revenue)} XOF`, color: "#27AE60", href: "/app/crm" },
          { label: "Bénéfice net",    value: `${fmt(stats.profit || 0)} XOF`, color: stats.profit >= 0 ? "#27AE60" : "#E74C3C", href: "/app/crm" },
        ]
      : []),
    { label: "Clients total", value: fmt(stats.clients), color: "#6B3FA0", href: "/app/clients" },
    { label: "Sessions chat",  value: stats.activeSessions, color: "#0B6BCB", href: "/app/chatbox" },
  ].slice(0, 4) : [];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>
            Bonjour, {user?.full_name?.split(" ")[0]} 👋
          </h1>
          <p style={{ fontSize: 13, color: "#787774", margin: "4px 0 0", textTransform: "capitalize" }}>{today}</p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: `${sectorCfg.color}14`, border: `1px solid ${sectorCfg.color}30`,
          borderRadius: 8, padding: "8px 14px",
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: sectorCfg.color }}>{sectorCfg.label}</span>
        </div>
      </div>

      {/* KPI cards */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
          {kpis.map(({ label, value, color, href }) => (
            <a key={label} href={href} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10,
                padding: "18px 20px", borderTop: `3px solid ${color}`, cursor: "pointer",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#787774" }}>{label}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#1A1A1A", marginTop: 8, lineHeight: 1 }}>{value}</div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Shortcut row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        {/* CRM */}
        <a href="/app/crm" style={{ textDecoration: "none" }}>
          <div style={{
            background: "#1A1A1A", borderRadius: 12, padding: "24px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer", transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#333")}
          onMouseLeave={e => (e.currentTarget.style.background = "#1A1A1A")}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{sectorCfg.crmLabel}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Ouvrir votre CRM {sectorCfg.label}</div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowRight size={18} color="#fff" />
            </div>
          </div>
        </a>

        {/* Chatbox */}
        <a href="/app/chatbox" style={{ textDecoration: "none" }}>
          <div style={{
            background: "linear-gradient(135deg, #128C7E, #075E54)", borderRadius: 12, padding: "24px",
            display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Chatbox WhatsApp</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                {stats?.activeSessions
                  ? `${stats.activeSessions} conversation${stats.activeSessions > 1 ? "s" : ""} active${stats.activeSessions > 1 ? "s" : ""}`
                  : "Aucune session active"}
              </div>
            </div>
            <MessageCircle size={28} color="#fff" style={{ opacity: 0.8 }} />
          </div>
        </a>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

        {/* Dernières conversations */}
        <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E8E8E5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>Dernières conversations</span>
            <a href="/app/chatbox" style={{ fontSize: 12, color: "#2383E2", textDecoration: "none", fontWeight: 500 }}>Tout voir →</a>
          </div>
          {sessions.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "#AFAFAC", fontSize: 13 }}>
              Aucune conversation
            </div>
          ) : sessions.map(s => (
            <a key={s.id} href="/app/chatbox" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 20px", borderBottom: "1px solid #F7F7F5", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#F7F7F5")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div style={{ position: "relative" }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: avColor(s.client_phone), color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700,
                  }}>
                    {initials(s.client_name || s.client_phone)}
                  </div>
                  {s.status === "active" && (
                    <div style={{ position: "absolute", bottom: 1, right: 1, width: 8, height: 8, borderRadius: "50%", background: "#15803D", border: "1.5px solid #fff" }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.client_name || s.client_phone}
                  </div>
                  <div style={{ fontSize: 11, color: "#AFAFAC" }}>{s.client_phone}</div>
                </div>
                <div style={{ fontSize: 11, color: "#AFAFAC", flexShrink: 0 }}>{fmtRel(s.last_message_at)}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Raccourcis */}
        <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E8E8E5" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>Raccourcis</span>
          </div>
          <div style={{ padding: "8px" }}>
            {[
              { icon: BarChart2, label: "Analytics",  sub: "Rapports et statistiques",    href: "/app/analytics", color: "#2383E2" },
              { icon: Package,   label: "Catalogue",  sub: "Gérer vos produits/services", href: "/app/catalogue", color: "#B35000" },
              { icon: Users,     label: "Équipe",     sub: "Membres et accès",            href: "/app/team",      color: "#6B3FA0" },
              { icon: Clock,     label: "Paramètres", sub: "Configuration et WhatsApp",   href: "/app/settings",  color: "#787774" },
            ].map(({ icon: Icon, label, sub, href, color }) => (
              <a key={label} href={href} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F7F7F5")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={16} color={color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{label}</div>
                    <div style={{ fontSize: 11, color: "#AFAFAC" }}>{sub}</div>
                  </div>
                  <ArrowRight size={14} color="#AFAFAC" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
