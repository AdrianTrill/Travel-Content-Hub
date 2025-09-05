'use client';

import { useState } from 'react';
import { CircleStackIcon } from '@heroicons/react/24/outline';
import DataRefreshSettings from './DataRefreshSettings';
import AnimatedContainer from '../../../dashboard/components/AnimatedContainer';

export default function DataSourceConfiguration() {
  const [syncInterval, setSyncInterval] = useState('15');
  const [cacheDuration, setCacheDuration] = useState('6');

  return (
    <div className="w-full max-w-full overflow-hidden">
      <AnimatedContainer direction="up" delay={0.1}>
        <div className="bg-[#FBF8F4] border border-[#DAE1E9] rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <CircleStackIcon className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-xl font-semibold text-[#340B37] break-words">Data Source Configuration</h2>
          </div>

          <AnimatedContainer direction="up" delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#340B37] mb-2">
                  Sync Interval (minutes)
                </label>
                <input
                  type="number"
                  value={syncInterval}
                  onChange={(e) => setSyncInterval(e.target.value)}
                  className="w-full h-12 px-3 border border-gray-border rounded-lg text-sm text-[#545D6B] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  min="1"
                  max="1440"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#340B37] mb-2">
                  Cache Duration (hours)
                </label>
                <input
                  type="number"
                  value={cacheDuration}
                  onChange={(e) => setCacheDuration(e.target.value)}
                  className="w-full h-12 px-3 border border-gray-border rounded-lg text-sm text-[#545D6B] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  min="1"
                  max="168"
                />
              </div>
            </div>
          </AnimatedContainer>

          <AnimatedContainer direction="up" delay={0.3}>
            <DataRefreshSettings />
          </AnimatedContainer>
        </div>
      </AnimatedContainer>

      <AnimatedContainer direction="up" delay={0.4}>
        <div className="flex justify-end mt-6 sm:mt-8 w-full">
          <button className="bg-[#6E2168] hover:bg-[#6E2168]/90 text-white px-4 sm:px-6 h-12 rounded-lg font-medium flex items-center space-x-2 transition-colors w-full sm:w-auto justify-center sm:justify-start">
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zM8 7h8M8 11h8M8 15h8" />
            </svg>
            <span>Save Settings</span>
          </button>
        </div>
      </AnimatedContainer>
    </div>
  );
} 