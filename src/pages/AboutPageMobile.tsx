// Version mobile dédiée — page À propos
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, Menu, X as XIcon, Star, Rocket, Target, Zap, Lightbulb,
  Users, MessageCircle, Workflow, BarChart2, Sparkles, Brain, Compass, Globe,
  Utensils, Home as HomeIcon, Plane, GraduationCap, Stethoscope, Hotel,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import ceoPhoto from "@/assets/ceo.jpeg";

const SECTORS = [
  { title: "Restaurants",       color: "#FF6B35", icon: Utensils, slug: "restaurant" },
  { title: "Immobilier",        color: "#00C875", icon: HomeIcon, slug: "immobilier" },
  { title: "Agences de voyage", color: "#579BFC", icon: Plane, slug: "voyage" },
  { title: "Écoles privées",    color: "#A25DDC", icon: GraduationCap, slug: "ecole-privee" },
  { title: "Cliniques privées", color: "#E2445C", icon: Stethoscope, slug: "clinique" },
  { title: "Hôtellerie",        color: "#FFCA28", icon: Hotel, slug: "hotellerie" },
];

const PILLARS = [
  { icon: Users,         title: "CRM intelligent",      desc: "Clients, prospects et interactions dans un espace unique.", color: "#FF6B35" },
  { icon: MessageCircle, title: "Chatbox IA WhatsApp",  desc: "Un assistant qui répond et qualifie 24h/24.",               color: "#00C875" },
  { icon: Workflow,      title: "Automatisations",      desc: "Vos workflows tournent seuls.",                              color: "#A25DDC" },
  { icon: BarChart2,     title: "Analytics temps réel", desc: "Pilotez votre activité d'un coup d'œil.",                    color: "#579BFC" },
  { icon: Sparkles,      title: "Insight Engine",       desc: "L'IA détecte et suggère les bonnes actions.",                color: "#E2445C" },
  { icon: Brain,         title: "IA contextuelle",      desc: "Adaptée à vos métiers et au contexte africain.",              color: "#FFCA28" },
];

const VALUES = [
  { icon: Target,    title: "Clarté", desc: "Interfaces simples, pensées pour l'essentiel.",     color: "#FF6B35" },
  { icon: Zap,       title: "Action", desc: "Des outils qui exécutent, pas juste qui affichent.", color: "#00C875" },
  { icon: Lightbulb, title: "Impact", desc: "Mesurer ce qui change réellement pour vous.",        color: "#A25DDC" },
];

const STATS = [
  { value: "5",    label: "Secteurs",      color: "#FF6B35" },
  { value: "24/7", label: "Assistant IA",  color: "#00C875" },
  { value: "100%", label: "Pour l'Afrique",color: "#A25DDC" },
  { value: "∞",    label: "Workflows",     color: "#579BFC" },
];

const VENTURES = [
  { name: "Productive Energy", color: "#FF6B35" },
  { name: "Inspire Consulting", color: "#00C875" },
  { name: "Inspire IA",         color: "#A25DDC" },
];

export default function AboutPageMobile() {
  const [menu, setMenu] = useState(false);

  return (
    <div style={{ background: "#fff", color: "#1A1A1A", fontFamily: "'DM Sans','Inter',sans-serif", overflowX: "hidden", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .m-syne { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
        @keyframes m-fadeUp { from { opacity:0; transform:translateY(14px);} to { opacity:1; transform:translateY(0);} }
        @keyframes m-pulse { 0%,100% { opacity:1;} 50% { opacity:0.5;} }
        .m-up { animation: m-fadeUp 0.5s ease both; }
      `}</style>

      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #F1F1EF" }}>
        <div style={{ height: 56, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none" }}><Logo size="sm" textColor="#1A1A1A" /></Link>
          <button aria-label="Menu" onClick={() => setMenu(true)} style={{ background: "#F4F4F1", border: "none", width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Menu size={20} />
          </button>
        </div>
      </header>

      {menu && (
        <div onClick={() => setMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)" }}>
          <div onClick={e => e.stopPropagation()} style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "82%", maxWidth: 320, background: "#fff", padding: "20px 18px", animation: "m-fadeUp 0.25s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <Logo size="sm" textColor="#1A1A1A" />
              <button onClick={() => setMenu(false)} style={{ background: "#F4F4F1", border: "none", width: 36, height: 36, borderRadius: 10 }}>
                <XIcon size={18} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Link to="/"        onClick={() => setMenu(false)} style={{ padding: "14px 12px", fontSize: 16, fontWeight: 600, color: "#1A1A1A", textDecoration: "none" }}>Accueil</Link>
              <Link to="/about"   onClick={() => setMenu(false)} style={{ padding: "14px 12px", fontSize: 16, fontWeight: 700, color: "#A25DDC", textDecoration: "none" }}>À propos</Link>
              <Link to="/contact" onClick={() => setMenu(false)} style={{ padding: "14px 12px", fontSize: 16, fontWeight: 600, color: "#1A1A1A", textDecoration: "none" }}>Contact</Link>
              <div style={{ borderTop: "1px solid #F0F0EE", marginTop: 12, paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <Link to="/login" onClick={() => setMenu(false)} style={{ padding: "13px 14px", textAlign: "center", borderRadius: 10, border: "1px solid #E8E8E5", fontSize: 15, fontWeight: 700, color: "#1A1A1A", textDecoration: "none" }}>Se connecter</Link>
                <Link to="/contact" onClick={() => setMenu(false)} style={{ padding: "13px 14px", textAlign: "center", borderRadius: 10, background: "linear-gradient(135deg, #FF6B35, #A25DDC)", fontSize: 15, fontWeight: 800, color: "#fff", textDecoration: "none", boxShadow: "0 6px 18px rgba(162,93,220,0.35)" }}>Nous contacter</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section style={{ background: "#0D0D0D", position: "relative", overflow: "hidden", padding: "44px 18px 56px" }}>
        <div style={{ position: "absolute", top: "-15%", left: "-20%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.28) 0%, transparent 70%)", filter: "blur(30px)" }} />
        <div style={{ position: "absolute", top: "30%", right: "-25%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(162,93,220,0.3) 0%, transparent 70%)", filter: "blur(30px)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="m-up" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px 4px 4px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, marginBottom: 18 }}>
            <span style={{ background: "linear-gradient(135deg, #FF6B35, #A25DDC)", borderRadius: 100, padding: "2px 8px", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Compass size={10} color="#fff" /><span style={{ fontSize: 10, fontWeight: 800, color: "#fff", letterSpacing: "0.05em" }}>NOTRE HISTOIRE</span>
            </span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Bâtir l'Afrique de demain</span>
          </div>
          <h1 className="m-syne m-up" style={{ fontSize: 30, fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 14px" }}>
            Une nouvelle génération de{" "}
            <span style={{ background: "linear-gradient(90deg, #FF6B35 0%, #FFCA28 30%, #00C875 55%, #579BFC 78%, #A25DDC 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              solutions intelligentes
            </span>{" "}pour l'Afrique
          </h1>
          <p className="m-up" style={{ fontSize: 14.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.55, margin: "0 0 22px" }}>
            Inspire IA est une plateforme SaaS née d'une vision : des outils technologiques modernes, puissants et adaptés aux réalités des entreprises du continent.
          </p>
          <div className="m-up" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link to="/contact" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 18px", borderRadius: 12, background: "linear-gradient(135deg, #FF6B35, #A25DDC)", color: "#fff", fontWeight: 800, fontSize: 15, textDecoration: "none", boxShadow: "0 8px 24px rgba(162,93,220,0.35)" }}>
              <Rocket size={15} /> Démarrer avec Inspire IA
            </Link>
            <Link to="/" hash="demo" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.06)", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
              Voir la démo
            </Link>
          </div>
        </div>
      </section>

      {/* STATS 2x2 */}
      <section style={{ padding: "28px 16px", borderBottom: "1px solid #F1F1EF" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background: "#FAFAF8", border: "1px solid #F0F0EE", borderRadius: 14, padding: "16px 14px", textAlign: "center" }}>
              <div className="m-syne" style={{ fontSize: 26, fontWeight: 700, background: `linear-gradient(135deg, ${s.color}, ${s.color}AA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#787774", marginTop: 6, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section style={{ padding: "44px 16px", background: "#FAFAF8" }}>
        <div style={{ display: "inline-block", padding: "4px 12px", background: "#FFF4EF", borderRadius: 100, fontSize: 11, fontWeight: 800, color: "#FF6B35", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Notre mission</div>
        <h2 className="m-syne" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2, margin: "0 0 12px" }}>
          Donner aux entreprises africaines les moyens de{" "}
          <span style={{ background: "linear-gradient(135deg, #FF6B35, #A25DDC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>mieux s'organiser et grandir</span>.
        </h2>
        <p style={{ fontSize: 14, color: "#5C5C5C", lineHeight: 1.65, margin: 0 }}>
          Dans un contexte où beaucoup d'entreprises fonctionnent encore avec WhatsApp, appels et fichiers Excel, Inspire IA permet de gagner en efficacité, en structure et en performance.
        </p>
      </section>

      {/* PILIERS — 2 col */}
      <section style={{ padding: "44px 16px", background: "#fff" }}>
        <div style={{ display: "inline-block", padding: "4px 12px", background: "#EDFAF3", borderRadius: 100, fontSize: 11, fontWeight: 800, color: "#00C875", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>L'écosystème</div>
        <h2 className="m-syne" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2, margin: "0 0 18px" }}>
          Un Business OS complet
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {PILLARS.map(p => {
            const Icon = p.icon;
            return (
              <div key={p.title} style={{ background: "#FAFAF8", border: "1px solid #F0F0EE", borderRadius: 14, padding: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${p.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <Icon size={17} color={p.color} />
                </div>
                <div className="m-syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, lineHeight: 1.25 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: "#787774", lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTEURS — dark, scroll horizontal */}
      <section style={{ padding: "44px 0", background: "#0D0D0D", position: "relative", overflow: "hidden" }}>
        <div style={{ padding: "0 16px", marginBottom: 18 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.85)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            <Globe size={11} /> Pour qui
          </div>
          <h2 className="m-syne" style={{ fontSize: 24, fontWeight: 700, color: "#fff", lineHeight: 1.2, margin: 0 }}>
            Six secteurs, une plateforme
          </h2>
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "4px 16px 8px", scrollSnapType: "x mandatory", scrollbarWidth: "none" as any }}>
          {SECTORS.map(s => (
            <Link key={s.slug} to="/secteurs/$slug" params={{ slug: s.slug }} style={{ flex: "0 0 60%", maxWidth: 200, scrollSnapAlign: "start", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "18px 12px", textAlign: "center", textDecoration: "none", color: "inherit" }}>
              <div style={{ width: 44, height: 44, margin: "0 auto 10px", borderRadius: 11, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 16px ${s.color}40` }}><s.icon size={21} color="#fff" /></div>
              <div className="m-syne" style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{s.title}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FONDATEUR */}
      <section style={{ padding: "44px 16px", background: "#fff" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 22 }}>
          <div style={{ position: "relative", width: 200, marginBottom: 18 }}>
            <div style={{ position: "absolute", inset: -10, borderRadius: 22, background: "linear-gradient(135deg, #FF6B35, #A25DDC)", opacity: 0.25, filter: "blur(16px)" }} />
            <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", aspectRatio: "4/5", background: "#F7F7F5", border: "2px solid #fff", boxShadow: "0 16px 36px rgba(0,0,0,0.15)" }}>
              <img src={ceoPhoto} alt="Ninsemon YHAYE" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", display: "block" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "26px 14px 12px", background: "linear-gradient(transparent, rgba(0,0,0,0.85))", color: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, color: "#FFCA28", letterSpacing: "0.08em", marginBottom: 3 }}>
                  <Star size={10} fill="#FFCA28" /> FOUNDER & CEO
                </div>
                <div className="m-syne" style={{ fontSize: 16, fontWeight: 700 }}>Ninsemon YHAYE</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "inline-block", padding: "4px 12px", background: "#F5F0FF", borderRadius: 100, fontSize: 11, fontWeight: 800, color: "#A25DDC", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Le fondateur</div>
        <h2 className="m-syne" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2, margin: "0 0 14px" }}>
          Une vision, un{" "}
          <span style={{ background: "linear-gradient(135deg, #A25DDC, #FF6B35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>bâtisseur</span>
        </h2>
        <p style={{ fontSize: 14, color: "#3A3A3A", lineHeight: 1.7, margin: 0, textAlign: "left" }}>
          <strong>Ninsemon YHAYE</strong>, né le 24 août 2002, est un étudiant international établi en France. Auteur de plusieurs ouvrages chrétiens comme <em>Consacré à Dieu</em>, titulaire d'un diplôme d'école de commerce, d'une certification en gestion de projet et d'une certification Harvard en Machine Learning & IA with Python, il fonde et dirige plusieurs entreprises dont Productive Energy et Inspire Consulting avec une vision claire : celle d'un entrepreneur qui place l'excellence au service de l'impact.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 18 }}>
          {VENTURES.map(v => (
            <div key={v.name} style={{ padding: 1.5, borderRadius: 12, background: `linear-gradient(135deg, ${v.color}, ${v.color}AA)` }}>
              <div style={{ background: "#fff", borderRadius: 10, padding: "10px 6px", textAlign: "center" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: v.color, margin: "0 auto 5px" }} />
                <div style={{ fontSize: 9, fontWeight: 700, color: "#787774", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 3 }}>Founder</div>
                <div className="m-syne" style={{ fontSize: 11, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.2 }}>{v.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VALEURS */}
      <section style={{ padding: "44px 16px", background: "linear-gradient(135deg, #0D0D0D 0%, #1A0A2E 50%, #2D1052 100%)", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", right: "-20%", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,107,53,0.2)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "-30%", left: "-20%", width: 300, height: 300, borderRadius: "50%", background: "rgba(162,93,220,0.22)", filter: "blur(40px)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", padding: "4px 12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 100, fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.85)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Nos valeurs</div>
          <h2 className="m-syne" style={{ fontSize: 24, fontWeight: 700, color: "#fff", lineHeight: 1.2, margin: "0 0 18px" }}>
            Trois principes qui guident chaque ligne
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {VALUES.map(v => {
              const Icon = v.icon;
              return (
                <div key={v.title} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: v.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 6px 16px ${v.color}45` }}>
                    <Icon size={18} color="#fff" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="m-syne" style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{v.title}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.55 }}>{v.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "44px 16px", background: "#FAFAF8", textAlign: "center" }}>
        <h2 className="m-syne" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.25, margin: "0 0 14px" }}>
          Inspire IA transforme les entreprises africaines grâce à l'{" "}
          <span style={{ background: "linear-gradient(135deg, #FF6B35, #A25DDC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>IA et l'automatisation</span>.
        </h2>
        <p style={{ fontSize: 14, color: "#5C5C5C", lineHeight: 1.55, margin: "0 0 20px" }}>Découvrez comment notre plateforme s'adapte à votre activité.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link to="/contact" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 18px", borderRadius: 12, background: "linear-gradient(135deg, #FF6B35, #A25DDC)", color: "#fff", fontWeight: 800, fontSize: 15, textDecoration: "none", boxShadow: "0 8px 24px rgba(162,93,220,0.3)" }}>
            <Rocket size={15} /> Demander une démo
          </Link>
          <Link to="/" hash="sectors" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 18px", borderRadius: 12, background: "#fff", color: "#1A1A1A", fontWeight: 700, fontSize: 15, textDecoration: "none", border: "1px solid #E8E8E5" }}>
            Voir les secteurs <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#111", padding: "32px 16px 24px" }}>
        <Logo size="sm" textColor="#fff" />
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, margin: "12px 0 22px" }}>Le Business OS intelligent pour les entreprises africaines.</p>
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