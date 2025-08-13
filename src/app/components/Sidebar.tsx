import {
  HomeIcon,
  SparklesIcon,
  ClockIcon,
  Cog6ToothIcon,
  GlobeAltIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { QuickStat } from '../types';
import Link from 'next/link';

interface SidebarProps {
  quickStats: QuickStat[];
  currentPage?: string;
}

export default function Sidebar({ quickStats, currentPage = 'dashboard' }: SidebarProps) {
  const navigationItems = [
    { name: 'Dashboard', icon: HomeIcon, href: '/', page: 'dashboard' },
    { name: 'Content Generation', icon: SparklesIcon, href: '/content-generation', page: 'content-generation' },
    { name: 'Content History', icon: ClockIcon, href: '/content-history', page: 'content-history' },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/settings', page: 'settings' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-border p-6">
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

      <div>
        <h3 className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-3">
          QUICK STATS
        </h3>
        <div className="space-y-3">
          {quickStats.map((stat) => (
            <div key={stat.label} className="bg-gray-lightest border border-gray-border rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <stat.icon className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-lg font-semibold text-gray-dark">{stat.value}</div>
                  <div className="text-sm text-gray-medium">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
} 