import { WeatherInfo } from '../types';

interface WeatherCardProps {
  weatherData: WeatherInfo[];
}

export default function WeatherCard({ weatherData }: WeatherCardProps) {
  const SunIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{color: '#F5A00F'}}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2m0 14v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2m14 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );

  const CloudOutline = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{color: '#F5A00F'}}>
      <path d="M7.5 19.5h9a4 4 0 0 0 0-8h-.2A6.5 6.5 0 0 0 5.5 9.8a3.8 3.8 0 0 0 2 7.2z" />
    </svg>
  );

  const CloudRainOutline = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{color: '#F5A00F'}}>
      <path d="M7.5 15.5h9a4 4 0 0 0 0-8h-.2A6.5 6.5 0 0 0 5.5 5.8a3.8 3.8 0 0 0 2 7.2z" />
      <path d="M8 18.5v2M12 18.5v2M16 18.5v2" />
    </svg>
  );

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <SunIcon />;
      case 'cloudy':
        return <CloudOutline />;
      case 'rainy':
        return <CloudRainOutline />;
      default:
        return <CloudOutline />;
    }
  };

  return (
    <div className="bg-[#FBF8F4] border border-[#DAE1E9] rounded-xl p-6 h-full">
      <div className="section-title mb-4">
        <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.5 19.5h9a4 4 0 0 0 0-8h-.2A6.5 6.5 0 0 0 5.5 9.8a3.8 3.8 0 0 0 2 7.2z" />
        </svg>
        <span>Destination Weather</span>
      </div>
      <div className="space-y-3">
        {weatherData.map((weather) => (
          <div key={weather.city} className="bg-white border border-gray-border rounded-lg p-4 shadow-sm" style={{backgroundColor: '#F8F9F9'}}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getWeatherIcon(weather.condition)}
                <div>
                  <div className="font-semibold" style={{color: '#340B37'}}>{weather.city}</div>
                  <div className="text-sm" style={{color: '#545D6B'}}>{weather.condition}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold" style={{color: '#340B37'}}>{weather.temperature}</div>
                <div className={`text-sm ${weather.change.startsWith('-') ? 'text-red-600' : ''}`} style={{color: weather.change.startsWith('-') ? undefined : '#0F612D'}}>{weather.change}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 