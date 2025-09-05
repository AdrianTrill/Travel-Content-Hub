'use client';

import { useState } from 'react';
import SettingsTabs from './SettingsTabs';
import { ApiConfiguration, DataSourceConfiguration, NotificationPreferences, SecuritySettings } from './';
import AnimatedContainer from '../../dashboard/components/AnimatedContainer';

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState('api-keys');

  return (
    <div className="bg-[#F7F1E9] px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-0 overflow-x-hidden w-full max-w-full">
      <div className="w-full max-w-full">
        <AnimatedContainer direction="up" delay={0.2}>
          <div className="flex items-center justify-between mb-6 w-full">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#340B37] break-words">Settings</h1>
          </div>
        </AnimatedContainer>

        <AnimatedContainer direction="up" delay={0.3}>
          <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </AnimatedContainer>
      
        <AnimatedContainer direction="up" delay={0.4}>
          {activeTab === 'api-keys' && <ApiConfiguration />}
          {activeTab === 'data-sources' && <DataSourceConfiguration />}
          {activeTab === 'notifications' && <NotificationPreferences />}
          {activeTab === 'security' && <SecuritySettings />}
          {/* Other tabs can be added here later */}
        </AnimatedContainer>
      </div>
    </div>
  );
} 