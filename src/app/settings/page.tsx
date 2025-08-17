import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { SettingsContent } from './components';
import { quickStats } from '../data/mockData';
import AnimatedContainer from '../dashboard/components/AnimatedContainer';

export default function Settings() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar quickStats={quickStats} currentPage="settings" />
        <main className="flex-1">
          <AnimatedContainer direction="up" delay={0.1}>
            <SettingsContent />
          </AnimatedContainer>
        </main>
      </div>
    </div>
  );
} 