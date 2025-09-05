import React, { useState } from 'react';
import { XMarkIcon, PencilIcon, EyeIcon, CalendarIcon, HandThumbUpIcon, HandThumbDownIcon, ChevronRightIcon, ChevronLeftIcon, ClockIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface ContentEditorProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
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
  };
  destination?: string;
  onUpdate?: (updatedContent: {
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
  }) => void;
  onRegenerate?: (content: {
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
  }) => void;
  loading?: boolean;
}

export default function ContentEditor({ isOpen, onClose, content, destination, onUpdate, onRegenerate, loading }: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState('content');
  const [editedTitle, setEditedTitle] = useState(content.title);
  const [editedContent, setEditedContent] = useState(content.content);
  const [editedTags, setEditedTags] = useState(content.tags || []);
  const [editedHighlights, setEditedHighlights] = useState(content.highlights || []);
  const [editedNeighborhoods, setEditedNeighborhoods] = useState(content.neighborhoods || []);
  const [editedRecommendedSpots, setEditedRecommendedSpots] = useState(content.recommended_spots || []);
  const [editedPriceRange, setEditedPriceRange] = useState(content.price_range || '');
  const [editedBestTimes, setEditedBestTimes] = useState(content.best_times || '');
  const [editedCautions, setEditedCautions] = useState(content.cautions || '');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customPromptLoading, setCustomPromptLoading] = useState(false);
  const [customPromptError, setCustomPromptError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [showGeneratedContent, setShowGeneratedContent] = useState(false);

  // Update local state when content prop changes
  React.useEffect(() => {
    setEditedTitle(content.title);
    setEditedContent(content.content);
    setEditedTags(content.tags || []);
    setEditedHighlights(content.highlights || []);
    setEditedNeighborhoods(content.neighborhoods || []);
    setEditedRecommendedSpots(content.recommended_spots || []);
    setEditedPriceRange(content.price_range || '');
    setEditedBestTimes(content.best_times || '');
    setEditedCautions(content.cautions || '');
  }, [content]);

  const generateCustomContent = async () => {
    if (!customPrompt.trim() || !destination) {
      setCustomPromptError('Please enter a custom prompt and ensure destination is set');
      return;
    }

    setCustomPromptLoading(true);
    setCustomPromptError(null);
    setGeneratedContent(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${apiUrl}/generate-custom-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: customPrompt.trim(),
          destination: destination,
          content_type: content.type,
          language: 'en',
          existing_content: content.content
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate custom content');
      }

      const data = await response.json();
      setGeneratedContent(data);
      setShowGeneratedContent(true);
    } catch (err) {
      setCustomPromptError('Failed to generate custom content. Please try again.');
      console.error('Custom prompt generation error:', err);
    } finally {
      setCustomPromptLoading(false);
    }
  };

  const approveGeneratedContent = () => {
    if (generatedContent) {
      // Update the local content state with all the generated fields
      const updatedContent = {
        ...content,
        title: generatedContent.title,
        content: generatedContent.content,
        tags: generatedContent.tags || content.tags,
        highlights: generatedContent.highlights || content.highlights,
        neighborhoods: generatedContent.neighborhoods || content.neighborhoods,
        recommended_spots: generatedContent.recommended_spots || content.recommended_spots,
        price_range: generatedContent.price_range || content.price_range,
        best_times: generatedContent.best_times || content.best_times,
        cautions: generatedContent.cautions || content.cautions,
      };
      
      // Update ALL local state variables
      setEditedTitle(updatedContent.title);
      setEditedContent(updatedContent.content);
      setEditedTags(updatedContent.tags || []);
      setEditedHighlights(updatedContent.highlights || []);
      setEditedNeighborhoods(updatedContent.neighborhoods || []);
      setEditedRecommendedSpots(updatedContent.recommended_spots || []);
      setEditedPriceRange(updatedContent.price_range || '');
      setEditedBestTimes(updatedContent.best_times || '');
      setEditedCautions(updatedContent.cautions || '');
      
      // Update the parent component immediately
      if (onUpdate) {
        onUpdate(updatedContent);
      }
      
      setShowGeneratedContent(false);
      setGeneratedContent(null);
      setCustomPrompt('');
      setActiveTab('content');
    }
  };

  const regenerateCustomContent = () => {
    setShowGeneratedContent(false);
    setGeneratedContent(null);
    generateCustomContent();
  };

  const validatePriceInput = (price: string) => {
    // Remove any $ symbols and validate
    const cleanPrice = price.replace(/\$/g, '').trim();
    
    if (!cleanPrice) return '';
    
    // If it's just numbers or symbols, suggest a better format
    if (/^[0-9\s\-]+$/.test(cleanPrice)) {
      return `£${cleanPrice}`; // Add currency symbol
    }
    
    // If it's already descriptive, return as is
    if (['Free', 'Budget-friendly', 'Moderate', 'Premium', 'Luxury'].includes(cleanPrice)) {
      return cleanPrice;
    }
    
    return cleanPrice;
  };

  if (!isOpen) return null;

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...content,
        title: editedTitle,
        content: editedContent,
        tags: editedTags,
        highlights: editedHighlights,
        neighborhoods: editedNeighborhoods,
        recommended_spots: editedRecommendedSpots,
        price_range: editedPriceRange || null,
        best_times: editedBestTimes || null,
        cautions: editedCautions || null,
      });
    }
    onClose();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'content':
        return (
          <div className="p-6 space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                Title
              </label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full h-12 px-4 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{backgroundColor: '#FFFFFF', color: '#374151'}}
              />
            </div>

            {/* Content Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                Content
              </label>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={8}
                className="w-full h-12 px-4 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                style={{backgroundColor: '#FFFFFF', color: '#374151'}}
              />
            </div>

            {/* Tags Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                Tags
              </label>
              <input
                type="text"
                value={editedTags.join(', ')}
                onChange={(e) => {
                  const input = e.target.value;
                  // Don't split immediately - let user type naturally
                  setEditedTags([input]);
                }}
                onBlur={(e) => {
                  const input = e.target.value;
                  // Only split on commas, not on spaces
                  const tags = input.split(',').filter(tag => tag.trim()).map(tag => tag.trim());
                  setEditedTags(tags);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.currentTarget.value;
                    // Only split on commas, not on spaces
                    const tags = input.split(',').filter(tag => tag.trim()).map(tag => tag.trim());
                    setEditedTags(tags);
                    e.currentTarget.blur();
                  }
                }}
                className="w-full h-12 px-4 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{backgroundColor: '#FFFFFF', color: '#374151'}}
                placeholder="nature, culture, food, adventure"
              />
              {/* Show tags as visual feedback */}
              {editedTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {editedTags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center h-7 px-2 text-xs rounded-full text-white" style={{backgroundColor: '#6E2168'}}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Highlights Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                Highlights
              </label>
              <input
                type="text"
                value={editedHighlights.join(', ')}
                onChange={(e) => {
                  const input = e.target.value;
                  // Don't split immediately - let user type naturally
                  setEditedHighlights([input]);
                }}
                onBlur={(e) => {
                  const input = e.target.value;
                  // Only split on commas, not on spaces
                  const highlights = input.split(',').filter(highlight => highlight.trim()).map(highlight => highlight.trim());
                  setEditedHighlights(highlights);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.currentTarget.value;
                    // Only split on commas, not on spaces
                    const highlights = input.split(',').filter(highlight => highlight.trim()).map(highlight => highlight.trim());
                    setEditedHighlights(highlights);
                    e.currentTarget.blur();
                  }
                }}
                className="w-full h-12 px-4 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{backgroundColor: '#FFFFFF', color: '#374151'}}
                placeholder="beautiful views, local cuisine, historic sites"
              />
              {/* Show highlights as visual feedback */}
              {editedHighlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {editedHighlights.map((highlight, index) => (
                    <span key={index} className="inline-flex items-center h-7 px-2 text-xs rounded-full text-white" style={{backgroundColor: '#6E2168'}}>
                      {highlight}
                    </span>
                  ))}
                </div>
              )}
            </div>


            {/* Additional Info Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                  Price Range
                </label>
                <input
                  type="text"
                  value={editedPriceRange}
                  onChange={(e) => setEditedPriceRange(validatePriceInput(e.target.value))}
                  className="w-full h-12 px-4 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  style={{backgroundColor: '#FFFFFF', color: '#374151'}}
                  placeholder="Free, Budget-friendly, £5-£20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                  Best Times
                </label>
                <input
                  type="text"
                  value={editedBestTimes}
                  onChange={(e) => setEditedBestTimes(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  style={{backgroundColor: '#FFFFFF', color: '#374151'}}
                  placeholder="summer, morning"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                  Cautions/Notes
                </label>
                <input
                  type="text"
                  value={editedCautions}
                  onChange={(e) => setEditedCautions(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  style={{backgroundColor: '#FFFFFF', color: '#374151'}}
                  placeholder="prepare for weather, crowdy"
                />
              </div>
            </div>
          </div>
        );
      
      case 'preview':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4" style={{color: '#340B37'}}>Preview for Website</h3>
            <div className="bg-white border border-gray-border rounded-lg p-6">
              <h1 className="text-lg font-bold mb-4" style={{color: '#340B37'}}>{editedTitle}</h1>
              <p className="text-sm leading-relaxed" style={{color: '#340B37'}}>{editedContent}</p>
            </div>
          </div>
        );
      
      case 'schedule':
        return (
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
              {/* Publish Date Field */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                  Publish Date
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{color: '#374151'}} />
                  <input
                    type="text"
                    placeholder="dd----yyyy"
                    className="w-full h-12 pl-10 pr-4 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{backgroundColor: '#FFFFFF', color: '#374151'}}
                  />
                </div>
              </div>

              {/* Publish Time Field */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                  Publish Time
                </label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{color: '#374151'}} />
                  <input
                    type="text"
                    placeholder="--:--"
                    className="w-full h-12 pl-10 pr-4 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{backgroundColor: '#FFFFFF', color: '#374151'}}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'custom-prompt':
        return (
          <div className="p-6 space-y-6">
            {/* Custom Prompt Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                Custom AI Prompt
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Write your custom prompt for the AI. For example: 'Write a blog post about hidden cafes in this city that locals love, with specific recommendations and insider tips'"
                rows={12}
                className="w-full px-4 py-3 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                style={{backgroundColor: '#FFFFFF', color: '#374151'}}
              />
              <p className="text-sm text-gray-700 mt-2">
                Be specific about what you want the AI to generate. Include style, tone, focus areas, and any specific requirements.
              </p>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <button
                onClick={generateCustomContent}
                disabled={customPromptLoading || !customPrompt.trim() || !destination}
                className="h-12 px-6 rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                style={{backgroundColor: '#6E2168'}}
              >
                {customPromptLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5" />
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {customPromptError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{customPromptError}</p>
              </div>
            )}

            {/* Generated Content Display */}
            {showGeneratedContent && generatedContent && (
              <div className="border border-gray-border rounded-lg p-6" style={{backgroundColor: '#FFFFFF'}}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold" style={{color: '#340B37'}}>AI Generated Content</h3>
                  <div className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    Generated from: "{generatedContent.generated_from_prompt}"
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                      Title
                    </label>
                    <p className="text-lg font-medium" style={{color: '#374151'}}>{generatedContent.title}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                      Content
                    </label>
                    <p className="text-sm leading-relaxed" style={{color: '#374151'}}>{generatedContent.content}</p>
                  </div>

                  {generatedContent.highlights && generatedContent.highlights.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                        Highlights
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.highlights.map((highlight: string, index: number) => (
                          <span
                            key={index}
                            className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-border">
                  <button
                    onClick={regenerateCustomContent}
                    disabled={customPromptLoading}
                    className="h-12 px-4 border rounded text-sm hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}
                  >
                    <SparklesIcon className="h-4 w-4" />
                    <span>Regenerate</span>
                  </button>
                  <button
                    onClick={approveGeneratedContent}
                    className="h-12 px-4 rounded text-sm hover:opacity-90 transition-opacity flex items-center space-x-2"
                    style={{backgroundColor: '#6E2168', color: '#FFFFFF'}}
                  >
                    <HandThumbUpIcon className="h-4 w-4" />
                    <span>Approve & Use</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderActionButtons = () => {
    if (activeTab === 'content') {
      return (
        <div className="flex items-center justify-end px-6 pb-6 space-x-3">
          <button 
            onClick={handleSave}
            className="h-12 px-3 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" 
            style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}
          >
            <HandThumbUpIcon className="h-3 w-3" style={{color: '#340B37'}} />
            <span>Approve</span>
          </button>
          <button 
            onClick={() => onRegenerate && onRegenerate(content)}
            disabled={loading}
            className="h-12 px-3 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed" 
            style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}
          >
            {loading && (
              <svg className="animate-spin h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <HandThumbDownIcon className="h-3 w-3" style={{color: '#340B37'}} />
            <span>{loading ? 'Regenerating...' : 'Regenerate'}</span>
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className="h-12 px-3 rounded text-sm hover:opacity-90 transition-opacity flex items-center space-x-1" 
            style={{backgroundColor: '#6E2168', color: '#FFFFFF'}}
          >
            <span>Next</span>
            <ChevronRightIcon className="h-3 w-3" />
          </button>
        </div>
      );
    } else if (activeTab === 'preview') {
      return (
        <div className="flex items-center justify-between px-6 pb-6">
          <button 
            onClick={() => setActiveTab('content')}
            className="h-12 px-3 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" 
            style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}
          >
            <ChevronLeftIcon className="h-3 w-3" style={{color: '#340B37'}} />
            <span>Previous</span>
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
            className="h-12 px-3 rounded text-sm hover:opacity-90 transition-opacity flex items-center space-x-1" 
            style={{backgroundColor: '#6E2168', color: '#FFFFFF'}}
          >
            <span>Next</span>
            <ChevronRightIcon className="h-3 w-3" />
          </button>
        </div>
      );
    } else if (activeTab === 'schedule') {
      return (
        <div className="flex items-center justify-between px-6 pb-6 space-x-3">
          <button 
            onClick={() => setActiveTab('preview')}
            className="h-12 px-3 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" 
            style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}
          >
            <ChevronLeftIcon className="h-3 w-3" style={{color: '#340B37'}} />
            <span>Previous</span>
          </button>
          <div className="flex space-x-3">
            <button className="h-12 px-3 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}>
              <ClockIcon className="h-3 w-3" style={{color: '#340B37'}} />
              <span>Schedule Post</span>
            </button>
            <button 
              onClick={handleSave}
              className="h-12 px-3 rounded text-sm hover:opacity-90 transition-opacity flex items-center space-x-1" 
              style={{backgroundColor: '#6E2168', color: '#FFFFFF'}}
            >
              <span>Next</span>
              <ChevronRightIcon className="h-3 w-3" />
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="rounded-xl shadow-2xl w-full max-w-4xl mx-4 h-[720px] overflow-hidden flex flex-col" style={{backgroundColor: '#F7F1E9'}}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{backgroundColor: '#F7F1E9'}}>
              <PencilIcon className="h-6 w-6" style={{color: '#340B37'}} />
            </div>
            <h2 className="text-xl font-semibold" style={{color: '#340B37'}}>Content Editor</h2>
          </div>
          <button
            onClick={handleSave}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-medium" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-6">
          {/* Tabs - pill segmented style */}
          <div className="w-full px-6 pt-6">
            <nav className="grid grid-cols-4 gap-2 items-center" style={{backgroundColor:'#F8F9F9', padding:'5px', borderRadius:'10px', border:'1px solid #C8C8C8'}}>
          <button 
            onClick={() => setActiveTab('content')}
                className={`w-full flex items-center justify-center space-x-2 py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'content' ? 'text-white' : ''
            }`} 
            style={{
              backgroundColor: activeTab === 'content' ? '#6E2168' : '#F8F9F9',
                  color: activeTab === 'content' ? '#FFFFFF' : '#374151'
            }}
          >
                <span>Content</span>
          </button>
          <button 
            onClick={() => setActiveTab('custom-prompt')}
                className={`w-full flex items-center justify-center space-x-2 py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'custom-prompt' ? 'text-white' : ''
            }`} 
            style={{
              backgroundColor: activeTab === 'custom-prompt' ? '#6E2168' : '#F8F9F9',
                                color: activeTab === 'custom-prompt' ? '#FFFFFF' : '#374151'
            }}
          >
              <SparklesIcon className="h-4 w-4" />
              <span>AI Prompt</span>
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
                className={`w-full flex items-center justify-center space-x-2 py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'preview' ? 'text-white' : ''
            }`} 
            style={{
              backgroundColor: activeTab === 'preview' ? '#6E2168' : '#F8F9F9',
                                color: activeTab === 'preview' ? '#FFFFFF' : '#374151'
            }}
          >
                <span>Preview</span>
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
                className={`w-full flex items-center justify-center space-x-2 py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'schedule' ? 'text-white' : ''
            }`} 
            style={{
              backgroundColor: activeTab === 'schedule' ? '#6E2168' : '#F8F9F9',
                                color: activeTab === 'schedule' ? '#FFFFFF' : '#374151'
            }}
          >
                <span>Schedule</span>
          </button>
            </nav>
        </div>
          {renderContent()}
        </div>

        {/* Action Buttons */}
        {renderActionButtons()}
      </div>
    </div>
  );
} 