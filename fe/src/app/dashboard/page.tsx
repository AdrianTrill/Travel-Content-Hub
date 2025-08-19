import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MetricCard from './components/MetricCard';
import WeatherCard from './components/WeatherCard';
import EventsCard from './components/EventsCard';
import LandmarksCard from './components/LandmarksCard';
import AnimatedContainer from './components/AnimatedContainer';
import {
  metricCards,
  quickStats,
  weatherData,
  events,
  landmarks,
} from '../data/mockData';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F7F1E9]">
      <Header />
      <div className="flex flex-col md:flex-row">
        <Sidebar quickStats={quickStats} currentPage="dashboard" />
        <main className="flex-1 p-4 md:p-8">
          <AnimatedContainer direction="up" delay={0.1}>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary-dark">Dashboard</h1>
              <div className="hidden sm:block text-sm text-gray-medium">
                Last updated <span className="font-semibold text-primary-dark">2 minutes ago</span>
              </div>
            </div>
          </AnimatedContainer>

          <AnimatedContainer direction="up" delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {metricCards.map((metric, index) => (
                <AnimatedContainer key={metric.title} direction="up" delay={0.3 + index * 0.1}>
                  <MetricCard metric={metric} />
                </AnimatedContainer>
              ))}
            </div>
          </AnimatedContainer>

          <AnimatedContainer direction="up" delay={0.6}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <AnimatedContainer direction="up" delay={0.7}>
                <WeatherCard weatherData={weatherData} />
              </AnimatedContainer>
              <AnimatedContainer direction="up" delay={0.8}>
                <EventsCard events={events} />
              </AnimatedContainer>
              <AnimatedContainer direction="up" delay={0.9}>
                <LandmarksCard landmarks={landmarks} />
              </AnimatedContainer>
            </div>
          </AnimatedContainer>
        </main>
      </div>
    </div>
  );
} 