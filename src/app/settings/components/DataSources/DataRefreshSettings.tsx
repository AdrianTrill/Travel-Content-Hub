'use client';

import { useState } from 'react';
import AnimatedContainer from '../../../dashboard/components/AnimatedContainer';

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
}

function ToggleSwitch({ enabled, onToggle }: ToggleSwitchProps) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        enabled ? 'bg-[#6E2168]' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function DataRefreshSettings() {
  const [autoRefreshWeather, setAutoRefreshWeather] = useState(true);
  const [autoRefreshEvents, setAutoRefreshEvents] = useState(true);
  const [backgroundSync, setBackgroundSync] = useState(false);

  return (
    <div>
      <AnimatedContainer direction="up" delay={0.1}>
        <h3 className="text-lg font-semibold text-[#340B37] mb-4">Data Refresh Settings</h3>
      </AnimatedContainer>
      
      <div className="space-y-4">
        <AnimatedContainer direction="up" delay={0.2}>
          <div className="bg-[#F8F9F9] border border-[#DAE1E9] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-[#340B37]">Auto-refresh weather data</h4>
                <p className="text-sm text-[#545D6B]">Automatically update weather information.</p>
              </div>
              <ToggleSwitch
                enabled={autoRefreshWeather}
                onToggle={() => setAutoRefreshWeather(!autoRefreshWeather)}
              />
            </div>
          </div>
        </AnimatedContainer>

        <AnimatedContainer direction="up" delay={0.3}>
          <div className="bg-[#F8F9F9] border border-[#DAE1E9] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-[#340B37]">Auto-refresh events</h4>
                <p className="text-sm text-[#545D6B]">Automatically update local events.</p>
              </div>
              <ToggleSwitch
                enabled={autoRefreshEvents}
                onToggle={() => setAutoRefreshEvents(!autoRefreshEvents)}
              />
            </div>
          </div>
        </AnimatedContainer>

        <AnimatedContainer direction="up" delay={0.4}>
          <div className="bg-[#F8F9F9] border border-[#DAE1E9] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-[#340B37]">Background sync</h4>
                <p className="text-sm text-[#545D6B]">Sync data even when app is not active.</p>
              </div>
              <ToggleSwitch
                enabled={backgroundSync}
                onToggle={() => setBackgroundSync(!backgroundSync)}
              />
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
} 