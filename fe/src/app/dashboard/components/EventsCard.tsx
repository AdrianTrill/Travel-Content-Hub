import { CalendarDaysIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Event } from '../../types';

interface EventsCardProps {
  events: Event[];
}

export default function EventsCard({ events }: EventsCardProps) {
  const hasEvents = events && events.length > 0;
  
  return (
    <div className="bg-[#FBF8F4] border border-[#DAE1E9] rounded-xl p-6 h-full flex flex-col">
      <h2 className="section-title mb-4">
        <CalendarDaysIcon className="h-5 w-5 text-primary" />
        <span>Featured Events</span>
      </h2>
      
      {!hasEvents ? (
        <div className="bg-white border border-gray-border rounded-lg p-6 text-center transition-opacity duration-300 ease-out flex-1 flex items-center justify-center" style={{backgroundColor: '#F8F9F9'}}>
          <div className="text-sm" style={{color: '#545D6B'}}>No events available yet.</div>
          <div className="text-xs mt-1" style={{color: '#545D6B'}}>Publish content with destinations to see featured events.</div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto max-h-96 pr-2">
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.name} className="bg-white border border-gray-border rounded-lg p-4 shadow-sm transition-all duration-300 ease-out opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]" style={{backgroundColor: '#F8F9F9'}}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold" style={{color: '#340B37'}}>{event.name}</h3>
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
      )}
      
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
} 