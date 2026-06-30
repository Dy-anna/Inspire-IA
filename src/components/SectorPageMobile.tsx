// Version mobile dédiée — page secteur (/secteurs/:slug)
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Play, Menu, X as XIcon, Utensils, Home as HomeIcon, Plane, GraduationCap, Stethoscope, Hotel, PartyPopper } from "lucide-react";
import { Logo } from "@/components/Logo";
import { setDemoMode } from "@/lib/supabase";
import type { DemoSector } from "@/lib/demoFixtures";

type Pillar = { icon: any; title: string; desc: string; bullets: string[] };
type Scenario = { before: string[]; after: string[] };
export type SectorContent = {
  slug: string;
  demoKey: DemoSector;
  icon: any;
  title: string;
  hero: string;
  subtitle: string;
  color: string;
  context: string;
  problems: string[];
  pillars: Pillar[];
  scenario: Scenario;
  results: { value: string; label: string }[];
  example: string;
  audience?: { title: string; desc: string }[];
  whyUs?: { title: string; text: string; bullets: string[] };
  finalCta?: { title: string; text: string };
  problemsTitle?: string;
  problemsSubtitle?: string;
  resultsTitle?: string;
};

const OTHER_SECTORS = [
  { title: "Restaurant",   slug: "restaurant",   color: "#FF6B35", icon: Utensils },
  { title: "Immobilier",   slug: "immobilier",   color: "#00C875", icon: HomeIcon },
  { title: "Voyage",       slug: "voyage",       color: "#579BFC", icon: Plane },
  { title: "École",        slug: "ecole-privee", color: "#A25DDC", icon: GraduationCap },
  { title: "Clinique",     slug: "clinique",     color: "#E2445C", icon: Stethoscope },
  { title: "Hôtellerie",   slug: "hotellerie",   color: "#FF6B35", icon: Hotel },
  { title: "Événementiel", slug: "evenement",    color: "#F59E0B", icon: PartyPopper },
];

export default function SectorPageMobile({ s }: { s: SectorContent }) {
  const [menu, setMenu] = useState(false);

  const launchDemo = () => {
    setDemoMode(true, s.demoKey);
    window.location.href = "/app/dashboard";
  };

  return (
    <div style={{ background: "#0D0D0D", color: "#fff", minHeight: "100vh", fontFamily: "'DM Sans','Inter',sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .m-syne { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
      `}</style>

      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #F1F1EF" }}>
        <div style={{ height: 56, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none" }}><Logo size="sm" textColor="#1A1A1A" /></Link>
          <button aria-label="Menu" onClick={() => setMenu(true)} style={{ background: "#F4F4F1", border: "none", width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Menu size={20} color="#1A1A1A" />
          </button>
        </div>
      </header>

      {menu && (
        <div onClick={() => setMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)" }}>
          <div onClick={e => e.stopPropagation()} style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "82%", maxWidth: 320, background: "#fff", padding: "20px 18px", color: "#1A1A1A" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <Logo size="sm" textColor="#1A1A1A" />
              <button onClick={() => setMenu(false)} style={{ background: "#F4F4F1", border: "none", width: 36, height: 36, borderRadius: 10 }}><XIcon size={18} /></button>
            </div>
            <Link to="/"        onClick={() => setMenu(false)} style={{ display: "block", padding: "14px 12px", fontSize: 16, fontWeight: 600, color: "#1A1A1A", textDecoration: "none" }}>Accueil</Link>
            <Link to="/about"   onClick={() => setMenu(false)} style={{ display: "block", padding: "14px 12px", fontSize: 16, fontWeight: 600, color: "#1A1A1A", textDecoration: "none" }}>À propos</Link>
            <Link to="/contact" onClick={() => setMenu(false)} style={{ display: "block", padding: "14px 12px", fontSize: 16, fontWeight: 600, color: "#1A1A1A", textDecoration: "none" }}>Contact</Link>
            <div style={{ borderTop: "1px solid #F0F0EE", marginTop: 12, paddingTop: 16 }}>
              <button onClick={() => { setMenu(false); launchDemo(); }} style={{ width: "100%", padding: "13px 14px", borderRadius: 10, background: s.color, color: "#fff", fontSize: 15, fontWeight: 800, border: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Play size={14} fill="white" /> Lancer la démo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section style={{ position: "relative", padding: "32px 18px 44px", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle, ${s.color}30 0%, transparent 65%)`, filter: "blur(30px)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "44px 44px", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Link to="/" hash="sectors" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none", marginBottom: 18 }}>
            <ArrowLeft size={14} /> Tous les secteurs
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: `${s.color}22`, border: `1px solid ${s.color}55`, display: "flex", alignItems: "center", justifyContent: "center" }}><s.icon size={24} color={s.color} /></div>
            <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", background: `${s.color}1A`, border: `1px solid ${s.color}44`, borderRadius: 100, fontSize: 10, fontWeight: 800, color: s.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Inspire IA — {s.title}
            </div>
          </div>
          <h1 className="m-syne" style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.1, margin: "0 0 12px" }}>{s.hero}</h1>
          <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.55, margin: "0 0 20px" }}>{s.subtitle}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={launchDemo} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 18px", background: s.color, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: `0 8px 22px ${s.color}40` }}>
              <Play size={15} fill="white" /> Essayer la démo {s.title}
            </button>
            <Link to="/contact" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 18px", background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
              Parler à un expert <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* PROBLEMS */}
      <section style={{ padding: "36px 16px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "inline-block", padding: "4px 12px", background: "rgba(226,68,92,0.14)", border: "1px solid rgba(226,68,92,0.35)", borderRadius: 100, fontSize: 10, fontWeight: 800, color: "#E2445C", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Le problème</div>
        <h2 className="m-syne" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 12px", lineHeight: 1.2 }}>{s.problemsTitle || "Ce que vous vivez aujourd'hui"}</h2>
        {s.problemsSubtitle && (
          <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, margin: "0 0 10px" }}>{s.problemsSubtitle}</p>
        )}
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: "0 0 22px" }}>{s.context}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {s.problems.map((p, i) => (
            <div key={i} style={{ padding: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 13, color: "rgba(255,255,255,0.78)", lineHeight: 1.55, display: "flex", gap: 8 }}>
              <span style={{ color: "#E2445C", fontWeight: 800, flexShrink: 0 }}>×</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section style={{ padding: "44px 16px" }}>
        <div style={{ display: "inline-block", padding: "4px 12px", background: `${s.color}1A`, border: `1px solid ${s.color}33`, borderRadius: 100, fontSize: 10, fontWeight: 800, color: s.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>La solution — 4 piliers</div>
        <h2 className="m-syne" style={{ fontSize: 24, fontWeight: 700, margin: "0 0 10px", lineHeight: 1.2 }}>Ce qu'Inspire IA fait à votre place</h2>
        <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.55, margin: "0 0 18px" }}>Une plateforme unique pensée pour les réalités africaines.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {s.pillars.map(({ icon: Icon, title, desc, bullets }) => (
            <div key={title} style={{ padding: 18, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}22`, border: `1px solid ${s.color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} color={s.color} />
                </div>
                <h3 className="m-syne" style={{ fontSize: 15.5, fontWeight: 700, margin: 0 }}>{title}</h3>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.55, margin: "0 0 12px" }}>{desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {bullets.map(b => (
                  <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 12.5, color: "rgba(255,255,255,0.78)", lineHeight: 1.5 }}>
                    <Check size={13} color={s.color} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section style={{ padding: "36px 16px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "inline-block", padding: "4px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Une journée type</div>
        <h2 className="m-syne" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 18px", lineHeight: 1.2 }}>Avant / Après Inspire IA</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ padding: 18, background: "rgba(226,68,92,0.06)", border: "1px solid rgba(226,68,92,0.22)", borderRadius: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#E2445C", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Sans Inspire IA</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {s.scenario.before.map((l, i) => (
                <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.55 }}>
                  <span style={{ color: "#E2445C", fontWeight: 800 }}>×</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ padding: 18, background: `${s.color}10`, border: `1px solid ${s.color}40`, borderRadius: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: s.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Avec Inspire IA</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {s.scenario.after.map((l, i) => (
                <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.55 }}>
                  <Check size={14} color={s.color} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section style={{ padding: "36px 16px", background: `linear-gradient(135deg, ${s.color}14, transparent)`, borderTop: `1px solid ${s.color}22` }}>
        <h2 className="m-syne" style={{ fontSize: 22, fontWeight: 700, textAlign: "center", margin: "0 0 18px" }}>{s.resultsTitle || "Résultats typiques après 3 mois"}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {s.results.map((r, i) => (
            <div key={i} style={{ padding: "18px 10px", textAlign: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}33`, borderRadius: 14 }}>
              <div className="m-syne" style={{ fontSize: 22, fontWeight: 700, color: s.color, marginBottom: 6, lineHeight: 1.15 }}>{r.value}</div>
              <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.35 }}>{r.label}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 13, color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>
          <Check size={13} style={{ display: "inline", marginRight: 6, color: s.color, verticalAlign: -1 }} />
          {s.example}
        </div>
      </section>

      {/* AUDIENCE */}
      {s.audience && (
        <section style={{ padding: "36px 16px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "inline-block", padding: "4px 12px", background: `${s.color}1A`, border: `1px solid ${s.color}33`, borderRadius: 100, fontSize: 10, fontWeight: 800, color: s.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Pour qui ?</div>
          <h2 className="m-syne" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 14px", lineHeight: 1.2 }}>Inspire IA s'adapte à votre activité</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {s.audience.map((a, i) => (
              <div key={a.title} style={{ padding: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}>
                <h3 className="m-syne" style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px", color: "#fff" }}>{a.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5, margin: 0 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* WHY US */}
      {s.whyUs && (
        <section style={{ padding: "36px 16px", background: `linear-gradient(135deg, ${s.color}0A, transparent)`, borderTop: `1px solid ${s.color}18` }}>
          <div style={{ display: "inline-block", padding: "4px 12px", background: `${s.color}1A`, border: `1px solid ${s.color}33`, borderRadius: 100, fontSize: 10, fontWeight: 800, color: s.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Pourquoi nous ?</div>
          <h2 className="m-syne" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 10px", lineHeight: 1.2 }}>{s.whyUs.title}</h2>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: "0 0 14px" }}>{s.whyUs.text}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {s.whyUs.bullets.map(b => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 8, padding: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10 }}>
                <Check size={14} color={s.color} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>{b}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "44px 16px", textAlign: "center" }}>
        <h2 className="m-syne" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2, margin: "0 0 12px" }}>
          {s.finalCta?.title || `Prêt à voir ça dans votre ${s.title.toLowerCase()} ?`}
        </h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: "0 0 18px" }}>{s.finalCta?.text || "Testez la démo sans inscription, ou parlez-nous de votre activité."}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={launchDemo} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 18px", background: s.color, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: `0 8px 22px ${s.color}45` }}>
            <Play size={15} fill="white" /> Lancer la démo
          </button>
          <Link to="/contact" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 18px", background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
            Parler à un expert
          </Link>
        </div>
      </section>

      {/* OTHER SECTORS — scroll horizontal */}
      <section style={{ padding: "32px 0 40px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="m-syne" style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "center", marginBottom: 14 }}>
          Découvrir un autre secteur
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "4px 16px 8px", scrollSnapType: "x mandatory", scrollbarWidth: "none" as any }}>
          {OTHER_SECTORS.filter(o => o.slug !== s.slug).map(o => (
            <Link key={o.slug} to="/secteurs/$slug" params={{ slug: o.slug }} style={{ flex: "0 0 45%", maxWidth: 160, scrollSnapAlign: "start", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "16px 10px", textAlign: "center", textDecoration: "none", color: "inherit" }}>
              <div style={{ width: 36, height: 36, margin: "0 auto 8px", borderRadius: 9, background: `${o.color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}><o.icon size={17} color={o.color} /></div>
              <div className="m-syne" style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>{o.title}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0A0A0A", padding: "28px 16px 22px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Logo size="sm" textColor="#fff" />
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, margin: "10px 0 16px" }}>Le Business OS intelligent pour les entreprises africaines.</p>
        <div style={{ paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          © {new Date().getFullYear()} Inspire IA. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}