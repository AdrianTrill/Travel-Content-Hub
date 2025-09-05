'use client';
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useQuickStats } from '../utils/quickStats';
import SettingsContent from './components/SettingsContent';

export default function SettingsPage() {
  const quickStats = useQuickStats();
  return (
    <div className="min-h-screen bg-[#F7F1E9]">
      <Header />
      <div className="flex flex-col md:flex-row">
        <Sidebar quickStats={quickStats} currentPage="settings" />
        <main className="flex-1 p-4 md:p-8 pb-0">
          <SettingsContent />
        </main>
      </div>
    </div>
  );
} 