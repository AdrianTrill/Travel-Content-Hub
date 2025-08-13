'use client';
import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { quickStats } from '../data/mockData';
import { MagnifyingGlassIcon, FunnelIcon, EyeIcon, PencilIcon, ArrowDownTrayIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

export default function ContentHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedTheme, setSelectedTheme] = useState('All Themes');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const contentHistory = [
    {
      id: 1,
      type: 'Blog Post',
      typeIcon: 'pencil',
      status: 'Published',
      statusColor: 'text-white',
      statusBg: '#0F612D',
      title: 'Hidden Gems: 5 Secret Spots in Paris Only Locals Know',
      views: '12,400',
      shares: '89',
      engagement: '7.8%',
      growth: '+12%',
      tags: ['Hidden Gems', 'Local Culture', 'Photography'],
      location: 'Paris, France',
      date: '4/15/2024',
      time: '4:32'
    },
    {
      id: 2,
      type: 'Instagram Post',
      typeIcon: 'camera',
      status: 'Scheduled',
      statusColor: 'text-black',
      statusBg: '#FFC938',
      title: 'Paris Magic in 60 Seconds ✨',
      views: '45,200',
      shares: '234',
      engagement: '12.3%',
      growth: '+12%',
      tags: ['Visual', 'Lifestyle', 'Quick Tips'],
      location: 'Paris, France',
      date: '4/14/2024',
      time: '0:30'
    },
    {
      id: 3,
      type: 'Instagram Post',
      typeIcon: 'camera',
      status: 'Draft',
      statusColor: 'text-gray-800',
      statusBg: '#F8F9F9',
      title: 'Paris Magic in 60 Seconds ✨',
      views: '45,200',
      shares: '234',
      engagement: '12.3%',
      growth: '+12%',
      tags: ['Visual', 'Lifestyle', 'Quick Tips'],
      location: 'Paris, France',
      date: '4/14/2024',
      time: '0:30'
    }
  ];

  return (
    <div className="h-fit" style={{background: 'linear-gradient(180deg, #F7F1E9 0%, #EDE3E7 100%)'}}>
      <Header />
      <div className="flex">
        <Sidebar quickStats={quickStats} currentPage="content-history" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-extrabold mb-4" style={{color: '#340B37'}}>Content History</h1>

          {/* Filters & Search Section */}
          <div className="card p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <FunnelIcon className="h-5 w-5" style={{color: '#6E2168'}} />
              <h2 className="text-lg font-semibold" style={{color: '#340B37'}}>Filters & Search</h2>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{color: '#545D6B'}} />
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{backgroundColor: '#FFFFFF', color: '#545D6B'}}
                  />
                </div>
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-3 py-3 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none pr-8"
                    style={{backgroundColor: '#FFFFFF', color: '#545D6B'}}
                  >
                    <option>All Locations</option>
                    <option>Paris, France</option>
                    <option>Tokyo, Japan</option>
                    <option>New York, USA</option>
                  </select>
                  <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <div className="relative">
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    className="px-3 py-3 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none pr-8"
                    style={{backgroundColor: '#FFFFFF', color: '#545D6B'}}
                  >
                    <option>All Themes</option>
                    <option>Culture</option>
                    <option>Adventure</option>
                    <option>Food</option>
                  </select>
                  <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-3 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none pr-8"
                    style={{backgroundColor: '#FFFFFF', color: '#545D6B'}}
                  >
                    <option>All Types</option>
                    <option>Blog Post</option>
                    <option>Instagram Post</option>
                    <option>Facebook Post</option>
                  </select>
                  <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-3 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none pr-8"
                    style={{backgroundColor: '#FFFFFF', color: '#545D6B'}}
                  >
                    <option>All Status</option>
                    <option>Published</option>
                    <option>Scheduled</option>
                    <option>Draft</option>
                  </select>
                  <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Content History List */}
          <div className="space-y-4">
            {contentHistory.map((content) => (
              <div key={content.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  {/* Left side - Content Type Label */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 px-2 py-1 rounded-full" style={{backgroundColor: '#F7F1E9'}}>
                      {content.typeIcon === 'pencil' ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      ) : content.typeIcon === 'camera' ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ) : null}
                      <span className="text-sm font-medium" style={{color: '#340B37'}}>{content.type}</span>
                    </div>
                  </div>
                  
                  {/* Right side - Metadata */}
                  <div className="flex items-center space-x-4 text-sm" style={{color: '#545D6B'}}>
                    <div className="flex items-center space-x-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{content.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{content.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{content.time}</span>
                    </div>
                  </div>
                </div>

                {/* Title and Status Row */}
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-xl font-semibold" style={{color: '#340B37'}}>
                    {content.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${content.statusColor}`} style={{backgroundColor: content.statusBg}}>
                    {content.status}
                  </span>
                </div>

                {/* Metrics Row - All on one line */}
                <div className="flex mb-3" style={{gap: '148px'}}>
                  <div className="flex items-center space-x-1">
                    <EyeIcon className="h-4 w-4" style={{color: '#6E2168'}} />
                    <div className="flex flex-col">
                      <span className="text-lg font-bold" style={{color: '#340B37'}}>{content.views}</span>
                      <span className="text-sm" style={{color: '#545D6B'}}>Views</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold" style={{color: '#340B37'}}>{content.shares}</span>
                      <span className="text-sm" style={{color: '#545D6B'}}>Shares</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.38-3.081 1.1-4.451.197-.403.526-.75.923-1.01.397-.26.854-.398 1.323-.398h.908c.889 0 1.713.518 1.972 1.368.141.55.22 1.113.22 1.676 0 .563-.079 1.126-.22 1.676z" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold" style={{color: content.engagement === '7.8%' ? '#CD8F23' : '#0F612D'}}>{content.engagement}</span>
                      <span className="text-sm" style={{color: '#545D6B'}}>Engagement</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold" style={{color: '#0F612D'}}>{content.growth}</span>
                      <span className="text-sm" style={{color: '#545D6B'}}>Growth</span>
                    </div>
                  </div>
                </div>

                {/* Tags and Action Buttons on same line */}
                <div className="flex items-center justify-between">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {content.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs rounded-full" style={{backgroundColor: '#FFB066', color: '#340B37'}}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button className="px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" style={{backgroundColor: '#F7F1E9', borderColor: '#6E2168', color: '#6E2168'}}>
                      <EyeIcon className="h-3 w-3" style={{color: '#6E2168'}} />
                      <span>View</span>
                    </button>
                    <button className="px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" style={{backgroundColor: '#F7F1E9', borderColor: '#6E2168', color: '#6E2168'}}>
                      <PencilIcon className="h-3 w-3" style={{color: '#6E2168'}} />
                      <span>Edit</span>
                    </button>
                    <button className="px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" style={{backgroundColor: '#F7F1E9', borderColor: '#6E2168', color: '#6E2168'}}>
                      <ArrowDownTrayIcon className="h-3 w-3" style={{color: '#6E2168'}} />
                      <span>Export</span>
                    </button>
                    <button className="px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" style={{backgroundColor: '#F7F1E9', borderColor: '#6E2168', color: '#6E2168'}}>
                      <EllipsisHorizontalIcon className="h-3 w-3" style={{color: '#6E2168'}} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
} 