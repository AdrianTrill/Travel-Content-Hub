import { useEffect, useState } from 'react';
import { QuickStat } from '../types';

export const DEFAULT_QUICK_STATS: QuickStat[] = [
  { label: 'Destinations', value: '0', icon: 'GlobeAltIcon' },
  { label: 'Scheduled', value: '0', icon: 'CalendarIcon' },
  { label: 'Engagement', value: '+0%', icon: 'ArrowTrendingUpIcon' },
];

export function deriveQuickStatsFromItems(items: any[]): QuickStat[] {
  if (!items || items.length === 0) return DEFAULT_QUICK_STATS;
  const destinations = new Set((items || []).map(i => (i.location || i.destination || '').trim()).filter(Boolean));
  const scheduled = (items || []).filter(i => i.status === 'Scheduled').length;
  const avgEngagement = (items || []).reduce((acc, cur) => acc + (Number(cur.engagement_rate) || 0), 0) / (items.length || 1);
  return [
    { label: 'Destinations', value: String(destinations.size), icon: 'GlobeAltIcon' },
    { label: 'Scheduled', value: String(scheduled), icon: 'CalendarIcon' },
    { label: 'Engagement', value: `+${Math.round(avgEngagement)}%`, icon: 'ArrowTrendingUpIcon' },
  ];
}

export function useQuickStats(): QuickStat[] {
  const [stats, setStats] = useState<QuickStat[]>(DEFAULT_QUICK_STATS);

  useEffect(() => {
    try {
      const cached = localStorage.getItem('published_content_cache');
      if (cached) {
        const items = JSON.parse(cached);
        setStats(deriveQuickStatsFromItems(items));
      }
    } catch {}

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'published_content_cache') {
        try {
          const items = e.newValue ? JSON.parse(e.newValue) : [];
          setStats(deriveQuickStatsFromItems(items));
        } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return stats;
}
