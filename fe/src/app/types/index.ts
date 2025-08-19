export interface WeatherInfo {
  city: string;
  condition: string;
  temperature: string;
  change: string;
  isPositive: boolean;
}

export interface Event {
  name: string;
  location: string;
  date: string;
  attendees: string;
  category: string;
}

export interface Landmark {
  name: string;
  location: string;
  description: string;
  annualVisitors: string;
  rating: number;
}

export interface MetricCard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface QuickStat {
  label: string;
  value: string;
  icon: string;
} 

export const DESTINATIONS: string[] = [
  'Paris',
  'Tokyo',
  'New York',
  'Rome',
  'London',
  'Barcelona',
  'Bangkok',
  'Dubai',
  'Sydney',
  'Singapore',
  'Berlin',
  'Amsterdam',
  'Lisbon',
  'Prague',
  'San Francisco',
];