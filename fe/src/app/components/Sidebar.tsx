'use client';

import {
  HomeIcon,
  SparklesIcon,
  ClockIcon,
  Cog6ToothIcon,
  GlobeAltIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { QuickStat } from '../types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AnimatedContainer from '../dashboard/components/AnimatedContainer';

interface SidebarProps {
  quickStats: QuickStat[];
  currentPage?: string;
}

export default function Sidebar({ quickStats, currentPage = 'dashboard' }: SidebarProps) {
  const [animateStats, setAnimateStats] = useState(false);
  const [counts, setCounts] = useState<{ [key: string]: number }>({});
  
  const navigationItems = [
    { name: 'Dashboard', icon: HomeIcon, href: '/', page: 'dashboard' },
    { name: 'Content Generation', icon: SparklesIcon, href: '/content-generation', page: 'content-generation' },
    { name: 'Content History', icon: ClockIcon, href: '/content-history', page: 'content-history' },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/settings', page: 'settings' },
  ];

  // Trigger animation whenever currentPage changes
  useEffect(() => {
    setAnimateStats(false);
    const timer = setTimeout(() => {
      setAnimateStats(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentPage]);

  // Also trigger animation on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateStats(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Custom counter animation function
  const animateCount = (label: string, targetValue: string, duration: number = 1500) => {
    const numericValue = parseFloat(targetValue.replace(/[^\d.-]/g, ''));
    if (isNaN(numericValue)) return;

    const startTime = Date.now();
    const startCount = counts[label] || 0;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = startCount + (numericValue - startCount) * easeOutQuart;
      
      setCounts(prev => ({ ...prev, [label]: currentCount }));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure we reach the final value exactly
        setCounts(prev => ({ ...prev, [label]: numericValue }));
      }
    };
    
    requestAnimationFrame(animate);
  };

  // Trigger count animations when animateStats changes
  useEffect(() => {
    if (animateStats) {
      quickStats.forEach((stat, index) => {
        setTimeout(() => {
          animateCount(stat.label, stat.value, 1500);
        }, index * 100);
      });
    }
  }, [animateStats, quickStats]);

  // Fallback: ensure final values are displayed after animation completes
  useEffect(() => {
    if (animateStats) {
      const fallbackTimer = setTimeout(() => {
        quickStats.forEach((stat) => {
          const numericValue = parseFloat(stat.value.replace(/[^\d.-]/g, ''));
          if (!isNaN(numericValue)) {
            setCounts(prev => ({ ...prev, [stat.label]: numericValue }));
          }
        });
      }, 2000); // 2 seconds to ensure animation completes
      
      return () => clearTimeout(fallbackTimer);
    }
  }, [animateStats, quickStats]);

  return (
    <aside className="w-72 bg-white border-r border-gray-border p-6">
      <AnimatedContainer direction="up" delay={animateStats ? 0.1 : 0}>
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-3">
            NAVIGATION
          </h3>
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-medium hover:text-gray-dark'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </AnimatedContainer>

      <div>
        <h3 className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-3">
          QUICK STATS
        </h3>
        <div className="space-y-3">
          {quickStats.map((stat, index) => {
            // Map icon names to icon components
            const getIconComponent = (iconName: string) => {
              switch (iconName) {
                case 'GlobeAltIcon':
                  return GlobeAltIcon;
                case 'CalendarIcon':
                  return CalendarIcon;
                case 'ChartBarIcon':
                  return ChartBarIcon;
                case 'ArrowTrendingUpIcon':
                  return ArrowTrendingUpIcon;
                default:
                  return GlobeAltIcon; // fallback
              }
            };
            
            const IconComponent = getIconComponent(stat.icon);
            
            return (
              <AnimatedContainer 
                key={stat.label} 
                direction="up" 
                delay={animateStats ? index * 0.1 : 0}
              >
                <div className="bg-gray-lightest border border-gray-border rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-lg font-semibold text-gray-dark">
                        {stat.label === 'Engagement' 
                          ? (counts[stat.label] !== undefined ? `+${Math.floor(counts[stat.label])}%` : '+0%')
                          : (counts[stat.label] !== undefined ? Math.floor(counts[stat.label]) : 0)
                        }
                      </div>
                      <div className="text-sm text-gray-medium">{stat.label}</div>
                    </div>
                  </div>
                </div>
              </AnimatedContainer>
            );
          })}
        </div>
      </div>
    </aside>
  );
} 