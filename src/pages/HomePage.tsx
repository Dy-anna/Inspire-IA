// src/pages/HomePage.tsx
// Design Monday.com-inspired — couleurs vives, sections colorées, product mockup,
// typographie massive, animations scroll, démo chatbot intégrée

import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard, MessageCircle, BarChart2, ArrowRight,
  Utensils, Home as HomeIcon, Plane, GraduationCap, Stethoscope, Hotel, Calendar,
  Play, Check, Star, Zap, Shield, Globe, ChevronDown,
  Users, TrendingUp, Clock, Menu, X as XIcon,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { setDemoMode } from "@/lib/supabase";
import type { DemoSector } from "@/lib/demoFixtures";
import HomePageMobile from "@/pages/HomePageMobile";
import { useIsMobile } from "@/hooks/useIsMobile";

const DEMO_SECTORS: { key: DemoSector; title: string; company: string; color: string; icon: any; tag: string }[] = [
  { key: "restaurant",     title: "Restaurant",    company: "Le Baobab",          color: "#FF6B35", icon: Utensils, tag: "Commandes WhatsApp" },
  { key: "real_estate",    title: "Immobilier",    company: "Sahel Immo",         color: "#00C875", icon: HomeIcon, tag: "Leads & biens" },
  { key: "travel_agency",  title: "Voyage",        company: "Téranga Travel",     color: "#579BFC", icon: Plane, tag: "Réservations" },
  { key: "private_school", title: "École",         company: "Les Palmiers",       color: "#A25DDC", icon: GraduationCap, tag: "Élèves & notes" },
  { key: "private_clinic", title: "Clinique",      company: "Médicis",            color: "#E2445C", icon: Stethoscope, tag: "Agenda RDV" },
  { key: "hotel",          title: "Hôtellerie",    company: "Hôtel Téranga",      color: "#FF6B35", icon: Hotel, tag: "Chambres & réservations" },
  { key: "event",          title: "Événementiel",  company: "Inspire Event Panko",color: "#F59E0B", icon: Calendar, tag: "Traiteur & food stand" },
];

function launchDemo(sector: DemoSector) {
  setDemoMode(true, sector);
  window.location.href = "/app/dashboard";
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const SECTORS = [
  { icon: Utensils,      title: "Restaurant",      desc: "Commandes WhatsApp, réservations et menu en temps réel.",      color: "#FF6B35", bg: "#FFF4EF", gradient: "linear-gradient(135deg, #FF6B35, #FF9A6C)" },
  { icon: HomeIcon,      title: "Immobilier",       desc: "Pipeline de leads, biens et visites pour vendre plus vite.",   color: "#00C875", bg: "#EDFAF3", gradient: "linear-gradient(135deg, #00C875, #00E28A)" },
  { icon: Plane,         title: "Voyage",            desc: "Réservations, packages et paiements en un seul endroit.",      color: "#579BFC", bg: "#EEF6FF", gradient: "linear-gradient(135deg, #579BFC, #85BAFF)" },
  { icon: GraduationCap, title: "École privée",      desc: "Inscriptions, notes et présences automatisées.",               color: "#A25DDC", bg: "#F5F0FF", gradient: "linear-gradient(135deg, #A25DDC, #C48AF0)" },
  { icon: Stethoscope,         title: "Clinique",          desc: "Agenda RDV, patients et rappels WhatsApp automatiques.",       color: "#E2445C", bg: "#FFF0EE", gradient: "linear-gradient(135deg, #E2445C, #FF6B80)" },
  { icon: Hotel,         title: "Hôtellerie",        desc: "Chambres, réservations et housekeeping centralisés.",          color: "#FF6B35", bg: "#FFF4EC", gradient: "linear-gradient(135deg, #FF6B35, #FF9A6C)" },
  { icon: Calendar,      title: "Événementiel",      desc: "Traiteur, food stand et animation culinaire pilotés en P&L.",  color: "#F59E0B", bg: "#FEF3C7", gradient: "linear-gradient(135deg, #F59E0B, #FCD34D)" },
];

const FEATURES = [
  { icon: LayoutDashboard, title: "CRM adapté à votre métier",         desc: "Interface unique pour commandes, clients, leads ou patients.",          color: "#A25DDC", number: "01" },
  { icon: MessageCircle,   title: "Chatbox WhatsApp IA 24h/24",        desc: "Répondez automatiquement, prenez des commandes, qualifiez des leads.",   color: "#00C875", number: "02" },
  { icon: BarChart2,       title: "Analytics et rapports intelligents", desc: "Tableaux de bord en temps réel, opportunités identifiées par l'IA.",     color: "#579BFC", number: "03" },
  { icon: Zap,             title: "Automatisations Make",               desc: "Rappels, relances et confirmations calculés automatiquement.",           color: "#FF6B35", number: "04" },
  { icon: Shield,          title: "Données sécurisées",                 desc: "Hébergement Europe, chiffrement bout-en-bout.",                          color: "#E2445C", number: "05" },
  { icon: Globe,           title: "Pensé pour l'Afrique",               desc: "Multidevise, WhatsApp-first, optimisé mobile.",                         color: "#FFCA28", number: "06" },
];

const TESTIMONIALS = [
  { quote: "Nos commandes WhatsApp sont gérées sans erreur. On a doublé notre volume du soir en 3 mois.", name: "Awa D.", role: "Restaurant Le Baobab", country: "🇸🇳 Dakar", color: "#FF6B35", icon: Utensils },
  { quote: "Le pipeline de leads me fait gagner 5 heures par semaine. Plus rien ne tombe entre les mailles.", name: "Joël M.", role: "Ivoire Habitat", country: "🇨🇮 Abidjan", color: "#00C875", icon: HomeIcon },
  { quote: "Les parents reçoivent les rappels d'absence automatiquement. L'école tourne mieux.", name: "Mariam K.", role: "École Les Lauriers", country: "🇧🇯 Cotonou", color: "#A25DDC", icon: GraduationCap },
  { quote: "Les rappels de rendez-vous automatiques ont réduit nos no-shows de 60%. Un vrai soulagement.", name: "Dr. Kouassi", role: "Clinique Saint-Joseph", country: "🇨🇮 Yamoussoukro", color: "#E74C3C", icon: Stethoscope },
  { quote: "Nos clients réservent leurs voyages directement via WhatsApp. C'est devenu notre premier canal de vente.", name: "Fatou S.", role: "Sahel Travel", country: "🇸🇳 Dakar", color: "#2383E2", icon: Plane },
  { quote: "L'IA répond aux questions des clients 24/7. Je dors enfin tranquille le week-end.", name: "Ibrahim T.", role: "Niger Foods", country: "🇳🇪 Niamey", color: "#FF6B35", icon: Utensils },
  { quote: "On a centralisé WhatsApp, Instagram et Facebook. Plus aucun message ne se perd.", name: "Aminata B.", role: "Bamako Immobilier", country: "🇲🇱 Bamako", color: "#00C875", icon: HomeIcon },
  { quote: "Le suivi des paiements de scolarité est automatisé. On a réduit les impayés de moitié.", name: "Pierre N.", role: "Institut Lumière", country: "🇨🇲 Yaoundé", color: "#A25DDC", icon: GraduationCap },
  { quote: "Inspire IA comprend nos clients en français, wolof, bambara. C'est ça, une vraie solution africaine.", name: "Khadija M.", role: "Atlas Voyages", country: "🇲🇦 Casablanca", color: "#2383E2", icon: Plane },
  { quote: "Mes commerciaux ont enfin un outil simple. Adoption 100% en une semaine.", name: "Serge K.", role: "Lomé Properties", country: "🇹🇬 Lomé", color: "#00C875", icon: HomeIcon },
];

const STATS = [
  { value: "500+", label: "Entreprises actives", icon: Users,     color: "#FF6B35" },
  { value: "6",    label: "Secteurs couverts",   icon: Globe,     color: "#00C875" },
  { value: "98%",  label: "Satisfaction client", icon: Star,      color: "#579BFC" },
  { value: "3×",   label: "Croissance moyenne",  icon: TrendingUp,color: "#A25DDC" },
];

// ─── Scroll-reveal hook ────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    // Immediate check: if already in viewport, show right away
    const rect = ref.current.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh && rect.bottom > 0) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(ref.current);
    // Safety fallback: ensure content shows even if observer never fires in this environment
    const timeout = window.setTimeout(() => setVisible(true), 1200);
    return () => { obs.disconnect(); window.clearTimeout(timeout); };
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

// ─── Product Mockup ────────────────────────────────────────────────────────────

function ProductMockup({ sector }: { sector: typeof SECTORS[0] }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.14)", border: "1px solid #E8E8E5", width: "100%" }}>
      {/* Top bar */}
      <div style={{ background: "#1A1A1A", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#FF5F57","#FFBE2E","#28CA41"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ flex: 1, background: "#2A2A2A", borderRadius: 4, height: 20, marginLeft: 8, display: "flex", alignItems: "center", padding: "0 10px" }}>
          <span style={{ fontSize: 10, color: "#787774" }}>app.inspire-ia.com</span>
        </div>
      </div>
      {/* Sidebar + Content */}
      <div style={{ display: "flex", height: 320 }}>
        {/* Sidebar */}
        <div style={{ width: 52, background: "#1C1F3B", display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 0", gap: 14 }}>
          {[LayoutDashboard, MessageCircle, Users, BarChart2, sector.icon].map((Icon, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: i === 0 ? sector.color : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={14} color={i === 0 ? "#fff" : "rgba(255,255,255,0.3)"} />
            </div>
          ))}
        </div>
        {/* Main */}
        <div style={{ flex: 1, background: "#F7F7F5", padding: "16px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#1A1A1A" }}>Tableau de bord</div>
              <div style={{ fontSize: 10, color: "#AFAFAC" }}>{sector.title}</div>
            </div>
            <div style={{ width: 60, height: 22, background: sector.color, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 9, color: "#fff", fontWeight: 700 }}>+ Nouveau</span>
            </div>
          </div>
          {/* KPI row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
            {[["47", "Auj."], ["12k", "CA"], ["98%", "Satisf."]].map(([v, l], i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 7, padding: "8px 10px", borderTop: `2px solid ${sector.color}` }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>{v}</div>
                <div style={{ fontSize: 9, color: "#AFAFAC" }}>{l}</div>
              </div>
            ))}
          </div>
          {/* Bar chart mock */}
          <div style={{ background: "#fff", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#AFAFAC", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Activité — 7 jours</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 50 }}>
              {[60, 80, 55, 90, 70, 95, 75].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "3px 3px 0 0", background: i === 5 ? sector.color : `${sector.color}33`, transition: "height 0.3s" }} />
              ))}
            </div>
          </div>
        </div>
        {/* Chat panel */}
        <div style={{ width: 130, background: "#fff", borderLeft: "1px solid #F1F1EF", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "10px 10px 8px", borderBottom: "1px solid #F1F1EF" }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: "#1A1A1A", marginBottom: 2 }}>WhatsApp</div>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#25D366" }} />
              <span style={{ fontSize: 8, color: "#25D366", fontWeight: 600 }}>3 nouveaux</span>
            </div>
          </div>
          {[
            { name: "Awa D.", msg: "Je voudrais commander...", time: "10:24", unread: 2 },
            { name: "Joël M.", msg: "Merci pour la réponse", time: "09:55", unread: 0 },
            { name: "Marie K.", msg: "RDV demain 14h ?", time: "09:30", unread: 1 },
          ].map((c, i) => (
            <div key={i} style={{ padding: "7px 8px", borderBottom: "1px solid #F7F7F5", display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: sector.color, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 8, color: "#fff", fontWeight: 800 }}>{c.name[0]}</span>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: "#1A1A1A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                <div style={{ fontSize: 7, color: "#AFAFAC", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.msg}</div>
              </div>
              {c.unread > 0 && <div style={{ width: 13, height: 13, borderRadius: "50%", background: sector.color, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 7, color: "#fff", fontWeight: 800 }}>{c.unread}</span>
              </div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Demo CRM Restaurant ──────────────────────────────────────────────────────

type OrderStatus = "new" | "prep" | "ready" | "done";
type Order = {
  id: string;
  client: string;
  items: string;
  total: number;
  time: string;
  status: OrderStatus;
};

const INITIAL_ORDERS: Order[] = [
  { id: "#1042", client: "Aïcha Diop",    items: "2× Poulet braisé · 1× Salade",       total: 14500, time: "19:00", status: "new" },
  { id: "#1041", client: "Moussa Traoré", items: "1× Thieboudienne · 2× Bissap",       total: 9800,  time: "18:45", status: "prep" },
  { id: "#1040", client: "Fatou Ndiaye",  items: "3× Yassa poulet",                    total: 13500, time: "18:30", status: "prep" },
  { id: "#1039", client: "Jean K.",       items: "1× Mafé bœuf · 1× Jus gingembre",    total: 6200,  time: "18:15", status: "ready" },
  { id: "#1038", client: "Awa Sow",       items: "2× Pastels · 1× Café",               total: 3400,  time: "18:00", status: "done" },
];

const NEW_ORDER: Order = {
  id: "#1043", client: "Ibrahim B.", items: "1× Poulet DG · 1× Coca",
  total: 7800, time: "19:05", status: "new",
};

const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  new:   { label: "Nouvelle",      color: "#FF6B35", bg: "rgba(255,107,53,0.12)" },
  prep:  { label: "En préparation", color: "#FFB020", bg: "rgba(255,176,32,0.12)" },
  ready: { label: "Prête",          color: "#579BFC", bg: "rgba(87,155,252,0.12)" },
  done:  { label: "Livrée",         color: "#00C875", bg: "rgba(0,200,117,0.12)" },
};

function DemoWidget() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [playing, setPlaying] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setOrders(INITIAL_ORDERS);
    setHighlightId(null);
    setPlaying(false);
  };

  const play = () => {
    reset();
    setPlaying(true);
    // 1) New WhatsApp order arrives
    timers.current.push(setTimeout(() => {
      setOrders((prev) => [NEW_ORDER, ...prev]);
      setHighlightId(NEW_ORDER.id);
    }, 600));
    // 2) Move to "en préparation"
    timers.current.push(setTimeout(() => {
      setOrders((prev) => prev.map((o) => o.id === NEW_ORDER.id ? { ...o, status: "prep" } : o));
    }, 2200));
    // 3) Ready
    timers.current.push(setTimeout(() => {
      setOrders((prev) => prev.map((o) => o.id === NEW_ORDER.id ? { ...o, status: "ready" } : o));
    }, 3800));
    // 4) Delivered
    timers.current.push(setTimeout(() => {
      setOrders((prev) => prev.map((o) => o.id === NEW_ORDER.id ? { ...o, status: "done" } : o));
      setPlaying(false);
      setTimeout(() => setHighlightId(null), 600);
    }, 5400));
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const totalDay = orders.reduce((s, o) => s + o.total, 0);
  const countDay = orders.length;
  const avg = Math.round(totalDay / countDay);

  const columns: OrderStatus[] = ["new", "prep", "ready", "done"];

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)",
      overflow: "hidden",
      maxWidth: 1080,
      margin: "0 auto",
    }}>
      {/* Browser bar */}
      <div style={{ background: "#F1F1EF", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #E8E8E5" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FEBC2E" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
        </div>
        <div style={{ flex: 1, textAlign: "center", fontSize: 12, color: "#787774", fontWeight: 500 }}>
          app.inspire-ia.com / crm / commandes
        </div>
      </div>

      {/* App layout */}
      <div style={{ display: "grid", gridTemplateColumns: "190px 1fr", minHeight: 520 }}>
        {/* Sidebar */}
        <div style={{ background: "#1C1F3B", padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ padding: "4px 8px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "linear-gradient(135deg, #FF6B35, #FF9A6C)", display: "flex", alignItems: "center", justifyContent: "center" }}><Utensils size={13} color="#fff" /></div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: "0.06em" }}>INSPIRE IA</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Le Baobab</div>
              </div>
            </div>
          </div>
          {[
            { icon: LayoutDashboard, label: "Tableau de bord" },
            { icon: Utensils,        label: "Commandes", active: true },
            { icon: Users,           label: "Clients" },
            { icon: MessageCircle,   label: "Chatbox" },
            { icon: BarChart2,       label: "Analytics" },
          ].map(({ icon: Icon, label, active }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "7px 10px", borderRadius: 6, fontSize: 12,
              color: active ? "#fff" : "rgba(255,255,255,0.5)",
              background: active ? "rgba(255,255,255,0.1)" : "transparent",
              fontWeight: active ? 600 : 400,
            }}>
              <Icon size={14} /> {label}
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{ background: "#F7F7F5", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>Commandes du jour</div>
              <div style={{ fontSize: 11, color: "#787774", marginTop: 2 }}>Mises à jour en temps réel depuis WhatsApp</div>
            </div>
            <button onClick={playing ? undefined : play} disabled={playing} style={{
              padding: "8px 14px",
              background: playing ? "#E8E8E5" : "linear-gradient(135deg, #FF6B35, #FF9A6C)",
              color: playing ? "#787774" : "#fff",
              border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700,
              cursor: playing ? "not-allowed" : "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {playing
                ? <><span style={{ width: 11, height: 11, borderRadius: "50%", border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#1A1A1A", display: "inline-block", animation: "spin 0.8s linear infinite" }} />Simulation en cours…</>
                : <><Play size={12} fill="white" />Simuler une commande WhatsApp</>}
            </button>
          </div>

          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { label: "CA du jour",     value: `${totalDay.toLocaleString("fr-FR")} XOF`, color: "#00C875" },
              { label: "Commandes",      value: countDay,                                  color: "#579BFC" },
              { label: "Panier moyen",   value: `${avg.toLocaleString("fr-FR")} XOF`,      color: "#A25DDC" },
            ].map((k) => (
              <div key={k.label} style={{ background: "#fff", borderRadius: 10, padding: "10px 12px", border: "1px solid #E8E8E5" }}>
                <div style={{ fontSize: 10, color: "#787774", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{k.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", marginTop: 2 }}>{k.value}</div>
                <div style={{ height: 3, borderRadius: 2, background: k.color, marginTop: 6, opacity: 0.8 }} />
              </div>
            ))}
          </div>

          {/* Kanban */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, flex: 1 }}>
            {columns.map((status) => {
              const meta = STATUS_META[status];
              const cards = orders.filter((o) => o.status === status);
              return (
                <div key={status} style={{ background: "#fff", borderRadius: 10, padding: 10, border: "1px solid #E8E8E5", display: "flex", flexDirection: "column", gap: 8, minHeight: 280 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: meta.color }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#1A1A1A", textTransform: "uppercase", letterSpacing: "0.04em" }}>{meta.label}</span>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: meta.color, background: meta.bg, padding: "2px 7px", borderRadius: 100 }}>{cards.length}</span>
                  </div>
                  {cards.map((o) => {
                    const isHi = o.id === highlightId;
                    return (
                      <div key={o.id} style={{
                        background: isHi ? meta.bg : "#FAFAF9",
                        border: `1px solid ${isHi ? meta.color : "#EFEFEC"}`,
                        borderRadius: 8, padding: "8px 10px",
                        boxShadow: isHi ? `0 6px 16px ${meta.bg}` : "none",
                        transition: "all 0.35s ease",
                        animation: "fadeUp 0.35s ease",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: meta.color }}>{o.id}</span>
                          <span style={{ fontSize: 9, color: "#787774" }}>{o.time}</span>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#1A1A1A", marginBottom: 2 }}>{o.client}</div>
                        <div style={{ fontSize: 10.5, color: "#787774", lineHeight: 1.4, marginBottom: 6 }}>{o.items}</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: "#1A1A1A" }}>{o.total.toLocaleString("fr-FR")} XOF</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, color: "#00A884", fontWeight: 600 }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#25D366" }} />WhatsApp
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {cards.length === 0 && (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#C7C7C2" }}>—</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeSector, setActiveSector] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveSector(i => (i + 1) % SECTORS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const currentSector = SECTORS[activeSector];

  if (isMobile) return <HomePageMobile />;

  return (
    <div className="public-page" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", color: "#1A1A1A", background: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .syne { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes floatY { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-8px); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes typingDot { 0%,80%,100% { transform:scale(0.8); opacity:0.4; } 40% { transform:scale(1.1); opacity:1; } }
        @keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes fadeSlide { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
        .nav-a { color:#1A1A1A; font-size:14px; font-weight:500; text-decoration:none; padding:6px 2px; border-bottom:2px solid transparent; transition:border-color 0.2s; }
        .nav-a:hover { border-color:#1A1A1A; }
        .sector-tab { transition:all 0.2s; cursor:pointer; }
        .sector-tab:hover { transform:translateY(-2px); }
        .feat-card { transition:all 0.25s; }
        .feat-card:hover { transform:translateY(-5px); box-shadow:0 20px 48px rgba(0,0,0,0.1) !important; }
        .testi-card { transition:all 0.2s; }
        .testi-card:hover { transform:translateY(-4px); box-shadow:0 16px 48px rgba(0,0,0,0.1) !important; }
        .cta-white { background:#fff; color:#1A1A1A; padding:14px 28px; border-radius:10px; text-decoration:none; font-size:15px; font-weight:800; display:inline-flex; align-items:center; gap:8px; transition:all 0.2s; font-family:'DM Sans',sans-serif; box-shadow:0 4px 20px rgba(255,255,255,0.15); }
        .cta-white:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(255,255,255,0.25); }
        .cta-outline { background:transparent; color:#fff; padding:14px 28px; border-radius:10px; text-decoration:none; font-size:15px; font-weight:700; display:inline-flex; align-items:center; gap:8px; border:2px solid rgba(255,255,255,0.3); transition:all 0.2s; font-family:'DM Sans',sans-serif; }
        .cta-outline:hover { background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.5); }
        .cta-dark { background:#1A1A1A; color:#fff; padding:14px 28px; border-radius:10px; text-decoration:none; font-size:15px; font-weight:800; display:inline-flex; align-items:center; gap:8px; transition:all 0.2s; font-family:'DM Sans',sans-serif; }
        .cta-dark:hover { background:#333; transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.2); }
      `}</style>

      {/* ── NAVIGATION ──────────────────────────────────────────────── */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: scrolled ? "rgba(255,255,255,0.97)" : "#fff", backdropFilter: "blur(12px)", borderBottom: scrolled ? "1px solid #F1F1EF" : "1px solid #F7F7F5", transition: "all 0.3s" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none" }}><Logo size="sm" textColor="#1A1A1A" /></Link>

          <nav style={{ display: "flex", alignItems: "center", gap: 36 }}>
            {[["#features","Fonctionnalités"],["#sectors","Secteurs"],["#demo","Démo"],["#testimonials","Ils témoignent"]].map(([href, label]) => (
              <a key={href} href={href} className="nav-a">{label}</a>
            ))}
            <Link to="/about" className="nav-a">À propos</Link>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link to="/login" style={{ color: "#1A1A1A", textDecoration: "none", fontSize: 14, fontWeight: 600, padding: "8px 14px" }}>Se connecter</Link>
            <Link to="/contact" style={{ background: "linear-gradient(135deg, #FF6B35, #A25DDC)", color: "#fff", padding: "10px 20px", borderRadius: 9, textDecoration: "none", fontSize: 14, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 6, boxShadow: "0 4px 16px rgba(162,93,220,0.3)", fontFamily: "inherit", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(162,93,220,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(162,93,220,0.3)"; }}>
              Contacter <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section style={{ background: "#0D0D0D", position: "relative", overflow: "hidden", minHeight: "92vh", display: "flex", alignItems: "center" }}>
        {/* Gradient mesh */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-10%", left: "15%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.18) 0%, transparent 70%)", filter: "blur(20px)" }} />
          <div style={{ position: "absolute", top: "20%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(162,93,220,0.2) 0%, transparent 70%)", filter: "blur(20px)" }} />
          <div style={{ position: "absolute", bottom: "-5%", left: "40%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(87,155,252,0.15) 0%, transparent 70%)", filter: "blur(20px)" }} />
          {/* Grid */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
        </div>

        {/* Floating sector pills */}
        {[
          { s: SECTORS[0], top: "18%", right: "6%",  anim: "0s" },
          { s: SECTORS[2], top: "52%", right: "12%", anim: "1.2s" },
          { s: SECTORS[4], bottom: "22%", left: "5%", anim: "0.6s" },
        ].map(({ s, top, right, bottom, left, anim }: any) => (
          <div key={s.title} style={{ position: "absolute", top, right, bottom, left, zIndex: 2, animation: `floatY 3.5s ease-in-out ${anim} infinite`, pointerEvents: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "rgba(255,255,255,0.07)", border: `1px solid ${s.color}30`, borderRadius: 100, backdropFilter: "blur(12px)" }}>
              <s.icon size={16} color={s.color} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.65)" }}>{s.title}</span>
            </div>
          </div>
        ))}

        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "80px 32px", position: "relative", zIndex: 3, width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 64, alignItems: "center" }}>
            {/* Left — copy */}
            <div>
              {/* Badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 12px 5px 6px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, marginBottom: 28, animation: "fadeUp 0.6s ease" }}>
                <div style={{ background: "linear-gradient(135deg, #FF6B35, #A25DDC)", borderRadius: 100, padding: "2px 9px" }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", letterSpacing: "0.06em" }}>NOUVEAU</span>
                </div>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>IA intégrée dans chaque secteur</span>
              </div>

              <h1 className="syne" style={{ fontSize: "clamp(28px, 3.4vw, 44px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 20px", animation: "fadeUp 0.6s ease 0.1s both" }}>
                Le système<br />
                <span style={{ background: "linear-gradient(90deg, #FF6B35 0%, #FFCA28 35%, #00C875 65%, #579BFC 85%, #A25DDC 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  d'exploitation
                </span><br />
                de votre business.
              </h1>

              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: "0 0 40px", maxWidth: 460, animation: "fadeUp 0.6s ease 0.2s both" }}>
                CRM, chatbox WhatsApp, automatisations et analytics — une seule plateforme pour les entreprises africaines.
              </p>

              <div style={{ display: "flex", gap: 12, marginBottom: 48, animation: "fadeUp 0.6s ease 0.3s both", flexWrap: "wrap" }}>
                <Link to="/register" className="cta-white">
                  Créer mon espace gratuit <ArrowRight size={16} />
                </Link>
                <a href="#demo" className="cta-outline">
                  <Play size={14} fill="white" /> Voir la démo
                </a>
              </div>

              {/* Social proof */}
              <div style={{ display: "flex", alignItems: "center", gap: 20, animation: "fadeUp 0.6s ease 0.4s both" }}>
                <div style={{ display: "flex" }}>
                  {SECTORS.map((s, i) => (
                    <div key={i} style={{ width: 34, height: 34, borderRadius: "50%", background: s.gradient, border: "2px solid #0D0D0D", marginLeft: i > 0 ? -10 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <s.icon size={15} color="#fff" />
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
                    {Array(5).fill(0).map((_, i) => <Star key={i} size={13} fill="#FFCA28" color="#FFCA28" />)}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                    <strong style={{ color: "#fff" }}>500+</strong> entreprises actives en Afrique
                  </div>
                </div>
              </div>
            </div>

            {/* Right — animated product mockup */}
            <div style={{ position: "relative", animation: "fadeUp 0.8s ease 0.3s both" }}>
              <div key={activeSector} style={{ animation: "fadeSlide 0.5s ease" }}>
                <ProductMockup sector={currentSector} />
              </div>
              {/* Sector switcher dots */}
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
                {SECTORS.map((s, i) => (
                  <button key={i} onClick={() => setActiveSector(i)} style={{ width: i === activeSector ? 24 : 8, height: 8, borderRadius: 4, background: i === activeSector ? s.color : "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS TICKER ──────────────────────────────────────────── */}
      <div style={{ background: "#F7F7F5", borderTop: "1px solid #EBEBEB", borderBottom: "1px solid #EBEBEB", overflow: "hidden" }}>
        <div style={{ display: "flex", width: "max-content", animation: "marquee 30s linear infinite" }}>
          {[...STATS, ...STATS, ...STATS].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 48px", borderRight: "1px solid #EBEBEB", flexShrink: 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color={s.color} />
                </div>
                <span className="syne" style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</span>
                <span style={{ fontSize: 13, color: "#787774", fontWeight: 500 }}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FEATURES ────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: "96px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ display: "inline-block", padding: "5px 14px", background: "linear-gradient(135deg, #A25DDC14, #579BFC14)", border: "1px solid #A25DDC22", borderRadius: 100, fontSize: 12, fontWeight: 800, color: "#A25DDC", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>
                Fonctionnalités
              </div>
              <h2 className="syne" style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.1, margin: "0 auto 16px", maxWidth: 540 }}>
                Tout ce dont votre entreprise a besoin
              </h2>
              <p style={{ fontSize: 15, color: "#787774", maxWidth: 440, margin: "0 auto", lineHeight: 1.65 }}>
                Une seule plateforme remplace 5 outils séparés.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 70}>
                  <div className="feat-card" style={{ borderRadius: 16, padding: "28px 26px", border: "1px solid #F0F0EE", background: "#fff", position: "relative", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    {/* Number watermark */}
                    <div className="syne" style={{ position: "absolute", top: 16, right: 20, fontSize: 30, fontWeight: 800, color: `${f.color}07`, lineHeight: 1 }}>{f.number}</div>
                    <div style={{ width: 48, height: 48, background: `${f.color}12`, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                      <Icon size={22} color={f.color} />
                    </div>
                    <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, margin: "0 0 10px" }}>{f.title}</h3>
                    <p style={{ fontSize: 14, color: "#787774", margin: 0, lineHeight: 1.65 }}>{f.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTORS ─────────────────────────────────────────────────── */}
      <section id="sectors" style={{ padding: "96px 32px", background: "#0D0D0D", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <h2 className="syne" style={{ fontSize: 30, fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: "0 0 14px" }}>
                7 secteurs, une seule plateforme
              </h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.4)", maxWidth: 420, margin: "0 auto" }}>
                Chaque métier a sa propre expérience.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, alignItems: "stretch" }}>
            {SECTORS.map((s, i) => {
              const slug = ({ "Restaurant": "restaurant", "Immobilier": "immobilier", "Voyage": "voyage", "École privée": "ecole-privee", "Clinique": "clinique", "Hôtellerie": "hotellerie", "Événementiel": "evenement" } as Record<string, string>)[s.title];
              return (
                <Reveal key={s.title} delay={i * 60}>
                  <Link to="/secteurs/$slug" params={{ slug }} style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}>
                    <div className="sector-tab" style={{ height: "100%", display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "28px 20px 22px", textAlign: "center", transition: "all 0.25s ease", cursor: "pointer" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = `${s.color}10`; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 20px 48px ${s.color}20`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                      <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}><s.icon size={36} color={s.color} /></div>
                      <h3 className="syne" style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>{s.title}</h3>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", margin: "0 0 14px", lineHeight: 1.55 }}>{s.desc}</p>
                      <div style={{ marginTop: "auto", display: "inline-block", alignSelf: "center", padding: "4px 12px", background: `${s.color}18`, borderRadius: 100, fontSize: 11, fontWeight: 700, color: s.color }}>
                        Voir →
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
      <section style={{ padding: "96px 32px", background: "#FAFAF8" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <div style={{ display: "inline-block", padding: "5px 14px", background: "#FFF4EF", borderRadius: 100, fontSize: 12, fontWeight: 800, color: "#FF6B35", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>
                Comment ça marche
              </div>
              <h2 className="syne" style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.1, margin: 0 }}>
                Actif en moins de 10 minutes
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative" }}>
            {/* Connecting line */}
            <div style={{ position: "absolute", top: 36, left: "12.5%", right: "12.5%", height: 2, background: "linear-gradient(90deg, #FF6B35, #A25DDC, #579BFC, #00C875)", zIndex: 0, borderRadius: 1 }} />

            {[
              { num: "1", title: "Inscrivez-vous",    desc: "Créez votre compte en 2 minutes.",  color: "#FF6B35", icon: "✦" },
              { num: "2", title: "Configurez",         desc: "Secteur, équipe, WhatsApp.",         color: "#A25DDC", icon: "⚙" },
              { num: "3", title: "Importez vos données",desc: "Clients, catalogue, historique.",   color: "#579BFC", icon: "📦" },
              { num: "4", title: "Activez l'IA",       desc: "Chatbot, alertes, automatisations.", color: "#00C875", icon: "🚀" },
            ].map((step, i) => (
              <Reveal key={step.num} delay={i * 80}>
                <div style={{ textAlign: "center", padding: "0 20px", position: "relative", zIndex: 1 }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: step.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: `0 8px 24px ${step.color}40`, border: "4px solid #FAFAF8" }}>
                    <span className="syne" style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{step.num}</span>
                  </div>
                  <h3 className="syne" style={{ fontSize: 15, fontWeight: 800, margin: "0 0 8px" }}>{step.title}</h3>
                  <p style={{ fontSize: 13, color: "#787774", margin: 0, lineHeight: 1.55 }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO ────────────────────────────────────────────────────── */}
      <section id="demo" style={{ background: "#0D0D0D", padding: "96px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(87,155,252,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(87,155,252,0.12)", border: "1px solid rgba(87,155,252,0.25)", borderRadius: 100, marginBottom: 18 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#25D366", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Démo interactive</span>
              </div>
              <h2 className="syne" style={{ fontSize: 30, fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: "0 0 14px" }}>
                Testez le CRM, sans inscription
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", maxWidth: 520, margin: "0 auto" }}>
                Choisissez un secteur et explorez l'intégralité du CRM avec des données fictives.
                Aucun compte requis — rien n'est sauvegardé.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, maxWidth: 1080, margin: "0 auto 40px" }}>
              {DEMO_SECTORS.map(({ key, title, company, color, icon: Icon, tag }) => (
                <button
                  key={key}
                  onClick={() => launchDemo(key)}
                  style={{
                    textAlign: "left",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 14,
                    padding: 20,
                    cursor: "pointer",
                    color: "inherit",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor = `${color}80`;
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = `0 12px 32px ${color}22`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                    <Icon size={20} color={color} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>Démo : {company}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 12, padding: "3px 8px", background: "rgba(255,255,255,0.06)", borderRadius: 100, display: "inline-block" }}>
                    {tag}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color }}>
                    Lancer <ArrowRight size={12} />
                  </div>
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150}>
            <DemoWidget />
          </Reveal>
        </div>
      </section>


      {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
      <section id="testimonials" style={{ padding: "96px 0", background: "#fff", overflow: "hidden" }}>
        <style>{`
          @keyframes marquee-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-track { animation: marquee-left 60s linear infinite; }
          .marquee-wrap:hover .marquee-track { animation-play-state: paused; }
        `}</style>
        <div style={{ padding: "0 32px" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <div style={{ display: "inline-block", padding: "5px 14px", background: "#EDFAF3", borderRadius: 100, fontSize: 12, fontWeight: 800, color: "#00C875", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>
                Ils témoignent
              </div>
              <h2 className="syne" style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.1, margin: "0 0 14px" }}>
                Ils ont transformé leur business
              </h2>
              <p style={{ fontSize: 16, color: "#787774" }}>Des résultats concrets, pas des promesses.</p>
            </div>
          </Reveal>
        </div>

        <div
          className="marquee-wrap"
          style={{
            position: "relative",
            maskImage: "linear-gradient(to right, transparent 0, #000 80px, #000 calc(100% - 80px), transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0, #000 80px, #000 calc(100% - 80px), transparent 100%)",
          }}
        >
          <div className="marquee-track" style={{ display: "flex", gap: 20, width: "max-content" }}>
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="testi-card" style={{ flex: "0 0 380px", background: "#fff", border: "1px solid #EBEBEB", borderRadius: 18, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                  {Array(5).fill(0).map((_, si) => <Star key={si} size={15} fill={t.color} color={t.color} />)}
                </div>
                <p style={{ fontSize: 15, color: "#1A1A1A", lineHeight: 1.7, margin: "0 0 22px", fontStyle: "italic", minHeight: 100 }}>
                  "{t.quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 18, borderTop: "1px solid #F3F3F1" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <t.icon size={18} color="#fff" />
                  </div>
                  <div>
                    <div className="syne" style={{ fontSize: 14, fontWeight: 800 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#787774" }}>{t.role}</div>
                    <div style={{ fontSize: 11, color: "#AFAFAC", marginTop: 1 }}>{t.country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, #0D0D0D 0%, #1A0A2E 40%, #2D1052 70%, #0D0D0D 100%)", padding: "96px 32px", position: "relative", overflow: "hidden" }}>
        {/* Color blobs */}
        {SECTORS.slice(0,3).map((s, i) => (
          <div key={i} style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: `${s.color}10`, filter: "blur(60px)", top: i === 0 ? "-20%" : i === 1 ? "30%" : "60%", left: i === 0 ? "10%" : i === 1 ? "70%" : "20%", pointerEvents: "none" }} />
        ))}

        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ fontSize: 44, marginBottom: 16 }}>🚀</div>
            <h2 className="syne" style={{ fontSize: 30, fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: "0 0 18px" }}>
              Prêt à passer à la vitesse supérieure ?
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "0 0 40px" }}>
              Rejoignez 500+ entreprises africaines qui automatisent leur activité avec Inspire IA.
            </p>

            <div style={{ marginBottom: 8 }} />


            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Link to="/register" className="cta-white">
                Créer mon espace <ArrowRight size={16} />
              </Link>
              <a href="#demo" className="cta-outline">
                <Play size={14} fill="white" />Voir la démo
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer style={{ background: "#111", borderTop: "1px solid #1F1F1F" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "52px 32px 32px" }}>
          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <Logo size="sm" textColor="#fff" />
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", marginTop: 14, lineHeight: 1.7, maxWidth: 280 }}>
                Le Business OS intelligent pour les entreprises africaines. CRM, chatbot WhatsApp et automatisations.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                {SECTORS.map(s => (
                  <div key={s.title} title={s.title} style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}18`, border: `1px solid ${s.color}25`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "default" }}>
                    <s.icon size={16} color={s.color} />
                  </div>
                ))}
              </div>
            </div>
            {[
              { title: "Secteurs",   links: [{label:"Restaurant",href:"/secteurs/restaurant"},{label:"Immobilier",href:"/secteurs/immobilier"},{label:"Voyage",href:"/secteurs/voyage"},{label:"École",href:"/secteurs/ecole-privee"},{label:"Clinique",href:"/secteurs/clinique"},{label:"Hôtellerie",href:"/secteurs/hotellerie"},{label:"Événementiel",href:"/secteurs/evenement"}] },
              { title: "Produit",    links: [{label:"Fonctionnalités",href:"/#features"},{label:"Démo",href:"/#demo"},{label:"Tarifs",href:"/contact",search:{subject:"tarifs"}},{label:"API",href:"#"}] },
              { title: "Entreprise", links: [{label:"À propos",href:"/about"},{label:"Contact",href:"/contact"},{label:"Conditions",href:"#"},{label:"Confidentialité",href:"#"}] },
            ].map(col => (
              <div key={col.title}>
                <div className="syne" style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>{col.title}</div>
                {col.links.map(l => {
                  const linkProps = l.search ? { to: l.href, search: l.search } : { to: l.href };
                  return (
                    <Link key={l.label} {...linkProps} style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.3)", textDecoration: "none", marginBottom: 10, transition: "color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
                      {l.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
          {/* Bottom */}
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
