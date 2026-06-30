import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, MessageCircle, LayoutDashboard, BarChart2, Zap, Play, Utensils, Home as HomeIcon, Plane, GraduationCap, Stethoscope, Hotel, PartyPopper } from "lucide-react";
import { Logo } from "@/components/Logo";
import { setDemoMode } from "@/lib/supabase";
import type { DemoSector } from "@/lib/demoFixtures";
import SectorPageMobile from "@/components/SectorPageMobile";
import { useIsMobile } from "@/hooks/useIsMobile";

const FOOTER_SECTORS = [
  { color: "#FF6B35", gradient: "linear-gradient(135deg, #FF6B35, #FF9A6C)", icon: Utensils, title: "Restaurant", slug: "restaurant" },
  { color: "#00C875", gradient: "linear-gradient(135deg, #00C875, #00E28A)", icon: HomeIcon, title: "Immobilier", slug: "immobilier" },
  { color: "#579BFC", gradient: "linear-gradient(135deg, #579BFC, #85BAFF)", icon: Plane, title: "Voyage",     slug: "voyage" },
  { color: "#A25DDC", gradient: "linear-gradient(135deg, #A25DDC, #C48AF0)", icon: GraduationCap, title: "École",       slug: "ecole-privee" },
  { color: "#E2445C", gradient: "linear-gradient(135deg, #E2445C, #FF6B80)", icon: Stethoscope, title: "Clinique",   slug: "clinique" },
  { color: "#FF6B35", gradient: "linear-gradient(135deg, #FF6B35, #FF9A6C)", icon: Hotel, title: "Hôtellerie", slug: "hotellerie" },
  { color: "#F59E0B", gradient: "linear-gradient(135deg, #F59E0B, #FCD34D)", icon: PartyPopper, title: "Événementiel", slug: "evenement" },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

type Pillar = { icon: any; title: string; desc: string; bullets: string[] };
type Scenario = { before: string[]; after: string[] };

type SectorContent = {
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

const SECTOR_CONTENT: Record<string, SectorContent> = {
  restaurant: {
    slug: "restaurant",
    demoKey: "restaurant",
    icon: Utensils,
    title: "Restaurant",
    color: "#FF6B35",
    hero: "Le système d'exploitation de votre restaurant",
    subtitle: "Centralisez vos commandes, réservations, clients et conversations WhatsApp dans une seule plateforme.",
    context: "Aujourd'hui, vos clients vous contactent déjà sur WhatsApp, Instagram, Facebook ou par téléphone. Inspire IA vous aide à transformer ces échanges en un système organisé, automatisé et piloté par la donnée.",
    problemsTitle: "Les défis des restaurants aujourd'hui",
    problemsSubtitle: "Votre activité grandit. Votre organisation doit suivre.",
    problems: [
      "Conversations dispersées — Les demandes arrivent via WhatsApp, téléphone, Instagram, Facebook ou directement sur place. Les informations sont réparties entre plusieurs personnes et plusieurs appareils.",
      "Aucun historique client centralisé — Il devient difficile de savoir qui sont vos meilleurs clients, quelles sont leurs habitudes ou quand ils ont commandé pour la dernière fois.",
      "Temps perdu sur des tâches répétitives — Votre équipe passe une partie importante de sa journée à répondre aux mêmes questions : horaires d'ouverture, disponibilité des plats, prix, localisation, réservations.",
      "Peu de visibilité sur les performances — Quels plats se vendent le mieux ? Quels jours génèrent le plus de revenus ? Quels clients reviennent régulièrement ? La plupart des restaurants ne disposent pas de ces informations en temps réel.",
    ],
    pillars: [
      { icon: MessageCircle, title: "Chatbox WhatsApp intelligente", desc: "Votre assistant IA répond automatiquement aux questions fréquentes, présente le menu, prend les réservations et accompagne les clients 24h/24.",
        bullets: ["Présentation du menu", "Réservations automatiques", "Réponses aux questions fréquentes", "Collecte des informations clients", "Escalade vers un membre de l'équipe si nécessaire"] },
      { icon: LayoutDashboard, title: "CRM Restaurant", desc: "Toutes vos données clients sont centralisées dans un seul espace.",
        bullets: ["Historique des commandes", "Coordonnées des clients", "Fréquence des visites", "Préférences alimentaires", "Statut de fidélité"] },
      { icon: Zap, title: "Automatisations", desc: "Réduisez les tâches répétitives et améliorez votre réactivité.",
        bullets: ["Confirmation automatique de réservation", "Rappels avant réservation", "Messages de remerciement", "Campagnes promotionnelles ciblées", "Relance des clients inactifs"] },
      { icon: BarChart2, title: "Insight Engine", desc: "Transformez vos données en décisions.",
        bullets: ["Les plats les plus populaires", "Les périodes les plus rentables", "Les tendances de consommation", "Les opportunités d'amélioration", "Les comportements clients"] },
    ],
    scenario: {
      before: [
        "Les demandes arrivent sur plusieurs canaux différents",
        "Les informations clients sont dispersées",
        "Les réservations sont suivies manuellement",
        "Les équipes répondent constamment aux mêmes questions",
        "Les performances sont difficiles à analyser",
      ],
      after: [
        "Toutes les interactions sont centralisées",
        "Les clients sont suivis automatiquement",
        "Les réservations sont organisées dans un seul système",
        "Les réponses fréquentes sont automatisées",
        "Les données sont accessibles en temps réel",
      ],
    },
    resultsTitle: "Ce que vous pouvez attendre",
    results: [
      { value: "Organisation", label: "Centralisez vos opérations et réduisez les risques d'oubli." },
      { value: "Expérience", label: "Répondez plus rapidement et offrez un suivi plus professionnel." },
      { value: "Visibilité", label: "Comprenez ce qui fonctionne réellement dans votre restaurant." },
      { value: "Gain de temps", label: "Automatisez les tâches répétitives pour vous concentrer sur le service." },
    ],
    example: "Restaurants traditionnels, fast-foods, services de livraison, restaurants premium et chaînes de restauration — Inspire IA s'adapte à tous.",
    audience: [
      { title: "Restaurants traditionnels", desc: "Gestion des commandes, réservations et fidélisation." },
      { title: "Fast-foods", desc: "Organisation des commandes et automatisation du service client." },
      { title: "Services de livraison", desc: "Suivi des commandes et communication client." },
      { title: "Restaurants premium", desc: "Gestion de la relation client et réservations avancées." },
      { title: "Chaînes de restauration", desc: "Pilotage centralisé de plusieurs établissements." },
    ],
    whyUs: {
      title: "Pourquoi Inspire IA ?",
      text: "La plupart des logiciels de restauration ont été conçus pour des marchés occidentaux. Inspire IA est conçu pour les réalités africaines :",
      bullets: [
        "WhatsApp au cœur de l'expérience",
        "Interface simple et mobile",
        "Déploiement rapide",
        "Automatisations adaptées aux PME",
        "Accompagnement local",
        "Intelligence artificielle pensée pour les usages du continent",
      ],
    },
    finalCta: {
      title: "Votre restaurant reçoit déjà des commandes et des demandes sur WhatsApp.",
      text: "La question n'est plus de savoir si le digital est important. La question est de savoir comment l'utiliser pour mieux organiser votre activité.",
    },
  },

  immobilier: {
    slug: "immobilier",
    demoKey: "real_estate",
    icon: HomeIcon,
    title: "Immobilier",
    color: "#00C875",
    hero: "Convertissez vos leads avant la concurrence",
    subtitle: "Vos prospects arrivent sur WhatsApp et Facebook. Inspire IA qualifie chaque lead automatiquement, relance ceux qui dorment, et organise votre pipeline jusqu'à la signature.",
    context: "Dans l'immobilier africain, un agent reçoit 30 demandes WhatsApp par jour. Il en oublie la moitié, n'en relance aucun, et ne sait jamais où chaque prospect en est. Pendant ce temps, la concurrence a déjà répondu.",
    problems: [
      "Leads dispersés entre WhatsApp, Facebook, le site, des appels — aucun endroit central.",
      "Réponse moyenne en 4h : le prospect a déjà signé ailleurs.",
      "Les agents oublient de relancer — 70% des leads sont perdus faute de suivi.",
      "Aucune qualification : on visite avec des gens qui n'ont ni budget, ni projet réel.",
      "Catalogue de biens partagé sur WhatsApp en photos — biens vendus encore proposés.",
      "Aucune visibilité : qui performe ? quels biens partent vite ? quelles zones sont demandées ?",
    ],
    pillars: [
      { icon: MessageCircle, title: "Chatbox immobilier", desc: "Pré-qualifie chaque lead pendant que vous dormez.",
        bullets: ["Demande budget, zone, type de bien", "Propose les biens correspondants", "Planifie la visite directement", "Filtre les curieux des sérieux"] },
      { icon: LayoutDashboard, title: "CRM immobilier", desc: "Le pipeline qui ne perd aucun prospect.",
        bullets: ["Pipeline visuel : Nouveau → Qualifié → Visite → Offre → Signé", "Attribution automatique aux agents", "Fiche bien complète avec photos et statut", "Historique complet par prospect"] },
      { icon: Zap, title: "Automatisations", desc: "Les relances se font toutes seules.",
        bullets: ["Réponse instantanée au lead 24/7", "Relance auto si silence > 3 jours", "Rappel de visite J-1 au client et à l'agent", "Notification au manager si lead chaud non traité"] },
      { icon: BarChart2, title: "Insight Engine", desc: "Sachez qui vend, quoi, et pourquoi.",
        bullets: ["Performance par agent", "Taux de conversion par étape", "Zones et types de biens les plus demandés", "Leads abandonnés à récupérer"] },
    ],
    scenario: {
      before: [
        "22h — un lead WhatsApp demande un T3 à Cocody, personne ne répond",
        "Le lendemain, agent répond à 11h, le client a visité ailleurs",
        "10 prospects de la semaine, aucun n'a été relancé",
        "Fin de mois : 4 visites, 1 vente, et personne ne sait pourquoi",
      ],
      after: [
        "Le bot qualifie le lead à 22h, propose 3 biens, planifie une visite samedi",
        "Le matin, l'agent ouvre son pipeline avec 7 visites confirmées",
        "Les leads froids reçoivent automatiquement les nouveautés correspondantes",
        "Dashboard : 22% des leads convertis en visite, vs 6% le mois passé",
      ],
    },
    results: [
      { value: "-85%", label: "temps de réponse au lead" },
      { value: "+3x", label: "visites planifiées/semaine" },
      { value: "100%", label: "des échanges historisés" },
      { value: "+22%", label: "taux de conversion" },
    ],
    example: "Sahel Immo (Dakar) a converti 22% de leads en visite vs 6% avant Inspire IA.",
  },

  voyage: {
    slug: "voyage",
    demoKey: "travel_agency",
    icon: Plane,
    title: "Agence de voyage",
    color: "#579BFC",
    hero: "Vendez des packages pendant que vous dormez",
    subtitle: "Vos clients demandent prix, visas, hôtels, billets sur WhatsApp toute la journée. Inspire IA répond, envoie les devis, prend les acomptes et suit chaque voyageur — sans agent au bout du fil.",
    context: "Une agence de voyage africaine reçoit 50+ demandes WhatsApp par jour, la plupart répétitives. Les équipes répondent manuellement à tout, perdent du temps, oublient des dossiers, et ne savent pas quelles destinations rapportent vraiment.",
    problems: [
      "« C'est combien Dubaï en mars ? » répété 30 fois par jour, réponse manuelle à chaque fois.",
      "Devis envoyés à la main, parfois erronés, parfois oubliés.",
      "Acomptes non encaissés à temps — dossiers qui sautent.",
      "Aucun suivi voyageur : visa reçu ? hôtel confirmé ? billets émis ?",
      "Pas de fichier client : impossible de relancer les voyageurs récurrents.",
      "Saisons fortes, abandons, destinations rentables — tout est dans la tête du patron.",
    ],
    pillars: [
      { icon: MessageCircle, title: "Chatbox voyage", desc: "Un commercial qui répond en 5 secondes, 24/7.",
        bullets: ["Présente les destinations et packages", "Calcule un devis personnalisé", "Répond aux FAQ (visa, vaccins, bagages)", "Lance la procédure de réservation"] },
      { icon: LayoutDashboard, title: "CRM voyage", desc: "Chaque voyageur, chaque dossier, parfaitement suivi.",
        bullets: ["Fiche voyageur avec historique complet", "Suivi des réservations par étape", "Gestion des acomptes et soldes", "Vue calendrier des départs"] },
      { icon: Zap, title: "Automatisations", desc: "Les rappels et confirmations partent tout seuls.",
        bullets: ["Confirmation de réservation automatique", "Rappel acompte J-30, solde J-15", "Envoi des documents (e-visa, billets)", "Rappel de départ J-3 avec checklist"] },
      { icon: BarChart2, title: "Insight Engine", desc: "Pilotez votre agence avec des chiffres clairs.",
        bullets: ["Destinations qui performent le plus", "Taux d'abandon par étape", "Voyageurs récurrents à fidéliser", "Saisonnalité et prévisions"] },
    ],
    scenario: {
      before: [
        "Lundi 9h — 47 messages WhatsApp en attente, 30 sur le prix de Dubaï",
        "Agent fait 4 devis, en oublie 2, encaisse 1 acompte en retard",
        "Vendredi : dossier annulé faute de solde rappelé à temps",
        "Aucune idée qu'Istanbul rapporte plus que Dubaï ce trimestre",
      ],
      after: [
        "Le bot envoie 30 devis Dubaï instantanément, qualifie 8 prospects sérieux",
        "Acomptes encaissés via lien de paiement, rappels auto envoyés",
        "Dashboard : taux d'abandon -40%, Istanbul = top destination du trimestre",
        "Voyageurs récurrents reçoivent une offre exclusive automatiquement",
      ],
    },
    results: [
      { value: "+60%", label: "de packages vendus en ligne" },
      { value: "-90%", label: "de relances manuelles" },
      { value: "24/7", label: "disponibilité commerciale" },
      { value: "-40%", label: "taux d'abandon" },
    ],
    example: "Téranga Travel encaisse les acomptes 24h/24 sans intervention humaine.",
  },

  "ecole-privee": {
    slug: "ecole-privee",
    demoKey: "private_school",
    icon: GraduationCap,
    title: "École privée",
    color: "#A25DDC",
    hero: "Gérez inscriptions et parents sans paperasse",
    subtitle: "Les parents écrivent toute la journée. Inspire IA répond pour vous, gère les pré-inscriptions, suit les absences et garde les familles informées sur WhatsApp.",
    context: "Dans une école privée africaine, l'administration passe 4h par jour à répondre aux parents sur WhatsApp (horaires, frais, absences, inscriptions). Les dossiers sont sur papier, les informations se perdent, les paiements sont rappelés trop tard.",
    problems: [
      "Les parents écrivent 100 fois par jour : horaires, frais de scolarité, documents requis, absences.",
      "Pré-inscriptions notées sur cahier, dossiers incomplets découverts trop tard.",
      "Absences non communiquées aux parents — découverte le soir, conflits.",
      "Frais de scolarité en retard, relance manuelle pénible et inefficace.",
      "Informations dispersées : un parent appelle 3 personnes différentes pour une réponse.",
      "Aucune vue d'ensemble : taux d'inscription, classes en demande, parents non engagés.",
    ],
    pillars: [
      { icon: MessageCircle, title: "Chatbox école", desc: "L'assistante administrative qui ne s'épuise pas.",
        bullets: ["Répond aux questions fréquentes 24/7", "Explique les procédures d'inscription", "Collecte les pré-inscriptions", "Envoie automatiquement les documents demandés"] },
      { icon: LayoutDashboard, title: "CRM école", desc: "Élèves, parents et classes parfaitement organisés.",
        bullets: ["Fiche élève complète (notes, absences, contacts)", "Annuaire parents avec historique d'échanges", "Suivi des inscriptions et réinscriptions", "Vue par classe / par niveau"] },
      { icon: Zap, title: "Automatisations", desc: "Les communications partent au bon moment.",
        bullets: ["Notification d'absence aux parents le matin même", "Rappel de paiement automatique J-5 et J+1", "Diffusion d'informations à toute une classe", "Messages administratifs récurrents (vacances, événements)"] },
      { icon: BarChart2, title: "Insight Engine", desc: "Pilotez votre école avec des données concrètes.",
        bullets: ["Taux d'inscription en temps réel", "Classes les plus demandées", "Parents les moins réactifs (à risque)", "Tendances absences et retards"] },
    ],
    scenario: {
      before: [
        "8h — secrétariat débordé, 60 messages WhatsApp sur frais et horaires",
        "10h — une absence non signalée aux parents, conflit le soir",
        "Fin du mois — 30% des familles en retard de paiement",
        "Rentrée — 45 dossiers d'inscription incomplets découverts en septembre",
      ],
      after: [
        "Le bot a déjà répondu à 50 messages, le secrétariat traite les 10 vrais cas",
        "Absences notifiées automatiquement aux parents à 9h",
        "Paiements rappelés en J-5 — taux de retard divisé par 3",
        "Dossiers pré-validés par le bot, prêts à signer à la rentrée",
      ],
    },
    results: [
      { value: "-70%", label: "d'appels parents/jour" },
      { value: "5 min", label: "pour un bulletin" },
      { value: "100%", label: "des absences notifiées" },
      { value: "÷3", label: "retards de paiement" },
    ],
    example: "L'École Les Palmiers a digitalisé 320 dossiers d'inscription en 2 semaines.",
  },

  clinique: {
    slug: "clinique",
    demoKey: "private_clinic",
    icon: Stethoscope,
    title: "Clinique",
    color: "#E2445C",
    hero: "Remplissez l'agenda, réduisez les no-shows",
    subtitle: "Les patients prennent RDV sur WhatsApp, oublient, ne viennent pas. Inspire IA prend, confirme, rappelle et organise tout — vos équipes se concentrent sur le soin.",
    context: "Dans une clinique privée africaine, la secrétaire passe sa journée au téléphone : prendre, déplacer, annuler des RDV, répondre aux questions. Les no-shows atteignent 30%, les dossiers patients sont incomplets, et personne ne sait quelle spécialité sature.",
    problems: [
      "Le téléphone sonne sans arrêt — prise, déplacement, annulation de RDV.",
      "30% de no-shows : créneaux perdus, médecins qui attendent.",
      "Patients qui demandent : « Quel spécialiste ? Quels horaires ? Disponibilité demain ? ».",
      "Dossiers patients incomplets, historique introuvable pendant la consultation.",
      "Rappels de contrôle annuel ou de vaccin jamais envoyés.",
      "Aucune visibilité sur la charge médecins, motifs fréquents, no-shows par profil.",
    ],
    pillars: [
      { icon: MessageCircle, title: "Chatbox clinique", desc: "Une secrétaire virtuelle disponible 24/7.",
        bullets: ["Prend les RDV selon la disponibilité réelle", "Oriente vers la bonne spécialité", "Répond aux FAQ (horaires, tarifs, prise en charge)", "Confirme et reprogramme automatiquement"] },
      { icon: LayoutDashboard, title: "CRM médical", desc: "Tout le parcours patient dans un seul endroit.",
        bullets: ["Dossier patient avec historique complet", "Agenda multi-praticiens (jour / semaine)", "Suivi des consultations et ordonnances", "Gestion des médecins et leurs spécialités"] },
      { icon: Zap, title: "Automatisations", desc: "Les rappels et le suivi se font sans effort.",
        bullets: ["Rappel WhatsApp J-1 et H-2 avant le RDV", "Libération auto du créneau si annulation", "Notification au patient pour résultats prêts", "Rappel de contrôle annuel ou vaccin"] },
      { icon: BarChart2, title: "Insight Engine", desc: "Pilotez la clinique avec des données médicales.",
        bullets: ["Taux de remplissage par médecin", "No-shows par profil de patient", "Motifs de consultation les plus fréquents", "CA et activité par praticien"] },
    ],
    scenario: {
      before: [
        "Standard saturé : 80 appels/jour pour des RDV",
        "30% no-shows : 12 créneaux perdus chaque jour",
        "Patient arrive, son dossier est introuvable, perte de 15 min",
        "Contrôles annuels jamais relancés, patients perdus",
      ],
      after: [
        "Le bot prend 60 RDV/jour sur WhatsApp, secrétaire libre pour l'accueil",
        "Rappels H-24/H-2 → no-shows divisés par 3, créneaux libérés relancés",
        "Dossier patient ouvert d'un clic, historique complet visible",
        "Relances annuelles automatiques → 40% des patients reviennent",
      ],
    },
    results: [
      { value: "-65%", label: "de no-shows" },
      { value: "+40%", label: "de RDV hors heures bureau" },
      { value: "0", label: "double-booking" },
      { value: "1.5", label: "ETP libéré" },
    ],
    example: "La Clinique Médicis a libéré 1.5 ETP en automatisant la prise de RDV.",
  },

  hotellerie: {
    slug: "hotellerie",
    demoKey: "hotel",
    icon: Hotel,
    title: "Hôtellerie",
    color: "#FF6B35",
    hero: "Remplissez vos chambres, simplifiez votre réception",
    subtitle: "Vos clients réservent, demandent, annulent sur WhatsApp toute la journée. Inspire IA gère les réservations, le check-in, le housekeeping et la fidélité — votre équipe se concentre sur l'expérience client.",
    context: "Dans un hôtel africain, la réception jongle entre téléphone, WhatsApp, OTA et walk-ins. Les chambres ne sont pas synchronisées, le housekeeping prend du retard, et personne ne sait quels clients reviennent ou pourquoi.",
    problems: [
      "Réservations dispersées entre WhatsApp, Booking, téléphone et walk-ins — risque d'overbooking.",
      "« Vous avez une chambre demain ? Combien ? » répété 50 fois par jour à la réception.",
      "Housekeeping désorganisé : chambres prêtes en retard, clients qui attendent au lobby.",
      "Aucun historique client : impossible de reconnaître un habitué ou personnaliser son séjour.",
      "Demandes spéciales (lit bébé, late check-out) oubliées entre la réservation et l'arrivée.",
      "Aucune visibilité sur le taux d'occupation, RevPAR ou origine des réservations.",
    ],
    pillars: [
      { icon: MessageCircle, title: "Chatbox hôtellerie", desc: "Une réception virtuelle disponible 24h/24.",
        bullets: ["Vérifie la disponibilité en temps réel", "Envoie tarifs et photos des chambres", "Prend la réservation et l'acompte", "Répond aux FAQ (petit-déj, parking, navette)"] },
      { icon: LayoutDashboard, title: "CRM hôtel", desc: "Chambres, clients et séjours en un seul écran.",
        bullets: ["Planning des chambres jour par jour", "Statut housekeeping en direct (clean / dirty / inspection)", "Fiche client avec historique de séjours", "Gestion des demandes spéciales par réservation"] },
      { icon: Zap, title: "Automatisations", desc: "Les moments-clés du séjour partent sans effort.",
        bullets: ["Confirmation de réservation et reçu d'acompte", "Pré-check-in WhatsApp J-1 (heure d'arrivée, documents)", "Notification au housekeeping dès le check-out", "Message de remerciement et demande d'avis post-séjour"] },
      { icon: BarChart2, title: "Insight Engine", desc: "Pilotez votre hôtel avec les bons KPI.",
        bullets: ["Taux d'occupation et RevPAR en temps réel", "Origine des réservations (direct vs OTA)", "Clients fidèles à relancer", "Pics et creux de saison à anticiper"] },
    ],
    scenario: {
      before: [
        "8h — 25 messages WhatsApp en attente sur la disponibilité du week-end",
        "Réception débordée, overbooking sur une suite réservée 2 fois",
        "Client arrive à 14h, chambre pas prête, housekeeping non prévenu",
        "Fin de mois — aucune idée du taux d'occupation réel ni des habitués perdus",
      ],
      after: [
        "Le bot a répondu à 25 demandes, confirmé 6 réservations avec acompte",
        "Planning chambres synchronisé — zéro overbooking",
        "Housekeeping notifié dès le check-out, chambres prêtes à 13h",
        "Dashboard : 82% d'occupation, 12 clients fidèles relancés automatiquement",
      ],
    },
    results: [
      { value: "+35%", label: "de réservations directes" },
      { value: "0", label: "overbooking" },
      { value: "-50%", label: "de temps à la réception" },
      { value: "+22%", label: "de clients récurrents" },
    ],
    example: "L'Hôtel Téranga (Dakar) a augmenté ses réservations directes de 35% en 3 mois.",
  },

  evenement: {
    slug: "evenement",
    demoKey: "event",
    icon: PartyPopper,
    title: "Événementiel",
    color: "#F59E0B",
    hero: "Pilotez chaque événement comme un mini-business",
    subtitle: "Mariages, anniversaires, corporate, food stands : suivez vos formules, vos invités, vos revenus et vos dépenses en temps réel — et sachez à la fin de chaque événement combien vous avez vraiment gagné.",
    context: "Les traiteurs, food stands et animateurs culinaires jonglent entre WhatsApp, devis improvisés et carnets de dépenses. À la fin du mois, impossible de savoir quel événement a vraiment été rentable. Inspire IA centralise les réservations, les formules, les coûts et les marges dans un seul outil pensé pour le terrain.",
    problemsTitle: "Les défis des traiteurs et food stands",
    problemsSubtitle: "Beaucoup d'événements, peu de visibilité sur la marge réelle.",
    problems: [
      "Demandes éparpillées entre WhatsApp, Instagram et appels — devis perdus, doublons fréquents.",
      "Formules variables (par personne, forfait, vente directe, partenariat) gérées au cas par cas, sans cadre clair.",
      "Dépenses (matières premières, transport, personnel, déco) notées dans un carnet ou jamais saisies.",
      "Aucune vue claire de la marge par événement : impossible de savoir lesquels sont rentables.",
      "Suivi des invités (bookés vs réellement servis) approximatif, donc estimation de coût par couvert faussée.",
      "Pas d'historique client pour relancer les organisateurs récurrents (entreprises, salles de réception).",
    ],
    pillars: [
      { icon: MessageCircle, title: "Chatbox Événementiel", desc: "Un assistant qui qualifie les demandes 24h/24 sur WhatsApp.",
        bullets: ["Récupère type d'événement, date, nombre d'invités", "Propose les formules adaptées (par personne, forfait, premium)", "Envoie devis et conditions automatiquement", "Escalade vers vous pour les événements premium"] },
      { icon: LayoutDashboard, title: "CRM Événements", desc: "Chaque événement devient une fiche claire avec son P&L.",
        bullets: ["Formule, prix, invités bookés vs servis", "Toppings et options choisies", "Statut : planifié / en cours / terminé", "Lieu, client, notes internes"] },
      { icon: Zap, title: "Suivi financier en temps réel", desc: "Revenus et dépenses saisis au moment où ils tombent.",
        bullets: ["Revenus par mode de paiement (cash, mobile money, virement)", "Dépenses par catégorie (matières, transport, personnel…)", "Marge nette et marge % calculées automatiquement", "Revenu et coût par invité"] },
      { icon: BarChart2, title: "Insight Engine", desc: "Identifiez les événements et clients les plus rentables.",
        bullets: ["Marge moyenne par type d'événement", "Top clients récurrents à relancer", "Saisons et jours les plus rentables", "Postes de dépense à optimiser"] },
    ],
    scenario: {
      before: [
        "10 demandes WhatsApp pour un mariage de 200 personnes — devis envoyés à l'arrache",
        "Le jour J, 30 invités en plus, aucun ajustement de coût enregistré",
        "Dépenses payées en cash, jamais saisies — marge réelle inconnue",
        "Fin de mois : 6 événements faits, impossible de dire lesquels étaient rentables",
      ],
      after: [
        "Le bot qualifie la demande, propose la formule premium et envoie le devis",
        "Fiche événement créée avec invités bookés, formule et acompte",
        "Dépenses et revenus saisis au fil de l'eau — marge calculée en direct",
        "Dashboard : marge moyenne 38%, top client identifié, prochains événements planifiés",
      ],
    },
    results: [
      { value: "+38%", label: "de marge moyenne mesurée" },
      { value: "100%", label: "des événements suivis en P&L" },
      { value: "-70%", label: "de temps sur les devis" },
      { value: "+25%", label: "de clients récurrents relancés" },
    ],
    example: "Inspire Event Panko suit chaque mariage et corporate avec sa marge nette dès le lendemain de l'événement.",
    audience: [
      { title: "Traiteurs événementiels", desc: "Mariages, anniversaires, corporate, associations." },
      { title: "Food stands & animation culinaire", desc: "Pancakes, crêpes, grillades, foires et marchés." },
      { title: "Agences événementielles", desc: "Coordination, formules clé-en-main, partenariats." },
    ],
    whyUs: {
      title: "Pensé pour la réalité du terrain africain",
      text: "Mobile money, cash, formules sur-mesure, équipes flexibles : Inspire IA s'adapte à votre façon de travailler — pas l'inverse.",
      bullets: [
        "Interface mobile simple, utilisable sur le stand",
        "Multidevise et mobile money natifs",
        "Catégories de dépenses adaptées au métier",
        "Calcul automatique de marge et coût par invité",
        "Historique client pour relancer organisateurs et entreprises",
        "Accompagnement local pour démarrer en quelques jours",
      ],
    },
    finalCta: {
      title: "Prêt à savoir combien chaque événement vous rapporte vraiment ?",
      text: "Testez la démo sans inscription, ou parlez-nous de votre activité événementielle.",
    },
  },
};

export const Route = createFileRoute("/secteurs/$slug")({
  loader: ({ params }) => {
    const data = SECTOR_CONTENT[params.slug];
    if (!data) throw notFound();
    return { slug: data.slug, title: data.title, subtitle: data.subtitle };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Inspire IA pour votre métier` },
          { name: "description", content: loaderData.subtitle },
          { property: "og:title", content: `${loaderData.title} — Inspire IA` },
          { property: "og:description", content: loaderData.subtitle },
        ]
      : [{ title: "Secteur introuvable — Inspire IA" }],
  }),
  notFoundComponent: () => (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <h1 className="syne" style={{ fontSize: 36 }}>Secteur introuvable</h1>
      <Link to="/" style={{ color: "#579BFC" }}>← Retour à l'accueil</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", background: "#0D0D0D" }}>
      <div>{(error as Error).message}</div>
    </div>
  ),
  component: SectorPage,
});

function SectorPage() {
  const { slug } = Route.useParams();
  const s = SECTOR_CONTENT[slug];
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const launchDemo = () => {
    setDemoMode(true, s.demoKey);
    window.location.href = "/app/dashboard";
  };

  if (isMobile) return <SectorPageMobile s={s} />;

  return (
    <div className="public-page" style={{ background: "#0D0D0D", color: "#fff", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@600;700;800family=Space+Grotesk:wght@500;600;700&display=swap');
        .syne { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
        .nav-a { color:#1A1A1A; text-decoration:none; font-size:14px; font-weight:600; transition:color 0.2s; }
        .nav-a:hover { color:${s.color}; }
      `}</style>

      {/* ── NAV ───────────────────────────────────────────── */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: scrolled ? "rgba(255,255,255,0.97)" : "#fff", backdropFilter: "blur(12px)", borderBottom: "1px solid #F1F1EF", transition: "all 0.3s" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none" }}><Logo size="sm" textColor="#1A1A1A" /></Link>
          <nav style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <Link to="/" hash="features" className="nav-a">Fonctionnalités</Link>
            <Link to="/" hash="sectors" className="nav-a" style={{ color: s.color }}>Secteurs</Link>
            <Link to="/" hash="demo" className="nav-a">Démo</Link>
            <Link to="/contact" className="nav-a">Contact</Link>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link to="/login" style={{ color: "#1A1A1A", textDecoration: "none", fontSize: 14, fontWeight: 600, padding: "8px 14px" }}>Se connecter</Link>
            <button onClick={launchDemo} style={{ background: s.color, color: "#fff", padding: "10px 20px", borderRadius: 9, border: "none", fontSize: 14, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", boxShadow: `0 4px 16px ${s.color}40` }}>
              <Play size={13} fill="white" /> Démo
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section style={{ position: "relative", padding: "72px 32px 96px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: -150, left: "50%", transform: "translateX(-50%)", width: 800, height: 800, borderRadius: "50%", background: `radial-gradient(circle, ${s.color}28 0%, transparent 60%)`, filter: "blur(20px)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
        </div>
        <div style={{ maxWidth: 980, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <Link to="/" hash="sectors" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 36 }}>
              <ArrowLeft size={14} /> Tous les secteurs
            </Link>
          </Reveal>
          <Reveal delay={80}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: `${s.color}1F`, border: `1px solid ${s.color}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={30} color={s.color} />
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", padding: "5px 12px", background: `${s.color}1A`, border: `1px solid ${s.color}44`, borderRadius: 100, fontSize: 11, fontWeight: 800, color: s.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Inspire IA pour {s.title}
              </div>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <h1 className="syne" style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.05, margin: "0 0 18px" }}>
              {s.hero}
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontSize: 19, color: "rgba(255,255,255,0.6)", lineHeight: 1.55, margin: "0 0 32px", maxWidth: 720 }}>
              {s.subtitle}
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={launchDemo} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 22px", background: s.color, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: `0 8px 24px ${s.color}40` }}>
                <Play size={15} fill="white" /> Essayer la démo {s.title}
              </button>
              <Link to="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 22px", background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
                Parler à un expert <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PROBLEMS ──────────────────────────────────────── */}
      <section style={{ padding: "80px 32px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "inline-block", padding: "5px 12px", background: "rgba(226,68,92,0.12)", border: "1px solid rgba(226,68,92,0.3)", borderRadius: 100, fontSize: 11, fontWeight: 800, color: "#E2445C", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
              Le problème
            </div>
            <h2 className="syne" style={{ fontSize: 36, fontWeight: 700, margin: "0 0 16px", lineHeight: 1.15 }}>
              {s.problemsTitle || "Ce que vous vivez aujourd'hui"}
            </h2>
            {s.problemsSubtitle && (
              <p style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, margin: "0 0 12px", maxWidth: 760 }}>
                {s.problemsSubtitle}
              </p>
            )}
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: "0 0 36px", maxWidth: 760 }}>
              {s.context}
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {s.problems.map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <div style={{ padding: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.55, height: "100%" }}>
                  <span style={{ color: "#E2445C", marginRight: 8, fontWeight: 800 }}>×</span>
                  {p}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PILLARS (4 piliers Inspire IA) ────────────────── */}
      <section style={{ padding: "96px 32px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display: "inline-block", padding: "5px 14px", background: `${s.color}1A`, border: `1px solid ${s.color}33`, borderRadius: 100, fontSize: 11, fontWeight: 800, color: s.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
                La solution — 4 piliers
              </div>
              <h2 className="syne" style={{ fontSize: 42, fontWeight: 700, margin: "0 0 14px", lineHeight: 1.1 }}>
                Ce qu'Inspire IA fait à votre place
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0, maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
                Une plateforme unique pensée pour les réalités africaines : centrée WhatsApp, simple, multi-secteur, et adaptée à vos habitudes.
              </p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
            {s.pillars.map(({ icon: Icon, title, desc, bullets }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div style={{ padding: 28, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, height: "100%", transition: "all 0.25s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.color}55`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}1F`, border: `1px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={22} color={s.color} />
                    </div>
                    <h3 className="syne" style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>{title}</h3>
                  </div>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.55, margin: "0 0 16px" }}>{desc}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {bullets.map(b => (
                      <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
                        <Check size={14} color={s.color} style={{ marginTop: 3, flexShrink: 0 }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER SCENARIO ───────────────────────── */}
      <section style={{ padding: "80px 32px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "inline-block", padding: "5px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
                Une journée type
              </div>
              <h2 className="syne" style={{ fontSize: 36, fontWeight: 700, margin: 0 }}>
                Avant Inspire IA / Après Inspire IA
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
            <Reveal>
              <div style={{ padding: 28, background: "rgba(226,68,92,0.04)", border: "1px solid rgba(226,68,92,0.18)", borderRadius: 16, height: "100%" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#E2445C", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 18 }}>
                  Sans Inspire IA
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                  {s.scenario.before.map((line, i) => (
                    <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.55 }}>
                      <span style={{ color: "#E2445C", fontWeight: 800, flexShrink: 0 }}>×</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div style={{ padding: 28, background: `${s.color}0F`, border: `1px solid ${s.color}40`, borderRadius: 16, height: "100%" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: s.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 18 }}>
                  Avec Inspire IA
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                  {s.scenario.after.map((line, i) => (
                    <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.55 }}>
                      <Check size={16} color={s.color} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* ── RESULTS ───────────────────────────────────────── */}
      <section style={{ padding: "80px 32px", background: `linear-gradient(135deg, ${s.color}12, transparent)`, borderTop: `1px solid ${s.color}22` }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <Reveal>
            <h2 className="syne" style={{ fontSize: 32, fontWeight: 700, textAlign: "center", margin: "0 0 40px" }}>
              {s.resultsTitle || "Résultats typiques après 3 mois"}
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
            {s.results.map((r, i) => {
              const isMetric = /\d/.test(r.value);
              return (
                <Reveal key={i} delay={i * 100}>
                  <div style={{ padding: "28px 20px", textAlign: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}33`, borderRadius: 16, height: 168, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div className="syne" style={{ fontSize: isMetric ? 32 : 18, fontWeight: 700, color: s.color, marginBottom: 10, lineHeight: 1.2 }}>{r.value}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.45 }}>{r.label}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <div style={{ textAlign: "center", padding: "20px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 14, color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>
              <Check size={14} style={{ display: "inline", marginRight: 8, color: s.color }} />
              {s.example}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AUDIENCE ────────────────────────────────────────── */}
      {s.audience && (
        <section style={{ padding: "80px 32px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <div style={{ display: "inline-block", padding: "5px 14px", background: `${s.color}1A`, border: `1px solid ${s.color}33`, borderRadius: 100, fontSize: 11, fontWeight: 800, color: s.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
                  Pour qui ?
                </div>
                <h2 className="syne" style={{ fontSize: 36, fontWeight: 700, margin: 0, lineHeight: 1.15 }}>
                  Inspire IA s'adapte à votre activité
                </h2>
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {s.audience.map((a, i) => (
                <Reveal key={a.title} delay={i * 60}>
                  <div style={{ padding: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, height: "100%" }}>
                    <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px", color: "#fff" }}>{a.title}</h3>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.55, margin: 0 }}>{a.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY US ──────────────────────────────────────────── */}
      {s.whyUs && (
        <section style={{ padding: "80px 32px", background: `linear-gradient(135deg, ${s.color}0A, transparent)`, borderTop: `1px solid ${s.color}18` }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <div style={{ display: "inline-block", padding: "5px 14px", background: `${s.color}1A`, border: `1px solid ${s.color}33`, borderRadius: 100, fontSize: 11, fontWeight: 800, color: s.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
                  Pourquoi nous ?
                </div>
                <h2 className="syne" style={{ fontSize: 36, fontWeight: 700, margin: 0, lineHeight: 1.15 }}>
                  {s.whyUs.title}
                </h2>
              </div>
            </Reveal>
            <Reveal>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, textAlign: "center", maxWidth: 720, margin: "0 auto 36px" }}>
                {s.whyUs.text}
              </p>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
              {s.whyUs.bullets.map((b, i) => (
                <Reveal key={b} delay={i * 60}>
                  <div style={{ padding: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, height: "100%", display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <Check size={18} color={s.color} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.55 }}>{b}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────── */}
      <section style={{ padding: "96px 32px 110px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <h2 className="syne" style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.1, margin: "0 0 16px" }}>
              {s.finalCta?.title || `Prêt à voir ça dans votre ${s.title.toLowerCase()} ?`}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", margin: "0 0 32px" }}>
              {s.finalCta?.text || "Testez la démo sans inscription, ou parlez-nous de votre activité."}
            </p>
          </Reveal>
          <Reveal delay={140}>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={launchDemo} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", background: s.color, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: `0 8px 24px ${s.color}40` }}>
                <Play size={15} fill="white" /> Lancer la démo
              </button>
              <Link to="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
                Parler à un expert
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── OTHER SECTORS ─────────────────────────────────── */}
      <section style={{ padding: "60px 32px 80px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <Reveal>
            <div className="syne" style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20, textAlign: "center" }}>
              Découvrir un autre secteur
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
            {FOOTER_SECTORS.filter(f => f.slug !== s.slug).map((f, i) => (
              <Reveal key={f.slug} delay={i * 60}>
                <Link to="/secteurs/$slug" params={{ slug: f.slug }} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ padding: "20px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, textAlign: "center", transition: "all 0.2s", cursor: "pointer" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ marginBottom: 6, display: "flex", justifyContent: "center" }}><f.icon size={26} color={f.color} /></div>
                    <div className="syne" style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{f.title}</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer style={{ background: "#111", borderTop: "1px solid #1F1F1F" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "52px 32px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <Logo size="sm" textColor="#fff" />
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", marginTop: 14, lineHeight: 1.7, maxWidth: 280 }}>
                Le Business OS intelligent pour les entreprises africaines. CRM, chatbot WhatsApp et automatisations.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                {FOOTER_SECTORS.map(f => (
                  <div key={f.title} title={f.title} style={{ width: 32, height: 32, borderRadius: 8, background: `${f.color}18`, border: `1px solid ${f.color}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <f.icon size={16} color={f.color} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="syne" style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Secteurs</div>
              {FOOTER_SECTORS.map(f => (
                <Link key={f.slug} to="/secteurs/$slug" params={{ slug: f.slug }} style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.3)", textDecoration: "none", marginBottom: 10 }}>{f.title}</Link>
              ))}
            </div>
            <div>
              <div className="syne" style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Produit</div>
              {["Fonctionnalités", "Démo", "Tarifs", "API"].map(l => (
                <a key={l} href="#" style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.3)", textDecoration: "none", marginBottom: 10 }}>{l}</a>
              ))}
            </div>
            <div>
              <div className="syne" style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Entreprise</div>
              <Link to="/contact" style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.3)", textDecoration: "none", marginBottom: 10 }}>Contact</Link>
              <Link to="/about" style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.3)", textDecoration: "none", marginBottom: 10 }}>À propos</Link>
              <a href="#" style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.3)", textDecoration: "none", marginBottom: 10 }}>Conditions</a>
              <a href="#" style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.3)", textDecoration: "none", marginBottom: 10 }}>Confidentialité</a>
            </div>
          </div>
          <div style={{ paddingTop: 24, borderTop: "1px solid #1F1F1F", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.2)" }}>© {new Date().getFullYear()} Inspire IA. Tous droits réservés.</div>
            <div style={{ display: "flex", gap: 6 }}>
              {FOOTER_SECTORS.map((f, i) => (
                <div key={i} style={{ width: 24, height: 4, borderRadius: 2, background: f.gradient }} />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
