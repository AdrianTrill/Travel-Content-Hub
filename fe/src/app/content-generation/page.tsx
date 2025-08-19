'use client';

import { useMemo, useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ContentEditor from './components/ContentEditor';
import AnimatedContainer from '../dashboard/components/AnimatedContainer';
import { quickStats } from '../data/mockData';
import { DESTINATIONS } from '../types';

interface Content {
  title: string;
  content: string;
  type: string;
  readingTime: string;
  quality: string;
  tags: string[];
}

export default function ContentGeneration() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
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
  const [suggestions, setSuggestions] = useState<Content[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contentGen_suggestions');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [error, setError] = useState<string | null>(null);
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
    setSelectedContent({
      title: content.title,
      content: content.content,
      type: content.type,
      readingTime: content.readingTime,
      quality: content.quality,
      tags: content.tags
    });
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
  };

  const handleContentUpdate = (updatedContent: Content) => {
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
        <Sidebar quickStats={quickStats} currentPage="content-generation" />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <AnimatedContainer direction="up" delay={0.1}>
          <h1 className="text-3xl font-extrabold text-primary-dark mb-4">Content Generation</h1>
          </AnimatedContainer>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Content Parameters Section */}
            <AnimatedContainer direction="up" delay={0.2}>
              <div className="bg-[#FBF8F4] border border-[#DAE1E9] rounded-xl p-4 md:p-6">
              <div className="flex items-center space-x-2 mb-6">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <h2 className="text-lg font-semibold" style={{color: '#340B37'}}>Content Parameters</h2>
              </div>

              <div className="space-y-4 md:space-y-5">
                {/* Destination Input */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium mb-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span style={{color: '#340B37'}}>Destination</span>
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-border rounded-lg text-gray-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{backgroundColor: '#FFFFFF'}}
                  >
                    <option value="">Choose destination</option>
                    {DESTINATIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

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
                        className="w-full sm:flex-1 px-3 py-2 border border-gray-border rounded-lg text-gray-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <span className="hidden sm:inline text-gray-400">-</span>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      placeholderText="end date"
                      minDate={startDate || undefined}
                      dateFormat="MMM d, yyyy"
                        className="w-full sm:flex-1 px-3 py-2 border border-gray-border rounded-lg text-gray-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-border rounded-lg text-gray-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" style={{backgroundColor: '#FFFFFF'}}>
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
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2 disabled:opacity-60">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="bg-[#FBF8F4] border border-[#DAE1E9] rounded-xl p-4 md:p-6">
              <div className="flex items-center space-x-2 mb-6">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <h2 className="text-lg font-semibold" style={{color: '#340B37'}}>AI Generated Suggestions</h2>
              </div>

              <div className="space-y-4">
                {error ? (
                  <div className="text-sm text-red-600">{error}</div>
                ) : null}
                {suggestions.length === 0 ? (
                  <div className="text-sm text-gray-500">No suggestions yet. Fill parameters and click Generate.</div>
                ) : null}
                {suggestions.map((s, idx) => (
                  <AnimatedContainer key={idx} direction="up" delay={0.2 + idx * 0.1}>
                <div className="border border-gray-border rounded-lg p-3 md:p-4" style={{backgroundColor: '#F8F9F9'}}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 px-2 py-1 rounded-full" style={{backgroundColor: '#F7F1E9'}}>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                        <span className="text-sm font-medium" style={{color: '#6E2168'}}>{s.type}</span>
                      </div>
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
                  <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3" style={{color: '#340B37'}}>
                    {s.title}
                  </h3>
                  <p className="text-sm text-gray-dark mb-3 md:mb-4">
                    {s.content}
                  </p>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {s.tags.map((tag, tagIdx) => (
                        <span key={tagIdx} className="px-2 py-1 text-xs rounded-full" style={{backgroundColor: '#FFB066', color: 'black'}}>{tag}</span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit({
                          title: s.title,
                          content: s.content,
                          type: s.type,
                          readingTime: s.readingTime,
                          quality: s.quality,
                          tags: s.tags,
                        })}
                            className="px-3 py-1 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" 
                        style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#340B37'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                          <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}>
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#340B37'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12l2-2 4-4 2-2" />
                        </svg>
                        <span>Copy</span>
                      </button>
                      <button className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-dark flex items-center space-x-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Publish</span>
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
        onUpdate={handleContentUpdate}
        onRegenerate={handleRegenerate}
        loading={loading}
      />
      )}
    </div>
  );
} 