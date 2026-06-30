// src/pages/HomePageMobile.tsx
// Version mobile dédiée — structure pensée pour smartphone uniquement.
// Ne touche pas au layout desktop.

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight, Play, Star, Menu, X as XIcon, MessageCircle,
  LayoutDashboard, BarChart2, Zap, Shield, Globe, Users, TrendingUp,
  Home as HomeIcon, Plane, GraduationCap, Stethoscope, Hotel, Utensils, Calendar,
  Check,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { setDemoMode } from "@/lib/supabase";
import type { DemoSector } from "@/lib/demoFixtures";

const SECTORS = [
  { slug: "restaurant",   key: "restaurant" as DemoSector,    title: "Restaurant",   desc: "Commandes WhatsApp & menu.",      color: "#FF6B35", icon: Utensils },
  { slug: "immobilier",   key: "real_estate" as DemoSector,   title: "Immobilier",   desc: "Pipeline leads & biens.",         color: "#00C875", icon: HomeIcon },
  { slug: "voyage",       key: "travel_agency" as DemoSector, title: "Voyage",       desc: "Réservations & packages.",        color: "#579BFC", icon: Plane },
  { slug: "ecole-privee", key: "private_school" as DemoSector,title: "École",        desc: "Inscriptions & notes.",            color: "#A25DDC", icon: GraduationCap },
  { slug: "clinique",     key: "private_clinic" as DemoSector,title: "Clinique",     desc: "Agenda RDV & rappels.",            color: "#E2445C", icon: Stethoscope },
  { slug: "hotellerie",   key: "hotel" as DemoSector,         title: "Hôtellerie",   desc: "Chambres & housekeeping.",         color: "#FF6B35", icon: Hotel },
  { slug: "evenement",    key: "event" as DemoSector,         title: "Événementiel", desc: "Traiteur & food stand.",          color: "#F59E0B", icon: Calendar },
];

const FEATURES = [
  { icon: LayoutDashboard, title: "CRM métier",      desc: "Une interface pour tout suivre.",            color: "#A25DDC" },
  { icon: MessageCircle,   title: "Chatbox WhatsApp",desc: "L'IA répond 24h/24.",                        color: "#00C875" },
  { icon: BarChart2,       title: "Analytics live",  desc: "KPIs en temps réel.",                        color: "#579BFC" },
  { icon: Zap,             title: "Automatisations", desc: "Rappels et relances auto.",                  color: "#FF6B35" },
  { icon: Shield,          title: "Sécurisé",        desc: "Hébergement Europe, chiffré.",               color: "#E2445C" },
  { icon: Globe,           title: "Pensé Afrique",   desc: "Multidevise, WhatsApp-first.",               color: "#FFCA28" },
];

const STATS = [
  { value: "500+", label: "Entreprises",      icon: Users,       color: "#FF6B35" },
  { value: "6",    label: "Secteurs",         icon: Globe,       color: "#00C875" },
  { value: "98%",  label: "Satisfaction",     icon: Star,        color: "#579BFC" },
  { value: "3×",   label: "Croissance",       icon: TrendingUp,  color: "#A25DDC" },
];

const STEPS = [
  { num: "1", title: "Inscrivez-vous",      desc: "Compte créé en 2 minutes.",       color: "#FF6B35" },
  { num: "2", title: "Configurez",          desc: "Secteur, équipe, WhatsApp.",      color: "#A25DDC" },
  { num: "3", title: "Importez vos données",desc: "Clients, catalogue, historique.", color: "#579BFC" },
  { num: "4", title: "Activez l'IA",        desc: "Chatbot, alertes, automations.",  color: "#00C875" },
];

const TESTIMONIALS = [
  { quote: "Nos commandes WhatsApp sont gérées sans erreur. On a doublé notre volume du soir.", name: "Awa D.",    role: "Le Baobab — Dakar",     color: "#FF6B35", icon: Utensils },
  { quote: "Le pipeline me fait gagner 5h/semaine. Plus rien ne tombe entre les mailles.",       name: "Joël M.",   role: "Ivoire Habitat",        color: "#00C875", icon: HomeIcon },
  { quote: "Les rappels automatiques ont réduit nos no-shows de 60%.",                            name: "Dr. Kouassi", role: "Clinique Saint-Joseph", color: "#E2445C", icon: Stethoscope },
  { quote: "Nos clients réservent leurs voyages via WhatsApp. C'est notre 1er canal.",            name: "Fatou S.",  role: "Sahel Travel",          color: "#579BFC", icon: Plane },
];

function launchDemo(sector: DemoSector) {
  setDemoMode(true, sector);
  window.location.href = "/app/dashboard";
}

export default function HomePageMobile() {
  const [menu, setMenu] = useState(false);

  return (
    <div style={{ background: "#fff", color: "#1A1A1A", fontFamily: "'DM Sans','Inter',sans-serif", overflowX: "hidden", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .m-syne { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
        @keyframes m-fadeUp { from { opacity:0; transform:translateY(14px);} to { opacity:1; transform:translateY(0);} }
        @keyframes m-pulse { 0%,100% { opacity:1;} 50% { opacity:0.5;} }
        .m-up { animation: m-fadeUp 0.5s ease both; }
        .m-scroll { -webkit-overflow-scrolling: touch; scrollbar-width: none; scroll-snap-type: x mandatory; }
        .m-scroll::-webkit-scrollbar { display: none; }
        .m-snap { scroll-snap-align: start; }
        .m-cta-primary { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:14px 18px; border-radius:12px; background:#fff; color:#0D0D0D; font-weight:800; font-size:15px; text-decoration:none; box-shadow:0 8px 24px rgba(255,255,255,0.18); }
        .m-cta-ghost { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:14px 18px; border-radius:12px; background:rgba(255,255,255,0.06); color:#fff; font-weight:700; font-size:15px; text-decoration:none; border:1px solid rgba(255,255,255,0.2); }
        .m-cta-dark { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:14px 18px; border-radius:12px; background:#0D0D0D; color:#fff; font-weight:800; font-size:15px; text-decoration:none; box-shadow:0 8px 24px rgba(0,0,0,0.2); }
      `}</style>

      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #F1F1EF" }}>
        <div style={{ height: 56, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none" }}><Logo size="sm" textColor="#1A1A1A" /></Link>
          <button aria-label="Menu" onClick={() => setMenu(true)} style={{ background: "#F4F4F1", border: "none", width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Menu size={20} color="#1A1A1A" />
          </button>
        </div>
      </header>

      {/* DRAWER */}
      {menu && (
        <div onClick={() => setMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)" }}>
          <div onClick={e => e.stopPropagation()} style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "82%", maxWidth: 320, background: "#fff", padding: "20px 18px 24px", display: "flex", flexDirection: "column", animation: "m-fadeUp 0.25s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
              <Logo size="sm" textColor="#1A1A1A" />
              <button onClick={() => setMenu(false)} aria-label="Fermer" style={{ background: "#F4F4F1", border: "none", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <XIcon size={18} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { to: "/about",   label: "À propos" },
                { to: "/contact", label: "Contact"  },
              ].map(l => (
                <Link key={l.to} to={l.to} onClick={() => setMenu(false)} style={{ padding: "14px 12px", borderRadius: 10, fontSize: 16, fontWeight: 600, color: "#1A1A1A", textDecoration: "none" }}>
                  {l.label}
                </Link>
              ))}
              <div style={{ borderTop: "1px solid #F0F0EE", marginTop: 12, paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <Link to="/login" onClick={() => setMenu(false)} style={{ padding: "13px 14px", textAlign: "center", borderRadius: 10, border: "1px solid #E8E8E5", fontSize: 15, fontWeight: 700, color: "#1A1A1A", textDecoration: "none" }}>
                  Se connecter
                </Link>
                <Link to="/register" onClick={() => setMenu(false)} style={{ padding: "13px 14px", textAlign: "center", borderRadius: 10, background: "linear-gradient(135deg, #FF6B35, #A25DDC)", fontSize: 15, fontWeight: 800, color: "#fff", textDecoration: "none", boxShadow: "0 6px 18px rgba(162,93,220,0.35)" }}>
                  Créer mon espace
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section style={{ background: "#0D0D0D", position: "relative", overflow: "hidden", padding: "44px 18px 56px" }}>
        <div style={{ position: "absolute", top: "-15%", left: "-20%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.28) 0%, transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", right: "-25%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(162,93,220,0.3) 0%, transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "44px 44px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="m-up" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 10px 4px 4px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, marginBottom: 18 }}>
            <span style={{ background: "linear-gradient(135deg, #FF6B35, #A25DDC)", borderRadius: 100, padding: "2px 8px", fontSize: 10, fontWeight: 800, color: "#fff", letterSpacing: "0.05em" }}>NOUVEAU</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>IA dans chaque secteur</span>
          </div>

          <h1 className="m-syne m-up" style={{ fontSize: 34, fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 14px" }}>
            Le système{" "}
            <span style={{ background: "linear-gradient(90deg, #FF6B35 0%, #FFCA28 35%, #00C875 65%, #579BFC 85%, #A25DDC 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              d'exploitation
            </span>{" "}
            de votre business.
          </h1>

          <p className="m-up" style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.55, margin: "0 0 24px" }}>
            CRM, chatbox WhatsApp, automatisations et analytics — une seule plateforme pour les entreprises africaines.
          </p>

          <div className="m-up" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            <Link to="/register" className="m-cta-primary">Créer mon espace gratuit <ArrowRight size={16} /></Link>
            <a href="#demo" className="m-cta-ghost"><Play size={14} fill="white" /> Voir la démo</a>
          </div>

          {/* Social proof */}
          <div className="m-up" style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}>
            <div style={{ display: "flex" }}>
              {SECTORS.slice(0, 5).map((s, i) => (
                <div key={s.title} style={{ width: 28, height: 28, borderRadius: "50%", background: s.color, border: "2px solid #0D0D0D", marginLeft: i > 0 ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <s.icon size={13} color="#fff" />
                </div>
              ))}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 2 }}>
                {Array(5).fill(0).map((_, i) => <Star key={i} size={11} fill="#FFCA28" color="#FFCA28" />)}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                <strong style={{ color: "#fff" }}>500+</strong> entreprises actives
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS — 2x2 grid */}
      <section style={{ padding: "32px 16px", background: "#fff", borderBottom: "1px solid #F1F1EF" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} style={{ background: "#FAFAF8", border: "1px solid #F0F0EE", borderRadius: 14, padding: "16px 14px" }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <Icon size={16} color={s.color} />
                </div>
                <div className="m-syne" style={{ fontSize: 24, fontWeight: 800, color: "#1A1A1A", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#787774", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTORS — scroll horizontal snap */}
      <section id="sectors" style={{ padding: "44px 0 44px", background: "#FAFAF8" }}>
        <div style={{ padding: "0 16px", marginBottom: 18 }}>
          <div style={{ display: "inline-block", padding: "4px 12px", background: "#fff", border: "1px solid #F0F0EE", borderRadius: 100, fontSize: 11, fontWeight: 800, color: "#FF6B35", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            Secteurs
          </div>
          <h2 className="m-syne" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
            7 secteurs, une seule plateforme
          </h2>
        </div>
        <div className="m-scroll" style={{ display: "flex", gap: 12, overflowX: "auto", padding: "4px 16px 8px" }}>
          {SECTORS.map((s) => (
            <Link key={s.slug} to="/secteurs/$slug" params={{ slug: s.slug }} className="m-snap" style={{ flex: "0 0 78%", maxWidth: 280, background: "#fff", border: "1px solid #F0F0EE", borderRadius: 16, padding: "20px 18px", textDecoration: "none", color: "inherit", display: "block" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <s.icon size={22} color={s.color} />
              </div>
              <div className="m-syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "#787774", lineHeight: 1.5, marginBottom: 12 }}>{s.desc}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: s.color }}>
                Découvrir <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES — 2 col grid */}
      <section id="features" style={{ padding: "44px 16px", background: "#fff" }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "inline-block", padding: "4px 12px", background: "#F5F0FF", borderRadius: 100, fontSize: 11, fontWeight: 800, color: "#A25DDC", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            Fonctionnalités
          </div>
          <h2 className="m-syne" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2, margin: "0 0 6px" }}>
            Tout ce dont vous avez besoin
          </h2>
          <p style={{ fontSize: 14, color: "#787774", margin: 0 }}>Une plateforme qui remplace 5 outils.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} style={{ background: "#FAFAF8", border: "1px solid #F0F0EE", borderRadius: 14, padding: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${f.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <Icon size={17} color={f.color} />
                </div>
                <div className="m-syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, lineHeight: 1.25 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "#787774", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS — vertical timeline */}
      <section style={{ padding: "44px 16px", background: "#FAFAF8" }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "inline-block", padding: "4px 12px", background: "#FFF4EF", borderRadius: 100, fontSize: 11, fontWeight: 800, color: "#FF6B35", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            Comment ça marche
          </div>
          <h2 className="m-syne" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
            Actif en moins de 10 minutes
          </h2>
        </div>
        <div style={{ position: "relative", paddingLeft: 56 }}>
          {/* vertical connecting line */}
          <div style={{ position: "absolute", left: 24, top: 12, bottom: 12, width: 2, background: "linear-gradient(180deg, #FF6B35, #A25DDC, #579BFC, #00C875)", borderRadius: 1 }} />
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ position: "relative", marginBottom: i === STEPS.length - 1 ? 0 : 22 }}>
              <div style={{ position: "absolute", left: -56, top: 0, width: 48, height: 48, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 18px ${s.color}55`, border: "3px solid #FAFAF8" }}>
                <span className="m-syne" style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{s.num}</span>
              </div>
              <div style={{ background: "#fff", border: "1px solid #F0F0EE", borderRadius: 12, padding: "12px 14px" }}>
                <div className="m-syne" style={{ fontSize: 15, fontWeight: 800, marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: "#787774", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO — single CTA card, no complex widget on mobile */}
      <section id="demo" style={{ padding: "44px 16px", background: "#0D0D0D", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", right: "-20%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(87,155,252,0.22) 0%, transparent 70%)", filter: "blur(30px)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", background: "rgba(87,155,252,0.15)", border: "1px solid rgba(87,155,252,0.3)", borderRadius: 100, marginBottom: 12 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#25D366", animation: "m-pulse 2s infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Démo interactive</span>
          </div>
          <h2 className="m-syne" style={{ fontSize: 24, fontWeight: 700, color: "#fff", lineHeight: 1.2, margin: "0 0 8px" }}>
            Testez le CRM, sans inscription
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.55, margin: "0 0 20px" }}>
            Choisissez un secteur et explorez la démo avec des données fictives.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {SECTORS.map((s) => (
              <button key={s.slug} onClick={() => launchDemo(s.key)} style={{ textAlign: "left", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 14, cursor: "pointer", color: "inherit", fontFamily: "inherit" }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `${s.color}22`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <s.icon size={17} color={s.color} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{s.title}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, color: s.color }}>
                  Lancer <ArrowRight size={11} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — horizontal scroll snap */}
      <section style={{ padding: "44px 0 44px", background: "#fff" }}>
        <div style={{ padding: "0 16px", marginBottom: 18 }}>
          <div style={{ display: "inline-block", padding: "4px 12px", background: "#EDFAF3", borderRadius: 100, fontSize: 11, fontWeight: 800, color: "#00C875", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            Ils témoignent
          </div>
          <h2 className="m-syne" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
            Ils ont transformé leur business
          </h2>
        </div>
        <div className="m-scroll" style={{ display: "flex", gap: 12, overflowX: "auto", padding: "4px 16px 8px" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="m-snap" style={{ flex: "0 0 82%", maxWidth: 300, background: "#FAFAF8", border: "1px solid #F0F0EE", borderRadius: 14, padding: 18 }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
                {Array(5).fill(0).map((_, si) => <Star key={si} size={12} fill={t.color} color={t.color} />)}
              </div>
              <p style={{ fontSize: 13.5, color: "#1A1A1A", lineHeight: 1.55, margin: "0 0 14px", fontStyle: "italic" }}>
                "{t.quote}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 12, borderTop: "1px solid #EFEFEC" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <t.icon size={15} color="#fff" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="m-syne" style={{ fontSize: 13, fontWeight: 800 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "#787774" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: "linear-gradient(135deg, #0D0D0D 0%, #1A0A2E 50%, #2D1052 100%)", padding: "48px 18px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", left: "-20%", width: 320, height: 320, borderRadius: "50%", background: "rgba(255,107,53,0.18)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "-30%", right: "-20%", width: 320, height: 320, borderRadius: "50%", background: "rgba(162,93,220,0.22)", filter: "blur(40px)" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🚀</div>
          <h2 className="m-syne" style={{ fontSize: 24, fontWeight: 700, color: "#fff", lineHeight: 1.2, margin: "0 0 10px" }}>
            Prêt à passer à la vitesse supérieure ?
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.55, margin: "0 0 22px" }}>
            Rejoignez 500+ entreprises africaines qui automatisent leur activité.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link to="/register" className="m-cta-primary">Créer mon espace <ArrowRight size={16} /></Link>
            <a href="#demo" className="m-cta-ghost"><Play size={14} fill="white" /> Voir la démo</a>
          </div>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12, marginTop: 22, fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
            {["Sans carte bancaire", "Actif en 10 min", "Annulable"].map(l => (
              <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Check size={12} color="#00C875" /> {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#111", padding: "32px 16px 24px", color: "rgba(255,255,255,0.5)" }}>
        <Logo size="sm" textColor="#fff" />
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, margin: "12px 0 22px" }}>
          Le Business OS intelligent pour les entreprises africaines.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 22 }}>
          <div>
            <div className="m-syne" style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Secteurs</div>
            {SECTORS.slice(0, 4).map(s => (
              <Link key={s.slug} to="/secteurs/$slug" params={{ slug: s.slug }} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8 }}>{s.title}</Link>
            ))}
          </div>
          <div>
            <div className="m-syne" style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Entreprise</div>
            <Link to="/about"   style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8 }}>À propos</Link>
            <Link to="/contact" style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8 }}>Contact</Link>
            <Link to="/login"   style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8 }}>Se connecter</Link>
          </div>
        </div>
        <div style={{ paddingTop: 18, borderTop: "1px solid #1F1F1F", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          © {new Date().getFullYear()} Inspire IA. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}