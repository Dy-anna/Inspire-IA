// src/pages/admin/AdminLayout.tsx
// Layout admin — vérifie admin_users, sidebar, header

import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard, Building2, Users, AlertTriangle, Zap,
  MessageSquare, Activity, Settings, LogOut, Globe, Bell, ChevronRight
} from "lucide-react";
import inspireLogo from "@/assets/inspire-ia-logo.png";

// ─── Context Admin ──────────────────────────────────────────────────────────────

interface AdminUser { id: string; email: string; full_name: string; role: string; }
const AdminCtx = createContext<{ admin: AdminUser | null; loading: boolean }>({ admin: null, loading: true });
export const useAdmin = () => useContext(AdminCtx);

// ─── Nav items ──────────────────────────────────────────────────────────────────

const NAV = [
  { path: "/admin/dashboard",  label: "Dashboard",       icon: LayoutDashboard },
  { path: "/admin/companies",  label: "Entreprises",     icon: Building2 },
  { path: "/admin/leads",      label: "Leads",           icon: Users },
  { path: "/admin/chatboxes",  label: "Chatboxes",       icon: MessageSquare },
  { path: "/admin/insights",   label: "Insight Engine",  icon: Zap },
  { path: "/admin/alerts",     label: "Alertes",         icon: AlertTriangle },
  { path: "/admin/activity",   label: "Activité",        icon: Activity },
  { path: "/admin/settings",   label: "Paramètres",      icon: Settings },
];

// ─── Guard + Layout ─────────────────────────────────────────────────────────────

export default function AdminLayout({ children, currentPath = "" }: { children: React.ReactNode; currentPath?: string }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertBadge, setAlertBadge] = useState(0);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.replace("/admin/login"); return; }

    const { data } = await supabase.from("admin_users")
      .select("id, email, full_name, role, is_active")
      .eq("id", user.id).single();

    if (!data || !data.is_active) {
      await supabase.auth.signOut();
      window.location.replace("/admin/login");
      return;
    }
    setAdmin({ id: data.id, email: data.email, full_name: data.full_name, role: data.role });

    // Badge alertes non lues
    const { count } = await supabase.from("insight_alerts")
      .select("id", { count: "exact", head: true })
      .eq("is_resolved", false).eq("is_read", false);
    setAlertBadge(count || 0);
    setLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.replace("/admin/login");
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <img src={inspireLogo} alt="Inspire IA" style={{ height: 52, margin: "0 auto 14px", display: "block", objectFit: "contain", filter: "brightness(1.2) contrast(1.25) saturate(1.3) drop-shadow(0 0 10px rgba(245,158,11,0.4)) drop-shadow(0 0 18px rgba(59,130,246,0.35))" }} />
        <div style={{ fontSize: 13, color: "#787774" }}>Vérification des accès...</div>
      </div>
    </div>
  );

  return (
    <AdminCtx.Provider value={{ admin, loading }}>
      <div style={{ minHeight: "100vh", background: "#F7F7F5", display: "flex", fontFamily: "inherit" }}>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>

        {/* ── SIDEBAR ─────────────────────────────────────────── */}
        <div style={{ width: 228, background: "#1C1F3B", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
          {/* Logo */}
          <div style={{ padding: "22px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={inspireLogo} alt="Inspire IA" style={{ width: 38, height: 38, objectFit: "contain", flexShrink: 0, filter: "brightness(1.22) contrast(1.28) saturate(1.3) drop-shadow(0 0 6px rgba(245,158,11,0.45)) drop-shadow(0 0 12px rgba(59,130,246,0.4))" }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>Inspire IA</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{admin?.role || "Admin"}</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
            {NAV.map(({ path, label, icon: Icon }) => {
              const active = currentPath.startsWith(path);
              return (
                <a key={path} href={path} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
                  borderRadius: 9, textDecoration: "none", transition: "all 0.15s",
                  background: active ? "rgba(255,255,255,0.1)" : "transparent",
                  color: active ? "#fff" : "rgba(255,255,255,0.42)",
                  fontSize: 13, fontWeight: active ? 700 : 500, position: "relative",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; (e.currentTarget.style.color = "rgba(255,255,255,0.7)"); }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.42)"; } }}>
                  <Icon size={15} />
                  <span style={{ flex: 1 }}>{label}</span>
                  {label === "Alertes" && alertBadge > 0 && (
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#B91C1C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>
                      {alertBadge > 9 ? "9+" : alertBadge}
                    </div>
                  )}
                  {active && <div style={{ position: "absolute", right: 0, top: "20%", bottom: "20%", width: 3, background: "#6B3FA0", borderRadius: "2px 0 0 2px" }} />}
                </a>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "12px 10px" }}>
            <a href="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 9, color: "rgba(255,255,255,0.28)", textDecoration: "none", fontSize: 12, fontWeight: 600, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.28)"; e.currentTarget.style.background = "transparent"; }}>
              <Globe size={14} />Site public
            </a>
            <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 9, color: "rgba(255,255,255,0.28)", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit", width: "100%", textAlign: "left", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#FCA5A5"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.28)"; e.currentTarget.style.background = "transparent"; }}>
              <LogOut size={14} />Déconnexion
            </button>
          </div>
        </div>

        {/* ── CONTENT ─────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Top bar */}
          <div style={{ background: "#fff", borderBottom: "1px solid #E8E8E5", padding: "0 28px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#AFAFAC" }}>
              <span>Admin</span>
              <ChevronRight size={12} />
              <span style={{ color: "#1A1A1A", fontWeight: 600 }}>
                {NAV.find(n => currentPath.startsWith(n.path))?.label || "Panel"}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {alertBadge > 0 && (
                <a href="/admin/alerts" style={{ position: "relative", textDecoration: "none", padding: 6, borderRadius: 8 }}>
                  <Bell size={17} color="#787774" />
                  <div style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: "50%", background: "#B91C1C", animation: "pulse 2s ease-in-out infinite" }} />
                </a>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #6B3FA0, #C0392B)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{admin?.full_name?.[0] || "A"}</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.1 }}>{admin?.full_name || "Admin"}</div>
                  <div style={{ fontSize: 10, color: "#AFAFAC", textTransform: "uppercase", letterSpacing: "0.06em" }}>{admin?.role}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
            {children}
          </div>
        </div>
      </div>
    </AdminCtx.Provider>
  );
}
