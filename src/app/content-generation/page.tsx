import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { quickStats } from '../data/mockData';

export default function ContentGeneration() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar quickStats={quickStats} currentPage="content-generation" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-extrabold text-primary-dark mb-6">Content Generation</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Parameters Section */}
            <div className="card p-6">
              <div className="flex items-center space-x-2 mb-6">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-dark">Content Parameters</h2>
              </div>

              <div className="space-y-5">
                {/* Destination Input */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-primary mb-2">
                    <svg className="h-4 w-4 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Destination</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-border rounded-lg text-gray-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" style={{backgroundColor: '#FFFFFF'}}>
                    <option>Choose destination</option>
                  </select>
                </div>

                {/* Travel Dates Input */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-primary mb-2">
                    <svg className="h-4 w-4 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Travel Dates</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="dd-----yyyy"
                      className="flex-1 px-3 py-2 border border-gray-border rounded-lg text-gray-dark bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="text"
                      placeholder="dd-----yyyy"
                      className="flex-1 px-3 py-2 border border-gray-border rounded-lg text-gray-dark bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Content Type Input */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-primary mb-2">
                    <svg className="h-4 w-4 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Content Type</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-border rounded-lg text-gray-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" style={{backgroundColor: '#FFFFFF'}}>
                    <option>Select content type</option>
                  </select>
                </div>

                {/* Generate Content Button */}
                <button className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span>Generate Content</span>
                </button>
              </div>
            </div>

            {/* AI Generated Suggestions Section */}
            <div className="card p-6">
              <div className="flex items-center space-x-2 mb-6">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-dark">AI Generated Suggestions</h2>
              </div>

              <div className="space-y-4">
                {/* Blog Post Suggestion */}
                <div className="border border-gray-border rounded-lg p-4" style={{backgroundColor: '#F8F9F9'}}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 px-2 py-1 rounded" style={{backgroundColor: '#F7F1E9'}}>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                        <span className="text-sm font-medium" style={{color: '#6E2168'}}>Blog Post</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-dark">
                      <span className="flex items-center space-x-1">
                        <svg className="h-4 w-4 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>4 min</span>
                      </span>
                      <span className="flex items-center space-x-1 text-success">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>High</span>
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-primary-dark mb-3">
                    Hidden Gems: 5 Secret Spots in Paris Only Locals Know
                  </h3>
                  <p className="text-sm text-gray-dark mb-4">
                    Discover the enchanting side streets and hidden courtyards that most tourists never see. From secret gardens to underground wine bars...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs rounded-full" style={{backgroundColor: '#FFB066', color: 'black'}}>Hidden Gems</span>
                      <span className="px-2 py-1 text-xs rounded-full" style={{backgroundColor: '#FFB066', color: 'black'}}>Local Culture</span>
                      <span className="px-2 py-1 text-xs rounded-full" style={{backgroundColor: '#FFB066', color: 'black'}}>Photography</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1 flex items-center space-x-1" style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}>
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#340B37'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1 flex items-center space-x-1" style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}>
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

                {/* Instagram Post Suggestion */}
                <div className="border border-gray-border rounded-lg p-4" style={{backgroundColor: '#F8F9F9'}}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 px-2 py-1 rounded" style={{backgroundColor: '#F7F1E9'}}>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium" style={{color: '#6E2168'}}>Instagram Post</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-dark">
                      <span className="flex items-center space-x-1">
                        <svg className="h-4 w-4 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>30 sec</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#CD8F23'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span style={{color: '#CD8F23'}}>Medium</span>
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-primary-dark mb-3">
                    Paris Magic in 60 Seconds ✨
                  </h3>
                  <p className="text-sm text-gray-dark mb-4">
                    Early morning light hitting the Seine, empty cobblestone streets, and the city waking up. This is the Paris dreams are made of! FR #ParisVibes #TravelMagic
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs rounded-full" style={{backgroundColor: '#FFB066', color: 'black'}}>Visual</span>
                      <span className="px-2 py-1 text-xs rounded-full" style={{backgroundColor: '#FFB066', color: 'black'}}>Lifestyle</span>
                      <span className="px-2 py-1 text-xs rounded-full" style={{backgroundColor: '#FFB066', color: 'black'}}>Quick Tips</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1 flex items-center space-x-1" style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}>
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#340B37'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1 flex items-center space-x-1" style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}>
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

                {/* Facebook Post Suggestion */}
                <div className="border border-gray-border rounded-lg p-4" style={{backgroundColor: '#F8F9F9'}}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 px-2 py-1 rounded" style={{backgroundColor: '#F7F1E9'}}>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" style={{color: '#6E2168'}}>
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.956v3.47h3.47l-.47 3.47h-3v8.385c5.737-.9 10.125-5.864 10.125-11.854z" />
                        </svg>
                        <span className="text-sm font-medium" style={{color: '#6E2168'}}>Facebook Post</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-dark">
                      <span className="flex items-center space-x-1">
                        <svg className="h-4 w-4 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>2 min</span>
                      </span>
                      <span className="flex items-center space-x-1 text-success">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>High</span>
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-primary-dark mb-3">
                    Why Paris Should Be Your Next Solo Travel Destination
                  </h3>
                  <p className="text-sm text-gray-dark mb-4">
                    Planning a solo adventure? Here's why Paris offers the perfect blend of safety, culture, and unforgettable experiences for independent travelers...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs rounded-full" style={{backgroundColor: '#FFB066', color: 'black'}}>Solo Travel</span>
                      <span className="px-2 py-1 text-xs rounded-full" style={{backgroundColor: '#FFB066', color: 'black'}}>Safety</span>
                      <span className="px-2 py-1 text-xs rounded-full" style={{backgroundColor: '#FFB066', color: 'black'}}>Culture</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1 flex items-center space-x-1" style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}>
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#340B37'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50 flex items-center space-x-1 flex items-center space-x-1" style={{backgroundColor: '#F7F1E9', borderColor: '#340B37', color: '#340B37'}}>
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
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 