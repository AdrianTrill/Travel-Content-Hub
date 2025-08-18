'use client';

import { EyeIcon, EyeSlashIcon, BeakerIcon } from '@heroicons/react/24/solid';

interface ApiField {
  label: string;
  type: 'text' | 'password';
  placeholder: string;
  required: boolean;
  hasRedAsterisk?: boolean;
}

interface ApiIntegrationProps {
  integration: {
    name: string;
    status: 'connected' | 'error' | 'disconnected';
    description: string;
    lastSync: string;
    fields: ApiField[];
  };
  showApiKey: boolean;
  onToggleApiKeyVisibility: () => void;
}

export default function ApiIntegration({ integration, showApiKey, onToggleApiKeyVisibility }: ApiIntegrationProps) {
  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'connected':
        return `${baseClasses} bg-[#0F612D] text-white`;
      case 'error':
        return `${baseClasses} bg-red-700 text-white`;
      case 'disconnected':
        return `${baseClasses} bg-gray-400 text-white`;
      default:
        return `${baseClasses} bg-gray-400 text-white`;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Error';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-[#F8F9F9] border border-[#DAE1E9] rounded-xl p-4 sm:p-6 w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 w-full">
        <div className="flex-1 min-w-0 max-w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 w-full">
            <h3 className="text-base sm:text-lg font-semibold text-[#340B37] break-words max-w-full">{integration.name}</h3>
            <span className={getStatusBadge(integration.status)}>
              {getStatusText(integration.status)}
            </span>
          </div>
          <p className="text-[#545D6B] text-sm mb-2 break-words max-w-full">{integration.description}</p>
          <p className="text-[#545D6B] text-xs">Last sync: {integration.lastSync}</p>
        </div>
        <button className="bg-[#F7F1E9] border border-[#340B37] text-[#340B37] px-3 sm:px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center sm:justify-start space-x-2 transition-colors hover:bg-[#F7F1E9]/80 w-full sm:w-auto flex-shrink-0">
          <BeakerIcon className="h-4 w-4" />
          <span>Test</span>
        </button>
      </div>

      <div className="space-y-4 w-full max-w-full">
        {integration.fields.map((field, index) => (
          <div key={index} className="w-full max-w-full">
            <div className="w-full max-w-full">
              <label className="block text-sm font-medium text-[#340B37] mb-1 break-words">
                {field.hasRedAsterisk ? (
                  <>
                    {field.label.replace(' *', '')} <span className="text-red-700">*</span>
                  </>
                ) : (
                  field.label
                )}
              </label>
              <div className="relative w-full max-w-full">
                <input
                  type={field.type === 'password' && showApiKey ? 'text' : field.type}
                  placeholder={field.placeholder}
                  className="w-full max-w-full px-3 py-2 border border-gray-border rounded-lg text-sm text-[#545D6B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required={field.required}
                />
                {field.type === 'password' && (
                  <button
                    type="button"
                    onClick={onToggleApiKeyVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-medium hover:text-gray-dark"
                  >
                    {showApiKey ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 