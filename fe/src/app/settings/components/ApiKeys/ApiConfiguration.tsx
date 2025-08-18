'use client';

import { useState, useEffect } from 'react';
import { KeyIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import ApiIntegration from './ApiIntegration';

export default function ApiConfiguration() {
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [animateElements, setAnimateElements] = useState(false);

  useEffect(() => {
    // Trigger animations immediately when component mounts
    setAnimateElements(true);
  }, []);

  const toggleApiKeyVisibility = (apiName: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [apiName]: !prev[apiName]
    }));
  };

  const apiIntegrations: Array<{
    name: string;
    status: 'connected' | 'error' | 'disconnected';
    description: string;
    lastSync: string;
    fields: Array<{
      label: string;
      type: 'password' | 'text';
      placeholder: string;
      required: boolean;
      hasRedAsterisk?: boolean;
    }>;
  }> = [
    {
      name: 'OpenWeatherMap',
      status: 'connected' as const,
      description: 'Weather data and forecasts for destinations',
      lastSync: '2 minutes ago',
      fields: [
        { label: 'API Key *', type: 'password' as const, placeholder: '••••••••••••••••••••', required: true, hasRedAsterisk: true }
      ]
    },
    {
      name: 'Eventbrite',
      status: 'connected' as const,
      description: 'Local events and entertainment listings',
      lastSync: '5 minutes ago',
      fields: [
        { label: 'API Key *', type: 'password' as const, placeholder: '••••••••••••••••••••', required: true, hasRedAsterisk: true },
        { label: 'Organization ID', type: 'text' as const, placeholder: 'Enter organization id', required: false }
      ]
    },
    {
      name: 'Google Places',
      status: 'error' as const,
      description: 'Points of interest and landmark information',
      lastSync: '2 hours ago',
      fields: [
        { label: 'API Key *', type: 'password' as const, placeholder: '••••••••••••••••••••', required: true, hasRedAsterisk: true }
      ]
    },
    {
      name: 'OpenAI',
      status: 'connected' as const,
      description: 'AI content generation and processing',
      lastSync: '1 minute ago',
      fields: [
        { label: 'API Key *', type: 'password' as const, placeholder: '••••••••••••••••••••', required: true, hasRedAsterisk: true },
        { label: 'Model *', type: 'text' as const, placeholder: 'Enter model', required: true, hasRedAsterisk: true }
      ]
    },
    {
      name: 'Unsplash',
      status: 'disconnected' as const,
      description: 'High-quality travel photography',
      lastSync: 'Never',
      fields: [
        { label: 'API Key *', type: 'password' as const, placeholder: '••••••••••••••••••••', required: true, hasRedAsterisk: true }
      ]
    }
  ];

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="bg-[#FBF8F4] border border-[#DAE1E9] rounded-xl p-6">
        <div 
          className={`flex items-center space-x-2 mb-6 transition-all duration-700 ease-out ${
            animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <KeyIcon className="h-6 w-6 text-primary flex-shrink-0" />
          <h2 className="text-xl font-semibold text-[#340B37] break-words">API Configuration</h2>
        </div>

        <div className="space-y-4 sm:space-y-6 mb-6">
          {apiIntegrations.map((integration, index) => (
            <div
              key={integration.name}
              className={`transition-all duration-700 ease-out ${
                animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${100 + index * 50}ms`
              }}
            >
              <ApiIntegration
                integration={integration}
                showApiKey={showApiKeys[integration.name] || false}
                onToggleApiKeyVisibility={() => toggleApiKeyVisibility(integration.name)}
              />
            </div>
          ))}
        </div>

        <div 
          className={`flex justify-end transition-all duration-700 ease-out ${
            animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            transitionDelay: '400ms'
          }}
        >
          <button className="bg-[#6E2168] hover:bg-[#6E2168]/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors w-full sm:w-auto justify-center sm:justify-start">
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zM8 7h8M8 11h8M8 15h8" />
            </svg>
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
} 