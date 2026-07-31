'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { API_URL } from '@/lib/api/config';

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = 'TEMPLE' | 'BEACH' | 'MOUNTAIN' | 'WATERFALL' | 'HISTORIC' | 'WILDLIFE' | 'CITY' | 'NATURE';

interface MapDestination {
  id: string;
  name: string;
  category: Category;
  latitude: number;
  longitude: number;
  description: string;
  travelTips?: string;
  estimatedVisitingTime?: string;
  entryFee?: number;
  openingHours?: string;
  images: string[];
  coverImage?: string;
  featured?: boolean;
  bestVisitingSeason?: string;
  weatherInfo?: {
    temperature?: string;
    humidity?: string;
    rainfall?: string;
    condition?: string;
    climate?: string;
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CAT_META: Record<Category, { emoji: string; color: string; label: string }> = {
  TEMPLE:    { emoji: '🛕', color: '#f59e0b', label: 'Temple'    },
  BEACH:     { emoji: '🏖️', color: '#06b6d4', label: 'Beach'     },
  MOUNTAIN:  { emoji: '⛰️', color: '#6366f1', label: 'Mountain'  },
  WATERFALL: { emoji: '💧', color: '#0ea5e9', label: 'Waterfall' },
  HISTORIC:  { emoji: '🏛️', color: '#8b5cf6', label: 'Historic'  },
  WILDLIFE:  { emoji: '🐘', color: '#10b981', label: 'Wildlife'  },
  CITY:      { emoji: '🏙️', color: '#1e40af', label: 'City'      },
  NATURE:    { emoji: '🌿', color: '#34d399', label: 'Nature'    },
};

// ─── Inline styles ────────────────────────────────────────────────────────────

const S = {
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    fontFamily: 'Inter, system-ui, sans-serif',
    background: '#0f172a',
    overflow: 'hidden',
  },
  topBar: {
    height: 52,
    minHeight: 52,
    background: '#0f172a',
    borderBottom: '1px solid #1e293b',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    gap: 12,
  },
  title: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: 700,
    margin: 0,
  },
  badge: (bg: string, color: string) => ({
    background: bg,
    color,
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 10px',
    borderRadius: 20,
  }),
  countText: {
    color: '#94a3b8',
    fontSize: 12,
    marginLeft: 'auto',
    display: 'flex',
    gap: 16,
  },
  filterBar: {
    background: '#0f172a',
    borderBottom: '1px solid #1e293b',
    padding: '8px 16px',
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap' as const,
    alignItems: 'center',
  },
  pill: (active: boolean, color = '#334155') => ({
    background: active ? color : 'transparent',
    color: active ? '#fff' : '#94a3b8',
    border: `1px solid ${active ? color : '#334155'}`,
    borderRadius: 20,
    padding: '4px 14px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap' as const,
  }),
  divider: {
    width: 1,
    height: 20,
    background: '#334155',
    margin: '0 4px',
  },
  mapRow: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    position: 'relative' as const,
  },
  mapWrap: {
    flex: 1,
    position: 'relative' as const,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute' as const,
    inset: 0,
    background: 'rgba(15,23,42,0.82)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    zIndex: 1000,
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: 500,
  },
  legend: {
    position: 'absolute' as const,
    bottom: 32,
    left: 12,
    background: '#fff',
    borderRadius: 10,
    padding: '10px 14px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
    zIndex: 500,
    fontSize: 12,
    minWidth: 160,
  },
  sidePanel: (open: boolean) => ({
    width: open ? 320 : 0,
    minWidth: open ? 320 : 0,
    background: '#fff',
    borderLeft: '1px solid #e2e8f0',
    overflow: open ? ('auto' as const) : ('hidden' as const),
    transition: 'width 0.2s ease, min-width 0.2s ease',
    display: 'flex',
    flexDirection: 'column' as const,
  }),
  panelInner: {
    padding: 20,
    minWidth: 320,
  },
  panelClose: {
    position: 'absolute' as const,
    top: 12,
    right: 12,
    background: 'none',
    border: 'none',
    fontSize: 20,
    cursor: 'pointer',
    color: '#64748b',
    lineHeight: 1,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
    marginTop: 12,
  },
  infoCard: (bg = '#f8fafc') => ({
    background: bg,
    borderRadius: 8,
    padding: '10px 12px',
  }),
  infoLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: 500,
  },
  tipBox: {
    background: '#f0fdf4',
    borderRadius: 8,
    padding: '10px 12px',
    marginTop: 12,
    fontSize: 13,
    color: '#166534',
    lineHeight: 1.5,
  },
  seasonBox: {
    background: '#fefce8',
    borderRadius: 8,
    padding: '10px 12px',
    marginTop: 12,
    fontSize: 13,
    color: '#713f12',
  },
  viewBtn: {
    display: 'block',
    width: '100%',
    marginTop: 16,
    padding: '10px 0',
    background: '#0f172a',
    color: '#fff',
    borderRadius: 8,
    border: 'none',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'center' as const,
    textDecoration: 'none',
  },
  photoStrip: {
    display: 'flex',
    gap: 6,
    overflowX: 'auto' as const,
    marginTop: 12,
    paddingBottom: 4,
  },
  photo: {
    width: 80,
    height: 60,
    borderRadius: 6,
    objectFit: 'cover' as const,
    flexShrink: 0,
  },
};

// ─── Leaflet window type ─────────────────────────────────────────────────────

type LeafletLib = typeof import('leaflet');
type WindowWithLeaflet = Window & typeof globalThis & { L?: LeafletLib };

// ─── Component ────────────────────────────────────────────────────────────────

export function LeafletMap() {
  const mapRef     = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<unknown>(null);
  const markerLayerRef = useRef<unknown>(null);

  const [mapReady, setMapReady]       = useState(false);
  const [mapData, setMapData]         = useState<{ destinations: MapDestination[] } | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  // Side panel state
  const [panel, setPanel] = useState<{ type: 'destination'; data: MapDestination } | null>(null);

  // ── Fetch /map/data ──────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API_URL}/map/data`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((d) => setMapData(d))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);



  // ── Init Leaflet ─────────────────────────────────────────────────────────
  const initMap = useCallback((L: LeafletLib) => {
    if (leafletMap.current || !mapRef.current) return;
    const map = L.map(mapRef.current, { center: [7.8731, 80.7718], zoom: 8, zoomControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO', subdomains: 'abcd', maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    leafletMap.current = map;
    markerLayerRef.current = L.layerGroup().addTo(map);
    setMapReady(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as WindowWithLeaflet).L) {
      initMap((window as WindowWithLeaflet).L!);
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.onload = () => initMap((window as WindowWithLeaflet).L!);
    document.head.appendChild(script);
  }, [initMap]);

  // ── Render markers whenever data/filters change ──────────────────────────
  useEffect(() => {
    const L = (window as WindowWithLeaflet).L;
    const layer = markerLayerRef.current as { clearLayers: () => void; addLayer: (m: unknown) => void } | null;
    if (!L || !layer || !mapData || !mapReady) return;

    layer.clearLayers();

    const visible = activeCategory
      ? mapData.destinations.filter((d) => d.category === activeCategory)
      : mapData.destinations;

    visible.forEach((dest) => {
      const meta = CAT_META[dest.category] ?? CAT_META.NATURE;
      const icon = L.divIcon({
        html: `<div style="width:34px;height:34px;border-radius:50% 50% 50% 0;background:${meta.color};border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.28);display:flex;align-items:center;justify-content:center;transform:rotate(-45deg);font-size:14px"><span style="transform:rotate(45deg)">${meta.emoji}</span></div>`,
        className: '',
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34],
      });
      const marker = L.marker([dest.latitude, dest.longitude], { icon });
      marker.on('click', () => setPanel({ type: 'destination', data: dest }));
      layer.addLayer(marker);
    });
  }, [mapData, activeCategory, mapReady]);

  // ── Derived counts ───────────────────────────────────────────────────────
  const featuredCount = mapData?.destinations.filter((d) => d.featured).length ?? 0;
  const visibleCount = activeCategory
    ? (mapData?.destinations.filter((d) => d.category === activeCategory).length ?? 0)
    : (mapData?.destinations.length ?? 0);

  const categoriesWithData = mapData
    ? (Object.keys(CAT_META) as Category[]).filter((c) =>
        mapData.destinations.some((d) => d.category === c)
      )
    : [];

  const legendCats = categoriesWithData;

  return (
    <div style={S.root}>

      {/* ── Top Bar ───────────────────────────────────────────────────── */}
      <div style={S.topBar}>
        <h1 style={S.title}>Sri Lanka Explorer</h1>
        <span style={S.badge('#1e40af', '#bfdbfe')}>Admin · Map View</span>
        <div style={S.countText}>
          <span>⭐ {featuredCount} featured</span>
          <span>🗺️ {visibleCount} destinations{activeCategory ? ` · ${CAT_META[activeCategory].label}` : ''}</span>
        </div>
      </div>

      {/* ── Filter Bar ────────────────────────────────────────────────── */}
      <div style={S.filterBar}>
        <button
          style={S.pill(activeCategory === null, '#475569')}
          onClick={() => setActiveCategory(null)}
        >
          All destinations
        </button>
        {categoriesWithData.map((cat) => (
          <button
            key={cat}
            style={S.pill(activeCategory === cat, CAT_META[cat].color)}
            onClick={() => setActiveCategory((c) => (c === cat ? null : cat))}
          >
            {CAT_META[cat].emoji} {CAT_META[cat].label}
          </button>
        ))}
      </div>

      {/* ── Map + Side Panel Row ──────────────────────────────────────── */}
      <div style={S.mapRow}>

        {/* Map */}
        <div style={S.mapWrap}>
          <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: 500 }} />

          {/* Loading overlay */}
          {loading && (
            <div style={S.overlay}>
              <span style={{ fontSize: 36 }}>🗺️</span>
              <span>Loading map data…</span>
            </div>
          )}

          {/* Error overlay */}
          {error && (
            <div style={S.overlay}>
              <span style={{ fontSize: 36 }}>⚠️</span>
              <span>{error}</span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{API_URL}/map/data</span>
            </div>
          )}

          {/* Legend */}
          {!loading && !error && legendCats.length > 0 && (
            <div style={S.legend}>
              <div style={{ fontWeight: 700, fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Legend
              </div>
              {legendCats.map((cat) => (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{
                    width: 14, height: 14,
                    borderRadius: '50% 50% 50% 0',
                    background: CAT_META[cat].color,
                    transform: 'rotate(-45deg)',
                    flexShrink: 0,
                    border: '1.5px solid #fff',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  }} />
                  <span style={{ fontSize: 12, color: '#334155' }}>{CAT_META[cat].emoji} {CAT_META[cat].label}</span>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* ── Side Panel ──────────────────────────────────────────────── */}
        <div style={S.sidePanel(panel !== null)}>
          {panel && (
            <div style={{ ...S.panelInner, position: 'relative' }}>
              <button style={S.panelClose} onClick={() => setPanel(null)}>×</button>

              {panel.type === 'destination' && <DestinationPanel data={panel.data} />}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Destination Panel ────────────────────────────────────────────────────────

function DestinationPanel({ data }: { data: MapDestination }) {
  const meta = CAT_META[data.category] ?? CAT_META.NATURE;
  return (
    <>
      <span style={{ ...S.badge(meta.color + '22', meta.color), fontSize: 11, fontWeight: 700 }}>
        {meta.emoji} {meta.label}
      </span>
      <h2 style={{ fontSize: 17, fontWeight: 700, margin: '10px 0 6px', color: '#0f172a', paddingRight: 24 }}>
        {data.name}
      </h2>
      <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.55, margin: 0 }}>{data.description}</p>

      <div style={S.infoGrid}>
        <div style={S.infoCard()}>
          <div style={S.infoLabel}>⏱ Visit time</div>
          <div style={S.infoValue}>{data.estimatedVisitingTime || '—'}</div>
        </div>
        <div style={S.infoCard()}>
          <div style={S.infoLabel}>🎟 Entry fee</div>
          <div style={S.infoValue}>{data.entryFee ? `LKR ${data.entryFee}` : 'Free'}</div>
        </div>
        <div style={S.infoCard()}>
          <div style={S.infoLabel}>🕐 Hours</div>
          <div style={S.infoValue}>{data.openingHours || '—'}</div>
        </div>
        <div style={S.infoCard()}>
          <div style={S.infoLabel}>🌤 Best season</div>
          <div style={S.infoValue}>{data.bestVisitingSeason || '—'}</div>
        </div>
      </div>

      {data.weatherInfo && (
        <div style={S.infoGrid}>
          <div style={S.infoCard()}>
            <div style={S.infoLabel}>🌡 Temp</div>
            <div style={S.infoValue}>{data.weatherInfo.temperature ?? '—'}</div>
          </div>
          <div style={S.infoCard()}>
            <div style={S.infoLabel}>🌿 Climate</div>
            <div style={S.infoValue}>{data.weatherInfo.climate ?? data.weatherInfo.condition ?? '—'}</div>
          </div>
        </div>
      )}

      {data.travelTips && (
        <div style={S.tipBox}>
          <strong>💡 Travel tip:</strong> {data.travelTips}
        </div>
      )}

      {data.featured && (
        <div style={{ ...S.badge('#fefce8', '#854d0e'), display: 'inline-block', marginTop: 14, fontSize: 12 }}>
          ⭐ Featured destination
        </div>
      )}

      {data.images && data.images.length > 0 && (
        <div style={S.photoStrip}>
          {data.images.slice(0, 4).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" style={S.photo} />
          ))}
        </div>
      )}

      <a href={`/destinations/${data.id}`} style={S.viewBtn}>
        View Full Details →
      </a>

      <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 12 }}>
        {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
      </p>
    </>
  );
}
