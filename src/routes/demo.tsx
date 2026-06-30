import { createFileRoute, Link } from "@tanstack/react-router";
import { Utensils, Home as HomeIcon, Plane, GraduationCap, Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { setDemoMode } from "@/lib/supabase";
import type { DemoSector } from "@/lib/demoFixtures";

export const Route = createFileRoute("/demo")({ component: DemoPicker });

const SECTORS: { key: DemoSector; icon: any; title: string; desc: string; color: string; company: string }[] = [
  { key: "restaurant",     icon: Utensils,      title: "Restaurant",     desc: "Commandes WhatsApp, menu, livraisons.",         color: "#FF6B35", company: "Le Baobab" },
  { key: "real_estate",    icon: HomeIcon,      title: "Immobilier",     desc: "Pipeline de leads, biens et visites.",          color: "#00C875", company: "Sahel Immo" },
  { key: "travel_agency",  icon: Plane,         title: "Agence Voyage",  desc: "Packages, réservations et acomptes.",           color: "#579BFC", company: "Téranga Travel" },
  { key: "private_school", icon: GraduationCap, title: "École privée",   desc: "Élèves, classes, notes et absences.",           color: "#A25DDC", company: "École Les Palmiers" },
  { key: "private_clinic", icon: Heart,         title: "Clinique",       desc: "Agenda RDV, patients et rappels WhatsApp.",     color: "#E2445C", company: "Clinique Médicis" },
];

function DemoPicker() {
  const launch = (sector: DemoSector) => {
    setDemoMode(true, sector);
    // Hard reload to ensure AuthProvider re-initializes against the demo client.
    window.location.href = "/app/dashboard";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", color: "#fff", padding: "48px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 32 }}>
          <ArrowLeft size={14} /> Retour à l'accueil
        </Link>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(87,155,252,0.12)", border: "1px solid rgba(87,155,252,0.25)", borderRadius: 100, marginBottom: 18 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#25D366" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Mode démo</span>
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
          Quel CRM voulez-vous tester ?
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 600, margin: "0 0 40px" }}>
          Choisissez un secteur et explorez l'intégralité du CRM avec des données fictives.
          Aucune inscription requise — rien n'est sauvegardé.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {SECTORS.map(({ key, icon: Icon, title, desc, color, company }) => (
            <button
              key={key}
              onClick={() => launch(key)}
              style={{
                textAlign: "left",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: 22,
                cursor: "pointer",
                color: "inherit",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = `${color}55`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Icon size={22} color={color} />
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>Démo : {company}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5, marginBottom: 14 }}>{desc}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color }}>
                Lancer la démo <ArrowRight size={13} />
              </div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 40, padding: 20, background: "rgba(87,155,252,0.06)", border: "1px solid rgba(87,155,252,0.15)", borderRadius: 12, fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
          <strong style={{ color: "#579BFC" }}>ℹ️ À propos de la démo</strong>
          <div style={{ marginTop: 6 }}>
            Toutes les pages du CRM sont accessibles avec des données fictives. Les modifications restent locales et sont effacées au rafraîchissement.
          </div>
        </div>
      </div>
    </div>
  );
}
