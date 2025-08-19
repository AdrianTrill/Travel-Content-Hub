import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { SettingsContent } from './components';
import { quickStats } from '../data/mockData';
import AnimatedContainer from '../dashboard/components/AnimatedContainer';

export default function Settings() {
  return (
    <div className="min-h-screen bg-[#F7F1E9]">
      <Header />
      <div className="flex flex-col md:flex-row relative">
        <Sidebar quickStats={quickStats} currentPage="settings" />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <AnimatedContainer direction="up" delay={0.1}>
            <SettingsContent />
          </AnimatedContainer>
        </main>
      </div>
    </div>
  );
} 