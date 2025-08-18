import { CalendarDaysIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Event } from '../../types';

interface EventsCardProps {
  events: Event[];
}

export default function EventsCard({ events }: EventsCardProps) {
  return (
    <div className="bg-[#FBF8F4] border border-[#DAE1E9] rounded-xl p-6">
      <div className="section-title mb-4">
        <CalendarDaysIcon className="h-5 w-5 text-primary" />
        <span>Featured Events</span>
      </div>
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.name} className="bg-white border border-gray-border rounded-lg p-4 shadow-sm" style={{backgroundColor: '#F8F9F9'}}>
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold" style={{color: '#340B37'}}>{event.name}</h4>
              <span className="pill-badge bg-warning" style={{color: '#340B37'}}>{event.category}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm" style={{color: '#545D6B'}}>
                <MapPinIcon className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm" style={{color: '#545D6B'}}>
                <CalendarDaysIcon className="h-4 w-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm" style={{color: '#545D6B'}}>
                <UserGroupIcon className="h-4 w-4" />
                <span>{event.attendees}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 