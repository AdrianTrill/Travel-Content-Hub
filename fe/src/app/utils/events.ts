import { useState, useEffect } from 'react';
import type { Event } from '../types';

interface PublishedItem {
  id: string;
  location?: string | null;
  date: string;
  time: string;
  type: string;
  title: string;
  tags: string[];
}

// Event categories based on content type and tags
const getEventCategory = (type: string, tags: string[]): string => {
  const tagStr = tags.join(' ').toLowerCase();
  
  if (type.toLowerCase().includes('blog')) {
    if (tagStr.includes('food') || tagStr.includes('restaurant') || tagStr.includes('culinary')) {
      return 'Culinary';
    }
    if (tagStr.includes('music') || tagStr.includes('concert') || tagStr.includes('festival')) {
      return 'Music';
    }
    if (tagStr.includes('art') || tagStr.includes('museum') || tagStr.includes('gallery')) {
      return 'Cultural';
    }
    if (tagStr.includes('sport') || tagStr.includes('fitness') || tagStr.includes('outdoor')) {
      return 'Sports';
    }
    return 'Cultural';
  }
  
  if (type.toLowerCase().includes('instagram') || type.toLowerCase().includes('facebook')) {
    if (tagStr.includes('food') || tagStr.includes('restaurant')) {
      return 'Culinary';
    }
    if (tagStr.includes('music') || tagStr.includes('concert')) {
      return 'Music';
    }
    return 'Social';
  }
  
  return 'Cultural';
};

// Generate event name from content title and location
const generateEventName = (title: string, location: string, type: string): string => {
  const cleanTitle = title.replace(/^(The|A|An)\s+/i, '').trim();
  
  // Always use the actual content title as the event name
  // This ensures each event has a unique, descriptive name
  return cleanTitle;
};

// Estimate attendees based on content type and engagement
const estimateAttendees = (type: string, views: number = 0): string => {
  if (type.toLowerCase().includes('blog')) {
    const estimated = Math.max(100, Math.floor(views * 0.1));
    if (estimated >= 1000) {
      return `${Math.floor(estimated / 1000)}K+ expected`;
    }
    return `${estimated}+ expected`;
  }
  
  if (type.toLowerCase().includes('instagram')) {
    const estimated = Math.max(50, Math.floor(views * 0.05));
    if (estimated >= 1000) {
      return `${Math.floor(estimated / 1000)}K+ expected`;
    }
    return `${estimated}+ expected`;
  }
  
  if (type.toLowerCase().includes('facebook')) {
    const estimated = Math.max(200, Math.floor(views * 0.08));
    if (estimated >= 1000) {
      return `${Math.floor(estimated / 1000)}K+ expected`;
    }
    return `${estimated}+ expected`;
  }
  
  return '500+ expected';
};

// Format date for events (convert from content date format)
const formatEventDate = (date: string, time: string): string => {
  try {
    // If date is in format "Apr 15, 2024" or similar
    if (date.includes(',')) {
      const dateObj = new Date(date);
      if (!isNaN(dateObj.getTime())) {
        const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
        const day = dateObj.getDate();
        return `${month} ${day}`;
      }
    }
    
    // If date is in format "2024-04-15" or similar
    if (date.includes('-')) {
      const dateObj = new Date(date);
      if (!isNaN(dateObj.getTime())) {
        const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
        const day = dateObj.getDate();
        return `${month} ${day}`;
      }
    }
    
    // Fallback: use the original date string
    return date;
  } catch {
    return date;
  }
};

export function deriveEventsFromPublishedCache(max: number = 10): Event[] {
  try {
    const cached = localStorage.getItem('published_content_cache');
    const items: PublishedItem[] = cached ? JSON.parse(cached) : [];
    
    if (!items || items.length === 0) {
      return [];
    }
    
    // Filter items that have locations (remove 30-day restriction to show more events)
    const itemsWithLocations = items.filter(item => {
      return item.location && item.location.trim() !== '' && item.location !== '—';
    });
    
    // Sort by date (most recent first)
    const sortedItems = itemsWithLocations.sort((a, b) => {
      try {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      } catch {
        return 0;
      }
    });
    
    // Convert to events (show all items with locations, not just unique locations)
    const events: Event[] = sortedItems
      .slice(0, max)
      .map(item => ({
        name: generateEventName(item.title, item.location!, item.type),
        location: item.location!,
        date: formatEventDate(item.date, item.time),
        attendees: estimateAttendees(item.type, (item as any).views || 0),
        category: getEventCategory(item.type, item.tags || [])
      }));
    
    return events;
  } catch (error) {
    console.error('Error deriving events from cache:', error);
    return [];
  }
}

export function useEvents(): Event[] {
  const [events, setEvents] = useState<Event[]>([]);
  
  useEffect(() => {
    const updateEvents = () => {
      const derivedEvents = deriveEventsFromPublishedCache(10);
      setEvents(derivedEvents);
    };
    
    // Initial load
    updateEvents();
    
    // Listen for cache updates
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'published_content_cache') {
        updateEvents();
      }
    };
    
    const onCustom = () => {
      updateEvents();
    };
    
    window.addEventListener('storage', onStorage);
    window.addEventListener('published-cache-updated', onCustom as EventListener);
    
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('published-cache-updated', onCustom as EventListener);
    };
  }, []);
  
  return events;
}
