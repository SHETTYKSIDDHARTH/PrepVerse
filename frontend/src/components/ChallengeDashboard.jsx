import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChallengeList from './ChallengeList';
import ChallengeForm from './ChallengeForm';
// import ChallengeDetail from './ChallengeDetail';

const ChallengeDashboard = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentBuddy, setCurrentBuddy] = useState(null);
  const [refreshData, setRefreshData] = useState(false);

  // Fetch current buddy
  useEffect(() => {
    const fetchCurrentBuddy = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/student/current-buddy', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setCurrentBuddy(response.data.buddy);
        }
      } catch (error) {
        console.error('Error fetching current buddy:', error);
      }
    };

    fetchCurrentBuddy();
  }, []);

  // Fetch challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:8000/challenge', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setChallenges(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching challenges:', error);
        setError('Failed to load challenges. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [refreshData]);

  // Filter challenges based on active tab
  const filteredChallenges = challenges.filter(challenge => {
    if (activeTab === 'all') return true;
    if (activeTab === 'created') return challenge.createdBy._id === localStorage.getItem('userId');
    if (activeTab === 'assigned') return challenge.assignedTo._id === localStorage.getItem('userId');
    if (activeTab === 'pending') return challenge.status === 'pending';
    if (activeTab === 'completed') return challenge.status === 'completed';
    return true;
  });

  const handleRefresh = () => {
    setRefreshData(!refreshData);
  };

  const handleSelectChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setShowCreateForm(false);
  };

  const handleBackToList = () => {
    setSelectedChallenge(null);
    setShowCreateForm(false);
  };

  const handleCreateNew = () => {
    setShowCreateForm(true);
    setSelectedChallenge(null);
  };

  const handleChallengeCreated = () => {
    setShowCreateForm(false);
    handleRefresh();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Challenge Dashboard</h1>
        {currentBuddy && !showCreateForm && !selectedChallenge && (
          <button 
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Create New Challenge
          </button>
        )}
      </div>

      {!currentBuddy && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p>You need a study buddy to create or receive challenges. Visit the Study Buddy dashboard to find a buddy.</p>
        </div>
      )}

      {showCreateForm ? (
        <ChallengeForm 
          onBack={handleBackToList} 
          onChallengeCreated={handleChallengeCreated}
          buddy={currentBuddy}
        />
      ) : selectedChallenge ? (
        <ChallengeDetail 
          challenge={selectedChallenge} 
          onBack={handleBackToList}
          onChallengeUpdated={handleRefresh}
        />
      ) : (
        <>
          <div className="flex border-b mb-4 overflow-x-auto">
            <button
              className={`px-4 py-2 whitespace-nowrap ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('all')}
            >
              All Challenges
            </button>
            <button
              className={`px-4 py-2 whitespace-nowrap ${activeTab === 'created' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('created')}
            >
              Created by Me
            </button>
            <button
              className={`px-4 py-2 whitespace-nowrap ${activeTab === 'assigned' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('assigned')}
            >
              Assigned to Me
            </button>
            <button
              className={`px-4 py-2 whitespace-nowrap ${activeTab === 'pending' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </button>
            <button
              className={`px-4 py-2 whitespace-nowrap ${activeTab === 'completed' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <p>{error}</p>
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">No challenges found.</p>
              {currentBuddy && (
                <button
                  onClick={handleCreateNew}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                  Create Your First Challenge
                </button>
              )}
            </div>
          ) : (
            <ChallengeList 
              challenges={filteredChallenges} 
              onSelectChallenge={handleSelectChallenge} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default ChallengeDashboard;