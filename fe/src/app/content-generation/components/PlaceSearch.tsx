'use client';

import { useState, useEffect, useRef } from 'react';
import { Place } from '../../types';

interface PlaceSearchProps {
  onPlaceSelect: (place: string) => void;
  selectedPlace?: string;
}

export default function PlaceSearch({ onPlaceSelect, selectedPlace }: PlaceSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchPending, setIsSearchPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Set initial value from selectedPlace prop
  useEffect(() => {
    if (selectedPlace) {
      setSearchQuery(selectedPlace);
    }
  }, [selectedPlace]);

  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setPlaces([]);
      setIsOpen(false);
      setIsSearchPending(false);
      return;
    }

    setIsLoading(true);
    setIsSearchPending(false);
    setError(null);
    // Clear previous results immediately when starting a new search
    setPlaces([]);
    setIsOpen(false);

    try {
      console.log('Searching for:', query);
      const response = await fetch(`${apiUrl}/search-places`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), language: 'en' })
      });

      if (!response.ok) {
        throw new Error('Failed to search places');
      }

      const data = await response.json();
      console.log('Search response:', data);
      
      // Only show results if the search query hasn't changed
      if (data.search_query === query.trim()) {
        setPlaces(data.places);
        setIsOpen(true);
      }
    } catch (err) {
      setError('Failed to search places. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (value.trim()) {
      // Show pending state immediately
      setIsSearchPending(true);
      setIsOpen(false);
      setPlaces([]);
      
      // Set a new timeout for the search
      const timeoutId = setTimeout(() => {
        searchPlaces(value);
      }, 800); // Search after 800ms of no typing
      
      searchTimeoutRef.current = timeoutId;
    } else {
      setPlaces([]);
      setIsOpen(false);
      setError(null);
      setIsSearchPending(false);
    }
  };

  const handlePlaceSelect = (place: Place) => {
    setSearchQuery(place.name);
    onPlaceSelect(place.name);
    setIsOpen(false);
    setError(null);
  };

  const handleInputFocus = () => {
    if (places.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <label className="flex items-center space-x-2 text-sm font-medium mb-2">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span style={{color: '#340B37'}}>Destination</span>
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setIsOpen(true)}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-3 sm:pl-4 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
          style={{backgroundColor: '#FFFFFF', color: '#545D6B'}}
          placeholder="Search for places (Transilvania, Paris cafes)"
        />
        
        {/* Show different states in the right side */}
        {isLoading && (
          <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-primary"></div>
          </div>
        )}
        
        {!isLoading && isSearchPending && (
          <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2">
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        )}
        
        {!isLoading && !isSearchPending && searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setPlaces([]);
              setIsOpen(false);
              onPlaceSelect('');
              setIsSearchPending(false);
            }}
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {!isLoading && !isSearchPending && !searchQuery && (
          <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* Status messages */}
      
      {isLoading && (
        <p className="text-sm text-gray-500 mt-1">
          Searching for places...
        </p>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      {/* Dropdown with search results */}
      {isOpen && places.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-gray-50 px-4 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Found {places.length} places
              </span>
              <span className="text-xs text-gray-500">
                Click to select
              </span>
            </div>
          </div>
          {places.map((place, index) => (
            <div
              key={index}
              onClick={() => handlePlaceSelect(place)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-gray-900 truncate">{place.name}</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full whitespace-nowrap">
                      {place.type}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full whitespace-nowrap">
                      {place.country}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 leading-relaxed">{place.description}</p>
                  {place.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {place.highlights.slice(0, 4).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                      {place.highlights.length > 4 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          +{place.highlights.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                  {place.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {place.categories.map((category, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && searchQuery && !isLoading && places.length === 0 && !error && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-border rounded-lg shadow-lg p-4">
          <p className="text-gray-500 text-center">No places found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
}
