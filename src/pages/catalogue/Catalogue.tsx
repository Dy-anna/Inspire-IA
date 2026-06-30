// src/pages/catalogue/Catalogue.tsx
// ─────────────────────────────────────────────────────────────────────────────
// MOTEUR CATALOGUE GÉNÉRIQUE
// Un seul composant pour gérer les produits/services de 6 secteurs
// (restaurant, immobilier, voyage, école, clinique, hôtel).
// Le secteur Événementiel garde sa propre page (EventsPage.tsx) car ses
// sous-entités financières (revenus/dépenses par événement) sont trop
// différentes pour être génériquées sans risque.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { SectorIcon } from '@/components/SectorIcon';
import {
  Plus, X, Trash2, Pencil, Save, Loader2, Search
} from 'lucide-react';

interface CatalogueField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'boolean' | 'array';
  required?: boolean;
  options?: string[];
}

interface SectorConfig {
  sector: string;
  color: string;
  icon: string;
  catalogue_table: string;
  catalogue_label: string;
  catalogue_title_field: string;
  catalogue_price_field: string | null;
  catalogue_image_field: string | null;
  catalogue_desc_field: string | null;
  catalogue_fields: CatalogueField[];
}

const formatCFA = (n: number) =>
  new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' XOF';

const Input: React.FC<{ field: CatalogueField; value: any; onChange: (v: any) => void }> = ({ field, value, onChange }) => {
  if (field.type === 'textarea') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}{field.required && ' *'}</label>
        <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition resize-none" />
      </div>
    );
  }
  if (field.type === 'select') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}{field.required && ' *'}</label>
        <select value={value || ''} onChange={e => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition bg-white">
          <option value="">—</option>
          {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
  }
  if (field.type === 'boolean') {
    return (
      <div className="flex items-center justify-between py-1">
        <label className="text-xs font-medium text-gray-600">{field.label}</label>
        <button type="button" onClick={() => onChange(!value)}
          className="relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0"
          style={{ background: value ? '#6B3FA0' : '#E5E5E3' }}>
          <span className="absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform"
            style={{ left: value ? 18 : 2 }} />
        </button>
      </div>
    );
  }
  if (field.type === 'array') {
    const display = Array.isArray(value) ? value.join(', ') : (value || '');
    return (
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}{field.required && ' *'}</label>
        <input type="text" value={display} onChange={e => onChange(e.target.value)}
          placeholder="Ex: Maths, Français, Anglais"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition" />
      </div>
    );
  }
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}{field.required && ' *'}</label>
      <input
        type={field.type === 'number' ? 'number' : 'text'}
        value={value ?? ''}
        onChange={e => onChange(field.type === 'number' ? e.target.value : e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition"
      />
    </div>
  );
};

const Catalogue: React.FC = () => {
  const { user } = useAuth();
  const [config, setConfig]     = useState<SectorConfig | null>(null);
  const [company, setCompany]   = useState<{ name: string; logo_url?: string | null } | null>(null);
  const [items, setItems]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm]         = useState<Record<string, any>>({});
  const [saving, setSaving]     = useState(false);

  useEffect(() => { if (user?.company_id) loadAll(); }, [user?.company_id]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const { data: cfg } = await supabase
        .from('sector_configs').select('*').eq('sector', user!.sector).single();
      if (!cfg || !cfg.catalogue_table) { setLoading(false); return; }
      setConfig(cfg as SectorConfig);

      const { data: comp } = await supabase
        .from('companies').select('name, logo_url').eq('id', user!.company_id).single();
      setCompany(comp);

      const { data: rows } = await supabase
        .from(cfg.catalogue_table)
        .select('*')
        .eq('company_id', user!.company_id)
        .order('created_at', { ascending: false });
      setItems(rows || []);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm({});
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setForm(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const payload: Record<string, any> = { company_id: user!.company_id };
      for (const f of config.catalogue_fields) {
        let v = form[f.name];
        if (f.type === 'number' && v !== undefined && v !== '') v = Number(v);
        if (f.type === 'boolean') { payload[f.name] = !!v; continue; }
        if (f.type === 'array') {
          if (typeof v === 'string' && v.trim() !== '') {
            v = v.split(',').map((s: string) => s.trim()).filter(Boolean);
          } else if (!Array.isArray(v)) {
            v = null;
          }
          if (v !== null) payload[f.name] = v;
          continue;
        }
        if (v !== undefined && v !== '') payload[f.name] = v;
      }

      if (editingId) {
        await supabase.from(config.catalogue_table).update(payload).eq('id', editingId);
      } else {
        await supabase.from(config.catalogue_table).insert(payload);
      }
      setShowForm(false);
      setForm({});
      setEditingId(null);
      await loadAll();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!config) return;
    await supabase.from(config.catalogue_table).delete().eq('id', id);
    await loadAll();
  };

  const filtered = items.filter(it => {
    if (!search || !config) return true;
    const title = String(it[config.catalogue_title_field] || '').toLowerCase();
    return title.includes(search.toLowerCase());
  });

  if (loading) return (
    <div className="w-full flex items-center justify-center py-32">
      <Loader2 size={28} className="animate-spin" style={{ color: '#6B3FA0' }} />
    </div>
  );

  if (!config || !config.catalogue_table) {
    return (
      <div className="w-full flex items-center justify-center py-32">
        <p className="text-sm text-gray-400">Catalogue non disponible pour ce secteur.</p>
      </div>
    );
  }

  const COLOR = config.color;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>

      {/* HEADER — aligné sur AnalyticsPage : titre + sous-titre à gauche, action à droite */}
      <div className="flex items-center justify-between mb-[22px]">
        <div className="flex items-center gap-3">
          {company?.logo_url ? (
            <img src={company.logo_url} alt={company.name}
              className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
          ) : (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: COLOR }}>
              <SectorIcon name={config.icon} size={19} color="#fff" />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', margin: 0 }}>Catalogue</h1>
            <p style={{ fontSize: 13, color: '#787774', margin: '3px 0 0' }}>{config.catalogue_label}s</p>
          </div>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: COLOR }}>
          <Plus size={15} /> Nouveau {config.catalogue_label.toLowerCase()}
        </button>
      </div>

      <div className="flex flex-col gap-4">

        {/* SEARCH */}
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Rechercher un ${config.catalogue_label.toLowerCase()}...`}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition bg-white"
          />
        </div>

        {/* CREATE/EDIT MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">
                  {editingId ? 'Modifier' : 'Nouveau'} {config.catalogue_label.toLowerCase()}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <div className="px-6 py-5 space-y-4">
                {config.catalogue_fields.map(f => (
                  <Input key={f.name} field={f} value={form[f.name]}
                    onChange={v => setForm(prev => ({ ...prev, [f.name]: v }))} />
                ))}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                <button onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600">
                  Annuler
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: COLOR }}>
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LIST */}
        {filtered.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #E8E8E5', borderRadius: 10 }} className="px-8 py-16 text-center">
            <div className="flex justify-center mb-4">
              <SectorIcon name={config.icon} size={40} color={COLOR} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }} className="mb-2">
              {items.length === 0 ? `Aucun ${config.catalogue_label.toLowerCase()} pour le moment` : 'Aucun résultat'}
            </p>
            {items.length === 0 && (
              <button onClick={openCreate}
                className="mt-4 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: COLOR }}>
                Créer mon premier {config.catalogue_label.toLowerCase()}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(item => {
              const title = item[config.catalogue_title_field] || '—';
              const price = config.catalogue_price_field ? item[config.catalogue_price_field] : null;
              const desc  = config.catalogue_desc_field ? item[config.catalogue_desc_field] : null;
              const image = config.catalogue_image_field ? item[config.catalogue_image_field] : null;

              return (
                <div key={item.id} style={{ background: '#fff', border: '1px solid #E8E8E5', borderRadius: 10 }} className="overflow-hidden group">
                  {image ? (
                    <img src={image} alt={title} className="w-full h-32 object-cover" />
                  ) : (
                    <div className="w-full h-24 flex items-center justify-center" style={{ background: COLOR + '0F' }}>
                      <SectorIcon name={config.icon} size={28} color={COLOR} />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: '#1A1A1A' }}>{title}</p>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(item)} className="text-gray-400 hover:text-gray-700">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    {desc && <p style={{ fontSize: 12, color: '#AFAFAC' }} className="line-clamp-2 mb-2">{desc}</p>}
                    {price != null && price !== '' && (
                      <p style={{ fontSize: 13.5, fontWeight: 700, color: COLOR }}>{formatCFA(Number(price))}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogue;