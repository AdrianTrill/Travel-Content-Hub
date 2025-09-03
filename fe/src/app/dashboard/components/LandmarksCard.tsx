import { StarIcon } from '@heroicons/react/24/outline';
import { MapPinIcon, EyeIcon } from '@heroicons/react/24/solid';
import { Landmark } from '../../types';

interface LandmarksCardProps {
  landmarks: Landmark[];
}

export default function LandmarksCard({ landmarks }: LandmarksCardProps) {
  const hasLandmarks = landmarks && landmarks.length > 0;
  
  const Stars = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon 
          key={i} 
          className={`h-4 w-4 ${i <= Math.floor(rating) ? 'fill-current' : ''}`} 
          style={{color: i <= Math.floor(rating) ? '#F5A00F' : '#E5E7EB'}} 
        />
      ))}
      <span className="ml-2 text-sm font-medium" style={{color: '#545D6B'}}>{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="bg-[#FBF8F4] border border-[#DAE1E9] rounded-xl p-6 h-full flex flex-col">
      <div className="section-title mb-4">
        <StarIcon className="h-5 w-5 text-primary" />
        <span>Historical Landmarks</span>
      </div>
      
      {!hasLandmarks ? (
        <div className="bg-white border border-gray-border rounded-lg p-6 text-center transition-opacity duration-300 ease-out flex-1 flex items-center justify-center" style={{backgroundColor: '#F8F9F9'}}>
          <div className="text-sm" style={{color: '#545D6B'}}>No landmarks available yet.</div>
          <div className="text-xs mt-1" style={{color: '#545D6B'}}>Publish content about historical places to see landmarks.</div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto max-h-96 pr-2">
          <div className="space-y-3">
            {landmarks.map((l, index) => (
              <div key={l.name} className="bg-white border border-gray-border rounded-lg p-4 shadow-sm transition-all duration-300 ease-out opacity-0" style={{backgroundColor: '#F8F9F9', animation: `fadeIn 0.3s ease-out forwards`, animationDelay: `${index * 60}ms`}}>
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
      )}
      
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
} 