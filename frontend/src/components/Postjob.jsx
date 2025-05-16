import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Briefcase, Calendar, FileText, ExternalLink, Send } from 'lucide-react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

function PostJob() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [jd, setJd] = useState('');
  const [batch, setBatch] = useState('');
  const [jobLink, setJobLink] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [requirements, setRequirements] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const postForm = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('alumniToken');
      if (!token) {
        setError('You must be logged in to post a job');
        setLoading(false);
        return;
      }

      // Get user ID from token
      const decoded = jwt_decode(token);
      const _id = decoded.id;
      
      const payload = {
        title,
        jd,
        batch,
        jobLink,
        startDate,
        endDate,
        requirements,
        postedBy: _id
      };

      // Include token in the Authorization header
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true  // Send cookies with the request
      };

      const response = await axios.post('http://localhost:8000/alumni/blogs/post-job', payload, config);
      
      setMessage('Job opportunity posted successfully!');
      console.log('Job posted successfully:', response.data);
      
      // Clear form after successful submission
      setTitle('');
      setJd('');
      setBatch('');
      setJobLink('');
      setStartDate('');
      setEndDate('');
      setRequirements('');
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
      
    } catch (error) {
      console.error('Error posting job:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white p-4 shadow-md">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/alumni-dashboard')}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold">Post a Job Opportunity</h1>
            </div>
            <Link 
              to="/alumni-dashboard" 
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl py-8 px-4">
        {/* Notification Messages */}
        {message && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-md flex items-start">
            <div className="flex-shrink-0 mr-3">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium">{message}</p>
              <p className="text-sm mt-1">The job opportunity has been posted to the platform.</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md flex items-start">
            <div className="flex-shrink-0 mr-3">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-1">Please try again or contact support if the issue persists.</p>
            </div>
          </div>
        )}

        {/* Job Posting Form */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 text-gray-800">
              <Briefcase size={24} className="text-red-400" />
              <h2 className="text-xl font-semibold">Job Details</h2>
            </div>
            <p className="text-gray-600 mt-2">
              Share job opportunities with current students and help them start their career journey.
            </p>
          </div>

          <form onSubmit={postForm} className="p-6 space-y-6">
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium">Job Title*</span>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase size={18} className="text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-red-400 focus:border-red-400" 
                    placeholder="Software Engineer, Product Manager, etc."
                    required
                  />
                </div>
              </label>
              
              <label className="block">
                <span className="text-gray-700 font-medium">Job Description*</span>
                <textarea 
                  value={jd} 
                  onChange={(e) => setJd(e.target.value)} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-red-400 focus:border-red-400" 
                  rows="4"
                  placeholder="Describe the role, responsibilities, and what the job entails..."
                  required
                />
              </label>
              
              <label className="block">
                <span className="text-gray-700 font-medium">Eligible Batch*</span>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText size={18} className="text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={batch} 
                    onChange={(e) => setBatch(e.target.value)} 
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-red-400 focus:border-red-400" 
                    placeholder="e.g. 2022-2023"
                    required
                  />
                </div>
              </label>
                
              <label className="block">
                <span className="text-gray-700 font-medium">Requirements*</span>
                <textarea 
                  value={requirements} 
                  onChange={(e) => setRequirements(e.target.value)} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-red-400 focus:border-red-400" 
                  rows="3"
                  placeholder="Skills, qualifications, experience required..."
                  required
                />
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-gray-700 font-medium">Job Link*</span>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ExternalLink size={18} className="text-gray-400" />
                    </div>
                    <input 
                      type="url" 
                      value={jobLink} 
                      onChange={(e) => setJobLink(e.target.value)} 
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-red-400 focus:border-red-400" 
                      placeholder="https://example.com/job"
                      required
                    />
                  </div>
                </label>
                
                <div className="block">
                  <span className="text-gray-700 font-medium">Application Deadline*</span>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)} 
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-red-400 focus:border-red-400" 
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-gray-700 font-medium">Application Start Date*</span>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)} 
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-red-400 focus:border-red-400" 
                      required
                    />
                  </div>
                </label>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <button 
                type="submit" 
                className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-red-400 hover:bg-red-500 text-white font-medium rounded-md shadow-sm transition duration-200 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Post Job Opportunity</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto max-w-3xl px-4">
          <p className="text-center text-gray-600 text-sm">
            By posting a job, you agree to our terms and conditions. Job opportunities will be reviewed before being published.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default PostJob;