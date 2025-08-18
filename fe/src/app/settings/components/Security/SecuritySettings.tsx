'use client';

import { useState } from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
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

export default function SecuritySettings() {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: true,
    apiKeyEncryption: true
  });

  const [apiLimits, setApiLimits] = useState({
    hourlyLimit: '1000',
    dailyLimit: '10000'
  });

  const toggleSecuritySetting = (key: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const securityOptions = [
    {
      key: 'twoFactorAuth' as keyof typeof securitySettings,
      label: 'Two-factor authentication',
      description: 'Add an extra layer of security.'
    },
    {
      key: 'sessionTimeout' as keyof typeof securitySettings,
      label: 'Session timeout',
      description: 'Auto-logout after inactivity.'
    },
    {
      key: 'apiKeyEncryption' as keyof typeof securitySettings,
      label: 'API key encryption',
      description: 'Encrypt stored API keys.'
    }
  ];

  return (
    <div className="w-full max-w-full overflow-hidden">
      <AnimatedContainer direction="up" delay={0.1}>
        <div className="bg-[#FBF8F4] border border-[#DAE1E9] rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <ShieldCheckIcon className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-xl font-semibold text-[#340B37] break-words">Security Settings</h2>
          </div>

          <div className="space-y-4 mb-6">
            {securityOptions.map((option, index) => (
              <AnimatedContainer key={option.key} direction="up" delay={0.2 + index * 0.1}>
                <div className="bg-[#F8F9F9] border border-[#DAE1E9] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-[#340B37]">{option.label}</h4>
                      <p className="text-sm text-[#545D6B]">{option.description}</p>
                    </div>
                    <ToggleSwitch
                      enabled={securitySettings[option.key]}
                      onToggle={() => toggleSecuritySetting(option.key)}
                    />
                  </div>
                </div>
              </AnimatedContainer>
            ))}
          </div>

          <AnimatedContainer direction="up" delay={0.5}>
            <div className="border-t border-[#DAE1E9] pt-6">
              <h3 className="text-lg font-semibold text-[#340B37] mb-4">API Rate Limits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#340B37] mb-2">
                    Hourly Request Limit
                  </label>
                  <input
                    type="number"
                    value={apiLimits.hourlyLimit}
                    onChange={(e) => setApiLimits(prev => ({ ...prev, hourlyLimit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm text-[#545D6B] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{backgroundColor: '#FFFFFF'}}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#340B37] mb-2">
                    Daily Request Limit
                  </label>
                  <input
                    type="number"
                    value={apiLimits.dailyLimit}
                    onChange={(e) => setApiLimits(prev => ({ ...prev, dailyLimit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm text-[#545D6B] focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{backgroundColor: '#FFFFFF'}}
                  />
                </div>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </AnimatedContainer>

      <AnimatedContainer direction="up" delay={0.6}>
        <div className="flex justify-end mt-6 sm:mt-8 w-full">
          <button className="bg-[#6E2168] hover:bg-[#6E2168]/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors w-full sm:w-auto justify-center sm:justify-start">
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