'use client';

import { useMemo, useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ContentEditor from './components/ContentEditor';
import PlaceSearch from './components/PlaceSearch';
import AnimatedContainer from '../dashboard/components/AnimatedContainer';
import { useQuickStats } from '../utils/quickStats';

interface Content {
  title: string;
  content: string;
  type: string;
  readingTime: string;
  quality: string;
  tags: string[];
  highlights?: string[];
  neighborhoods?: string[];
  recommended_spots?: string[];
  price_range?: string | null;
  best_times?: string | null;
  cautions?: string | null;
  imageUrl?: string | null;
}

export default function ContentGeneration() {
  const quickStats = useQuickStats();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [destination, setDestination] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('contentGen_destination') || '';
    }
    return '';
  });
  const [startDate, setStartDate] = useState<Date | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contentGen_startDate');
      return saved ? new Date(saved) : null;
    }
    return null;
  });
  const [endDate, setEndDate] = useState<Date | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contentGen_endDate');
      return saved ? new Date(saved) : null;
    }
    return null;
  });
  const [contentType, setContentType] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('contentGen_contentType') || 'Blog Post';
    }
    return 'Blog Post';
  });
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({});
  const [suggestions, setSuggestions] = useState<Content[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contentGen_suggestions');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState<{[key: string]: boolean}>({});
  const apiUrl = useMemo(() => (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:8000/api/v1', []);

  // Save state changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('contentGen_destination', destination);
    }
  }, [destination]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (startDate) {
        localStorage.setItem('contentGen_startDate', startDate.toISOString());
      } else {
        localStorage.removeItem('contentGen_startDate');
      }
    }
  }, [startDate]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (endDate) {
        localStorage.setItem('contentGen_endDate', endDate.toISOString());
      } else {
        localStorage.removeItem('contentGen_endDate');
      }
    }
  }, [endDate]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('contentGen_contentType', contentType);
    }
  }, [contentType]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('contentGen_suggestions', JSON.stringify(suggestions));
    }
  }, [suggestions]);

  const handleEdit = (content: Content) => {
    console.log('handleEdit called with:', content);
    setSelectedContent({
      title: content.title,
      content: content.content,
      type: content.type,
      readingTime: content.readingTime,
      quality: content.quality,
      tags: content.tags || [],
      highlights: content.highlights || [],
      neighborhoods: content.neighborhoods || [],
      recommended_spots: content.recommended_spots || [],
      price_range: content.price_range || null,
      best_times: content.best_times || null,
      cautions: content.cautions || null,
      imageUrl: content.imageUrl || null,
    });
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
  };

  const handleContentUpdate = (updatedContent: Content) => {
    console.log('handleContentUpdate called with:', updatedContent);
    setSuggestions(prev => prev.map(s => 
      s.title === selectedContent?.title && s.content === selectedContent?.content 
        ? updatedContent 
        : s
    ));
    setSelectedContent(null);
  };

  const handleRegenerate = async (contentToRegenerate: Content) => {
    if (!destination) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${apiUrl}/generate-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          destination, 
          start_date: startDate?.toISOString().split('T')[0] || '', 
          end_date: endDate?.toISOString().split('T')[0] || '', 
          content_type: contentType, 
          language: 'en' 
        })
      });
      
      if (!res.ok) {
        let message = 'Request failed';
        try {
          const err = await res.json();
          message = err?.detail?.message || err?.detail || message;
        } catch {}
        setError(message);
        return;
      }
      
      const data = await res.json();
      const newSuggestions: Content[] = (data?.suggestions || []).map((s: any) => ({
        title: s.title,
        content: s.content,
        type: s.type,
        readingTime: s.reading_time,
        quality: s.quality,
        tags: s.tags || [],
        highlights: s.highlights || [],
        neighborhoods: s.neighborhoods || [],
        recommended_spots: s.recommended_spots || [],
        price_range: s.price_range ?? null,
        best_times: s.best_times ?? null,
        cautions: s.cautions ?? null,
      }));
      
      // Replace the specific card being edited with the first new suggestion
      if (newSuggestions.length > 0) {
        setSuggestions(prev => prev.map(s => 
          s.title === contentToRegenerate.title && s.content === contentToRegenerate.content 
            ? newSuggestions[0] 
            : s
        ));
        setSelectedContent(newSuggestions[0]);
      }
    } catch (e) {
      console.error(e);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1E9]">
      <Header />
      <div className="flex flex-col md:flex-row relative">
        {toast && (
          <div className="fixed top-4 right-4 z-50">
            <div className="px-4 py-2 rounded-lg shadow-md text-white" style={{backgroundColor:'#0F612D'}}>
              {toast}
            </div>
          </div>
        )}
        <Sidebar quickStats={quickStats} currentPage="content-generation" />
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <AnimatedContainer direction="up" delay={0.1}>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-dark mb-4">Content Generation</h1>
          </AnimatedContainer>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Content Parameters Section */}
            <AnimatedContainer direction="up" delay={0.2}>
              <div className="bg-[#FBF8F4] border border-[#DAE1E9] rounded-xl p-3 sm:p-4 md:p-6">
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <h2 className="text-base sm:text-lg font-semibold" style={{color: '#340B37'}}>Content Parameters</h2>
              </div>

              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                {/* Destination Input */}
                <PlaceSearch
                  onPlaceSelect={setDestination}
                  selectedPlace={destination}
                />

                {/* Travel Dates Input */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium mb-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span style={{color: '#340B37'}}>Travel Dates</span>
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      placeholderText="start date"
                      dateFormat="MMM d, yyyy"
                        className="w-full sm:flex-1 px-3 py-2.5 sm:py-2 border border-gray-border rounded-lg text-gray-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                    />
                    <span className="hidden sm:inline text-gray-400">-</span>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      placeholderText="end date"
                      minDate={startDate || undefined}
                      dateFormat="MMM d, yyyy"
                        className="w-full sm:flex-1 px-3 py-2.5 sm:py-2 border border-gray-border rounded-lg text-gray-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Content Type Input */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium mb-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span style={{color: '#340B37'}}>Content Type</span>
                  </label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-2 border border-gray-border rounded-lg text-gray-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base" style={{backgroundColor: '#FFFFFF'}}>
                    <option>Blog Post</option>
                    <option>Instagram Post</option>
                    <option>Facebook Post</option>
                  </select>
                </div>

                {/* Generate Content Button */}
                <button
                  onClick={async () => {
                    if (!destination) return;
                    try {
                      setLoading(true);
                      setError(null);
                      const res = await fetch(`${apiUrl}/generate-content`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ destination, start_date: startDate?.toISOString().split('T')[0], end_date: endDate?.toISOString().split('T')[0], content_type: contentType, language: 'en' })
                      });
                      if (!res.ok) {
                        let message = 'Request failed';
                        try {
                          const err = await res.json();
                          message = err?.detail?.message || err?.detail || message;
                        } catch {}
                        setSuggestions([]);
                        setError(message);
                        return;
                      }
                      const data = await res.json();
                      const mapped: Content[] = (data?.suggestions || []).map((s: any) => ({
                        title: s.title,
                        content: s.content,
                        type: s.type,
                        readingTime: s.reading_time,
                        quality: s.quality,
                        tags: s.tags || [],
                        highlights: s.highlights || [],
                        neighborhoods: s.neighborhoods || [],
                        recommended_spots: s.recommended_spots || [],
                        price_range: s.price_range ?? null,
                        best_times: s.best_times ?? null,
                        cautions: s.cautions ?? null,
                      }));
                      setSuggestions(mapped);
                    } catch (e) {
                      console.error(e);
                      setError('Something went wrong. Please try again.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  aria-busy={loading}
                  className="w-full bg-primary text-white py-3 sm:py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2 disabled:opacity-60 text-sm sm:text-base">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span>Generate Content</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            </AnimatedContainer>

            {/* AI Generated Suggestions Section */}
            <AnimatedContainer direction="up" delay={0.3}>
              <div className="bg-[#FBF8F4] border border-[#DAE1E9] rounded-xl p-3 sm:p-4 md:p-6">
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <h2 className="text-base sm:text-lg font-semibold" style={{color: '#340B37'}}>AI Generated Suggestions</h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {error ? (
                  <div className="text-sm text-red-600">{error}</div>
                ) : null}
                {suggestions.length === 0 ? (
                  <div className="text-sm text-gray-500">No suggestions yet. Fill parameters and click Generate.</div>
                ) : null}
                {suggestions.map((s, idx) => (
                  <AnimatedContainer key={idx} direction="up" delay={0.2 + idx * 0.1}>
                <div className="border border-gray-border rounded-lg p-3 sm:p-4" style={{backgroundColor: '#F8F9F9'}}>
                  {/* Generated Image */}
                  {s.imageUrl && (
                    <div className="mb-3">
                      <img 
                        src={s.imageUrl} 
                        alt={`Generated image for ${s.title}`}
                        className="w-full h-40 sm:h-48 object-cover rounded-lg"
                        onError={(e) => {
                          // Hide image if it fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 px-2 py-1 rounded-full" style={{backgroundColor: '#F7F1E9'}}>
                        <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                        <span className="text-xs sm:text-sm font-medium" style={{color: '#6E2168'}}>{s.type}</span>
                      </div>
                    </div>
                    <div className="flex sm:hidden items-center space-x-3 text-xs text-gray-dark">
                      <span className="flex items-center space-x-1">
                        <svg className="h-3 w-3 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{s.readingTime}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-success">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>{s.quality}</span>
                      </span>
                    </div>
                    <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-dark">
                      <span className="flex items-center space-x-1">
                        <svg className="h-4 w-4 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{s.readingTime}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-success">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>{s.quality}</span>
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3" style={{color: '#340B37'}}>
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-dark mb-3 sm:mb-4 leading-relaxed">
                    {s.content}
                  </p>
                  {/* Rich details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3">
                    {s.highlights && s.highlights.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold mb-1" style={{color:'#340B37'}}>Highlights</div>
                        <div className="flex flex-wrap gap-1">
                          {s.highlights.slice(0,5).map((h, i) => (
                            <span key={i} className="px-1.5 py-0.5 text-[9px] sm:text-[10px] rounded-full bg-white border border-gray-200 text-gray-700">{h}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {(s.neighborhoods && s.neighborhoods.length > 0) || (s.recommended_spots && s.recommended_spots.length > 0) ? (
                      <div>
                        {s.neighborhoods && s.neighborhoods.length > 0 && (
                          <div className="mb-2">
                            <div className="text-xs font-semibold mb-1" style={{color:'#340B37'}}>Neighborhoods</div>
                            <div className="flex flex-wrap gap-1">
                              {s.neighborhoods.slice(0,4).map((n, i) => (
                                <span key={i} className="px-1.5 py-0.5 text-[9px] sm:text-[10px] rounded-full bg-white border border-gray-200 text-gray-700">{n}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {s.recommended_spots && s.recommended_spots.length > 0 && (
                          <div>
                            <div className="text-xs font-semibold mb-1" style={{color:'#340B37'}}>Spots</div>
                            <div className="flex flex-wrap gap-1">
                              {s.recommended_spots.slice(0,6).map((spot, i) => (
                                <span key={i} className="px-1.5 py-0.5 text-[9px] sm:text-[10px] rounded-full bg-white border border-gray-200 text-gray-700">{spot}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                  {(s.price_range || s.best_times || s.cautions) && (
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                      {s.price_range && (<span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] rounded bg-white border border-gray-200 text-gray-700">Price: {s.price_range}</span>)}
                      {s.best_times && (<span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] rounded bg-white border border-gray-200 text-gray-700">Best: {s.best_times}</span>)}
                      {s.cautions && (<span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] rounded bg-white border border-gray-200 text-gray-700">Note: {s.cautions}</span>)}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mt-2">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {s.tags.map((tag, tagIdx) => (
                        <span key={tagIdx} className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs rounded-full" style={{backgroundColor: '#FFB066', color: 'black'}}>{tag}</span>
                      ))}
                    </div>
                    <div className="flex space-x-1 sm:space-x-2 justify-end self-end mt-2 sm:mt-0">
                      <button 
                        onClick={() => handleEdit({
                          title: s.title,
                          content: s.content,
                          type: s.type,
                          readingTime: s.readingTime,
                          quality: s.quality,
                          tags: s.tags,
                          highlights: s.highlights || [],
                          neighborhoods: s.neighborhoods || [],
                          recommended_spots: s.recommended_spots || [],
                          price_range: s.price_range || null,
                          best_times: s.best_times || null,
                          cautions: s.cautions || null,
                          imageUrl: s.imageUrl || null,
                        })}
                            className="px-2 py-1 sm:px-1.5 sm:py-0.5 border rounded text-[10px] sm:text-xs hover:bg-gray-50 flex items-center space-x-1 w-16 sm:w-20 justify-center"
                        style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}
                      >
                        <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#340B37'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button 
                        onClick={async () => {
                          const contentKey = `${s.title}-${s.content}`;
                          setImageLoading(prev => ({ ...prev, [contentKey]: true }));
                          try {
                            const res = await fetch(`${apiUrl}/generate-image`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                title: s.title,
                                content: s.content,
                                destination: destination,
                                tags: s.tags,
                                neighborhoods: s.neighborhoods || [],
                                recommended_spots: s.recommended_spots || [],
                                best_times: s.best_times
                              })
                            });
                            if (res.ok) {
                              const data = await res.json();
                              if (data.image_url) {
                                // Update the content card with the generated image
                                setSuggestions(prev => prev.map(item => 
                                  item.title === s.title && item.content === s.content
                                    ? { ...item, imageUrl: data.image_url }
                                    : item
                                ));
                              } else {
                                alert('Image generation failed: ' + (data.error || 'Unknown error'));
                              }
                            } else {
                              alert('Failed to generate image');
                            }
                          } catch (e) {
                            console.error(e);
                            alert('Error generating image');
                          } finally {
                            setImageLoading(prev => ({ ...prev, [contentKey]: false }));
                          }
                        }}
                        disabled={imageLoading[`${s.title}-${s.content}`]}
                        className="px-2 py-1 sm:px-1.5 sm:py-0.5 border rounded text-[10px] sm:text-xs hover:bg-gray-50 flex items-center space-x-1 disabled:opacity-50 w-16 sm:w-20 justify-center"
                        style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}
                      >
                        {imageLoading[`${s.title}-${s.content}`] ? (
                          <>
                            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="hidden sm:inline">Generating...</span>
                          </>
                        ) : (
                          <>
                        <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#340B37'}}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                            <span className="hidden sm:inline">{s.imageUrl ? 'Regenerate' : 'Generate Image'}</span>
                          </>
                        )}
                      </button>
                          <button className="px-2 py-1 sm:px-1.5 sm:py-0.5 border rounded text-[10px] sm:text-xs hover:bg-gray-50 flex items-center space-x-1 w-16 sm:w-20 justify-center" style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}>
                        <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#340B37'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12l2-2 4-4 2-2" />
                        </svg>
                        <span className="hidden sm:inline">Copy</span>
                      </button>
                      <button 
                        onClick={async () => {
                          const key = `${s.title}-${s.content}`;
                          setPublishing(prev => ({ ...prev, [key]: true }));
                          try {
                            const res = await fetch(`${apiUrl}/publish`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                title: s.title,
                                content: s.content,
                                type: s.type,
                                reading_time: s.readingTime,
                                quality: s.quality,
                                tags: s.tags,
                                highlights: s.highlights || [],
                                neighborhoods: s.neighborhoods || [],
                                recommended_spots: s.recommended_spots || [],
                                price_range: s.price_range ?? null,
                                best_times: s.best_times ?? null,
                                cautions: s.cautions ?? null,
                                destination: destination || undefined,
                                image_url: s.imageUrl || undefined,
                              })
                            });
                            if (!res.ok) {
                              const err = await res.json().catch(() => null);
                              alert(`Failed to publish: ${err?.message || res.statusText}`);
                              return;
                            }
                            const created = await res.json();
                            try {
                              // Update browser cache so Content History reflects immediately
                              const CACHE_KEY = 'published_content_cache';
                              const CACHE_TIMESTAMP_KEY = 'published_content_timestamp';
                              const CACHE_VERSION_KEY = 'published_content_version';
                              const CURRENT_CACHE_VERSION = '1.0';
                              const existing = localStorage.getItem(CACHE_KEY);
                              const items = existing ? JSON.parse(existing) : [];
                              // Prepend newest
                              const updated = [created, ...items];
                              localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
                              localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
                              localStorage.setItem(CACHE_VERSION_KEY, CURRENT_CACHE_VERSION);
                              // Notify listeners in-app (without full page reload)
                              window.dispatchEvent(new CustomEvent('published-cache-updated'));
                              // Show toast
                              setToast('Published!');
                              setTimeout(() => setToast(null), 2500);
                            } catch {}
                            // Optional lightweight inline confirmation (no blocking alert)
                            // console.info('Published successfully');
                          } catch (e) {
                            console.error(e);
                            alert('Failed to publish');
                          } finally {
                            setPublishing(prev => ({ ...prev, [key]: false }));
                          }
                        }}
                        disabled={publishing[`${s.title}-${s.content}`]}
                        className="px-2 py-1 sm:px-1.5 sm:py-0.5 bg-primary text-white rounded text-[10px] sm:text-xs hover:bg-primary-dark flex items-center space-x-1 disabled:opacity-50 w-16 sm:w-20 justify-center"
                      >
                        {publishing[`${s.title}-${s.content}`] ? (
                          <>
                            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="hidden sm:inline">Publishing...</span>
                          </>
                        ) : (
                          <>
                            <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span className="hidden sm:inline">Publish</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                    </div>
                  </AnimatedContainer>
                ))}
                </div>
              </div>
            </AnimatedContainer>
          </div>
        </main>
      </div>

      {/* Content Editor Modal */}
      {selectedContent && (
      <ContentEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        content={selectedContent}
        destination={destination}
        onUpdate={handleContentUpdate}
        onRegenerate={handleRegenerate}
        loading={loading}
      />
      )}
    </div>
  );
} 