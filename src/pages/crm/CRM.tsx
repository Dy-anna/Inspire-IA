// src/pages/crm/CRM.tsx
// ─────────────────────────────────────────────────────────────────────────────
// MOTEUR CRM GÉNÉRIQUE
// Un seul composant pour les 7 secteurs. Lit sector_configs pour savoir
// quoi afficher (libellés, couleurs, KPIs, colonnes de la liste).
// Langage visuel aligné sur AnalyticsPage : cartes à bordure colorée,
// icône en haut à droite, typographie cohérente dans tout le produit.
//
// Ce que ce moteur fait : header + KPIs + liste d'entités, génériquement.
// Ce qu'il ne fait PAS (encore) : la création/édition d'entité — chaque
// secteur garde sa propre logique de formulaire pour l'instant (sous-entités
// financières trop différentes entre Event, Hôtel, Restaurant etc.)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
  TrendingUp, TrendingDown, DollarSign, Users, Plus, ChevronRight,
  Calendar, CalendarClock, Package, BedDouble, GraduationCap, ClipboardList,
} from 'lucide-react';
import { SectorIcon } from '@/components/SectorIcon';

function kpiIcon(key: string) {
  const k = key.toLowerCase();
  if (/profit|margin/.test(k))                          return TrendingUp;
  if (/expense/.test(k))                                return TrendingDown;
  if (/revenue|value|price|ca_|montant/.test(k))         return DollarSign;
  if (/leads|clients|patients|students|pipeline/.test(k)) return Users;
  if (/today|checkin|appointments_today/.test(k))        return Calendar;
  if (/upcoming|departure|week|pending/.test(k))          return CalendarClock;
  if (/room|available_rooms/.test(k))                     return BedDouble;
  if (/class|enrollment/.test(k))                         return GraduationCap;
  if (/package|listing|service|order/.test(k))            return Package;
  return ClipboardList;
}

interface SectorConfig {
  sector: string;
  label: string;
  icon: string;
  color: string;
  entity_table: string;
  entity_label: string;
  entity_label_plural: string;
  crm_nav_label: string;
  fields: any[];
  kpis: { key: string; label: string }[];
  title_field: string;
  subtitle_field: string;
  date_field: string;
  status_field: string;
}

interface Company {
  id: string;
  name: string;
  logo_url?: string | null;
}

const formatNumber = (n: number) =>
  typeof n === 'number' ? new Intl.NumberFormat('fr-FR').format(Math.round(n)) : n;

const isMoneyKpi = (key: string) =>
  /revenue|expense|profit|amount|total_amount|montant|value|price/i.test(key);

const isPercentKpi = (key: string) => /pct|percent|margin/i.test(key);

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  completed: { bg: '#DCFCE7', text: '#16A34A' },
  confirmed: { bg: '#DCFCE7', text: '#16A34A' },
  paid:      { bg: '#DCFCE7', text: '#16A34A' },
  active:    { bg: '#DCFCE7', text: '#16A34A' },
  planned:   { bg: '#DBEAFE', text: '#1D4ED8' },
  pending:   { bg: '#FEF3C7', text: '#D97706' },
  new:       { bg: '#FEF3C7', text: '#D97706' },
  ongoing:   { bg: '#FEF3C7', text: '#D97706' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626' },
};

const CRM: React.FC = () => {
  const { user } = useAuth();
  const [config, setConfig]   = useState<SectorConfig | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [stats, setStats]     = useState<Record<string, any>>({});
  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user?.company_id) loadAll(); }, [user?.company_id]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const cid = user!.company_id;
      const sector = user!.sector;

      const { data: cfg } = await supabase
        .from('sector_configs').select('*').eq('sector', sector).single();
      if (!cfg) { setLoading(false); return; }
      setConfig(cfg as SectorConfig);

      const { data: comp } = await supabase
        .from('companies').select('id, name, logo_url').eq('id', cid).single();
      setCompany(comp);

      const { data: statsData } = await supabase.rpc('get_sector_stats', { p_company_id: cid });
      setStats(statsData || {});

      const { data: rows } = await supabase
        .from(cfg.entity_table)
        .select('*')
        .eq('company_id', cid)
        .order(cfg.date_field || 'created_at', { ascending: false })
        .limit(20);
      setEntities(rows || []);

    } finally {
      setLoading(false);
    }
  };

  if (loading || !config) {
    return (
      <div className="w-full flex items-center justify-center py-32">
        <div className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: '#E8E8E5', borderTopColor: '#6B3FA0' }} />
      </div>
    );
  }

  const COLOR = config.color;
  const allKpis = [...config.kpis, { key: 'total_clients', label: 'Clients total' }];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>

      {/* HEADER — aligné sur AnalyticsPage : titre + sous-titre à gauche, action à droite */}
      <div className="flex items-center justify-between mb-[22px]">
        <div className="flex items-center gap-3">
          {company?.logo_url ? (
            <img src={company.logo_url} alt={company.name}
              className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
          ) : (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: COLOR }}>
              <SectorIcon name={config.icon} size={19} color="#fff" />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', margin: 0 }}>
              {company?.name || 'Mon Entreprise'}
            </h1>
            <p style={{ fontSize: 13, color: '#787774', margin: '3px 0 0' }}>{config.crm_nav_label}</p>
          </div>
        </div>
        <button
          onClick={() => window.location.href = `/app/catalogue?new=true`}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: COLOR }}>
          <Plus size={15} /> Nouveau {config.entity_label.toLowerCase()}
        </button>
      </div>

      <div className="flex flex-col gap-4">

        {/* KPIs — bordure colorée en haut, icône en haut à droite, valeur en grand : identique à Analytics */}
        <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
          {allKpis.map((kpi) => {
            const raw = stats[kpi.key] ?? 0;
            const isMoney = isMoneyKpi(kpi.key);
            const isPercent = isPercentKpi(kpi.key);
            const display = isMoney ? `${formatNumber(raw)} XOF` : isPercent ? `${raw}%` : formatNumber(raw);
            const isNeg = isMoney && raw < 0;
            const Icon = kpi.key === 'total_clients' ? Users : kpiIcon(kpi.key);
            const cardColor = kpi.key === 'total_clients' ? '#6B3FA0' : COLOR;
            return (
              <div key={kpi.key}
                style={{ background: '#fff', border: '1px solid #E8E8E5', borderRadius: 10, padding: '18px 20px', borderTop: `3px solid ${cardColor}` }}>
                <div className="flex items-start justify-between">
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#787774' }}>{kpi.label}</span>
                  <div className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center flex-shrink-0"
                    style={{ background: `${cardColor}18` }}>
                    <Icon size={14} color={cardColor} />
                  </div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: isNeg ? '#E74C3C' : '#1A1A1A', margin: '8px 0 2px' }}>
                  {display}
                </div>
              </div>
            );
          })}
        </div>

        {/* LISTE — générique sur entity_table, colonnes pilotées par config */}
        <div style={{ background: '#fff', border: '1px solid #E8E8E5', borderRadius: 10 }} className="overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#F1F1EF' }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{config.entity_label_plural} récents</h2>
            <button onClick={() => window.location.href = '/app/catalogue'}
              className="text-xs font-medium flex items-center gap-1" style={{ color: COLOR }}>
              Tout voir <ChevronRight size={13} />
            </button>
          </div>

          {entities.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="flex justify-center mb-3">
                <SectorIcon name={config.icon} size={36} color={COLOR} />
              </div>
              <p style={{ fontSize: 13, color: '#AFAFAC' }} className="mb-4">
                Aucun {config.entity_label.toLowerCase()} pour le moment
              </p>
              <button onClick={() => window.location.href = '/app/catalogue?new=true'}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: COLOR }}>
                Créer mon premier {config.entity_label.toLowerCase()}
              </button>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#F7F7F5' }}>
              {entities.map((row) => {
                const title    = row[config.title_field] || '—';
                const subtitle = row[config.subtitle_field];
                const status   = row[config.status_field];
                const statusCfg = STATUS_COLORS[status] || { bg: '#F1F1EF', text: '#787774' };
                return (
                  <div key={row.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="min-w-0">
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: '#1A1A1A' }} className="truncate">{title}</p>
                      {subtitle && <p style={{ fontSize: 12, color: '#AFAFAC', marginTop: 2 }}>{String(subtitle)}</p>}
                    </div>
                    {status && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                        style={{ background: statusCfg.bg, color: statusCfg.text }}>
                        {status}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CRM;