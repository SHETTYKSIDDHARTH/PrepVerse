import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Alumni Dashboard Components
import PostInterview from '../components/PostInterview';
import DisplayInterview from '../components/DisplayInterview';
import PostJob from '../components/PostJob';

function AlumniDashboard() {
  const navigate = useNavigate();
  const [alumniData, setAlumniData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Fetch alumni data on component mount
  useEffect(() => {
    const fetchAlumniData = async () => {
      try {
        const token = localStorage.getItem('alumniToken');
        
        // Redirect to login if no token found
        if (!token) {
          navigate('/alumni-login');
          return;
        }
        
        // Fetch alumni profile data
        const response = await axios.get('http://localhost:8000/alumni/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setAlumniData(response.data);
        
        // Store alumni data in localStorage for components to access
        localStorage.setItem('alumniData', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching alumni data:', error);
        // If unauthorized or token invalid, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem('alumniToken');
          navigate('/alumni-login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlumniData();
  }, [navigate]);
  
  const handleLogout = () => {
    // Clear token and user data
    localStorage.removeItem('alumniToken');
    localStorage.removeItem('alumniData');
    // Redirect to login
    navigate('/alumni-login');
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Active link style for navbar
  const activeLinkClass = "text-red-400 border-b-2 border-red-400";
  const inactiveLinkClass = "text-gray-300 hover:text-white transition-colors duration-200";

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-red-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-red-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Dashboard Header with Navigation */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top bar with logo and logout */}
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-red-400">Alumni Portal</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink 
                to="/alumni-dashboard" 
                end
                className={({ isActive }) => 
                  isActive ? activeLinkClass : inactiveLinkClass
                }
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/alumni-dashboard/getalljobs" 
                className={({ isActive }) => 
                  isActive ? activeLinkClass : inactiveLinkClass
                }
              >
                All Jobs
              </NavLink>
              <NavLink 
                to="/alumni-dashboard/getjobpostedbyalumni" 
                className={({ isActive }) => 
                  isActive ? activeLinkClass : inactiveLinkClass
                }
              >
                My Jobs
              </NavLink>
              <NavLink 
                to="/alumni-dashboard/postjob" 
                className={({ isActive }) => 
                  isActive ? activeLinkClass : inactiveLinkClass
                }
              >
                Post Job
              </NavLink>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition ml-4"
              >
                Logout
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* User welcome message below navbar on desktop */}
          <div className="hidden md:block pb-2">
            {alumniData && (
              <p className="text-gray-400 text-sm">
                Welcome, {alumniData.fullname || alumniData.email}
              </p>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink 
                to="/alumni-dashboard" 
                end
                className={({ isActive }) => 
                  `block px-3 py-2 rounded ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/alumni-dashboard/getalljobs" 
                className={({ isActive }) => 
                  `block px-3 py-2 rounded ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All jobs
              </NavLink>
              <NavLink 
                to="/alumni-dashboard/getjobpostedbyalumni" 
                className={({ isActive }) => 
                  `block px-3 py-2 rounded ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Jobs
              </NavLink>
              <NavLink 
                to="/alumni-dashboard/postjob" 
                className={({ isActive }) => 
                  `block px-3 py-2 rounded ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Post Job
              </NavLink>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-white bg-red-600 rounded hover:bg-red-700"
              >
                Logout
              </button>
              
              {/* User welcome message in mobile menu */}
              {alumniData && (
                <p className="px-3 py-2 text-gray-400 text-sm mt-4 border-t border-gray-800">
                  Signed in as: {alumniData.fullname || alumniData.email}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto p-4">
        <Routes>
          <Route path="/" element={
            <>
              <div className="mb-8">
                <PostInterview alumniId={alumniData?._id} />
              </div>
              <DisplayInterview />
            </>
          } />
          <Route path="/interviews" element={<DisplayInterview />} />
          <Route path="/postjob" element={<PostJob alumniId={alumniData?._id} />} />
        </Routes>
      </div>
    </div>
  );
}

export default AlumniDashboard;