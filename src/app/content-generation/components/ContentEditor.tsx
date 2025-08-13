import React, { useState } from 'react';
import { XMarkIcon, PencilIcon, EyeIcon, CalendarIcon, HandThumbUpIcon, HandThumbDownIcon, ChevronRightIcon, ChevronLeftIcon, ClockIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface ContentEditorProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    title: string;
    content: string;
    type: string;
    readingTime: string;
    quality: string;
  };
}

export default function ContentEditor({ isOpen, onClose, content }: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState('content');

  if (!isOpen) return null;

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
                defaultValue={content.title}
                className="w-full px-4 py-3 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{backgroundColor: '#FFFFFF', color: '#545D6B'}}
              />
            </div>

            {/* Content Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                Content
              </label>
              <textarea
                defaultValue={content.content}
                rows={8}
                className="w-full px-4 py-3 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                style={{backgroundColor: '#FFFFFF', color: '#545D6B'}}
              />
            </div>
          </div>
        );
      
      case 'preview':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4" style={{color: '#340B37'}}>Preview for Website</h3>
            <div className="bg-white border border-gray-border rounded-lg p-6">
              <h1 className="text-lg font-bold mb-4" style={{color: '#340B37'}}>{content.title}</h1>
              <p className="text-sm leading-relaxed" style={{color: '#340B37'}}>{content.content}</p>
            </div>
          </div>
        );
      
      case 'schedule':
        return (
          <div className="p-6">
            <div className="flex space-x-6">
              {/* Publish Date Field */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                  Publish Date
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{color: '#545D6B'}} />
                  <input
                    type="text"
                    placeholder="dd----yyyy"
                    className="w-full pl-10 pr-4 py-3 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{backgroundColor: '#FFFFFF', color: '#545D6B'}}
                  />
                </div>
              </div>

              {/* Publish Time Field */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                  Publish Time
                </label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{color: '#545D6B'}} />
                  <input
                    type="text"
                    placeholder="--:--"
                    className="w-full pl-10 pr-4 py-3 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{backgroundColor: '#FFFFFF', color: '#545D6B'}}
                  />
                </div>
              </div>
            </div>
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
          <button className="px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}>
            <HandThumbUpIcon className="h-3 w-3" style={{color: '#340B37'}} />
            <span>Approve</span>
          </button>
          <button className="px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}>
            <HandThumbDownIcon className="h-3 w-3" style={{color: '#340B37'}} />
            <span>Regenerate</span>
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className="px-3 py-2 rounded text-sm hover:opacity-90 transition-opacity flex items-center space-x-1" 
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
            className="px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" 
            style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}
          >
            <ChevronLeftIcon className="h-3 w-3" style={{color: '#340B37'}} />
            <span>Previous</span>
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
            className="px-3 py-2 rounded text-sm hover:opacity-90 transition-opacity flex items-center space-x-1" 
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
            className="px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" 
            style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}
          >
            <ChevronLeftIcon className="h-3 w-3" style={{color: '#340B37'}} />
            <span>Previous</span>
          </button>
          <div className="flex space-x-3">
            <button className="px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}>
              <ClockIcon className="h-3 w-3" style={{color: '#340B37'}} />
              <span>Schedule Post</span>
            </button>
            <button 
              onClick={onClose}
              className="px-3 py-2 rounded text-sm hover:opacity-90 transition-opacity flex items-center space-x-1" 
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
      <div className="rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden" style={{backgroundColor: '#F7F1E9'}}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{backgroundColor: '#F7F1E9'}}>
              <PencilIcon className="h-6 w-6" style={{color: '#340B37'}} />
            </div>
            <h2 className="text-xl font-semibold" style={{color: '#340B37'}}>Content Editor</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-medium" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex w-full border-b border-gray-border">
          <button 
            onClick={() => setActiveTab('content')}
            className={`flex-1 px-16 py-2 border-b-2 font-medium text-lg ${
              activeTab === 'content' 
                ? 'border-b-2' 
                : 'border-transparent'
            }`} 
            style={{
              borderColor: activeTab === 'content' ? '#6E2168' : 'transparent',
              backgroundColor: activeTab === 'content' ? '#6E2168' : '#F8F9F9',
              color: activeTab === 'content' ? '#FFFFFF' : '#545D6B'
            }}
          >
            Content
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`flex-1 px-16 py-2 border-b-2 font-medium text-lg ${
              activeTab === 'preview' 
                ? 'border-b-2' 
                : 'border-transparent'
            }`} 
            style={{
              borderColor: activeTab === 'preview' ? '#6E2168' : 'transparent',
              backgroundColor: activeTab === 'preview' ? '#6E2168' : '#F8F9F9',
              color: activeTab === 'preview' ? '#FFFFFF' : '#545D6B'
            }}
          >
            Preview
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 px-16 py-2 border-b-2 font-medium text-lg ${
              activeTab === 'schedule' 
                ? 'border-b-2' 
                : 'border-transparent'
            }`} 
            style={{
              borderColor: activeTab === 'schedule' ? '#6E2168' : 'transparent',
              backgroundColor: activeTab === 'schedule' ? '#6E2168' : '#F8F9F9',
              color: activeTab === 'schedule' ? '#FFFFFF' : '#545D6B'
            }}
          >
            Schedule
          </button>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {renderContent()}
        </div>

        {/* Action Buttons */}
        {renderActionButtons()}
      </div>
    </div>
  );
} 