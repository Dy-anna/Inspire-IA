// src/pages/ContactPage.tsx
import { useState, useEffect } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { ArrowRight, Mail, Phone, MapPin, MessageCircle, Send, Check, Tag, Utensils, Home as HomeIcon, Plane, GraduationCap, Stethoscope } from "lucide-react";
import { Logo } from "@/components/Logo";
import ContactPageMobile from "@/pages/ContactPageMobile";
import { useIsMobile } from "@/hooks/useIsMobile";

const SECTORS = [
  { color: "#FF6B35", gradient: "linear-gradient(135deg, #FF6B35, #FF9A6C)", icon: Utensils, title: "Restaurant" },
  { color: "#00C875", gradient: "linear-gradient(135deg, #00C875, #00E28A)", icon: HomeIcon, title: "Immobilier" },
  { color: "#579BFC", gradient: "linear-gradient(135deg, #579BFC, #85BAFF)", icon: Plane, title: "Voyage" },
  { color: "#A25DDC", gradient: "linear-gradient(135deg, #A25DDC, #C48AF0)", icon: GraduationCap, title: "École" },
  { color: "#E2445C", gradient: "linear-gradient(135deg, #E2445C, #FF6B80)", icon: Stethoscope, title: "Clinique" },
];

const CONTACTS = [
  { icon: Mail,          label: "Email",     value: "contact@inspire-ia.com", href: "mailto:contact@inspire-ia.com", color: "#A25DDC" },
  { icon: Phone,         label: "Téléphone", value: "+221 77 000 00 00",       href: "tel:+221770000000",            color: "#00C875" },
  { icon: MessageCircle, label: "WhatsApp",  value: "+221 77 000 00 00",       href: "https://wa.me/221770000000",   color: "#FF6B35" },
  { icon: MapPin,        label: "Adresse",   value: "Dakar, Sénégal",          href: "#",                            color: "#579BFC" },
];

export default function ContactPage() {
  const search = useSearch({ from: "/contact" });
  const isPricing = search.subject === "tarifs";

  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    sector: "",
    message: isPricing ? "Bonjour,\n\nJe souhaite recevoir un devis personnalisé pour mon entreprise.\n\nMerci de me faire parvenir vos offres et disponibilités." : "",
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", company: "", sector: "", message: "" });
  };

  if (isMobile) return <ContactPageMobile />;

  return (
    <div className="public-page" style={{ background: "#fff", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@600;700;800family=Space+Grotesk:wght@500;600;700&display=swap');
        .syne { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
        .nav-a { color:#1A1A1A; text-decoration:none; font-size:14px; font-weight:600; position:relative; transition:color 0.2s; }
        .nav-a:hover { color:#A25DDC; }
        .field { width:100%; padding:14px 16px; border-radius:10px; border:1.5px solid #E8E8E5; font-size:15px; font-family:inherit; color:#1A1A1A; background:#fff; transition:all 0.2s; outline:none; }
        .field:focus { border-color:#A25DDC; box-shadow:0 0 0 4px rgba(162,93,220,0.12); }
        .field::placeholder { color:#AFAFAC; }
        .submit-btn { background:linear-gradient(135deg, #FF6B35, #A25DDC); color:#fff; padding:16px 28px; border-radius:11px; border:none; font-size:15px; font-weight:800; font-family:inherit; display:inline-flex; align-items:center; justify-content:center; gap:8px; cursor:pointer; box-shadow:0 8px 24px rgba(162,93,220,0.3); transition:all 0.2s; }
        .submit-btn:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(162,93,220,0.4); }
      `}</style>

      {/* ── NAV ───────────────────────────────────────────── */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: scrolled ? "rgba(255,255,255,0.97)" : "#fff", backdropFilter: "blur(12px)", borderBottom: scrolled ? "1px solid #F1F1EF" : "1px solid #F7F7F5", transition: "all 0.3s" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none" }}><Logo size="sm" textColor="#1A1A1A" /></Link>
          <nav style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <Link to="/" hash="features" className="nav-a">Fonctionnalités</Link>
            <Link to="/" hash="sectors" className="nav-a">Secteurs</Link>
            <Link to="/" hash="demo" className="nav-a">Démo</Link>
            <Link to="/about" className="nav-a">À propos</Link>
            <Link to="/contact" className="nav-a" style={{ color: "#A25DDC" }}>Contact</Link>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link to="/login" style={{ color: "#1A1A1A", textDecoration: "none", fontSize: 14, fontWeight: 600, padding: "8px 14px" }}>Se connecter</Link>
            <Link to="/contact" style={{ background: "linear-gradient(135deg, #FF6B35, #A25DDC)", color: "#fff", padding: "10px 20px", borderRadius: 9, textDecoration: "none", fontSize: 14, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 6, boxShadow: "0 4px 16px rgba(162,93,220,0.3)" }}>
              Contacter <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section style={{ background: "#0D0D0D", position: "relative", overflow: "hidden", padding: "88px 32px 96px" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-10%", left: "15%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.18) 0%, transparent 70%)", filter: "blur(20px)" }} />
          <div style={{ position: "absolute", top: "10%", right: "10%", width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(162,93,220,0.22) 0%, transparent 70%)", filter: "blur(20px)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
        </div>
        <div style={{ maxWidth: 920, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 100, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 24 }}>
            {isPricing ? <><Tag size={14} /> Demande de tarifs</> : <><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00C875" }} /> Réponse sous 24h</>}
          </div>
          <h1 className="syne" style={{ fontSize: 64, fontWeight: 700, color: "#fff", lineHeight: 1.05, margin: "0 0 20px" }}>
            {isPricing ? (
              <>Demandez votre <span style={{ background: "linear-gradient(135deg, #FF6B35, #A25DDC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>devis</span> personnalisé</>
            ) : (
              <>Parlons de votre <span style={{ background: "linear-gradient(135deg, #FF6B35, #A25DDC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>projet</span></>
            )}
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: "0 auto", maxWidth: 600 }}>
            {isPricing
              ? "Décrivez-nous vos besoins et nous vous enverrons une offre adaptée à votre secteur et à la taille de votre entreprise."
              : "Une question, une démo personnalisée, un partenariat ? Notre équipe vous répond rapidement."}
          </p>
        </div>
      </section>

      {/* ── CONTENT ───────────────────────────────────────── */}
      <section style={{ padding: "80px 32px", background: "#F7F7F5" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 40 }}>
          {/* Contact cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div className="syne" style={{ fontSize: 11, fontWeight: 700, color: "#787774", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Nous joindre</div>
              <h2 className="syne" style={{ fontSize: 28, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.15, margin: "0 0 12px" }}>
                Plusieurs canaux à votre écoute
              </h2>
              <p style={{ fontSize: 15, color: "#787774", lineHeight: 1.65, margin: "0 0 24px" }}>
                Choisissez le canal qui vous convient. Notre équipe est basée en Afrique de l'Ouest et répond en français.
              </p>
            </div>
            {CONTACTS.map(c => {
              const Icon = c.icon;
              return (
                <a key={c.label} href={c.href} style={{ textDecoration: "none", background: "#fff", border: "1px solid #E8E8E5", borderRadius: 14, padding: 18, display: "flex", alignItems: "center", gap: 14, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 28px ${c.color}22`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8E8E5"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: `${c.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={20} color={c.color} strokeWidth={2} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#AFAFAC", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.label}</div>
                    <div style={{ fontSize: 15, color: "#1A1A1A", fontWeight: 700, marginTop: 2 }}>{c.value}</div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Form */}
          <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 18, padding: 36, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <h3 className="syne" style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", margin: "0 0 6px" }}>{isPricing ? "Demandez un devis gratuit" : "Envoyez-nous un message"}</h3>
            <p style={{ fontSize: 14, color: "#787774", margin: "0 0 24px" }}>{isPricing ? "Remplissez ce formulaire et recevez votre estimation sous 24h." : "Tous les champs marqués d'un * sont obligatoires."}</p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", display: "block", marginBottom: 6 }}>Nom complet *</label>
                  <input className="field" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Awa Diop" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", display: "block", marginBottom: 6 }}>Email *</label>
                  <input className="field" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="awa@entreprise.com" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", display: "block", marginBottom: 6 }}>Entreprise</label>
                  <input className="field" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Mon entreprise" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", display: "block", marginBottom: 6 }}>Secteur</label>
                  <select className="field" value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })}>
                    <option value="">Sélectionner…</option>
                    {SECTORS.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", display: "block", marginBottom: 6 }}>Votre message *</label>
                <textarea className="field" required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Parlez-nous de votre projet, vos besoins…" style={{ resize: "vertical", minHeight: 120 }} />
              </div>

              <button type="submit" className="submit-btn" style={{ marginTop: 8 }}>
                {sent ? <><Check size={16} /> Message envoyé</> : <>Envoyer le message <Send size={16} /></>}
              </button>
              <p style={{ fontSize: 12, color: "#AFAFAC", textAlign: "center", margin: "4px 0 0" }}>
                En envoyant ce message, vous acceptez d'être recontacté par notre équipe.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
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
              { title: "Produit",    links: [{label:"Fonctionnalités",href:"/#features"},{label:"Démo",href:"/#demo"},{label:"Tarifs",href:"/contact",search:{subject:"tarifs"}},{label:"API",href:"#"}] },
              { title: "Entreprise", links: [{label:"À propos",href:"/about"},{label:"Contact",href:"/contact"},{label:"Conditions",href:"#"},{label:"Confidentialité",href:"#"}] },
            ].map(col => (
              <div key={col.title}>
                <div className="syne" style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>{col.title}</div>
                {col.links.map(l => {
                  const linkProps = l.search ? { to: l.href, search: l.search } : { to: l.href };
                  return (
                    <Link key={l.label} {...linkProps} style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.3)", textDecoration: "none", marginBottom: 10 }}>{l.label}</Link>
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
