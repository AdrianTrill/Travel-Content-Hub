import {
  EyeIcon,
  ShareIcon,
  ClockIcon,
  HandThumbUpIcon,
  GlobeAltIcon,
  CalendarIcon,
  ChartBarIcon,
  CloudIcon,
  CalendarDaysIcon,
  StarIcon,
  MapPinIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { WeatherInfo, Event, Landmark, MetricCard, QuickStat } from '../types';

export const metricCards: MetricCard[] = [
  {
    title: 'Total Views',
    value: '124.5K',
    change: '+12%',
    isPositive: true,
    icon: EyeIcon,
  },
  {
    title: 'Shares',
    value: '8.2K',
    change: '+18%',
    isPositive: true,
    icon: ShareIcon,
  },
  {
    title: 'Avg. Read Time',
    value: '3.4min',
    change: '+5%',
    isPositive: true,
    icon: ClockIcon,
  },
  {
    title: 'Engagement Rate',
    value: '7.8%',
    change: '+23%',
    isPositive: true,
    icon: HandThumbUpIcon,
  },
];

export const quickStats: QuickStat[] = [
  {
    label: 'Destinations',
    value: '24',
    icon: 'GlobeAltIcon',
  },
  {
    label: 'Scheduled',
    value: '12',
    icon: 'CalendarIcon',
  },
  {
    label: 'Engagement',
    value: '+23%',
    icon: 'ArrowTrendingUpIcon',
  },
];

export const weatherData: WeatherInfo[] = [
  {
    city: 'Paris',
    condition: 'Sunny',
    temperature: '22°C',
    change: '+2°',
    isPositive: true,
  },
  {
    city: 'Tokyo',
    condition: 'Cloudy',
    temperature: '18°C',
    change: '-1°',
    isPositive: false,
  },
  {
    city: 'New York',
    condition: 'Rainy',
    temperature: '15°C',
    change: '+3°',
    isPositive: true,
  },
  {
    city: 'Rome',
    condition: 'Sunny',
    temperature: '25°C',
    change: '+1°',
    isPositive: true,
  },
];

export const events: Event[] = [
  {
    name: 'Cherry Blossom Festival',
    location: 'Tokyo',
    date: 'Apr 15-30',
    attendees: '50K+ expected',
    category: 'Cultural',
  },
  {
    name: 'Jazz in the Park',
    location: 'Paris',
    date: 'Apr 20',
    attendees: '5K+ expected',
    category: 'Music',
  },
  {
    name: 'Food & Wine Expo',
    location: 'Rome',
    date: 'Apr 22-24',
    attendees: '12K+ expected',
    category: 'Culinary',
  },
];

export const landmarks: Landmark[] = [
  {
    name: 'Eiffel Tower',
    location: 'Paris',
    description: 'Iconic iron lattice tower built in 1889',
    annualVisitors: '7M/year',
    rating: 4.8,
  },
  {
    name: 'Colosseum',
    location: 'Rome',
    description: 'Ancient amphitheater and architectural marvel',
    annualVisitors: '6M/year',
    rating: 4.9,
  },
  {
    name: 'Senso-ji Temple',
    location: 'Tokyo',
    description: 'Tokyo\'s oldest temple, founded in 628 AD',
    annualVisitors: '30M/year',
    rating: 4.7,
  },
]; 