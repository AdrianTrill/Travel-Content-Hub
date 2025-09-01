'use client';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { quickStats } from '../data/mockData';
import { MagnifyingGlassIcon, FunnelIcon, EyeIcon, PencilIcon, ArrowDownTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
import AnimatedContainer from '../dashboard/components/AnimatedContainer';
import AnimatedCounter from '../dashboard/components/AnimatedCounter';

interface PublishedItem {
  id: string;
  type: string;
  status: string;
  title: string;
  content: string;
  tags: string[];
  location?: string | null;
  date: string;
  time: string;
  statusColor?: string;
  statusBg?: string;
  views: number;
  shares: number;
  engagement_rate: number;
  growth_rate: number;
  typeIcon?: 'pencil' | 'camera';
}

export default function ContentHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedTheme, setSelectedTheme] = useState('All Themes');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [items, setItems] = useState<PublishedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewModal, setViewModal] = useState<{ open: boolean; item: PublishedItem | null }>({ open: false, item: null });
  const [editModal, setEditModal] = useState<{ open: boolean; item: PublishedItem | null }>({ open: false, item: null });
  const [shareModal, setShareModal] = useState<{ open: boolean; item: PublishedItem | null }>({ open: false, item: null });

  useEffect(() => {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:8000/api/v1';
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${apiUrl}/published`);
        if (!res.ok) {
          throw new Error('Failed to fetch content history');
        }
        const data = await res.json();
        const mapped: PublishedItem[] = (data?.items || []).map((i: any, idx: number) => ({
          id: i.id,
          type: i.type,
          status: i.status || 'Published',
          title: i.title,
          content: i.content || '',
          tags: i.tags || [],
          location: i.location || i.destination || '—',
          date: i.date,
          time: i.time,
          statusColor: i.status === 'Published' ? 'text-white' : 'text-black',
          statusBg: i.status === 'Published' ? '#0F612D' : '#FFC938',
          views: i.views || 0,
          shares: i.shares || 0,
          engagement_rate: i.engagement_rate || 0.0,
          growth_rate: i.growth_rate || 0.0
        }));
        setItems(mapped);
        

      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Simple filtering by search text
  const filtered = items.filter(item => {
    const matchesSearch = searchQuery ? (item.title.toLowerCase().includes(searchQuery.toLowerCase())) : true;
    const matchesType = selectedType === 'All Types' ? true : item.type === selectedType;
    const matchesStatus = selectedStatus === 'All Status' ? true : item.status === selectedStatus;
    const matchesLocation = selectedLocation === 'All Locations' ? true : (item.location || '').includes(selectedLocation);
    const matchesTheme = selectedTheme === 'All Themes' ? true : item.tags.includes(selectedTheme);
    return matchesSearch && matchesType && matchesStatus && matchesLocation && matchesTheme;
  });

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:8000/api/v1';
      const res = await fetch(`${apiUrl}/published/${itemId}`, { method: 'DELETE' });
      
      if (!res.ok) {
        throw new Error('Failed to delete content');
      }
      
      // Remove from local state
      setItems(prev => prev.filter(item => item.id !== itemId));
      alert('Content deleted successfully');
    } catch (e) {
      console.error('Failed to delete content:', e);
      alert('Failed to delete content');
    }
  };

  const handleView = async (itemId: string) => {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:8000/api/v1';
      const res = await fetch(`${apiUrl}/published/${itemId}/view`, { method: 'POST' });
      
      if (res.ok) {
        // Update local state immediately
        setItems(prev => prev.map(item => 
          item.id === itemId 
            ? { ...item, views: item.views + 1 }
            : item
        ));
      }
    } catch (e) {
      console.error('Failed to track view:', e);
    }
  };

  ;
  return (
    <div className="min-h-screen bg-[#F7F1E9]">
      <Header />
      <div className="flex flex-col md:flex-row relative">
        <Sidebar quickStats={quickStats} currentPage="content-history" />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <AnimatedContainer direction="up" delay={0.1} trigger="immediate">
          <h1 className="text-3xl font-extrabold mb-4" style={{color: '#340B37'}}>Content History</h1>
          </AnimatedContainer>

          {/* Filters & Search Section */}
          <AnimatedContainer direction="up" delay={0.2} trigger="immediate">
            <div className="bg-[#FBF8F4] border border-[#DAE1E9] rounded-xl p-4 md:p-6 mb-4 md:mb-6">
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
                      {/* Populate common locations from items */}
                      {Array.from(new Set(items.map(i => i.location).filter(Boolean) as (string | null | undefined)[])).map((loc, idx) => (
                        <option key={idx}>{loc}</option>
                      ))}
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
                    {Array.from(new Set(items.flatMap(i => i.tags))).map((theme, idx) => (
                      <option key={idx}>{theme}</option>
                    ))}
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
                      {Array.from(new Set(items.map(i => i.type))).map((t, idx) => (
                        <option key={idx}>{t}</option>
                      ))}
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
                  </select>
                  <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          </AnimatedContainer>

          {/* Content History List */}
          <div className="space-y-4">
            {loading && (
              <div className="text-sm text-gray-500">Loading...</div>
            )}
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="text-sm text-gray-500">No content yet. Publish from Content Generation.</div>
            )}
            {filtered.map((content, index) => (
              <AnimatedContainer key={content.id} direction="up" delay={0.3 + index * 0.1} trigger="immediate">
                <div className="bg-[#FBF8F4] border border-[#DAE1E9] rounded-xl p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                  {/* Left side - Content Type Label */}
                  <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 px-2 py-1 rounded-full border" style={{backgroundColor: '#F7F1E9', borderColor: '#DAE1E9'}}>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      <span className="text-sm font-medium" style={{color: '#340B37'}}>{content.type}</span>
                    </div>
                  </div>
                  
                  {/* Right side - Metadata */}
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm" style={{color: '#545D6B'}}>
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-3">
                  <h3 className="text-lg md:text-xl font-semibold" style={{color: '#340B37'}}>
                    {content.title}
                  </h3>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${content.statusColor || 'text-white'}`} style={{backgroundColor: content.statusBg || '#0F612D'}}>
                    {content.status}
                  </span>
                </div>

                  {/* Metrics Row - placeholders */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-20 mb-3">
                  <div className="flex items-center space-x-1">
                    <EyeIcon className="h-4 w-4" style={{color: '#6E2168'}} />
                    <div className="flex flex-col">
                        <span className="text-lg font-bold" style={{color: '#340B37'}}>
                          <AnimatedCounter value={content.views.toString()} duration={2} trigger="immediate" />
                        </span>
                      <span className="text-sm" style={{color: '#545D6B'}}>Views</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold" style={{color: '#340B37'}}>
                          <AnimatedCounter value={content.shares.toString()} duration={2} trigger="immediate" />
                        </span>
                      <span className="text-sm" style={{color: '#545D6B'}}>Shares</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.850.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.38-3.081 1.1-4.451.197-.403.526-.75.923-1.01.397-.26.854-.398 1.323-.398h.908c.889 0 1.713.518 1.972 1.368.141.55.22 1.113.22 1.676 0 .563-.079 1.126-.22 1.676z" />
                    </svg>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold" style={{color: '#0F612D'}}>
                          <AnimatedCounter value={`${content.engagement_rate}%`} duration={2} trigger="immediate" />
                        </span>
                      <span className="text-sm" style={{color: '#545D6B'}}>Engagement</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold" style={{color: '#0F612D'}}>
                          <AnimatedCounter value={`+${content.growth_rate}%`} duration={2} trigger="immediate" />
                        </span>
                      <span className="text-sm" style={{color: '#545D6B'}}>Growth</span>
                      </div>
                  </div>
                </div>

                {/* Tags and Action Buttons on same line */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
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
                                            <button 
                        onClick={async () => {
                          await handleView(content.id);
                          setViewModal({ open: true, item: content });
                        }}
                        className="px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" 
                        style={{backgroundColor: '#F7F1E9', borderColor: '#6E2168', color: '#6E2168'}}
                      >
                      <EyeIcon className="h-3 w-3" style={{color: '#6E2168'}} />
                      <span>View</span>
                    </button>
                      <button 
                        onClick={() => setEditModal({ open: true, item: content })}
                        className="px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" 
                        style={{backgroundColor: '#F7F1E9', borderColor: '#6E2168', color: '#6E2168'}}
                      >
                      <PencilIcon className="h-3 w-3" style={{color: '#6E2168'}} />
                      <span>Edit</span>
                    </button>
                      <button 
                        onClick={() => setShareModal({ open: true, item: content })}
                        className="px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" 
                        style={{backgroundColor: '#F7F1E9', borderColor: '#6E2168', color: '#6E2168'}}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <span>Share</span>
                    </button>
                    <button className="px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" style={{backgroundColor: '#F7F1E9', borderColor: '#6E2168', color: '#6E2168'}}>
                      <ArrowDownTrayIcon className="h-3 w-3" style={{color: '#6E2168'}} />
                      <span>Export</span>
                    </button>
                      <button 
                        onClick={() => handleDelete(content.id)}
                        className="px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" 
                        style={{backgroundColor: '#F7F1E9', borderColor: '#6E2168', color: '#6E2168'}}
                      >
                        <TrashIcon className="h-3 w-3" style={{color: '#6E2168'}} />
                        <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
              </AnimatedContainer>
            ))}
          </div>
        </main>
      </div>

      {/* View Modal */}
      {viewModal.open && viewModal.item && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[95vh] overflow-hidden" style={{backgroundColor: '#F7F1E9'}}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-border">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg" style={{backgroundColor: '#F7F1E9'}}>
                  <EyeIcon className="h-6 w-6" style={{color: '#340B37'}} />
                </div>
              <div>
                  <h2 className="text-xl font-semibold" style={{color: '#340B37'}}>{viewModal.item.title}</h2>
                  <p className="text-sm mt-1" style={{color: '#545D6B'}}>
                  Views: {items.find(item => item.id === viewModal.item!.id)?.views || viewModal.item.views}
                </p>
                </div>
              </div>
              <button
                onClick={() => setViewModal({ open: false, item: null })}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[400px] max-h-[60vh] overflow-y-auto">
              <div className="bg-white border border-gray-border rounded-lg p-6">
                <div className="space-y-4">
                  {/* Content Type and Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 px-2 py-1 rounded-full border" style={{backgroundColor: '#F7F1E9', borderColor: '#DAE1E9'}}>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="text-sm font-medium" style={{color: '#340B37'}}>{viewModal.item.type}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${viewModal.item.statusColor || 'text-white'}`} style={{backgroundColor: viewModal.item.statusBg || '#0F612D'}}>
                      {viewModal.item.status}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm" style={{color: '#545D6B'}}>
                    <div className="flex items-center space-x-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{viewModal.item.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{viewModal.item.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{viewModal.item.time}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {viewModal.item.tags && viewModal.item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {viewModal.item.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs rounded-full" style={{backgroundColor: '#FFB066', color: '#340B37'}}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Content */}
                  <div className="border-t border-gray-border pt-4">
                    <h3 className="text-lg font-semibold mb-3" style={{color: '#340B37'}}>Content</h3>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{color: '#545D6B'}}>{viewModal.item.content}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end px-6 pb-6 space-x-3">
              <button 
                onClick={() => setViewModal({ open: false, item: null })}
                className="px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1" 
                style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}
              >
                <span>Close</span>
              </button>
              <button 
                onClick={() => {
                  setViewModal({ open: false, item: null });
                  setEditModal({ open: true, item: viewModal.item });
                }}
                className="px-3 py-2 rounded text-sm hover:opacity-90 transition-opacity flex items-center space-x-1" 
                style={{backgroundColor: '#6E2168', color: '#FFFFFF'}}
              >
                <PencilIcon className="h-3 w-3" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.open && editModal.item && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[95vh] overflow-hidden" style={{backgroundColor: '#F7F1E9'}}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-border">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg" style={{backgroundColor: '#F7F1E9'}}>
                  <PencilIcon className="h-6 w-6" style={{color: '#340B37'}} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold" style={{color: '#340B37'}}>Edit Content</h2>
                  <p className="text-sm mt-1" style={{color: '#545D6B'}}>
                    {editModal.item.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditModal({ open: false, item: null })}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[400px] max-h-[60vh] overflow-y-auto">
              <div className="bg-white border border-gray-border rounded-lg p-6">
                <div className="space-y-6">
                  {/* Title Field */}
              <div>
                    <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                      Title
                    </label>
                <input
                  type="text"
                  value={editModal.item.title}
                  onChange={(e) => setEditModal(prev => ({ ...prev, item: prev.item ? { ...prev.item, title: e.target.value } : null }))}
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
                  value={editModal.item.content}
                  onChange={(e) => setEditModal(prev => ({ ...prev, item: prev.item ? { ...prev.item, content: e.target.value } : null }))}
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      style={{backgroundColor: '#FFFFFF', color: '#545D6B'}}
                    />
                  </div>

                  {/* Tags Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                      Tags
                    </label>
                    <input
                      type="text"
                      value={editModal.item.tags.join(', ')}
                      onChange={(e) => {
                        const input = e.target.value;
                        // Don't split immediately - let user type naturally
                        setEditModal(prev => ({ 
                          ...prev, 
                          item: prev.item ? { ...prev.item, tags: [input] } : null 
                        }));
                      }}
                      onBlur={(e) => {
                        const input = e.target.value;
                        // Only split on commas, not on spaces
                        const tags = input.split(',').filter(tag => tag.trim()).map(tag => tag.trim());
                        setEditModal(prev => ({ 
                          ...prev, 
                          item: prev.item ? { ...prev.item, tags } : null 
                        }));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget.value;
                          // Only split on commas, not on spaces
                          const tags = input.split(',').filter(tag => tag.trim()).map(tag => tag.trim());
                          setEditModal(prev => ({ 
                            ...prev, 
                            item: prev.item ? { ...prev.item, tags } : null 
                          }));
                          e.currentTarget.blur();
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      style={{backgroundColor: '#FFFFFF', color: '#545D6B'}}
                      placeholder="nature, culture, food, adventure"
                    />
                    {/* Show tags as visual feedback */}
                    {editModal.item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {editModal.item.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs rounded-full text-white" style={{backgroundColor: '#6E2168'}}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content Type and Status Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                        Content Type
                      </label>
                      <div className="relative">
                        <select
                          value={editModal.item.type}
                          onChange={(e) => setEditModal(prev => ({ 
                            ...prev, 
                            item: prev.item ? { ...prev.item, type: e.target.value } : null 
                          }))}
                          className="w-full px-4 py-3 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none pr-8"
                          style={{backgroundColor: '#F7F1E9', color: 'transparent'}}
                        >
                          <option value="Instagram Post">Instagram Post</option>
                          <option value="Facebook Post">Facebook Post</option>
                          <option value="Blog Post">Blog Post</option>
                        </select>
                        <div className="absolute inset-0 pointer-events-none flex items-center px-4">
                          <div className="flex items-center space-x-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span className="text-sm font-medium" style={{color: '#340B37'}}>{editModal.item.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                        Status
                      </label>
                      <div className="relative">
                        <select
                          value={editModal.item.status}
                          onChange={(e) => setEditModal(prev => ({ 
                            ...prev, 
                            item: prev.item ? { 
                              ...prev.item, 
                              status: e.target.value,
                              statusColor: e.target.value === 'Published' ? 'text-white' : 'text-black',
                              statusBg: e.target.value === 'Published' ? '#0F612D' : '#FFC938'
                            } : null 
                          }))}
                          className="w-full px-4 py-3 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none pr-8"
                          style={{backgroundColor: '#F7F1E9', color: 'transparent'}}
                        >
                          <option value="Published">Published</option>
                          <option value="Draft">Draft</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Archived">Archived</option>
                        </select>
                        <div className="absolute inset-0 pointer-events-none flex items-center px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${editModal.item.statusColor || 'text-white'}`} style={{backgroundColor: editModal.item.statusBg || '#0F612D'}}>
                            {editModal.item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Display */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: '#340B37'}}>
                      Metadata
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border" style={{backgroundColor: '#F8F9F9', borderColor: '#DAE1E9'}}>
                      <div className="flex items-center space-x-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm" style={{color: '#545D6B'}}>{editModal.item.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm" style={{color: '#545D6B'}}>{editModal.item.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm" style={{color: '#545D6B'}}>{editModal.item.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end px-6 pb-6 space-x-3">
                <button
                  onClick={() => setEditModal({ open: false, item: null })}
                className="px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1"
                style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}
                >
                <span>Cancel</span>
                </button>
                <button
                  onClick={async () => {
                    try {
                      const apiUrl = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:8000/api/v1';
                      const res = await fetch(`${apiUrl}/published/${editModal.item!.id}`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          title: editModal.item!.title,
                          content: editModal.item!.content,
                          type: editModal.item!.type,
                          tags: editModal.item!.tags,
                          status: editModal.item!.status,
                          destination: editModal.item!.location,
                        }),
                      });

                      if (!res.ok) {
                        throw new Error('Failed to update content');
                      }

                      // Update local state with the new data
                      setItems(prev => prev.map(item => 
                        item.id === editModal.item!.id 
                          ? { 
                              ...item, 
                              title: editModal.item!.title,
                              content: editModal.item!.content,
                              type: editModal.item!.type,
                              tags: editModal.item!.tags,
                              status: editModal.item!.status,
                              statusColor: editModal.item!.status === 'Published' ? 'text-white' : 'text-black',
                              statusBg: editModal.item!.status === 'Published' ? '#0F612D' : '#FFC938',
                            }
                          : item
                      ));

                      setEditModal({ open: false, item: null });
                    } catch (e) {
                      console.error('Failed to update content:', e);
                      alert('Failed to update content. Please try again.');
                    }
                  }}
                className="px-3 py-2 rounded text-sm hover:opacity-90 transition-opacity flex items-center space-x-1"
                style={{backgroundColor: '#6E2168', color: '#FFFFFF'}}
              >
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModal.open && shareModal.item && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[95vh] overflow-hidden" style={{backgroundColor: '#F7F1E9'}}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-border">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg" style={{backgroundColor: '#F7F1E9'}}>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#340B37'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold" style={{color: '#340B37'}}>Share Content</h2>
                  <p className="text-sm mt-1" style={{color: '#545D6B'}}>
                    {shareModal.item.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShareModal({ open: false, item: null })}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[300px] max-h-[60vh] overflow-y-auto">
              <div className="bg-white border border-gray-border rounded-lg p-6">
                <div className="space-y-6">
                  {/* Content Preview */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{color: '#340B37'}}>
                      Content Preview
                    </label>
                    <div className="p-4 rounded-lg border" style={{backgroundColor: '#F8F9F9', borderColor: '#DAE1E9'}}>
                      <h3 className="text-lg font-semibold mb-2" style={{color: '#340B37'}}>{shareModal.item.title}</h3>
                      <p className="text-sm leading-relaxed" style={{color: '#545D6B'}}>
                        {shareModal.item.content.length > 150 
                          ? `${shareModal.item.content.substring(0, 150)}...` 
                          : shareModal.item.content
                        }
                      </p>
                      {shareModal.item.tags && shareModal.item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {shareModal.item.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs rounded-full" style={{backgroundColor: '#FFB066', color: '#340B37'}}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Share Options */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{color: '#340B37'}}>
                      Share on Social Media
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={async () => {
                    try {
                      const apiUrl = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:8000/api/v1';
                      await fetch(`${apiUrl}/published/${shareModal.item!.id}/share`, { method: 'POST' });
                      
                      // Update local state
                      setItems(prev => prev.map(item => 
                        item.id === shareModal.item!.id 
                          ? { ...item, shares: item.shares + 1 }
                          : item
                      ));
                      
                      // Copy to clipboard
                      await navigator.clipboard.writeText(shareModal.item!.title);
                      alert('Content shared and copied to clipboard!');
                      setShareModal({ open: false, item: null });
                    } catch (e) {
                      console.error('Failed to track share:', e);
                      alert('Failed to share content');
                    }
                  }}
                        className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-3 transition-colors"
                        style={{backgroundColor: '#FFFFFF', borderColor: '#DAE1E9'}}
                >
                  <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806.26-1.564.4-2.38.4-.617 0-1.217-.238-1.738-.619v.062c0 2.908 2.164 5.479 5.836 6.029-.598.163-1.23.248-1.892.248-.454 0-.9-.043-1.335-.124.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                        <span className="text-sm font-medium" style={{color: '#340B37'}}>Twitter</span>
                </button>
                <button
                  onClick={async () => {
                    try {
                      const apiUrl = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:8000/api/v1';
                      await fetch(`${apiUrl}/published/${shareModal.item!.id}/share`, { method: 'POST' });
                      
                      // Update local state
                      setItems(prev => prev.map(item => 
                        item.id === shareModal.item!.id 
                          ? { ...item, shares: item.shares + 1 }
                          : item
                      ));
                      
                      // Copy to clipboard
                      await navigator.clipboard.writeText(shareModal.item!.title);
                      alert('Content shared and copied to clipboard!');
                      setShareModal({ open: false, item: null });
                    } catch (e) {
                      console.error('Failed to track share:', e);
                      alert('Failed to share content');
                    }
                  }}
                        className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-3 transition-colors"
                        style={{backgroundColor: '#FFFFFF', borderColor: '#DAE1E9'}}
                >
                  <svg className="h-8 w-8 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                        <span className="text-sm font-medium" style={{color: '#340B37'}}>Facebook</span>
                </button>
                <button
                  onClick={async () => {
                    try {
                      const apiUrl = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:8000/api/v1';
                      await fetch(`${apiUrl}/published/${shareModal.item!.id}/share`, { method: 'POST' });
                      
                      // Update local state
                      setItems(prev => prev.map(item => 
                        item.id === shareModal.item!.id 
                          ? { ...item, shares: item.shares + 1 }
                          : item
                      ));
                      
                      // Copy to clipboard
                      await navigator.clipboard.writeText(shareModal.item!.title);
                      alert('Content shared and copied to clipboard!');
                      setShareModal({ open: false, item: null });
                    } catch (e) {
                      console.error('Failed to track share:', e);
                      alert('Failed to share content');
                    }
                  }}
                        className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-3 transition-colors"
                        style={{backgroundColor: '#FFFFFF', borderColor: '#DAE1E9'}}
                >
                  <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                        <span className="text-sm font-medium" style={{color: '#340B37'}}>LinkedIn</span>
                </button>
                <button
                  onClick={async () => {
                    try {
                      const apiUrl = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:8000/api/v1';
                      await fetch(`${apiUrl}/published/${shareModal.item!.id}/share`, { method: 'POST' });
                      
                      // Update local state
                      setItems(prev => prev.map(item => 
                        item.id === shareModal.item!.id 
                          ? { ...item, shares: item.shares + 1 }
                          : item
                      ));
                      
                      // Copy to clipboard
                      await navigator.clipboard.writeText(shareModal.item!.title);
                      alert('Content shared and copied to clipboard!');
                      setShareModal({ open: false, item: null });
                    } catch (e) {
                      console.error('Failed to track share:', e);
                      alert('Failed to share content');
                    }
                  }}
                        className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-3 transition-colors"
                        style={{backgroundColor: '#FFFFFF', borderColor: '#DAE1E9'}}
                >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#545D6B'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                        <span className="text-sm font-medium" style={{color: '#340B37'}}>Copy Link</span>
                </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end px-6 pb-6 space-x-3">
              <button
                onClick={() => setShareModal({ open: false, item: null })}
                className="px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1"
                style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 