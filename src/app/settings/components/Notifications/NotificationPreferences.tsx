'use client';

import { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
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

export default function NotificationPreferences() {
  const [notifications, setNotifications] = useState({
    contentGenerationComplete: true,
    publishingErrors: true,
    weeklyPerformanceReports: false,
    apiLimitWarnings: true,
    scheduledPostReminders: false
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const notificationOptions = [
    {
      key: 'contentGenerationComplete' as keyof typeof notifications,
      label: 'Content Generation Complete',
      description: 'Get notified when AI content generation is finished'
    },
    {
      key: 'publishingErrors' as keyof typeof notifications,
      label: 'Publishing Errors',
      description: 'Receive alerts for any content publishing issues'
    },
    {
      key: 'weeklyPerformanceReports' as keyof typeof notifications,
      label: 'Weekly Performance Reports',
      description: 'Get weekly summaries of content performance'
    },
    {
      key: 'apiLimitWarnings' as keyof typeof notifications,
      label: 'API Limit Warnings',
      description: 'Get notified when approaching API rate limits'
    },
    {
      key: 'scheduledPostReminders' as keyof typeof notifications,
      label: 'Scheduled Post Reminders',
      description: 'Receive reminders for upcoming scheduled posts'
    }
  ];

  return (
    <div className="w-full max-w-full overflow-hidden">
      <AnimatedContainer direction="up" delay={0.1}>
        <div className="bg-[#FBF8F4] border border-[#DAE1E9] rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <BellIcon className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-xl font-semibold text-[#340B37] break-words">Notification Preferences</h2>
          </div>

          <div className="space-y-4">
            {notificationOptions.map((option, index) => (
              <AnimatedContainer key={option.key} direction="up" delay={0.2 + index * 0.1}>
                <div className="bg-[#F8F9F9] border border-[#DAE1E9] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-[#340B37]">{option.label}</h4>
                      <p className="text-sm text-[#545D6B]">{option.description}</p>
                    </div>
                    <ToggleSwitch
                      enabled={notifications[option.key]}
                      onToggle={() => toggleNotification(option.key)}
                    />
                  </div>
                </div>
              </AnimatedContainer>
            ))}
          </div>
        </div>
      </AnimatedContainer>

      <AnimatedContainer direction="up" delay={0.7}>
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