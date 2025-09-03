import type { WeatherInfo } from '../types';

interface ResolvedCity {
  display: string; // human readable city
  latitude: number;
  longitude: number;
}

async function resolveToCity(place: string): Promise<ResolvedCity | null> {
  const query = (place || '').trim();
  if (!query) return null;

  // 1) Try Open‑Meteo geocoding search
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
    const geo = await geoRes.json();
    const cand = geo?.results?.[0];
    if (cand) {
      // If it's already a city/town/village or has admin info, use its own name
      const name: string = cand.name || cand.admin1 || query;
      return {
        display: name,
        latitude: Number(cand.latitude),
        longitude: Number(cand.longitude),
      };
    }
  } catch {}

  // 2) Fallback: Nominatim forward geocoding
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&limit=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const arr = await res.json();
    const hit = arr?.[0];
    if (hit) {
      const lat = Number(hit.lat);
      const lon = Number(hit.lon);
      // Try to get the nearest city name via reverse lookup
      const revUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
      const rev = await fetch(revUrl, { headers: { 'Accept-Language': 'en' } }).then(r => r.json()).catch(() => null);
      const addr = rev?.address || {};
      const cityName = addr.city || addr.town || addr.village || addr.county || hit.display_name?.split(',')?.[0] || query;
      return { display: cityName, latitude: lat, longitude: lon };
    }
  } catch {}

  // 3) Give up
  return null;
}

export async function fetchWeatherForCities(cities: string[], limit: number = 4): Promise<WeatherInfo[]> {
  const unique = Array.from(new Set(cities.filter(Boolean).map(c => c.trim()))).slice(0, limit);
  const results: WeatherInfo[] = [];

  for (const raw of unique) {
    try {
      const resolved = await resolveToCity(raw);
      if (!resolved) continue;

      // Fetch current and last 24h hourly temps
      const wxRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${resolved.latitude}&longitude=${resolved.longitude}&hourly=temperature_2m&past_days=1&current_weather=true&timezone=auto`);
      const wx = await wxRes.json();
      const currentTemp = Number(wx?.current_weather?.temperature);
      const hourlyTemps: number[] = (wx?.hourly?.temperature_2m || []).map((n: any) => Number(n));

      let change = 0;
      if (hourlyTemps && hourlyTemps.length >= 2) {
        const last = hourlyTemps[hourlyTemps.length - 1];
        const prev = hourlyTemps[hourlyTemps.length - 2];
        change = Number((last - prev).toFixed(0));
      }

      results.push({
        city: resolved.display,
        condition: wx?.current_weather ? 'Sunny' : '—', // For brevity; could map weathercode → text later
        temperature: `${Math.round(currentTemp)}°C`,
        change: `${change >= 0 ? '+' : ''}${change}°`,
        isPositive: change >= 0,
      });
    } catch (e) {
      // Skip on error
    }
  }

  return results;
}

export function deriveCitiesFromPublishedCache(max: number = 4): string[] {
  try {
    const cached = localStorage.getItem('published_content_cache');
    const items: any[] = cached ? JSON.parse(cached) : [];
    const raw: string[] = items
      .map((i: any) => (i?.location || i?.destination || ''))
      .filter((s: unknown): s is string => typeof s === 'string' && s.trim().length > 0)
      .map((s: string) => s.trim());
    const unique: string[] = Array.from(new Set<string>(raw)).slice(0, max);
    return unique;
  } catch {
    return [];
  }
}
