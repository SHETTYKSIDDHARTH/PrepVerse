import React, { useState } from 'react';
import FindBuddiesComponent from './FindBuddiesComponent';
import BuddyRequestsComponent from './BuddyRequestsComponent';

const StudyBuddyDashboard = () => {
  const [activeTab, setActiveTab] = useState('requests');

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Study Buddy System</h1>
      
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'requests'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('requests')}
        >
          Requests & Status
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'find'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('find')}
        >
          Find Buddies
        </button>
      </div>
      
      {activeTab === 'requests' ? (
        <BuddyRequestsComponent />
      ) : (
        <FindBuddiesComponent />
      )}
    </div>
  );
};

export default StudyBuddyDashboard;