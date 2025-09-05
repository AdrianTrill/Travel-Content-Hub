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
      <div className="mb-6 sm:mb-8 w-full max-w-full">
        <nav className="grid grid-cols-4 gap-2 items-center" style={{backgroundColor:'#F8F9F9', padding:'5px', borderRadius:'10px', border:'1px solid #C8C8C8'}}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center justify-center space-x-2 py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                  isActive ? 'text-white' : ''
                }`}
                style={{
                  backgroundColor: isActive ? '#6E2168' : '#F8F9F9',
                  color: isActive ? '#FFFFFF' : '#374151'
                }}
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