// Version mobile dédiée — page Contact
import { useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { Mail, Phone, MapPin, MessageCircle, Send, Check, Tag, Menu, X as XIcon } from "lucide-react";
import { Logo } from "@/components/Logo";

const CONTACTS = [
  { icon: Mail,          label: "Email",     value: "contact@inspire-ia.com", href: "mailto:contact@inspire-ia.com", color: "#A25DDC" },
  { icon: Phone,         label: "Téléphone", value: "+221 77 000 00 00",       href: "tel:+221770000000",            color: "#00C875" },
  { icon: MessageCircle, label: "WhatsApp",  value: "+221 77 000 00 00",       href: "https://wa.me/221770000000",   color: "#FF6B35" },
  { icon: MapPin,        label: "Adresse",   value: "Dakar, Sénégal",          href: "#",                            color: "#579BFC" },
];

const SECTORS = [
  { title: "Restaurant" },
  { title: "Immobilier" },
  { title: "Voyage" },
  { title: "École" },
  { title: "Clinique" },
];

export default function ContactPageMobile() {
  const search = useSearch({ from: "/contact" });
  const isPricing = (search as { subject?: string }).subject === "tarifs";
  const [menu, setMenu] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", company: "", sector: "",
    message: isPricing ? "Bonjour,\n\nJe souhaite recevoir un devis personnalisé." : "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", company: "", sector: "", message: "" });
  };

  return (
    <div style={{ background: "#fff", color: "#1A1A1A", fontFamily: "'DM Sans','Inter',sans-serif", overflowX: "hidden", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .m-syne { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
        .m-field { width:100%; padding:13px 14px; border-radius:10px; border:1.5px solid #E8E8E5; font-size:15px; font-family:inherit; color:#1A1A1A; background:#fff; outline:none; transition:all .2s; }
        .m-field:focus { border-color:#A25DDC; box-shadow:0 0 0 4px rgba(162,93,220,0.12); }
        .m-field::placeholder { color:#AFAFAC; }
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
          <div onClick={e => e.stopPropagation()} style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "82%", maxWidth: 320, background: "#fff", padding: "20px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <Logo size="sm" textColor="#1A1A1A" />
              <button onClick={() => setMenu(false)} style={{ background: "#F4F4F1", border: "none", width: 36, height: 36, borderRadius: 10 }}>
                <XIcon size={18} />
              </button>
            </div>
            <Link to="/"        onClick={() => setMenu(false)} style={{ display: "block", padding: "14px 12px", fontSize: 16, fontWeight: 600, color: "#1A1A1A", textDecoration: "none" }}>Accueil</Link>
            <Link to="/about"   onClick={() => setMenu(false)} style={{ display: "block", padding: "14px 12px", fontSize: 16, fontWeight: 600, color: "#1A1A1A", textDecoration: "none" }}>À propos</Link>
            <Link to="/contact" onClick={() => setMenu(false)} style={{ display: "block", padding: "14px 12px", fontSize: 16, fontWeight: 700, color: "#A25DDC", textDecoration: "none" }}>Contact</Link>
            <div style={{ borderTop: "1px solid #F0F0EE", marginTop: 12, paddingTop: 16 }}>
              <Link to="/login" onClick={() => setMenu(false)} style={{ display: "block", padding: "13px 14px", textAlign: "center", borderRadius: 10, border: "1px solid #E8E8E5", fontSize: 15, fontWeight: 700, color: "#1A1A1A", textDecoration: "none" }}>Se connecter</Link>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section style={{ background: "#0D0D0D", position: "relative", overflow: "hidden", padding: "40px 18px 44px", textAlign: "center" }}>
        <div style={{ position: "absolute", top: "-30%", left: "-20%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.22) 0%, transparent 70%)", filter: "blur(30px)" }} />
        <div style={{ position: "absolute", top: "10%", right: "-25%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(162,93,220,0.3) 0%, transparent 70%)", filter: "blur(30px)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 100, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 14 }}>
            {isPricing ? <><Tag size={12} /> Demande de tarifs</> : <><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00C875" }} /> Réponse sous 24h</>}
          </div>
          <h1 className="m-syne" style={{ fontSize: 30, fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 12px" }}>
            {isPricing ? <>Demandez votre <span style={{ background: "linear-gradient(135deg, #FF6B35, #A25DDC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>devis</span></> : <>Parlons de votre <span style={{ background: "linear-gradient(135deg, #FF6B35, #A25DDC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>projet</span></>}
          </h1>
          <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.55, margin: 0 }}>
            {isPricing ? "Décrivez vos besoins, on vous envoie une offre adaptée." : "Une question, une démo, un partenariat ? On répond rapidement."}
          </p>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section style={{ padding: "28px 16px 8px", background: "#F7F7F5" }}>
        <div className="m-syne" style={{ fontSize: 10, fontWeight: 800, color: "#787774", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Nous joindre</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {CONTACTS.map(c => {
            const Icon = c.icon;
            return (
              <a key={c.label} href={c.href} style={{ textDecoration: "none", background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `${c.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={17} color={c.color} />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#AFAFAC", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.label}</div>
                  <div style={{ fontSize: 13, color: "#1A1A1A", fontWeight: 700, marginTop: 2, wordBreak: "break-word" }}>{c.value}</div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* FORM */}
      <section style={{ padding: "20px 16px 44px", background: "#F7F7F5" }}>
        <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 16, padding: 18, boxShadow: "0 4px 18px rgba(0,0,0,0.04)" }}>
          <h3 className="m-syne" style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>{isPricing ? "Demandez un devis gratuit" : "Envoyez-nous un message"}</h3>
          <p style={{ fontSize: 13, color: "#787774", margin: "0 0 18px" }}>{isPricing ? "Recevez votre estimation sous 24h." : "Les champs marqués * sont obligatoires."}</p>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 5 }}>Nom complet *</label>
              <input className="m-field" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Awa Diop" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 5 }}>Email *</label>
              <input className="m-field" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="awa@entreprise.com" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 5 }}>Entreprise</label>
              <input className="m-field" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Mon entreprise" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 5 }}>Secteur</label>
              <select className="m-field" value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })}>
                <option value="">Sélectionner…</option>
                {SECTORS.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                <option value="autre">Autre</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 5 }}>Votre message *</label>
              <textarea className="m-field" required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Parlez-nous de votre projet…" style={{ resize: "vertical", minHeight: 110 }} />
            </div>
            <button type="submit" style={{ background: "linear-gradient(135deg, #FF6B35, #A25DDC)", color: "#fff", padding: "14px 18px", borderRadius: 11, border: "none", fontSize: 15, fontWeight: 800, fontFamily: "inherit", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", boxShadow: "0 8px 24px rgba(162,93,220,0.3)", marginTop: 4 }}>
              {sent ? <><Check size={16} /> Message envoyé</> : <>Envoyer le message <Send size={16} /></>}
            </button>
            <p style={{ fontSize: 11, color: "#AFAFAC", textAlign: "center", margin: "2px 0 0" }}>En envoyant, vous acceptez d'être recontacté.</p>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#111", padding: "32px 16px 24px" }}>
        <Logo size="sm" textColor="#fff" />
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, margin: "12px 0 22px" }}>Le Business OS intelligent pour les entreprises africaines.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 22 }}>
          <div>
            <div className="m-syne" style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Entreprise</div>
            <Link to="/about"   style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8 }}>À propos</Link>
            <Link to="/contact" style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8 }}>Contact</Link>
            <Link to="/login"   style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8 }}>Se connecter</Link>
          </div>
          <div>
            <div className="m-syne" style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Produit</div>
            <Link to="/"        hash="features" style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8 }}>Fonctionnalités</Link>
            <Link to="/"        hash="demo"     style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8 }}>Démo</Link>
            <Link to="/contact" search={{ subject: "tarifs" }} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8 }}>Tarifs</Link>
          </div>
        </div>
        <div style={{ paddingTop: 18, borderTop: "1px solid #1F1F1F", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          © {new Date().getFullYear()} Inspire IA. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}