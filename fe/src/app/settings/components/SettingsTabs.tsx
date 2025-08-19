import { KeyIcon, CircleStackIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import AnimatedContainer from '../../dashboard/components/AnimatedContainer';

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  const tabs = [
    { id: 'api-keys', name: 'API Keys', icon: KeyIcon },
    { id: 'data-sources', name: 'Data Sources', icon: CircleStackIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  ];

  return (
    <AnimatedContainer direction="up" delay={0.1}>
      <div className="mb-6 sm:mb-8 w-full max-w-full overflow-x-auto">
        <nav className="flex w-max min-w-full gap-2 pr-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center justify-center space-x-2 py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg font-medium text-sm transition-colors whitespace-nowrap flex-1 ${
                  isActive
                    ? 'bg-[#6E2168] text-white'
                    : 'bg-[#F8F9F9] text-[#545D6B] hover:text-[#340B37]'
                }`}
              >
                <tab.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </AnimatedContainer>
  );
} 