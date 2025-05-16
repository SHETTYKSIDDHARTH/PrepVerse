import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BuddyRequestsComponent = () => {
  const [currentBuddy, setCurrentBuddy] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loadingBuddy, setLoadingBuddy] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const fetchCurrentBuddy = async () => {
    setLoadingBuddy(true);
    try {
      const response = await axios.get(
        'http://localhost:8000/student/current-buddy',
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        }
      );
      
      if (response.data.success) {
        setCurrentBuddy(response.data.buddy);
      }
    } catch (err) {
      if (err.response && err.response.status !== 404) {
        setError('Error fetching buddy: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoadingBuddy(false);
    }
  };

  const fetchIncomingRequests = async () => {
    setLoadingRequests(true);
    try {
      const response = await axios.get(
        'http://localhost:8000/student/incoming-buddy-requests',
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        }
      );
      
      if (response.data.success) {
        setIncomingRequests(response.data.requests || []);
      } else {
        setIncomingRequests([]);
      }
    } catch (err) {
      setError('Error fetching requests: ' + (err.response?.data?.message || err.message));
      toast.error('Failed to load incoming requests');
    } finally {
      setLoadingRequests(false);
    }
  };

  const acceptRequest = async (requesterId) => {
    if (actionInProgress) return;
    
    setActionInProgress(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/student/accept-buddy-request',
        { requesterId },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Buddy request accepted!');
        fetchCurrentBuddy();
        fetchIncomingRequests();
      } else {
        toast.error(response.data.message || 'Failed to accept request');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept buddy request');
    } finally {
      setActionInProgress(false);
    }
  };

  const rejectRequest = async (requesterId) => {
    if (actionInProgress) return;
    
    setActionInProgress(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/student/reject-buddy-request',
        { requesterId },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Buddy request rejected');
        setIncomingRequests(incomingRequests.filter(req => req._id !== requesterId));
      } else {
        toast.error(response.data.message || 'Failed to reject request');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject buddy request');
    } finally {
      setActionInProgress(false);
    }
  };

  const removeBuddy = async () => {
    if (actionInProgress) return;
    
    if (!window.confirm('Are you sure you want to remove your study buddy?')) {
      return;
    }
    
    setActionInProgress(true);
    try {
      const response = await axios.delete(
       'http://localhost:8000/student/remove-buddy',
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Study buddy removed successfully');
        setCurrentBuddy(null);
      } else {
        toast.error(response.data.message || 'Failed to remove buddy');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove study buddy');
    } finally {
      setActionInProgress(false);
    }
  };

  useEffect(() => {
    fetchCurrentBuddy();
    fetchIncomingRequests();
  }, []);

  const daysWithBuddy = currentBuddy?.studyBuddyStartDate ? 
    Math.floor((new Date() - new Date(currentBuddy.studyBuddyStartDate)) / (1000 * 60 * 60 * 24)) : 0;

  const canRemoveBuddy = daysWithBuddy >= 30;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Buddy Requests & Status</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Your Study Buddy</h3>
        
        {loadingBuddy ? (
          <div className="text-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : currentBuddy ? (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-lg">{currentBuddy.fullname}</h4>
                <p className="text-gray-600">{currentBuddy.email}</p>
                <p className="text-sm text-gray-500 mt-1">USN: {currentBuddy.usn}</p>
                <div className="mt-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                    {currentBuddy.branch}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Semester {currentBuddy.sem}
                  </span>
                </div>
                <p className="mt-3 text-sm">
                  <span className="font-medium">Days as buddies:</span> {daysWithBuddy}
                </p>
              </div>
              
              <button
                className={`px-3 py-2 text-white rounded ${canRemoveBuddy 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gray-400 cursor-not-allowed'}`}
                onClick={removeBuddy}
                disabled={!canRemoveBuddy || actionInProgress}
                title={canRemoveBuddy ? 'Remove buddy' : 'Can only remove after 30 days'}
              >
                {actionInProgress ? 'Processing...' : 'Remove Buddy'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="text-gray-500">You don't have a study buddy yet</p>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Incoming Buddy Requests</h3>
        
        {loadingRequests ? (
          <div className="text-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : incomingRequests.length === 0 ? (
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="text-gray-500">No pending buddy requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incomingRequests.map(request => (
              <div key={request._id} className="border p-4 rounded-lg bg-gray-50">
                <h4 className="font-medium">{request.fullname}</h4>
                <p className="text-sm text-gray-600">{request.email}</p>
                <div className="flex gap-2 text-sm text-gray-500 mt-1">
                  <span>USN: {request.usn}</span>
                  <span>|</span>
                  <span>{request.branch}</span>
                  <span>|</span>
                  <span>Semester {request.sem}</span>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <button
                    className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                    onClick={() => acceptRequest(request._id)}
                    disabled={actionInProgress || currentBuddy !== null}
                  >
                    Accept
                  </button>
                  <button
                    className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                    onClick={() => rejectRequest(request._id)}
                    disabled={actionInProgress}
                  >
                    Reject
                  </button>
                </div>
                
                {currentBuddy && (
                  <p className="text-xs text-orange-600 mt-2">
                    You already have a study buddy. Remove your current buddy to accept new requests.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
          <button 
            className="mt-2 text-sm underline"
            onClick={() => {
              fetchCurrentBuddy();
              fetchIncomingRequests();
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default BuddyRequestsComponent;