'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export interface MapboxMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  color?: string;
  category?: string;
}

export interface MapboxMapProps {
  markers?: MapboxMarker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onMarkerClick?: (marker: MapboxMarker) => void;
}

const SRI_LANKA_CENTER: [number, number] = [80.7718, 7.8731];
const DEFAULT_ZOOM = 6.6;

export function MapboxMap({
  markers = [],
  center = SRI_LANKA_CENTER,
  zoom = DEFAULT_ZOOM,
  height = '400px',
  onMarkerClick,
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const markersRef   = useRef<mapboxgl.Marker[]>([]);
  const token        = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Init map once
  useEffect(() => {
    if (!token || !mapContainer.current || mapRef.current) return;
    mapboxgl.accessToken = token;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center,
      zoom,
    });
    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Update markers whenever the markers prop changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (markers.length === 0) {
      mapRef.current.flyTo({ center: SRI_LANKA_CENTER, zoom: DEFAULT_ZOOM, duration: 600 });
      return;
    }

    markers.forEach((m) => {
      const popup = new mapboxgl.Popup({ offset: 20 }).setHTML(
        `<strong style="font-size:13px">${m.name}</strong>${m.category ? `<br/><span style="font-size:11px;color:#64748b">${m.category}</span>` : ''}`,
      );

      const marker = new mapboxgl.Marker({ color: m.color ?? '#0d9488' })
        .setLngLat([m.longitude, m.latitude])
        .setPopup(popup)
        .addTo(mapRef.current as mapboxgl.Map);

      if (onMarkerClick) {
        marker.getElement().addEventListener('click', () => onMarkerClick(m));
      }

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    const bounds = new mapboxgl.LngLatBounds();
    markers.forEach((m) => bounds.extend([m.longitude, m.latitude]));
    mapRef.current.fitBounds(bounds, { padding: 60, maxZoom: 12, duration: 600 });
  }, [markers, onMarkerClick]);

  if (!token) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-xl bg-gray-100 flex items-center justify-center text-sm text-gray-400"
      >
        Map preview unavailable
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      style={{ height }}
      className="w-full rounded-xl overflow-hidden"
    />
  );
}
