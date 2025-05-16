import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  // States
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [searchCompany, setSearchCompany] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('interviews'); // 'interviews' or 'jobs'
  
  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/student-login');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Fetch both data types simultaneously
        const [jobsResponse, interviewsResponse] = await Promise.all([
         axios.get('http://localhost:8000/students/blogs/get-jobs-students', config),
          axios.get('http://localhost:8000/students/blogs/get-intexp-students', config)
        ]);

        setJobs(jobsResponse.data);
        setInterviews(interviewsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);

        // If unauthorized, redirect to login
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          navigate('/student-login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  // Handle company search
  const handleSearch = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`http://localhost:8000/student/get-intexp-students?company=${searchCompany}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setInterviews(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error searching interviews:', err);
      setError('Search failed. Please try again.');
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/student-login');
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Reset search
  const resetSearch = async () => {
    setSearchCompany('');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/student/get-intexp-students', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setInterviews(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error resetting search:', err);
      setError('Failed to reset. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="bg-black border-b border-gray-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-red-400">Student Dashboard</h1>
            <div className="hidden md:flex space-x-4">
              <button 
                onClick={() => setActiveTab('interviews')}
                className={`px-3 py-1 rounded-md ${activeTab === 'interviews' ? 'bg-red-400 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
              >
                Interview Experiences
              </button>
              <button 
                onClick={() => setActiveTab('jobs')}
                className={`px-3 py-1 rounded-md ${activeTab === 'jobs' ? 'bg-red-400 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
              >
                Job Postings
              </button>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md transition duration-200"
          >
            Logout
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden flex space-x-2 mt-4">
          <button 
            onClick={() => setActiveTab('interviews')}
            className={`flex-1 px-3 py-1 rounded-md ${activeTab === 'interviews' ? 'bg-red-400 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
          >
            Interviews
          </button>
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 px-3 py-1 rounded-md ${activeTab === 'jobs' ? 'bg-red-400 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
          >
            Jobs
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-red-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-20 border border-red-900 text-white p-4 rounded-md">
            {error}
          </div>
        ) : (
          <>
            {/* Interview Experiences Tab */}
            {activeTab === 'interviews' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex-grow flex space-x-2">
                    <input
                      type="text"
                      placeholder="Search by company name..."
                      value={searchCompany}
                      onChange={(e) => setSearchCompany(e.target.value)}
                      className="flex-grow px-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    <button
                      onClick={handleSearch}
                      className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md transition duration-200"
                    >
                      Search
                    </button>
                  </div>
                  {searchCompany && (
                    <button
                      onClick={resetSearch}
                      className="text-gray-300 hover:text-white"
                    >
                      Clear Search
                    </button>
                  )}
                </div>

                <h2 className="text-xl font-semibold text-white">Interview Experiences</h2>
                
                {interviews.length === 0 ? (
                  <div className="bg-gray-900 p-8 rounded-lg text-center">
                    <p className="text-gray-400">No interview experiences found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {interviews.map((interview) => (
                      <div 
                        key={interview._id} 
                        className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-red-400 transition duration-300"
                      >
                        <div className="p-5">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-white mb-2">{interview.companyName}</h3>
                          </div>
                          <div className="text-sm text-gray-400 mb-4">
                            <p>Posted by: {interview.postedBy?.fullname || 'Anonymous'}</p>
                            <p>Date: {formatDate(interview.createdAt)}</p>
                            {interview.postedBy?.batch && (
                              <p>Batch: {interview.postedBy.batch}</p>
                            )}
                          </div>
                          <p className="text-gray-300 mb-3 line-clamp-3">{interview.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Job Postings Tab */}
            {activeTab === 'jobs' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Job Postings</h2>
                
                {jobs.length === 0 ? (
                  <div className="bg-gray-900 p-8 rounded-lg text-center">
                    <p className="text-gray-400">No job postings found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                      <div 
                        key={job._id} 
                        className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-red-400 transition duration-300"
                      >
                        <div className="p-5">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-white mb-2">{job.title}</h3>
                            {job.batch && (
                              <span className="px-2 py-1 bg-red-400 bg-opacity-20 text-red-400 text-xs rounded-md">
                                Batch: {job.batch}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400 mb-4">
                            <p>Posted by: {job.postedBy?.fullname || 'Anonymous'}</p>
                            {job.postedBy?.company && (
                              <p>Company: {job.postedBy.company}</p>
                            )}
                            <p>Date: {formatDate(job.createdAt)}</p>
                            <div className="flex gap-2 mt-2 text-xs">
                              <span className="px-2 py-1 bg-gray-800 rounded-md">
                                Start: {formatDate(job.startDate)}
                              </span>
                              <span className="px-2 py-1 bg-gray-800 rounded-md">
                                End: {formatDate(job.endDate)}
                              </span>
                            </div>
                          </div>
                          <div className="mb-3">
                            <p className="text-gray-300 line-clamp-2 mb-2">{job.jd}</p>
                            <p className="text-gray-300 line-clamp-2">{job.requirements}</p>
                          </div>
                          <div className="flex items-center justify-end">
                            <a 
                              href={job.jobLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-md text-sm transition duration-200"
                            >
                              Apply Now
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 px-6 py-4 text-center text-gray-400">
        <p>© {new Date().getFullYear()} Student Alumni Portal</p>
      </footer>
    </div>
  );
}

export default StudentDashboard;