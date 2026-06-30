import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Plus, X, ChevronDown, ChevronUp, ArrowLeft,
  Trash2, TrendingUp, TrendingDown, CheckCircle2,
  Calendar, Users, MapPin, Tag, Save, Loader2
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Event {
  id: string;
  name: string;
  event_date: string;
  event_type: string;
  formule: string;
  prix_formule: number | null;
  location: string | null;
  client_name: string | null;
  booked_guests: number;
  actual_guests: number | null;
  toppings: string[] | null;
  stand_installe: boolean;
  status: string;
  notes: string | null;
}

interface Revenue {
  id: string;
  description: string;
  amount: number;
  currency: string;
  payment_method: string;
  recorded_at: string;
}

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  paid_at: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COLOR = '#F59E0B';

const EVENT_TYPES = [
  { value: 'mariage',      label: '💍 Mariage' },
  { value: 'anniversaire', label: '🎂 Anniversaire' },
  { value: 'corporate',    label: '🏢 Corporate' },
  { value: 'association',  label: '🤝 Association' },
  { value: 'public',       label: '🎪 Événement public' },
  { value: 'autre',        label: '📅 Autre' },
];

const FORMULES = [
  { value: 'prix_par_personne', label: 'Prix par personne' },
  { value: 'forfait_global',    label: 'Forfait global' },
  { value: 'vente_directe',     label: 'Vente directe' },
  { value: 'partenariat',       label: 'Partenariat' },
  { value: 'premium',           label: 'Premium sur mesure' },
];

const EXPENSE_CATEGORIES = [
  { value: 'matieres_premieres', label: '🥚 Matières premières' },
  { value: 'emballages',         label: '📦 Emballages' },
  { value: 'boissons',           label: '🥤 Boissons' },
  { value: 'transport',          label: '🚗 Transport' },
  { value: 'materiel',           label: '🔧 Matériel' },
  { value: 'personnel',          label: '👤 Personnel' },
  { value: 'decoration',         label: '🎨 Décoration' },
  { value: 'consommables',       label: '🔌 Consommables' },
  { value: 'other',              label: '📌 Autre' },
];

const PAYMENT_METHODS = [
  { value: 'cash',         label: 'Espèces' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'transfer',     label: 'Virement' },
  { value: 'card',         label: 'Carte' },
  { value: 'other',        label: 'Autre' },
];

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  completed: { bg: '#DCFCE7', color: '#16A34A', label: 'Terminé' },
  planned:   { bg: '#DBEAFE', color: '#1D4ED8', label: 'Planifié' },
  ongoing:   { bg: '#FEF3C7', color: '#D97706', label: 'En cours' },
  cancelled: { bg: '#FEE2E2', color: '#DC2626', label: 'Annulé' },
};

const formatCFA = (n: number) =>
  new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' XOF';

// ─── Input / Select helpers ───────────────────────────────────────────────────

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <input
      {...props}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
      style={{ focusRingColor: COLOR } as React.CSSProperties}
    />
  </div>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: { value: string; label: string }[] }> = ({ label, options, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <select
      {...props}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition bg-white"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const EventsPage: React.FC = () => {
  const [companyId, setCompanyId]         = useState<string>('');
  const [company, setCompany]             = useState<{ name: string; logo_url?: string | null } | null>(null);
  const [events, setEvents]               = useState<Event[]>([]);
  const [loading, setLoading]             = useState(true);
  const [expandedId, setExpandedId]       = useState<string | null>(null);
  const [revenues, setRevenues]           = useState<Record<string, Revenue[]>>({});
  const [expenses, setExpenses]           = useState<Record<string, Expense[]>>({});
  const [showNewEvent, setShowNewEvent]   = useState(false);
  const [showRevForm, setShowRevForm]     = useState<string | null>(null);
  const [showExpForm, setShowExpForm]     = useState<string | null>(null);
  const [saving, setSaving]               = useState(false);

  // Forms
  const [eventForm, setEventForm] = useState({
    name: '', event_date: '', event_type: 'corporate', formule: 'prix_par_personne',
    prix_formule: '', location: '', client_name: '', booked_guests: '',
    toppings: '', status: 'planned', notes: '',
  });
  const [revForm, setRevForm] = useState({
    description: '', amount: '', payment_method: 'cash',
  });
  const [expForm, setExpForm] = useState({
    category: 'matieres_premieres', description: '', amount: '',
  });

  // Init
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('new') === 'true') setShowNewEvent(true);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: u } = await (supabase as any).from('users').select('company_id, companies(name, logo_url)').eq('id', user.id).single();
      if (!u) return;
      setCompanyId(u.company_id);
      if (u.companies) setCompany(u.companies);
      const { data } = await supabase
        .from('events').select('*')
        .eq('company_id', u.company_id)
        .order('event_date', { ascending: false });
      setEvents(data || []);
    } finally {
      setLoading(false);
    }
  };

  const loadEventDetails = async (eventId: string) => {
    const [{ data: revs }, { data: exps }] = await Promise.all([
      (supabase as any).from('event_revenues').select('*').eq('event_id', eventId).order('recorded_at', { ascending: false }),
      (supabase as any).from('event_expenses').select('*').eq('event_id', eventId).order('paid_at', { ascending: false }),
    ]);
    setRevenues(prev => ({ ...prev, [eventId]: revs || [] }));
    setExpenses(prev => ({ ...prev, [eventId]: exps || [] }));
  };

  const toggleExpand = async (id: string) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    if (!revenues[id]) await loadEventDetails(id);
  };

  // ── Create Event ──────────────────────────────────────────────────────────
  const createEvent = async () => {
    if (!eventForm.name || !eventForm.event_date || !companyId) return;
    setSaving(true);
    try {
      const { error } = await (supabase as any).from('events').insert({
        company_id:    companyId,
        name:          eventForm.name,
        event_date:    eventForm.event_date,
        event_type:    eventForm.event_type,
        formule:       eventForm.formule,
        prix_formule:  eventForm.prix_formule ? Number(eventForm.prix_formule) : null,
        location:      eventForm.location || null,
        client_name:   eventForm.client_name || null,
        booked_guests: Number(eventForm.booked_guests) || 0,
        toppings:      eventForm.toppings ? eventForm.toppings.split(',').map(t => t.trim()) : null,
        status:        eventForm.status,
        notes:         eventForm.notes || null,
      });
      if (!error) {
        setShowNewEvent(false);
        setEventForm({ name: '', event_date: '', event_type: 'corporate', formule: 'prix_par_personne', prix_formule: '', location: '', client_name: '', booked_guests: '', toppings: '', status: 'planned', notes: '' });
        await loadData();
      }
    } finally {
      setSaving(false);
    }
  };

  // ── Add Revenue ────────────────────────────────────────────────────────────
  const addRevenue = async (eventId: string) => {
    if (!revForm.description || !revForm.amount) return;
    setSaving(true);
    try {
      await (supabase as any).from('event_revenues').insert({
        company_id:     companyId,
        event_id:       eventId,
        description:    revForm.description,
        amount:         Number(revForm.amount),
        currency:       'XOF',
        payment_method: revForm.payment_method,
      });
      setRevForm({ description: '', amount: '', payment_method: 'cash' });
      setShowRevForm(null);
      await loadEventDetails(eventId);
    } finally {
      setSaving(false);
    }
  };

  // ── Add Expense ────────────────────────────────────────────────────────────
  const addExpense = async (eventId: string) => {
    if (!expForm.description || !expForm.amount) return;
    setSaving(true);
    try {
      await (supabase as any).from('event_expenses').insert({
        company_id:  companyId,
        event_id:    eventId,
        category:    expForm.category,
        description: expForm.description,
        amount:      Number(expForm.amount),
        currency:    'XOF',
      });
      setExpForm({ category: 'matieres_premieres', description: '', amount: '' });
      setShowExpForm(null);
      await loadEventDetails(eventId);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteRevenue = async (id: string, eventId: string) => {
    await (supabase as any).from('event_revenues').delete().eq('id', id);
    await loadEventDetails(eventId);
  };
  const deleteExpense = async (id: string, eventId: string) => {
    await (supabase as any).from('event_expenses').delete().eq('id', id);
    await loadEventDetails(eventId);
  };

  // ── P&L helpers ────────────────────────────────────────────────────────────
  const totalRev  = (id: string) => (revenues[id] || []).reduce((s, r) => s + Number(r.amount), 0);
  const totalExp  = (id: string) => (expenses[id] || []).reduce((s, e) => s + Number(e.amount), 0);
  const profit    = (id: string) => totalRev(id) - totalExp(id);
  const margin    = (id: string) => totalRev(id) > 0 ? Math.round(profit(id) / totalRev(id) * 100) : 0;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAF8' }}>
      <Loader2 size={28} className="animate-spin" style={{ color: COLOR }} />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8', fontFamily: 'DM Sans, sans-serif' }}>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div style={{ background: '#1C1F3B' }} className="px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => window.location.href = '/crm'}
              className="text-white/60 hover:text-white transition">
              <ArrowLeft size={18} />
            </button>
            {company?.logo_url ? (
              <img src={company.logo_url} alt={company?.name || 'Logo'}
                className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                style={{ background: '#fff' }} />
            ) : (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: COLOR }}>🎉</div>
            )}
            <h1 className="text-white font-extrabold"
              style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px' }}>
              Mes événements
            </h1>
          </div>
          <button
            onClick={() => setShowNewEvent(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: COLOR }}>
            <Plus size={15} /> Nouvel événement
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-4">

        {/* ── NEW EVENT MODAL ──────────────────────────────── */}
        {showNewEvent && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Nouvel événement
                </h2>
                <button onClick={() => setShowNewEvent(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <div className="px-6 py-5 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input label="Nom de l'événement *" value={eventForm.name}
                    onChange={e => setEventForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ex: Mariage Dupont & Martin" />
                </div>
                <Input label="Date *" type="date" value={eventForm.event_date}
                  onChange={e => setEventForm(f => ({ ...f, event_date: e.target.value }))} />
                <Select label="Type" value={eventForm.event_type} options={EVENT_TYPES}
                  onChange={e => setEventForm(f => ({ ...f, event_type: e.target.value }))} />
                <Select label="Formule" value={eventForm.formule} options={FORMULES}
                  onChange={e => setEventForm(f => ({ ...f, formule: e.target.value }))} />
                <Input label="Prix formule (XOF)" type="number" value={eventForm.prix_formule}
                  onChange={e => setEventForm(f => ({ ...f, prix_formule: e.target.value }))}
                  placeholder="Ex: 2500" />
                <Input label="Nb. personnes bookées" type="number" value={eventForm.booked_guests}
                  onChange={e => setEventForm(f => ({ ...f, booked_guests: e.target.value }))}
                  placeholder="Ex: 80" />
                <Input label="Client / Organisateur" value={eventForm.client_name}
                  onChange={e => setEventForm(f => ({ ...f, client_name: e.target.value }))}
                  placeholder="Nom du client" />
                <div className="col-span-2">
                  <Input label="Lieu" value={eventForm.location}
                    onChange={e => setEventForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="Ex: Sofitel Abidjan, Cocody..." />
                </div>
                <div className="col-span-2">
                  <Input label="Toppings prévus (séparés par virgule)" value={eventForm.toppings}
                    onChange={e => setEventForm(f => ({ ...f, toppings: e.target.value }))}
                    placeholder="Ex: chocolat, caramel, fraises, nutella" />
                </div>
                <Select label="Statut" value={eventForm.status}
                  options={[
                    { value: 'planned', label: 'Planifié' },
                    { value: 'ongoing', label: 'En cours' },
                    { value: 'completed', label: 'Terminé' },
                    { value: 'cancelled', label: 'Annulé' },
                  ]}
                  onChange={e => setEventForm(f => ({ ...f, status: e.target.value }))} />
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                <button onClick={() => setShowNewEvent(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600">
                  Annuler
                </button>
                <button onClick={createEvent} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: COLOR }}>
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  Créer l'événement
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── EVENT LIST ───────────────────────────────────── */}
        {events.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-16 text-center">
            <p className="text-5xl mb-4">🎉</p>
            <p className="font-semibold text-gray-800 mb-2">Aucun événement pour le moment</p>
            <p className="text-sm text-gray-400 mb-6">Créez votre premier événement pour commencer le suivi financier</p>
            <button onClick={() => setShowNewEvent(true)}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: COLOR }}>
              Créer mon premier événement
            </button>
          </div>
        ) : events.map(ev => {
          const isOpen = expandedId === ev.id;
          const cfg    = STATUS_CONFIG[ev.status] || STATUS_CONFIG.planned;
          const revTotal = totalRev(ev.id);
          const expTotal = totalExp(ev.id);
          const pnl      = profit(ev.id);
          const mgn      = margin(ev.id);

          return (
            <div key={ev.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* EVENT ROW */}
              <div
                className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-amber-50/20 transition-colors"
                onClick={() => toggleExpand(ev.id)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: COLOR + '18' }}>
                  {ev.event_type === 'mariage' ? '💍' : ev.event_type === 'anniversaire' ? '🎂' : ev.event_type === 'corporate' ? '🏢' : '🎪'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-gray-900 text-sm truncate">{ev.name}</p>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={11} />{new Date(ev.event_date).toLocaleDateString('fr-FR')}</span>
                    {ev.client_name && <span className="flex items-center gap-1"><Tag size={11} />{ev.client_name}</span>}
                    <span className="flex items-center gap-1"><Users size={11} />{ev.actual_guests || ev.booked_guests} pers.</span>
                    {ev.location && <span className="flex items-center gap-1 truncate"><MapPin size={11} />{ev.location}</span>}
                  </div>
                </div>
                {isOpen && revenues[ev.id] !== undefined && (
                  <div className="text-right flex-shrink-0 mr-2">
                    <p className="font-bold text-sm"
                      style={{ color: pnl >= 0 ? '#27AE60' : '#E74C3C' }}>
                      {pnl >= 0 ? '+' : ''}{formatCFA(pnl)}
                    </p>
                    <p className="text-xs text-gray-400">{mgn}% marge</p>
                  </div>
                )}
                <div className="flex-shrink-0 text-gray-400">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {/* EXPANDED DETAIL */}
              {isOpen && (
                <div className="border-t border-gray-50 px-5 py-5 space-y-5">

                  {/* P&L SUMMARY */}
                  {revenues[ev.id] !== undefined && (
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: 'Revenus',  value: formatCFA(revTotal), color: '#27AE60', icon: <TrendingUp size={14} /> },
                        { label: 'Dépenses', value: formatCFA(expTotal), color: '#E74C3C', icon: <TrendingDown size={14} /> },
                        { label: 'Bénéfice', value: formatCFA(pnl),      color: pnl >= 0 ? '#27AE60' : '#E74C3C', icon: <CheckCircle2 size={14} /> },
                        { label: 'Marge',    value: `${mgn}%`,           color: COLOR,    icon: <Tag size={14} /> },
                      ].map((k, i) => (
                        <div key={i} className="rounded-xl p-3 text-center"
                          style={{ background: k.color + '10' }}>
                          <div className="flex items-center justify-center gap-1 mb-1" style={{ color: k.color }}>
                            {k.icon}
                          </div>
                          <p className="font-bold text-sm" style={{ color: k.color }}>{k.value}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{k.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* ── REVENUES ──────────────────── */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                          <TrendingUp size={14} style={{ color: '#27AE60' }} /> Revenus
                        </h3>
                        <button onClick={() => setShowRevForm(showRevForm === ev.id ? null : ev.id)}
                          className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition"
                          style={{ background: '#27AE60' + '15', color: '#27AE60' }}>
                          <Plus size={11} /> Ajouter
                        </button>
                      </div>

                      {showRevForm === ev.id && (
                        <div className="bg-green-50 rounded-xl p-4 mb-3 space-y-3">
                          <Input label="Description" value={revForm.description}
                            onChange={e => setRevForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="Ex: Prestation 80 personnes" />
                          <div className="grid grid-cols-2 gap-2">
                            <Input label="Montant (XOF)" type="number" value={revForm.amount}
                              onChange={e => setRevForm(f => ({ ...f, amount: e.target.value }))} />
                            <Select label="Paiement" value={revForm.payment_method} options={PAYMENT_METHODS}
                              onChange={e => setRevForm(f => ({ ...f, payment_method: e.target.value }))} />
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setShowRevForm(null)}
                              className="flex-1 py-2 rounded-lg text-xs font-medium border border-gray-200 text-gray-500">
                              Annuler
                            </button>
                            <button onClick={() => addRevenue(ev.id)} disabled={saving}
                              className="flex-1 py-2 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1"
                              style={{ background: '#27AE60' }}>
                              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                              Enregistrer
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        {(revenues[ev.id] || []).length === 0 ? (
                          <p className="text-xs text-gray-400 italic py-2">Aucun revenu enregistré</p>
                        ) : (revenues[ev.id] || []).map(r => (
                          <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-green-50/50">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-800 truncate">{r.description}</p>
                              <p className="text-xs text-gray-400 capitalize">{r.payment_method.replace('_', ' ')}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              <span className="font-semibold text-sm text-green-700">+{formatCFA(Number(r.amount))}</span>
                              <button onClick={() => deleteRevenue(r.id, ev.id)}
                                className="text-gray-300 hover:text-red-400 transition">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── EXPENSES ──────────────────── */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                          <TrendingDown size={14} style={{ color: '#E74C3C' }} /> Dépenses
                        </h3>
                        <button onClick={() => setShowExpForm(showExpForm === ev.id ? null : ev.id)}
                          className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition"
                          style={{ background: '#E74C3C' + '15', color: '#E74C3C' }}>
                          <Plus size={11} /> Ajouter
                        </button>
                      </div>

                      {showExpForm === ev.id && (
                        <div className="bg-red-50 rounded-xl p-4 mb-3 space-y-3">
                          <Select label="Catégorie" value={expForm.category} options={EXPENSE_CATEGORIES}
                            onChange={e => setExpForm(f => ({ ...f, category: e.target.value }))} />
                          <Input label="Description" value={expForm.description}
                            onChange={e => setExpForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="Ex: Farine, œufs, lait (120 pers)" />
                          <Input label="Montant (XOF)" type="number" value={expForm.amount}
                            onChange={e => setExpForm(f => ({ ...f, amount: e.target.value }))} />
                          <div className="flex gap-2">
                            <button onClick={() => setShowExpForm(null)}
                              className="flex-1 py-2 rounded-lg text-xs font-medium border border-gray-200 text-gray-500">
                              Annuler
                            </button>
                            <button onClick={() => addExpense(ev.id)} disabled={saving}
                              className="flex-1 py-2 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1"
                              style={{ background: '#E74C3C' }}>
                              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                              Enregistrer
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        {(expenses[ev.id] || []).length === 0 ? (
                          <p className="text-xs text-gray-400 italic py-2">Aucune dépense enregistrée</p>
                        ) : (expenses[ev.id] || []).map(x => {
                          const catLabel = EXPENSE_CATEGORIES.find(c => c.value === x.category)?.label || x.category;
                          return (
                            <div key={x.id} className="flex items-center justify-between p-3 rounded-xl bg-red-50/50">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-800 truncate">{x.description}</p>
                                <p className="text-xs text-gray-400">{catLabel}</p>
                              </div>
                              <div className="flex items-center gap-2 ml-2">
                                <span className="font-semibold text-sm text-red-700">-{formatCFA(Number(x.amount))}</span>
                                <button onClick={() => deleteExpense(x.id, ev.id)}
                                  className="text-gray-300 hover:text-red-400 transition">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventsPage;
