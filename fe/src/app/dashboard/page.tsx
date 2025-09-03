'use client';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MetricCard from './components/MetricCard';
import WeatherCard from './components/WeatherCard';
import EventsCard from './components/EventsCard';
import LandmarksCard from './components/LandmarksCard';
import AnimatedContainer from './components/AnimatedContainer';
import { events, landmarks } from '../data/mockData';
import { EyeIcon, ShareIcon, ClockIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';
import { useQuickStats } from '../utils/quickStats';
import type { MetricCard as MetricCardType, WeatherInfo } from '../types';
import { deriveCitiesFromPublishedCache, fetchWeatherForCities } from '../utils/weather';

export default function Dashboard() {
  const quickStats = useQuickStats();
  const [cards, setCards] = useState<MetricCardType[]>([{
    title: 'Total Views', value: '0', change: '+0%', isPositive: true, icon: EyeIcon,
  }, {
    title: 'Shares', value: '0', change: '+0%', isPositive: true, icon: ShareIcon,
  }, {
    title: 'Avg. Read Time', value: '0 min', change: '+0%', isPositive: true, icon: ClockIcon,
  }, {
    title: 'Engagement Rate', value: '0%', change: '+0%', isPositive: true, icon: HandThumbUpIcon,
  }]);
  const [weather, setWeather] = useState<WeatherInfo[]>([]);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);

  // Parse minutes from strings like "3 min"; fall back to 0
  const parseMinutes = (val: any): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    const m = String(val).match(/\d+(?:\.\d+)?/);
    return m ? parseFloat(m[0]) : 0;
  };

  // Estimate reading time by content length (200 wpm)
  const estimateReadTime = (content: string): number => {
    if (!content) return 0;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  };

  const pctChange = (current: number, previous: number): { label: string; positive: boolean } => {
    if (previous <= 0) return { label: '+0%', positive: true };
    const change = ((current - previous) / previous) * 100;
    const rounded = Math.round(change);
    return { label: `${change >= 0 ? '+' : ''}${rounded}%`, positive: change >= 0 };
  };

  const recompute = () => {
    try {
      const cached = localStorage.getItem('published_content_cache');
      const items: any[] = cached ? JSON.parse(cached) : [];

      // Split into recent half and previous half for change calc
      const mid = Math.floor(items.length / 2) || 1;
      const recent = items.slice(0, mid);
      const previous = items.slice(mid);

      const sum = (arr: any[], selector: (x: any) => number) => arr.reduce((a, i) => a + selector(i), 0);

      const totalViews = sum(items, i => Number(i.views) || 0);
      const viewsRecent = sum(recent, i => Number(i.views) || 0);
      const viewsPrev = sum(previous, i => Number(i.views) || 0);
      const viewsChange = pctChange(viewsRecent, viewsPrev);

      const totalShares = sum(items, i => Number(i.shares) || 0);
      const sharesRecent = sum(recent, i => Number(i.shares) || 0);
      const sharesPrev = sum(previous, i => Number(i.shares) || 0);
      const sharesChange = pctChange(sharesRecent, sharesPrev);

      const readMinutesArr = items.map(i => parseMinutes(i.reading_time) || estimateReadTime(i.content || ''));
      const avgReadTime = readMinutesArr.length ? (readMinutesArr.reduce((a, n) => a + n, 0) / readMinutesArr.length) : 0;
      const avgReadRecent = recent.length ? (recent.map(i => parseMinutes(i.reading_time) || estimateReadTime(i.content || '')).reduce((a, n) => a + n, 0) / recent.length) : 0;
      const avgReadPrev = previous.length ? (previous.map(i => parseMinutes(i.reading_time) || estimateReadTime(i.content || '')).reduce((a, n) => a + n, 0) / previous.length) : 0;
      const readChange = pctChange(avgReadRecent, avgReadPrev);

      const engagementAvg = items.length ? (sum(items, i => Number(i.engagement_rate) || 0) / items.length) : 0;
      const engagementRecent = recent.length ? (sum(recent, i => Number(i.engagement_rate) || 0) / recent.length) : 0;
      const engagementPrev = previous.length ? (sum(previous, i => Number(i.engagement_rate) || 0) / previous.length) : 0;
      const engagementChange = pctChange(engagementRecent, engagementPrev);

      setCards([
        { title: 'Total Views', value: Intl.NumberFormat().format(totalViews), change: viewsChange.label, isPositive: viewsChange.positive, icon: EyeIcon },
        { title: 'Shares', value: Intl.NumberFormat().format(totalShares), change: sharesChange.label, isPositive: sharesChange.positive, icon: ShareIcon },
        { title: 'Avg. Read Time', value: `${avgReadTime.toFixed(1)} min`, change: readChange.label, isPositive: readChange.positive, icon: ClockIcon },
        { title: 'Engagement Rate', value: `${engagementAvg.toFixed(1)}%`, change: engagementChange.label, isPositive: engagementChange.positive, icon: HandThumbUpIcon },
      ]);
    } catch (e) {
      // Leave defaults on error
    }
  };

  useEffect(() => {
    recompute();
    // fetch weather based on current destinations
    const loadWeather = async () => {
      setWeatherLoading(true);
      const cities = deriveCitiesFromPublishedCache(4);
      if (cities.length === 0) {
        setWeather([]);
        setWeatherLoading(false);
        return;
      }
      const wx = await fetchWeatherForCities(cities, 4);
      setWeather(wx || []);
      setWeatherLoading(false);
    };
    loadWeather();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'published_content_cache') {
        recompute();
        // refresh weather when destinations change
        const cities = deriveCitiesFromPublishedCache(4);
        fetchWeatherForCities(cities, 4).then(wx => setWeather(wx || []));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F1E9]">
      <Header />
      <div className="flex flex-col md:flex-row">
        <Sidebar quickStats={quickStats} currentPage="dashboard" />
        <main className="flex-1 p-4 md:p-8">
          <AnimatedContainer direction="up" delay={0.1}>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary-dark">Dashboard</h1>
              <div className="hidden sm:block text-sm text-gray-medium">
                Last updated <span className="font-semibold text-primary-dark">just now</span>
              </div>
            </div>
          </AnimatedContainer>

          <AnimatedContainer direction="up" delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {cards.map((metric, index) => (
                <AnimatedContainer key={metric.title} direction="up" delay={0.3 + index * 0.1}>
                  <MetricCard metric={metric} />
                </AnimatedContainer>
              ))}
            </div>
          </AnimatedContainer>

          <AnimatedContainer direction="up" delay={0.6}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <AnimatedContainer direction="up" delay={0.7}>
                <WeatherCard weatherData={weather} isLoading={weatherLoading} />
              </AnimatedContainer>
              <AnimatedContainer direction="up" delay={0.8}>
                <EventsCard events={events} />
              </AnimatedContainer>
              <AnimatedContainer direction="up" delay={0.9}>
                <LandmarksCard landmarks={landmarks} />
              </AnimatedContainer>
            </div>
          </AnimatedContainer>
        </main>
      </div>
    </div>
  );
} 