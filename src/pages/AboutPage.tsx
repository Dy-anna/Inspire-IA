// src/pages/AboutPage.tsx
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight, Brain, Zap, Users, MessageCircle, BarChart2,
  Workflow, Sparkles, Target, Lightbulb, Globe,
  Utensils, Home as HomeIcon, Plane, GraduationCap, Stethoscope, Hotel,
  Compass, Mail, Rocket, Star,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import ceoPhoto from "@/assets/ceo.jpeg";
import AboutPageMobile from "@/pages/AboutPageMobile";
import { useIsMobile } from "@/hooks/useIsMobile";

const SECTORS = [
  { icon: Utensils,      title: "Restaurants",       color: "#FF6B35", bg: "#FFF4EF", gradient: "linear-gradient(135deg, #FF6B35, #FF9A6C)" },
  { icon: HomeIcon,      title: "Immobilier",        color: "#00C875", bg: "#EDFAF3", gradient: "linear-gradient(135deg, #00C875, #00E28A)" },
  { icon: Plane,         title: "Agences de voyage", color: "#579BFC", bg: "#EEF6FF", gradient: "linear-gradient(135deg, #579BFC, #85BAFF)" },
  { icon: GraduationCap, title: "Écoles privées",    color: "#A25DDC", bg: "#F5F0FF", gradient: "linear-gradient(135deg, #A25DDC, #C48AF0)" },
  { icon: Stethoscope,         title: "Cliniques privées", color: "#E2445C", bg: "#FFF0EE", gradient: "linear-gradient(135deg, #E2445C, #FF6B80)" },
  { icon: Hotel,         title: "Hôtellerie",        color: "#FFCA28", bg: "#FFF8E5", gradient: "linear-gradient(135deg, #FFCA28, #FFD95C)" },
];

const PILLARS = [
  { icon: Users,         title: "CRM intelligent",      desc: "Centralisez clients, prospects et interactions dans un espace unique.", color: "#FF6B35", gradient: "linear-gradient(135deg, #FF6B35, #FF9A6C)" },
  { icon: MessageCircle, title: "Chatbox IA WhatsApp",  desc: "Un assistant qui répond, qualifie et oriente vos clients 24h/24.",       color: "#00C875", gradient: "linear-gradient(135deg, #00C875, #00E28A)" },
  { icon: Workflow,      title: "Automatisations",      desc: "Confirmations, rappels, relances : vos workflows tournent seuls.",       color: "#A25DDC", gradient: "linear-gradient(135deg, #A25DDC, #C48AF0)" },
  { icon: BarChart2,     title: "Analytics temps réel", desc: "Tableaux de bord clairs pour piloter votre activité.",                    color: "#579BFC", gradient: "linear-gradient(135deg, #579BFC, #85BAFF)" },
  { icon: Sparkles,      title: "Insight Engine",       desc: "L'IA détecte les anomalies et vous suggère les bonnes actions.",          color: "#E2445C", gradient: "linear-gradient(135deg, #E2445C, #FF6B80)" },
  { icon: Brain,         title: "IA contextuelle",      desc: "Des modèles adaptés à vos métiers et à vos réalités locales.",            color: "#FFCA28", gradient: "linear-gradient(135deg, #FFCA28, #FFE082)" },
];

const VALUES = [
  { icon: Target,    title: "Clarté",  desc: "Des interfaces simples, pensées pour aller à l'essentiel.",     color: "#FF6B35", gradient: "linear-gradient(135deg, #FF6B35, #FF9A6C)" },
  { icon: Zap,       title: "Action",  desc: "Des outils qui exécutent, pas juste qui affichent.",            color: "#00C875", gradient: "linear-gradient(135deg, #00C875, #00E28A)" },
  { icon: Lightbulb, title: "Impact",  desc: "Mesurer ce qui change réellement pour votre entreprise.",       color: "#A25DDC", gradient: "linear-gradient(135deg, #A25DDC, #C48AF0)" },
];

const STATS = [
  { value: "5", label: "Secteurs couverts", color: "#FF6B35" },
  { value: "24/7", label: "Assistant IA WhatsApp", color: "#00C875" },
  { value: "100%", label: "Pensé pour l'Afrique", color: "#A25DDC" },
  { value: "∞", label: "Workflows possibles", color: "#579BFC" },
];

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll reveal — ajoute la classe .in à tout élément .reveal quand visible
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  if (isMobile) return <AboutPageMobile />;

  return (
    <div className="public-page" style={{ background: "#fff", minHeight: "100vh", fontFamily: "'DM Sans', 'Inter', sans-serif", color: "#1A1A1A", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        .syne { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
        .nav-a { color:#1A1A1A; text-decoration:none; font-size:14px; font-weight:600; transition:color 0.2s; }
        .nav-a:hover { color:#A25DDC; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes floatY { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-10px); } }
        @keyframes pulseGlow { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
        @keyframes spin { to { transform:rotate(360deg); } }
        .anim-up { animation: fadeUp 0.7s ease both; }
        .reveal { opacity:0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.in { opacity:1; transform: translateY(0); }
        .reveal-d1 { transition-delay: 0.08s; }
        .reveal-d2 { transition-delay: 0.16s; }
        .reveal-d3 { transition-delay: 0.24s; }
        .reveal-d4 { transition-delay: 0.32s; }
        .reveal-d5 { transition-delay: 0.40s; }
        .section-pad { padding: 96px 32px; }
        .max-w { max-width: 1100px; margin: 0 auto; }
        .pillar-card { background:#fff; border:1px solid #EBEBEB; border-radius:16px; padding:28px; transition: all 0.3s; position:relative; overflow:hidden; }
        .pillar-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.08); }
        .pillar-card::before { content:""; position:absolute; top:0; left:0; right:0; height:3px; transform:scaleX(0); transform-origin:left; transition:transform 0.3s; }
        .pillar-card:hover::before { transform:scaleX(1); }
        .sector-card { background:#fff; border:1px solid #EBEBEB; border-radius:16px; padding: 32px 20px; text-align:center; transition: all 0.3s; cursor:default; }
        .sector-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 16px 40px rgba(0,0,0,0.08); }
        @media (max-width: 860px) {
          .section-pad { padding: 64px 20px; }
          .founder-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .pillars-grid { grid-template-columns: 1fr !important; }
          .values-grid { grid-template-columns: 1fr !important; }
          .sectors-grid { grid-template-columns: repeat(2,1fr) !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .hero-h1 { font-size: 42px !important; }
          .h2 { font-size: 30px !important; }
        }
      `}</style>

      {/* NAV */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: scrolled ? "rgba(255,255,255,0.97)" : "#fff", backdropFilter: "blur(12px)", borderBottom: scrolled ? "1px solid #F1F1EF" : "1px solid #F7F7F5", transition: "all 0.3s" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none" }}><Logo size="sm" textColor="#1A1A1A" /></Link>
          <nav style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <Link to="/" hash="features" className="nav-a">Fonctionnalités</Link>
            <Link to="/" hash="sectors" className="nav-a">Secteurs</Link>
            <Link to="/about" className="nav-a" style={{ color: "#A25DDC" }}>À propos</Link>
            <Link to="/contact" className="nav-a">Contact</Link>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link to="/login" style={{ color: "#1A1A1A", textDecoration: "none", fontSize: 14, fontWeight: 600, padding: "8px 14px" }}>Se connecter</Link>
            <Link to="/contact" style={{ background: "linear-gradient(135deg, #FF6B35, #A25DDC)", color: "#fff", padding: "10px 20px", borderRadius: 9, textDecoration: "none", fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6, boxShadow: "0 4px 16px rgba(162,93,220,0.3)" }}>
              Contacter <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO sombre, halos colorés, emojis flottants */}
      <section style={{ background: "#0D0D0D", padding: "100px 32px 120px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-10%", left: "12%", width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.18) 0%, transparent 70%)", filter: "blur(20px)", animation: "pulseGlow 4s ease-in-out infinite" }} />
          <div style={{ position: "absolute", top: "10%", right: "8%", width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(162,93,220,0.22) 0%, transparent 70%)", filter: "blur(20px)", animation: "pulseGlow 5s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "-10%", left: "40%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(87,155,252,0.15) 0%, transparent 70%)", filter: "blur(20px)", animation: "pulseGlow 6s ease-in-out infinite" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
        </div>

        {/* Emojis flottants des secteurs */}
        {SECTORS.map((s, i) => {
          const pos = [
            { top: "15%", left: "6%" },
            { top: "22%", right: "10%" },
            { bottom: "20%", left: "8%" },
            { top: "55%", right: "6%" },
            { bottom: "12%", right: "20%" },
          ][i];
          return (
            <div key={s.title} style={{ position: "absolute", ...pos, zIndex: 2, animation: `floatY ${3 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`, pointerEvents: "none" }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: s.gradient, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 12px 32px ${s.color}40`, border: "1px solid rgba(255,255,255,0.1)" }}>
                <s.icon size={26} color="#fff" />
              </div>
            </div>
          );
        })}

        <div style={{ maxWidth: 920, margin: "0 auto", position: "relative", zIndex: 3, textAlign: "center" }}>
          <div className="anim-up" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 12px 5px 6px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, marginBottom: 28 }}>
            <div style={{ background: "linear-gradient(135deg, #FF6B35, #A25DDC)", borderRadius: 100, padding: "2px 9px", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Compass size={11} color="#fff" /><span style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>NOTRE HISTOIRE</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Bâtir l'Afrique de demain</span>
          </div>
          <h1 className="syne hero-h1 anim-up" style={{ fontSize: 60, fontWeight: 700, color: "#fff", lineHeight: 1.05, margin: "0 0 24px", animationDelay: "0.1s" }}>
            Une nouvelle génération<br />de{" "}
            <span style={{ background: "linear-gradient(90deg, #FF6B35 0%, #FFCA28 30%, #00C875 55%, #579BFC 78%, #A25DDC 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              solutions intelligentes
            </span>{" "}
            pour l'Afrique
          </h1>
          <p className="anim-up" style={{ fontSize: 19, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: "0 auto 36px", maxWidth: 700, animationDelay: "0.2s" }}>
            Inspire IA est une plateforme SaaS née d'une vision ambitieuse : construire des outils technologiques modernes, puissants et réellement adaptés aux réalités des entreprises du continent.
          </p>
          <div className="anim-up" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animationDelay: "0.3s" }}>
            <Link to="/contact" style={{ background: "linear-gradient(135deg, #FF6B35, #A25DDC)", color: "#fff", padding: "14px 26px", borderRadius: 10, textDecoration: "none", fontSize: 15, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 8px 24px rgba(162,93,220,0.35)" }}>
              <Rocket size={16} /> Démarrer avec Inspire IA
            </Link>
            <Link to="/" hash="demo" style={{ background: "rgba(255,255,255,0.06)", color: "#fff", padding: "14px 26px", borderRadius: 10, textDecoration: "none", fontSize: 15, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,0.15)" }}>
              Voir la démo
            </Link>
          </div>
        </div>
      </section>

      {/* STATS bandeau */}
      <section style={{ background: "#fff", borderBottom: "1px solid #F1F1EF", padding: "40px 32px" }}>
        <div className="max-w stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {STATS.map((s, i) => (
            <div key={s.label} className={`reveal reveal-d${i+1}`} style={{ textAlign: "center" }}>
              <div className="syne" style={{ fontSize: 40, fontWeight: 700, background: `linear-gradient(135deg, ${s.color}, ${s.color}AA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: "#787774", marginTop: 8, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="section-pad" style={{ background: "#FAFAF8" }}>
        <div className="max-w" style={{ textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "5px 14px", background: "linear-gradient(135deg, #FF6B3514, #A25DDC14)", border: "1px solid #FF6B3522", borderRadius: 100, fontSize: 12, fontWeight: 800, color: "#FF6B35", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>
            Notre mission
          </div>
          <h2 className="syne h2" style={{ fontSize: 42, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.15, margin: "0 auto 24px", maxWidth: 820 }}>
            Donner à chaque entreprise africaine les moyens de{" "}
            <span style={{ background: "linear-gradient(135deg, #FF6B35, #A25DDC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>mieux s'organiser et grandir</span>.
          </h2>
          <p style={{ fontSize: 17, color: "#5C5C5C", lineHeight: 1.75, margin: "0 auto", maxWidth: 760 }}>
            Dans un contexte où de nombreuses entreprises fonctionnent encore avec WhatsApp, appels, cahiers et fichiers Excel, Inspire IA permet aux organisations africaines de gagner en efficacité, en structure et en performance — en centralisant, en structurant et en automatisant tout ce qui peut l'être.
          </p>
        </div>
      </section>

      {/* PILIERS — cartes colorées */}
      <section className="section-pad" style={{ background: "#fff" }}>
        <div className="max-w">
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "inline-block", padding: "5px 14px", background: "linear-gradient(135deg, #00C87514, #579BFC14)", border: "1px solid #00C87522", borderRadius: 100, fontSize: 12, fontWeight: 800, color: "#00C875", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>
              L'écosystème
            </div>
            <h2 className="syne h2" style={{ fontSize: 42, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.15, margin: "0 auto", maxWidth: 740 }}>
              Un Business OS complet, pensé comme un{" "}
              <span style={{ background: "linear-gradient(135deg, #00C875, #579BFC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>seul produit</span>
            </h2>
          </div>
          <div className="pillars-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {PILLARS.map((p, i) => (
              <div key={p.title} className={`pillar-card reveal reveal-d${(i%3)+1}`} style={{ ["--accent" as never]: p.color }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: p.gradient }} />
                <div style={{ width: 52, height: 52, borderRadius: 13, background: p.gradient, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: `0 8px 20px ${p.color}30` }}>
                  <p.icon size={24} color="#fff" strokeWidth={2.2} />
                </div>
                <div className="syne" style={{ fontSize: 19, fontWeight: 700, color: "#1A1A1A", marginBottom: 8 }}>{p.title}</div>
                <p style={{ fontSize: 14, color: "#787774", lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTEURS — bande sombre, cartes colorées */}
      <section className="section-pad" style={{ background: "#0D0D0D", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div className="max-w" style={{ position: "relative", zIndex: 1 }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.85)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>
              <Globe size={12} /> Pour qui
            </div>
            <h2 className="syne h2" style={{ fontSize: 42, fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: "0 auto", maxWidth: 740 }}>
              Six secteurs,{" "}
              <span style={{ background: "linear-gradient(90deg, #FF6B35, #00C875, #579BFC, #A25DDC, #E2445C, #FFCA28)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>une plateforme</span>
            </h2>
          </div>
          <div className="sectors-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
            {SECTORS.map((s, i) => (
              <div key={s.title} className={`reveal reveal-d${i+1}`} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "28px 16px", textAlign: "center", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = `${s.color}50`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                <div style={{ width: 56, height: 56, margin: "0 auto 14px", borderRadius: 14, background: s.gradient, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 20px ${s.color}40` }}>
                  <s.icon size={26} color="#fff" />
                </div>
                <div className="syne" style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{s.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FONDATEUR — dynamique avec halos colorés */}
      <section className="section-pad" style={{ background: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(162,93,220,0.1) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
        <div className="max-w" style={{ position: "relative", zIndex: 1 }}>
          <div className="founder-grid reveal" style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 56, alignItems: "start" }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: -16, borderRadius: 22, background: "linear-gradient(135deg, #FF6B35, #A25DDC)", opacity: 0.2, filter: "blur(24px)", animation: "pulseGlow 4s ease-in-out infinite" }} />
              <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", aspectRatio: "4/5", background: "#F7F7F5", border: "2px solid #fff", boxShadow: "0 20px 50px rgba(0,0,0,0.12)" }}>
                <img src={ceoPhoto} alt="Ninsemon YHAYE, fondateur d'Inspire IA" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", display: "block" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 20px 18px", background: "linear-gradient(transparent, rgba(0,0,0,0.85))", color: "#fff" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "#FFCA28", letterSpacing: "0.08em", marginBottom: 4 }}>
                    <Star size={11} fill="#FFCA28" /> FOUNDER & CEO
                  </div>
                  <div className="syne" style={{ fontSize: 20, fontWeight: 700 }}>Ninsemon YHAYE</div>
                </div>
              </div>
            </div>
            <div>
              <div style={{ display: "inline-block", padding: "5px 14px", background: "linear-gradient(135deg, #A25DDC14, #FF6B3514)", border: "1px solid #A25DDC22", borderRadius: 100, fontSize: 12, fontWeight: 800, color: "#A25DDC", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>
                Le fondateur
              </div>
              <h2 className="syne h2" style={{ fontSize: 42, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.15, margin: "0 0 28px" }}>
                Une vision, un{" "}
                <span style={{ background: "linear-gradient(135deg, #A25DDC, #FF6B35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>bâtisseur</span>
              </h2>
              <p style={{ fontSize: 16, color: "#3A3A3A", lineHeight: 1.75, margin: "0 0 14px", textAlign: "justify" }}>
                <strong>Ninsemon YHAYE</strong>, né le 24 août 2002, est un étudiant international établi en France. Auteur de plusieurs ouvrages chrétiens comme <em>Consacré à Dieu</em>, titulaire d’un diplôme d’école de commerce, d’une certification en gestion de projet et d’une certification Harvard en Machine Learning &amp; IA with Python, il fonde et dirige plusieurs entreprises dont Productive Energy et Inspire Consulting avec une vision claire : celle d’un entrepreneur qui place l’excellence au service de l’impact.
              </p>
              <style>{`
                @keyframes ventureGradient { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
                @keyframes ventureShine { 0% { transform: translateX(-120%) skewX(-20deg); } 100% { transform: translateX(220%) skewX(-20deg); } }
                .venture-card { position: relative; border-radius: 14px; padding: 1.5px; background-size: 200% 200%; animation: ventureGradient 6s ease infinite; transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; cursor: default; }
                .venture-card:nth-child(2) { animation-delay: .4s; }
                .venture-card:nth-child(3) { animation-delay: .8s; }
                .venture-card:hover { transform: translateY(-8px) scale(1.03); }
                .venture-inner { position: relative; overflow: hidden; background:#fff; border-radius: 12px; padding: 16px 14px; text-align:center; }
                .venture-card:hover .venture-inner::after { content:""; position:absolute; top:0; left:0; width:40%; height:100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent); animation: ventureShine .9s ease forwards; }
                .venture-dot { width:6px; height:6px; border-radius:50%; display:inline-block; margin-right:6px; vertical-align:middle; }
              `}</style>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 24 }}>
                {[
                  { name: "Productive Energy", grad: "linear-gradient(135deg, #FF6B35, #FFCA28, #FF6B35)", dot: "#FF6B35", shadow: "rgba(255,107,53,.35)" },
                  { name: "Inspire Consulting", grad: "linear-gradient(135deg, #00C875, #579BFC, #00C875)", dot: "#00C875", shadow: "rgba(0,200,117,.32)" },
                  { name: "Inspire IA",         grad: "linear-gradient(135deg, #A25DDC, #FF6B35, #A25DDC)", dot: "#A25DDC", shadow: "rgba(162,93,220,.35)" },
                ].map(v => (
                  <div
                    key={v.name}
                    className="venture-card"
                    style={{ background: v.grad, backgroundSize: "200% 200%" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 18px 40px ${v.shadow}`; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div className="venture-inner">
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#787774", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                        <span className="venture-dot" style={{ background: v.dot, boxShadow: `0 0 0 3px ${v.dot}22` }} />
                        Founder
                      </div>
                      <div className="syne" style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>{v.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* VALEURS — bande sombre dégradé */}
      <section style={{ background: "linear-gradient(135deg, #0D0D0D 0%, #1A0A2E 40%, #2D1052 70%, #0D0D0D 100%)", padding: "96px 32px", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", right: "10%", width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.18) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "10%", width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(162,93,220,0.2) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="max-w" style={{ position: "relative", zIndex: 1 }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "inline-block", padding: "5px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.85)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>
              Nos valeurs
            </div>
            <h2 className="syne h2" style={{ fontSize: 42, fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: 0 }}>
              Trois principes qui{" "}
              <span style={{ background: "linear-gradient(90deg, #FF6B35, #00C875, #A25DDC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>guident chaque ligne</span>{" "}
              de produit
            </h2>
          </div>
          <div className="values-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {VALUES.map((v, i) => (
              <div key={v.title} className={`reveal reveal-d${i+1}`} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: 32, transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = `${v.color}50`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ width: 52, height: 52, borderRadius: 13, background: v.gradient, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: `0 8px 20px ${v.color}40` }}>
                  <v.icon size={24} color="#fff" strokeWidth={2.2} />
                </div>
                <div className="syne" style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{v.title}</div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section-pad" style={{ background: "#FAFAF8", textAlign: "center" }}>
        <div className="max-w" style={{ maxWidth: 820 }}>
          <h2 className="syne h2" style={{ fontSize: 40, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.2, margin: "0 0 24px" }}>
            Inspire IA transforme les entreprises africaines grâce à l'{" "}
            <span style={{ background: "linear-gradient(135deg, #FF6B35, #A25DDC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>IA, l'automatisation et le CRM</span>.
          </h2>
          <p style={{ fontSize: 17, color: "#5C5C5C", lineHeight: 1.6, margin: "0 0 32px" }}>
            Découvrez comment notre plateforme peut s'adapter à votre activité.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #FF6B35, #A25DDC)", color: "#fff", padding: "14px 28px", borderRadius: 10, textDecoration: "none", fontSize: 15, fontWeight: 700, boxShadow: "0 8px 24px rgba(162,93,220,0.3)" }}>
              <Rocket size={16} /> Demander une démo
            </Link>
            <Link to="/" hash="sectors" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "#1A1A1A", padding: "14px 28px", borderRadius: 10, textDecoration: "none", fontSize: 15, fontWeight: 700, border: "1px solid #E8E8E5" }}>
              Voir les secteurs
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#111", borderTop: "1px solid #1F1F1F" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "52px 32px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <Logo size="sm" textColor="#fff" />
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", marginTop: 14, lineHeight: 1.7, maxWidth: 280 }}>
                Le Business OS intelligent pour les entreprises africaines. CRM, chatbot WhatsApp et automatisations.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                {SECTORS.map(s => (
                  <div key={s.title} title={s.title} style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}18`, border: `1px solid ${s.color}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <s.icon size={16} color={s.color} />
                  </div>
                ))}
              </div>
            </div>
            {[
              { title: "Secteurs",   links: [{label:"Restaurant",href:"/secteurs/restaurant"},{label:"Immobilier",href:"/secteurs/immobilier"},{label:"Voyage",href:"/secteurs/voyage"},{label:"École",href:"/secteurs/ecole"},{label:"Clinique",href:"/secteurs/clinique"}] },
              { title: "Produit",    links: [{label:"Fonctionnalités",href:"/"},{label:"Démo",href:"/"},{label:"Tarifs",href:"/contact",search:{subject:"tarifs"}},{label:"API",href:"#"}] },
              { title: "Entreprise", links: [{label:"À propos",href:"/about"},{label:"Contact",href:"/contact"},{label:"Conditions",href:"#"},{label:"Confidentialité",href:"#"}] },
            ].map(col => (
              <div key={col.title}>
                <div className="syne" style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>{col.title}</div>
                {col.links.map(l => {
                  const linkProps = l.search ? { to: l.href, search: l.search } : { to: l.href };
                  return (
                    <Link key={l.label} {...linkProps} style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.3)", textDecoration: "none", marginBottom: 10 }}>
                      {l.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{ paddingTop: 24, borderTop: "1px solid #1F1F1F", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.2)" }}>© {new Date().getFullYear()} Inspire IA. Tous droits réservés.</div>
            <div style={{ display: "flex", gap: 6 }}>
              {SECTORS.map((s, i) => (
                <div key={i} style={{ width: 24, height: 4, borderRadius: 2, background: s.gradient }} />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
