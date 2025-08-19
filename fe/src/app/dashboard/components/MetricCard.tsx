import { MetricCard as MetricCardType } from '../../types';
import AnimatedCounter from './AnimatedCounter';

interface MetricCardProps {
  metric: MetricCardType;
}

export default function MetricCard({ metric }: MetricCardProps) {
  const { title, value, change, isPositive, icon: Icon } = metric;

  return (
    <div className="bg-[#FBF8F4] border border-[#DAE1E9] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-dark">{title}</h3>
        <div className="metric-icon-tile">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-2xl font-bold text-primary-dark">
          <AnimatedCounter value={value} duration={1.5} trigger="immediate" />
        </div>
        <div className={`flex items-center space-x-1 text-sm ${
          isPositive ? '' : 'text-danger'
        }`} style={{color: isPositive ? '#0F612D' : undefined}}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>
            <AnimatedCounter value={change} duration={1.2} trigger="immediate" />
          </span>
        </div>
      </div>
    </div>
  );
} 