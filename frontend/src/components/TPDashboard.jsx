import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateJob from './CreateJob';
import JobsList from './JobsList';
import JobDetails from './JobDetails';
import ApplicantsList from './ApplicantsList';
import {StudentsList} from './StudentsList';
import Statistics from './Statistics';
import {Notifications} from './Notifications';
import {SendNotification} from './SendNotification';
import {Profile} from './Profile';

function TPDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('tpToken');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Verify token and fetch dashboard stats
    const verifyTokenAndFetchStats = async () => {
      try {
        // Verify token
        await axios.get('http://localhost:8000/tp/verify-token', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch stats for dashboard
        const statsResponse = await axios.get('http://localhost:8000/tp/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setStats(statsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Authentication failed:', error);
        localStorage.removeItem('tpToken');
        navigate('/login');
      }
    };
    
    verifyTokenAndFetchStats();
  }, [navigate]);
  
  const logout = () => {
    localStorage.removeItem('tpToken');
    navigate('/');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">T&P Portal</h1>
            <p className="text-gray-400 text-sm">Training & Placement</p>
          </div>
          
          <nav>
            <ul className="space-y-2">
              <li>
                <Link to="/tp-dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">Dashboard</Link>
              </li>
              <li>
                <Link to="/tp-dashboard/jobs" className="block py-2 px-4 rounded hover:bg-gray-700">Manage Jobs</Link>
              </li>
              <li>
                <Link to="/tp-dashboard/create-job" className="block py-2 px-4 rounded hover:bg-gray-700">Create Job</Link>
              </li>
              <li>
                <Link to="/tp-dashboard/students" className="block py-2 px-4 rounded hover:bg-gray-700">Eligible Students</Link>
              </li>
              <li>
                <Link to="/tp-dashboard/notifications" className="block py-2 px-4 rounded hover:bg-gray-700">Notifications</Link>
              </li>
              <li>
                <Link to="/tp-dashboard/send-notification" className="block py-2 px-4 rounded hover:bg-gray-700">Send Notification</Link>
              </li>
              <li>
                <Link to="/tp-dashboard/profile" className="block py-2 px-4 rounded hover:bg-gray-700">Profile</Link>
              </li>
              <li>
                <button 
                  onClick={logout} 
                  className="block w-full text-left py-2 px-4 rounded hover:bg-red-700 bg-red-600 mt-8"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<DashboardHome stats={stats} />} />
            <Route path="/jobs" element={<JobsList />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/jobs/:id/applicants" element={<ApplicantsList />} />
            <Route path="/create-job" element={<CreateJob />} />
            <Route path="/students" element={<StudentsList />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/send-notification" element={<SendNotification />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}


function DashboardHome({ stats }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Job Stats */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Total Jobs</h3>
          <p className="text-4xl font-bold text-blue-400">{stats.totalJobs}</p>
          <div className="mt-4 text-sm">
            <div className="flex justify-between">
              <span>Open Jobs:</span>
              <span className="font-medium text-green-400">{stats.openJobs}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Closed Jobs:</span>
              <span className="font-medium text-red-400">{stats.closedJobs}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Upcoming:</span>
              <span className="font-medium text-yellow-400">{stats.upcomingJobs}</span>
            </div>
          </div>
        </div>
        
        {/* Applicant Stats */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Total Applicants</h3>
          <p className="text-4xl font-bold text-purple-400">{stats.totalApplicants}</p>
          <div className="mt-4 text-sm">
            <div className="flex justify-between">
              <span>Pending:</span>
              <span className="font-medium text-yellow-400">{stats.pendingApplicants}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Eligible:</span>
              <span className="font-medium text-green-400">{stats.eligibleApplicants}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Not Eligible:</span>
              <span className="font-medium text-red-400">{stats.notEligibleApplicants}</span>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg md:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/tp-dashboard/create-job" className="bg-blue-600 hover:bg-blue-700 text-center py-3 px-4 rounded">
              Post New Job
            </Link>
            <Link to="/tp-dashboard/send-notification" className="bg-purple-600 hover:bg-purple-700 text-center py-3 px-4 rounded">
              Send Notification
            </Link>
            <Link to="/tp-dashboard/jobs" className="bg-green-600 hover:bg-green-700 text-center py-3 px-4 rounded">
              View All Jobs
            </Link>
            <Link to="/tp-dashboard/students" className="bg-yellow-600 hover:bg-yellow-700 text-center py-3 px-4 rounded">
              Browse Students
            </Link>
          </div>
        </div>
      </div>
      
      {/* Recent activity would go here */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Recent Activity</h3>
        <div className="bg-gray-800 rounded-lg p-6">
          <p className="text-gray-400">Coming soon - Activity feed showing recent applications and notifications</p>
        </div>
      </div>
    </div>
  );
}

export default TPDashboard;