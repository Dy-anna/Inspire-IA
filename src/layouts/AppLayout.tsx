import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { isDemoMode, setDemoMode } from "@/lib/supabase";
import {
  LayoutDashboard,
  ShoppingBag,
  Home,
  Plane,
  Users,
  Calendar,
  UserCheck,
  Package,
  MessageCircle,
  BarChart2,
  UserPlus,
  Settings,
  LogOut,
  Hotel,
  CalendarCheck,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SECTOR_LABELS } from "@/design/tokens";

const SECTOR_CRM = {
  restaurant:     { label: "Commandes",      icon: ShoppingBag },
  real_estate:    { label: "Leads et biens", icon: Home },
  travel_agency:  { label: "Réservations",   icon: Plane },
  private_school: { label: "Élèves",         icon: Users },
  private_clinic: { label: "Patients et RDV",icon: Calendar },
  hotel:          { label: "Chambres",       icon: Hotel },
  event:          { label: "Événements",     icon: CalendarCheck },
} as const;

const PAGE_TITLES: Record<string, string> = {
  "/app/dashboard": "Tableau de bord",
  "/app/crm": "CRM",
  "/app/clients": "Clients",
  "/app/catalogue": "Catalogue",
  "/app/chatbox": "Chatbox WhatsApp",
  "/app/analytics": "Analytics",
  "/app/team": "Équipe",
  "/app/settings": "Paramètres",
};

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const sector = (user?.sector || "restaurant") as keyof typeof SECTOR_CRM;
  const crm = SECTOR_CRM[sector] ?? SECTOR_CRM.restaurant;
  const CrmIcon = crm.icon;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const navItems = [
    { to: "/app/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { to: "/app/crm", icon: CrmIcon, label: crm.label },
    { to: "/app/clients", icon: UserCheck, label: "Clients" },
    { to: "/app/catalogue", icon: Package, label: "Catalogue" },
    { to: "/app/chatbox", icon: MessageCircle, label: "Chatbox" },
    { to: "/app/analytics", icon: BarChart2, label: "Analytics" },
    { to: "/app/team", icon: UserPlus, label: "Équipe" },
    { to: "/app/settings", icon: Settings, label: "Paramètres" },
  ] as const;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F7F7F5" }}>
      <aside
        style={{
          width: 220,
          background: "#1C1F3B",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          zIndex: 100,
        }}
      >
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            {user?.logo_url && (
              <img
                src={user.logo_url}
                alt={user?.company_name || "Logo"}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  objectFit: "cover",
                  background: "rgba(255,255,255,0.06)",
                  flexShrink: 0,
                }}
              />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  color: "#fff",
                  textTransform: "uppercase",
                  lineHeight: 1.2,
                }}
              >
                Inspire IA
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  lineHeight: 1.2,
                }}
              >
                {user?.company_name}
              </div>
              <div
                style={{
                  display: "inline-block",
                  alignSelf: "flex-start",
                  marginTop: 2,
                  padding: "2px 8px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 100,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.65)",
                  fontWeight: 500,
                }}
              >
                {SECTOR_LABELS[sector]}
              </div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "8px 0" }}>
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 16px",
                  textDecoration: "none",
                  fontSize: 14,
                  color: active ? "#fff" : "rgba(255,255,255,0.5)",
                  background: active ? "rgba(255,255,255,0.1)" : "transparent",
                  fontWeight: active ? 500 : 400,
                  transition: "all 0.1s",
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Avatar name={user?.full_name || ""} src={user?.avatar_url} size={28} />
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#fff",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.full_name}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{user?.role}</div>
            </div>
          </div>
          <button
            onClick={signOut}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.4)",
              fontSize: 13,
              padding: "4px 0",
              fontFamily: "Inter",
              width: "100%",
            }}
          >
            <LogOut size={14} />
            Déconnexion
          </button>
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          marginLeft: 220,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {isDemoMode() && (
          <div style={{
            background: "linear-gradient(90deg, #FFB020 0%, #FF6B35 100%)",
            color: "#1A1A1A",
            padding: "8px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            fontSize: 13,
            fontWeight: 600,
            position: "sticky",
            top: 0,
            zIndex: 60,
          }}>
            <span>🎭 Mode démo — {user?.company_name} · Aucune donnée n'est sauvegardée.</span>
            <div style={{ display: "flex", gap: 8 }}>
              <Link to="/register" style={{ background: "rgba(26,26,26,0.9)", color: "#fff", padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                Créer mon compte
              </Link>
              <button
                onClick={() => { setDemoMode(false); window.location.href = "/"; }}
                style={{ background: "rgba(255,255,255,0.4)", color: "#1A1A1A", padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit" }}
              >
                Quitter la démo
              </button>
            </div>
          </div>
        )}
        <div
          style={{
            height: 52,
            background: "#fff",
            borderBottom: "1px solid #E8E8E5",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>
            {PAGE_TITLES[location.pathname] || "Inspire IA"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }} ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", borderRadius: "50%" }}
              aria-label="Compte"
            >
              <Avatar name={user?.full_name || ""} src={user?.avatar_url} size={30} />
            </button>
            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: 260,
                  background: "#fff",
                  border: "1px solid #E8E8E5",
                  borderRadius: 10,
                  boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                  zIndex: 200,
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: 14, display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #F1F1EF" }}>
                  <Avatar name={user?.full_name || ""} src={user?.avatar_url} size={40} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user?.full_name}
                    </div>
                    <div style={{ fontSize: 11, color: "#787774", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user?.email}
                    </div>
                  </div>
                </div>
                <div style={{ padding: 4 }}>
                  <Link
                    to="/app/settings"
                    onClick={() => setMenuOpen(false)}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", fontSize: 13, color: "#1A1A1A", textDecoration: "none", borderRadius: 6 }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F7F7F5")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <Settings size={14} /> Paramètres du compte
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); signOut(); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", fontSize: 13, color: "#B91C1C", background: "none", border: "none", cursor: "pointer", borderRadius: 6, fontFamily: "inherit", textAlign: "left" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#FEF2F2")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <LogOut size={14} /> Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, padding: "32px" }}>{children}</div>
      </main>
    </div>
  );
}

export default AppLayout;
