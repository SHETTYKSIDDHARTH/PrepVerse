import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DisplayInterview() {
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // States for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    companyName: '',
    description: ''
  });
  
  // Get current user ID from local storage
  useEffect(() => {
    const userData = localStorage.getItem('alumniData');
    
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setCurrentUserId(parsedData._id || parsedData.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Fetch interviews
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem('alumniToken');
        
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // Fetch interview experiences from API
        const response = await axios.get('http://localhost:8000/alumni/blogs/get-intexp', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setInterviews(response.data);
        setFilteredInterviews(response.data);
      } catch (error) {
        console.error('Error fetching interviews:', error);
        setError('Failed to load interview experiences');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInterviews();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredInterviews(interviews);
    } else {
      const filtered = interviews.filter(interview => 
        interview.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInterviews(filtered);
    }
  }, [searchTerm, interviews]);

  // Function to show notifications
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle edit button click
  const handleEditClick = (interview) => {
    setIsEditing(true);
    setEditingId(interview._id);
    setEditForm({
      companyName: interview.companyName,
      description: interview.description
    });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setEditForm({ companyName: '', description: '' });
  };

  // Handle input change in edit form
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle update submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const token = localStorage.getItem('alumniToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Send update request
      const response = await axios.put(
        `http://localhost:8000/alumni/blogs/update-intexp/${editingId}`, 
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update the interviews list
      setInterviews(prevInterviews => 
        prevInterviews.map(interview => 
          interview._id === editingId ? response.data.data : interview
        )
      );
      
      // Reset edit state
      setIsEditing(false);
      setEditingId(null);
      setEditForm({ companyName: '', description: '' });
      
      // Show success notification
      showNotification('Interview experience updated successfully');
      
    } catch (error) {
      console.error('Error updating interview:', error);
      setError(error.response?.data?.error || 'Failed to update interview experience');
      showNotification('Failed to update interview experience', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this interview experience?')) {
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('alumniToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Send delete request
      await axios.delete(`http://localhost:8000/alumni/blogs/delete-intexp/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove from interviews list
      setInterviews(prevInterviews => 
        prevInterviews.filter(interview => interview._id !== id)
      );
      
      // Show success notification
      showNotification('Interview experience deleted successfully');
      
    } catch (error) {
      console.error('Error deleting interview:', error);
      setError(error.response?.data?.error || 'Failed to delete interview experience');
      showNotification('Failed to delete interview experience', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle loading state
  if (loading && interviews.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Interview Experiences</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-red-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-red-400">Loading experiences...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error && !isEditing) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Interview Experiences</h2>
        <div className="bg-red-900/30 border border-red-800 text-red-300 p-4 rounded-md">
          <p>{error}</p>
          <button 
            className="mt-2 text-red-400 hover:text-red-300 underline"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // No interviews found
  if (filteredInterviews.length === 0 && !loading) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Interview Experiences</h2>
        
        {/* Notification */}
        {notification.show && (
          <div className={`mb-4 p-3 rounded-md ${
            notification.type === 'error' 
              ? 'bg-red-900/30 border border-red-800 text-red-300' 
              : 'bg-green-900/30 border border-green-800 text-green-300'
          }`}>
            {notification.message}
          </div>
        )}
        
        {/* Search box */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by company..."
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="text-center py-8 text-gray-400">
          {searchTerm ? (
            <p>No interview experiences found for "{searchTerm}".</p>
          ) : (
            <>
              <p>No interview experiences have been shared yet.</p>
              <p className="mt-2">Be the first to share your experience!</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Display interviews with edit form for selected interview
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-6">Interview Experiences</h2>
      
      {/* Notification */}
      {notification.show && (
        <div className={`mb-4 p-3 rounded-md ${
          notification.type === 'error' 
            ? 'bg-red-900/30 border border-red-800 text-red-300' 
            : 'bg-green-900/30 border border-green-800 text-green-300'
        }`}>
          {notification.message}
        </div>
      )}
      
      {error && !notification.show && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 p-4 rounded-md mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Search box */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by company..."
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-6">
        {filteredInterviews.map((interview) => (
          <div key={interview._id} className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-gray-600 transition-colors">
            {isEditing && editingId === interview._id ? (
              // Edit form
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-400 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={editForm.companyName}
                    onChange={handleEditFormChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditFormChange}
                    rows="6"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  ></textarea>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                  <button 
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // Display interview
              <>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-red-400">{interview.companyName}</h3>
                  <span className="text-xs text-gray-400">{formatDate(interview.createdAt)}</span>
                </div>
                
                <div className="mt-3 text-gray-300 whitespace-pre-line">
                  {interview.description}
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-700 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Posted by: {interview.postedBy?.fullname || 'Anonymous Alumni'}
                  </div>
                  
                  {/* Show edit/delete buttons only if current user is the author */}
                  {currentUserId && interview.postedBy && interview.postedBy._id === currentUserId && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditClick(interview)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(interview._id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors disabled:opacity-50"
                        disabled={loading}
                      >
                        {loading ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DisplayInterview;