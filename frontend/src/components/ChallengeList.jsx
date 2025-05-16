import React from 'react';
import { format, formatDistanceToNow, isPast } from 'date-fns';

const ChallengeList = ({ challenges, onSelectChallenge }) => {
  const getCategoryBadgeColor = (category) => {
    const colors = {
      programming: 'bg-blue-100 text-blue-800',
      dsa: 'bg-purple-100 text-purple-800',
      dbms: 'bg-green-100 text-green-800',
      theory: 'bg-yellow-100 text-yellow-800',
      project: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  const getStatusBadgeColor = (status, deadline) => {
    if (status === 'completed') return 'bg-green-100 text-green-800';
    if (status === 'failed') return 'bg-red-100 text-red-800';
    return isPast(new Date(deadline)) ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (status, deadline) => {
    if (status === 'completed') return 'Completed';
    if (status === 'failed') return 'Failed';
    return isPast(new Date(deadline)) ? 'Expired' : 'Pending';
  };

  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-1 gap-4">
        {challenges.map((challenge) => (
          <div 
            key={challenge._id} 
            className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer" 
            onClick={() => onSelectChallenge(challenge)}
          >
            <div className="p-5">
              <div className="flex flex-wrap items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                <div className="flex space-x-2 mt-1 sm:mt-0">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryBadgeColor(challenge.category)}`}>
                    {challenge.category.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadgeColor(challenge.status, challenge.deadline)}`}>
                    {getStatusText(challenge.status, challenge.deadline)}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 line-clamp-2 mb-3">{challenge.description}</p>
              
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>
                    Due {format(new Date(challenge.deadline), 'MMM d, yyyy')} ({formatDistanceToNow(new Date(challenge.deadline), { addSuffix: true })})
                  </span>
                </div>
                
                <div className="flex items-center text-sm">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className="text-gray-700">
                      {challenge.createdBy._id === localStorage.getItem('userId') 
                        ? <span>Assigned to <span className="font-medium">{challenge.assignedTo?.fullname}</span></span>
                        : <span>From <span className="font-medium">{challenge.createdBy?.fullname}</span></span>
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span className="text-gray-700">{challenge.points} points</span>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengeList;