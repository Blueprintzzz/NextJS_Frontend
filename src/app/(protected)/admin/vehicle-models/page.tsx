'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type VehicleModel = {
  id: string;
  name: string;
  type: string;
  icon?: string;
  image?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const VEHICLE_TYPES = ['CAR', 'SUV', 'VAN', 'MINIBUS', 'LUXURY'];
const DEFAULT_ICONS: Record<string, string> = {
  CAR: '🚗', SUV: '🚙', VAN: '🚐', MINIBUS: '🚌', LUXURY: '🏎️',
};

function getAuthHeaders(): Record<string, string> {
  const raw = localStorage.getItem('tfx_auth');
  if (!raw) return {};
  const { accessToken } = JSON.parse(raw);
  if (!accessToken) return {};
  return { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
}

export default function VehicleModelsPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [editingModel, setEditingModel] = useState<VehicleModel | null>(null);
  const [formData, setFormData] = useState({ name: '', type: 'CAR', icon: '', image: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('tfx_auth');
    if (!raw) { router.replace('/login'); return; }
    const { user } = JSON.parse(raw);
    if (user?.role !== 'ADMIN') { router.replace('/'); return; }
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (authChecked) loadModels();
  }, [authChecked]);

  async function loadModels() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/vehicle-models`, { headers: getAuthHeaders() });
      const data = await res.json();
      setModels(Array.isArray(data) ? data : (data?.data ?? []));
    } catch {
      setModels([]);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingModel(null);
    setFormData({ name: '', type: 'CAR', icon: '', image: '' });
    setError(null);
    setShowForm(true);
  }

  function openEdit(model: VehicleModel) {
    setEditingModel(model);
    setFormData({ name: model.name, type: model.type, icon: model.icon ?? '', image: model.image ?? '' });
    setError(null);
    setShowForm(true);
  }

  async function handleSave() {
    if (!formData.name.trim()) { setError('Name is required'); return; }
    setSaving(true);
    setError(null);
    try {
      const body: Record<string, string> = {
        name: formData.name.trim(),
        type: formData.type,
      };
      if (formData.icon.trim()) body.icon = formData.icon.trim();
      if (formData.image.trim()) body.image = formData.image.trim();
      const url = editingModel ? `${API_URL}/vehicle-models/${editingModel.id}` : `${API_URL}/vehicle-models`;
      const res = await fetch(url, { method: editingModel ? 'PATCH' : 'POST', headers: getAuthHeaders(), body: JSON.stringify(body) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message ?? 'Failed to save'); }
      setShowForm(false);
      await loadModels();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this vehicle model? This cannot be undone.')) return;
    await fetch(`${API_URL}/vehicle-models/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    await loadModels();
  }

  if (!authChecked) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const displayModels = filterType === 'ALL' ? models : models.filter(m => m.type === filterType);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Models</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage models available for drivers</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors"
        >
          + Add Model
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {['ALL', ...VEHICLE_TYPES].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterType === type ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-600'
            }`}
          >
            {type === 'ALL' ? 'All Types' : type}
            <span className="ml-1 text-[10px] opacity-70">
              ({type === 'ALL' ? models.length : models.filter(m => m.type === type).length})
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-52 rounded-xl bg-gray-200 animate-pulse" />)}
        </div>
      ) : displayModels.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🚗</p>
          <p className="font-medium">No models found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayModels.map(model => (
            <div key={model.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-36 bg-gray-50">
                {model.image ? (
                  <img src={model.image} alt={model.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    {model.icon ?? DEFAULT_ICONS[model.type] ?? '🚗'}
                  </div>
                )}
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 text-xs font-semibold text-gray-700 rounded-full border border-gray-200">
                  {model.type}
                </span>
              </div>
              <div className="p-3">
                <p className="font-semibold text-gray-900 text-sm">{model.name}</p>
                {model.icon && <p className="text-xs text-gray-400 mt-0.5">Icon: {model.icon}</p>}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(model)} className="flex-1 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(model.id)} className="py-1.5 px-3 text-xs font-medium border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{editingModel ? 'Edit Model' : 'Add Vehicle Model'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <div>
              <label className="text-sm font-medium text-gray-700">Model Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Toyota HiAce"
                className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Type *</label>
              <select
                value={formData.type}
                onChange={e => setFormData(f => ({ ...f, type: e.target.value }))}
                className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Icon (emoji)</label>
              <div className="flex gap-2 mt-1 items-center">
                <input
                  type="text"
                  value={formData.icon}
                  onChange={e => setFormData(f => ({ ...f, icon: e.target.value }))}
                  placeholder={DEFAULT_ICONS[formData.type] ?? '🚗'}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-2xl">{formData.icon || DEFAULT_ICONS[formData.type] || '🚗'}</span>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {['🚗', '🚙', '🚐', '🚌', '🏎️', '🚕', '🚓', '🚑'].map(e => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, icon: e }))}
                    className={`text-xl p-1.5 rounded-lg border transition-colors ${formData.icon === e ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Image URL (optional)</label>
              <input
                type="url"
                value={formData.image}
                onChange={e => setFormData(f => ({ ...f, image: e.target.value }))}
                placeholder="https://example.com/hiace.jpg"
                className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {formData.image && (
                <div className="mt-2 h-24 rounded-lg overflow-hidden border border-gray-200">
                  <img src={formData.image} alt="preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
              <p className="text-xs text-gray-400 mt-1">If no image, the icon emoji will be shown instead</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors">
                {saving ? 'Saving…' : editingModel ? 'Save Changes' : 'Add Model'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
