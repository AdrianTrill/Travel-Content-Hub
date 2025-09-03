import { useState, useEffect } from 'react';
import type { Landmark } from '../types';

interface PublishedItem {
  id: string;
  location?: string | null;
  date: string;
  time: string;
  type: string;
  title: string;
  content: string;
  tags: string[];
  views: number;
  shares: number;
  engagement_rate: number;
}

// Historical landmark keywords to identify landmark-related content
const LANDMARK_KEYWORDS = [
  // Architectural structures
  'castle', 'palace', 'tower', 'cathedral', 'church', 'temple', 'monument', 'statue',
  'museum', 'fortress', 'bridge', 'gate', 'wall', 'ruins', 'archaeological', 'historic',
  'basilica', 'chapel', 'abbey', 'monastery', 'convent', 'mosque', 'synagogue', 'shrine',
  'mausoleum', 'tomb', 'crypt', 'catacombs', 'dome', 'spire', 'minaret', 'bell tower',
  'clock tower', 'lighthouse', 'observatory', 'planetarium', 'aqueduct', 'viaduct',
  'colonnade', 'arcade', 'portico', 'rotunda', 'pavilion', 'gazebo', 'obelisk',
  
  // Historical periods and styles
  'ancient', 'medieval', 'renaissance', 'baroque', 'gothic', 'roman', 'victorian',
  'byzantine', 'romanesque', 'art nouveau', 'art deco', 'neoclassical', 'modernist',
  'prehistoric', 'bronze age', 'iron age', 'classical', 'hellenistic', 'imperial',
  
  // Cultural and religious sites
  'heritage', 'cultural', 'sacred', 'holy', 'pilgrimage', 'sanctuary', 'altar',
  'relic', 'icon', 'fresco', 'mosaic', 'stained glass', 'carving', 'sculpture',
  'artwork', 'masterpiece', 'treasure', 'collection', 'exhibition', 'gallery',
  
  // Natural and landscape features
  'garden', 'park', 'plaza', 'square', 'courtyard', 'terrace', 'balcony',
  'fountain', 'waterfall', 'cave', 'grotto', 'cliff', 'peak', 'summit',
  'valley', 'canyon', 'gorge', 'river', 'lake', 'island', 'peninsula',
  
  // Famous landmarks and sites
  'eiffel', 'colosseum', 'acropolis', 'stonehenge', 'machu picchu', 'taj mahal',
  'great wall', 'pyramid', 'sphinx', 'notre dame', 'westminster', 'buckingham',
  'versailles', 'louvre', 'pantheon', 'trevi fountain', 'sistine chapel',
  'big ben', 'london eye', 'tower bridge', 'st paul', 'canterbury', 'york minster',
  'sagrada familia', 'alhambra', 'seville cathedral', 'prado', 'reina sofia',
  'brandenburg gate', 'neuschwanstein', 'heidelberg', 'cologne cathedral',
  'st peter', 'vatican', 'florence cathedral', 'leaning tower', 'pisa',
  'milan cathedral', 'venice', 'grand canal', 'rialto bridge', 'st mark',
  'parthenon', 'delphi', 'mycenae', 'knossos', 'santorini', 'mykonos',
  'hagia sophia', 'blue mosque', 'topkapi', 'galata tower', 'bosphorus',
  'kremlin', 'red square', 'st basil', 'hermitage', 'peterhof', 'catherine palace',
  'mount fuji', 'tokyo tower', 'senso-ji', 'meiji shrine', 'golden pavilion',
  'forbidden city', 'summer palace', 'temple of heaven', 'terracotta army',
  'angkor wat', 'bali', 'borobudur', 'petronas towers', 'marina bay',
  'opera house', 'harbour bridge', 'uluru', 'great barrier reef',
  'christ redeemer', 'iguazu', 'machu picchu', 'nazca lines', 'easter island',
  'niagara falls', 'grand canyon', 'yellowstone', 'yosemite', 'mount rushmore',
  'statue of liberty', 'golden gate', 'hollywood', 'disney', 'universal',
  
  // Cultural events and traditions
  'festival', 'celebration', 'ceremony', 'ritual', 'tradition', 'custom',
  'folklore', 'legend', 'myth', 'story', 'tale', 'history', 'chronicle',
  'documentary', 'archive', 'library', 'university', 'academy', 'institute',
  
  // Military and defensive structures
  'battlefield', 'fort', 'battery', 'barracks', 'armory', 'arsenal',
  'bunker', 'trench', 'rampart', 'bastion', 'citadel', 'keep', 'dungeon',
  
  // Transportation and infrastructure
  'station', 'terminal', 'depot', 'harbor', 'port', 'dock', 'pier',
  'airport', 'railway', 'metro', 'subway', 'tram', 'cable car', 'funicular',
  
  // Entertainment and leisure
  'theater', 'opera', 'concert hall', 'stadium', 'arena', 'coliseum',
  'amphitheater', 'circus', 'carnival', 'fair', 'exhibition', 'expo',
  'zoo', 'aquarium', 'botanical garden', 'conservatory', 'greenhouse',
  
  // Modern landmarks
  'skyscraper', 'high-rise', 'landmark', 'iconic', 'famous', 'renowned',
  'spectacular', 'magnificent', 'breathtaking', 'stunning', 'impressive'
];

// Check if content is about a historical landmark
const isLandmarkContent = (title: string, content: string, tags: string[]): boolean => {
  const text = `${title} ${content} ${tags.join(' ')}`.toLowerCase();
  return LANDMARK_KEYWORDS.some(keyword => text.includes(keyword));
};

// Generate landmark name from content title
const generateLandmarkName = (title: string, location: string): string => {
  const cleanTitle = title.replace(/^(The|A|An)\s+/i, '').trim();
  
  // If title already sounds like a landmark name, use it
  if (cleanTitle.toLowerCase().includes('castle') || 
      cleanTitle.toLowerCase().includes('palace') ||
      cleanTitle.toLowerCase().includes('tower') ||
      cleanTitle.toLowerCase().includes('cathedral') ||
      cleanTitle.toLowerCase().includes('temple') ||
      cleanTitle.toLowerCase().includes('monument')) {
    return cleanTitle;
  }
  
  // Otherwise, create a landmark name from location
  const locationName = location.split(',')[0].trim();
  return `${locationName} Landmark`;
};

// Generate landmark description from content
const generateLandmarkDescription = (content: string, title: string): string => {
  // Extract first meaningful sentence from content
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  if (sentences.length > 0) {
    return sentences[0].trim() + '.';
  }
  
  // Fallback to title-based description
  return `Historic ${title.toLowerCase()} with cultural significance.`;
};

// Estimate annual visitors based on content engagement and type
const estimateAnnualVisitors = (type: string, views: number, shares: number): string => {
  const baseEngagement = views + (shares * 10);
  
  if (type.toLowerCase().includes('blog')) {
    const estimated = Math.max(100000, Math.floor(baseEngagement * 1000));
    if (estimated >= 1000000) {
      return `${Math.floor(estimated / 1000000)}M/year`;
    }
    return `${Math.floor(estimated / 1000)}K/year`;
  }
  
  if (type.toLowerCase().includes('instagram')) {
    const estimated = Math.max(50000, Math.floor(baseEngagement * 500));
    if (estimated >= 1000000) {
      return `${Math.floor(estimated / 1000000)}M/year`;
    }
    return `${Math.floor(estimated / 1000)}K/year`;
  }
  
  if (type.toLowerCase().includes('facebook')) {
    const estimated = Math.max(200000, Math.floor(baseEngagement * 800));
    if (estimated >= 1000000) {
      return `${Math.floor(estimated / 1000000)}M/year`;
    }
    return `${Math.floor(estimated / 1000)}K/year`;
  }
  
  return '500K/year';
};

// Calculate rating based on engagement and content quality
const calculateRating = (views: number, shares: number, engagement_rate: number): number => {
  const baseRating = 4.0;
  const engagementBonus = Math.min(0.8, (engagement_rate * 0.1));
  const viewsBonus = Math.min(0.3, (views / 10000) * 0.1);
  const sharesBonus = Math.min(0.2, (shares / 100) * 0.1);
  
  return Math.min(5.0, baseRating + engagementBonus + viewsBonus + sharesBonus);
};

export function deriveLandmarksFromPublishedCache(max: number = 10): Landmark[] {
  try {
    const cached = localStorage.getItem('published_content_cache');
    const items: PublishedItem[] = cached ? JSON.parse(cached) : [];
    
    if (!items || items.length === 0) {
      return [];
    }
    
    // Filter items that are about landmarks and have locations
    const landmarkItems = items.filter(item => {
      if (!item.location || item.location.trim() === '' || item.location === '—') {
        return false;
      }
      
      return isLandmarkContent(item.title, item.content, item.tags || []);
    });
    
    // Sort by engagement (most popular first)
    const sortedItems = landmarkItems.sort((a, b) => {
      const aEngagement = a.views + (a.shares * 10) + (a.engagement_rate * 100);
      const bEngagement = b.views + (b.shares * 10) + (b.engagement_rate * 100);
      return bEngagement - aEngagement;
    });
    
    // Convert to landmarks
    const landmarks: Landmark[] = sortedItems
      .slice(0, max)
      .map(item => ({
        name: generateLandmarkName(item.title, item.location!),
        location: item.location!,
        description: generateLandmarkDescription(item.content, item.title),
        annualVisitors: estimateAnnualVisitors(item.type, item.views, item.shares),
        rating: calculateRating(item.views, item.shares, item.engagement_rate)
      }));
    
    return landmarks;
  } catch (error) {
    console.error('Error deriving landmarks from cache:', error);
    return [];
  }
}

export function useLandmarks(): Landmark[] {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  
  useEffect(() => {
    const updateLandmarks = () => {
      const derivedLandmarks = deriveLandmarksFromPublishedCache(10);
      setLandmarks(derivedLandmarks);
    };
    
    // Initial load
    updateLandmarks();
    
    // Listen for cache updates
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'published_content_cache') {
        updateLandmarks();
      }
    };
    
    const onCustom = () => {
      updateLandmarks();
    };
    
    window.addEventListener('storage', onStorage);
    window.addEventListener('published-cache-updated', onCustom as EventListener);
    
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('published-cache-updated', onCustom as EventListener);
    };
  }, []);
  
  return landmarks;
}
