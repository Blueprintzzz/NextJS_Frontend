const ATTRACTION_CLASSES = new Set(['tourism', 'historic', 'natural', 'leisure']);
const NOM_HEADERS = { 'Accept-Language': 'en', 'User-Agent': 'TFXtour/1.0' };
const NOM_BASE = 'https://nominatim.openstreetmap.org';

export interface GeoSuggestion {
  place_name: string;
  place_type: string[]; // includes 'poi' for attractions
  center: [number, number]; // [lng, lat]
}

export async function searchPlaces(query: string): Promise<GeoSuggestion[]> {
  if (query.trim().length < 2) return [];
  try {
    const base = `${NOM_BASE}/search?countrycodes=lk&format=json&addressdetails=0&limit=6`;
    const [generalRes, attractionRes] = await Promise.all([
      fetch(`${base}&q=${encodeURIComponent(query)}`, { headers: NOM_HEADERS }),
      fetch(`${base}&q=${encodeURIComponent(query)}&class=tourism,historic,natural,leisure`, { headers: NOM_HEADERS }),
    ]);
    const [generalData, attractionData]: Array<Array<{ display_name: string; lat: string; lon: string; class: string }>> =
      await Promise.all([generalRes.json(), attractionRes.json()]);

    const seen = new Set<string>();
    const merged = [...attractionData, ...generalData]
      .filter((f) => {
        if (seen.has(f.display_name)) return false;
        seen.add(f.display_name);
        return true;
      })
      .sort((a, b) => (ATTRACTION_CLASSES.has(a.class) ? 0 : 1) - (ATTRACTION_CLASSES.has(b.class) ? 0 : 1))
      .slice(0, 6)
      .map((f) => ({
        place_name: f.display_name,
        place_type: [ATTRACTION_CLASSES.has(f.class) ? 'poi' : f.class],
        center: [parseFloat(f.lon), parseFloat(f.lat)] as [number, number],
      }));

    if (merged.length > 0) return merged;

    // Fallback: Mapbox
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return [];
    const mbRes = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=LK&proximity=80.7718,7.8731&types=poi,place,locality,neighborhood,district&limit=6&language=en&access_token=${token}`
    );
    const mbData = await mbRes.json();
    const mbSeen = new Set<string>();
    return [
      ...(mbData.features ?? []).filter((f: { place_type: string[] }) => f.place_type.includes('poi')),
      ...(mbData.features ?? []).filter((f: { place_type: string[] }) => !f.place_type.includes('poi')),
    ].filter((f: { place_name: string }) => {
      if (mbSeen.has(f.place_name)) return false;
      mbSeen.add(f.place_name);
      return true;
    }).slice(0, 6);
  } catch {
    return [];
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<{ district: string }> {
  try {
    const res = await fetch(
      `${NOM_BASE}/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`,
      { headers: NOM_HEADERS }
    );
    const data = await res.json();
    const addr = data.address ?? {};
    const district = addr.county ?? addr.state_district ?? addr.city ?? addr.town ?? addr.state ?? '';
    return { district };
  } catch {
    return { district: '' };
  }
}
