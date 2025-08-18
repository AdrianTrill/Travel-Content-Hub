import { GlobeAltIcon } from '@heroicons/react/24/solid';

export default function Header() {
  return (
    <header className="w-full bg-background-lighter/70 border-b border-gray-border px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <GlobeAltIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-primary-dark">Travel Content Hub</span>
        </div>
      </div>
    </header>
  );
} 