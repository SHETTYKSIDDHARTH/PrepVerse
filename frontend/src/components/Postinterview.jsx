import React, { useState } from 'react';
import axios from 'axios';

function PostInterview({ alumniId }) {
  const [formData, setFormData] = useState({
    companyName: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.companyName.trim() || !formData.description.trim()) {
      setMessage({ 
        text: 'Please provide both company name and description', 
        type: 'error' 
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('alumniToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Make API request to post interview experience
      const response = await axios.post(
        'http://localhost:8000/alumni/blogs/post-intexp', 
        {
          companyName: formData.companyName,
          description: formData.description,
          postedBy: alumniId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Reset form on success
      setFormData({
        companyName: '',
        description: ''
      });
      
      // Show success message
      setMessage({
        text: 'Interview experience posted successfully!',
        type: 'success'
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
    } catch (error) {
      console.error('Error posting interview:', error);
      setMessage({
        text: error.response?.data?.error || 'Failed to post interview experience',
        type: 'error'
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Share Your Interview Experience</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-1">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter company name"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Interview Experience
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Share your interview experience, questions asked, and tips for others..."
            ></textarea>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </span>
              ) : 'Post Interview Experience'}
            </button>
          </div>
        </div>
      </form>
      
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-24 right-5 p-4 rounded-md shadow-lg z-50 max-w-md border-l-4 ${
          message.type === 'success' ? 'bg-green-900 border-green-500 text-green-100' : 'bg-red-900 border-red-500 text-red-100'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {message.type === 'success' ? 'Success!' : 'Error'}
              </p>
              <p className="mt-1 text-sm opacity-90">
                {message.text}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                type="button"
                onClick={() => setShowToast(false)}
                className="inline-flex text-gray-400 hover:text-white"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostInterview;