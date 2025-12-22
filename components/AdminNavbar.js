'use client';

import { useState } from 'react';
import { Search, Phone, Bell } from 'lucide-react';

const AdminNavbar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Search query:', searchQuery);
      // Add your search logic here
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="bg-white shadow-sm border-b w-full  border-gray-200 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="Ashok Gold Logo" 
              className="h-10 w-10 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="text-xl sm:text-2xl font-bold text-yellow-500">
              Ashok Gold
            </span>
          </div>

          {/* Search Bar */}
          {/* <div className="flex-1 max-w-xl mx-4 sm:mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search..."
                className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white text-sm transition-all"
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div> */}

          {/* Right Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Phone Icon */}
            {/* <button 
              className="p-2 text-gray-600 hover:text-yellow-500 transition-colors rounded-full hover:bg-gray-50"
              aria-label="Phone"
            >
              <Phone className="w-5 h-5" />
            </button> */}

            {/* Notification Bell */}
            <button 
              className="p-2 text-gray-600 hover:text-yellow-500 transition-colors rounded-full hover:bg-gray-50"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-2 cursor-pointer group rounded-lg p-2 py-1 shadow-lg shadow-amber-500/20 border border-amber-400/80 ">
              <img
                src="/avatar.png"
                alt="Payal Sharma"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-transparent group-hover:ring-yellow-400 transition-all"
              />
              <span className="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-yellow-600 transition-colors">
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;