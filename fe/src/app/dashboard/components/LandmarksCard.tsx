import { StarIcon } from '@heroicons/react/24/outline';
import { MapPinIcon, EyeIcon } from '@heroicons/react/24/solid';
import { Landmark } from '../../types';

interface LandmarksCardProps {
  landmarks: Landmark[];
}

export default function LandmarksCard({ landmarks }: LandmarksCardProps) {
  const Stars = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
      {[1].map((i) => (
        <StarIcon key={i} className="h-4 w-4 fill-current" style={{color: '#F5A00F'}} />
      ))}
      <span className="ml-2 text-sm font-medium" style={{color: '#545D6B'}}>{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="bg-[#FBF8F4] border border-[#DAE1E9] rounded-xl p-6">
      <div className="section-title mb-4">
        <StarIcon className="h-5 w-5 text-primary" />
        <span>Historical Landmarks</span>
      </div>
      <div className="space-y-3">
        {landmarks.map((l) => (
          <div key={l.name} className="bg-white border border-gray-border rounded-lg p-4 shadow-sm" style={{backgroundColor: '#F8F9F9'}}>
            <div className="flex items-start justify-between">
              <h4 className="font-semibold" style={{color: '#340B37'}}>{l.name}</h4>
              <Stars rating={l.rating} />
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-sm" style={{color: '#545D6B'}}>
                <MapPinIcon className="h-4 w-4 mr-2" />
                {l.location}
              </div>
              <p className="text-sm" style={{color: '#545D6B'}}>{l.description}</p>
              <div className="flex items-center text-sm" style={{color: '#6E2168'}}>
                <EyeIcon className="h-4 w-4 mr-2" />
                {l.annualVisitors}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 