import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MetricCard from './components/MetricCard';
import WeatherCard from './components/WeatherCard';
import EventsCard from './components/EventsCard';
import LandmarksCard from './components/LandmarksCard';
import {
  metricCards,
  quickStats,
  weatherData,
  events,
  landmarks,
} from '../data/mockData';

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar quickStats={quickStats} currentPage="dashboard" />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-extrabold text-primary-dark">Dashboard</h1>
            <div className="text-sm text-gray-medium">
              Last updated <span className="font-semibold text-primary-dark">2 minutes ago</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricCards.map((metric) => (
              <MetricCard key={metric.title} metric={metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <WeatherCard weatherData={weatherData} />
            <EventsCard events={events} />
            <LandmarksCard landmarks={landmarks} />
          </div>
        </main>
      </div>
    </div>
  );
} 