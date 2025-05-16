import { useState, useEffect } from 'react';
import { Search, LogOut, Briefcase, FileText, Home } from 'lucide-react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';

// Main Dashboard Component
const StudentDashboard1 = () => {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/interviews" element={<InterviewExperiencesPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

// Navbar Component
const Navbar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="bg-black border-b border-gray-800 py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl">Student Portal</span>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="flex items-center space-x-1 hover:text-red-400 transition">
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link to="/jobs" className="flex items-center space-x-1 hover:text-red-400 transition">
            <Briefcase size={18} />
            <span>Jobs</span>
          </Link>
          <Link to="/interviews" className="flex items-center space-x-1 hover:text-red-400 transition">
            <FileText size={18} />
            <span>Interviews</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

// Dashboard Home Page
const DashboardHome = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Welcome to your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800 hover:border-red-400 transition cursor-pointer">
          <Link to="/jobs" className="flex flex-col items-center">
            <Briefcase size={40} className="text-red-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Job Postings</h2>
            <p className="text-gray-400 text-center">Discover opportunities posted by alumni from various companies</p>
          </Link>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800 hover:border-red-400 transition cursor-pointer">
          <Link to="/interviews" className="flex flex-col items-center">
            <FileText size={40} className="text-red-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Interview Experiences</h2>
            <p className="text-gray-400 text-center">Learn from alumni interview experiences at top companies</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Jobs Page
const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await axios.get('http://localhost:8000/student/get-jobs-students', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setJobs(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.message || 'Failed to fetch jobs');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading jobs...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-center">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Job Opportunities</h1>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center text-gray-400 py-10">No job postings found</div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

// Job Card Component
const JobCard = ({ job }) => {
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">{job.role}</h2>
        <span className="bg-red-400 text-black px-3 py-1 rounded-full text-sm font-medium">
          {job.jobType || 'Full-time'}
        </span>
      </div>
      
      <div className="mt-2">
        <span className="text-lg font-semibold">{job.companyName}</span>
        {job.location && <span className="text-gray-400 ml-2">• {job.location}</span>}
      </div>
      
      {job.description && (
        <p className="mt-4 text-gray-300">{job.description.substring(0, 150)}...</p>
      )}
      
      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills && job.skills.map((skill, index) => (
          <span key={index} className="bg-gray-800 px-2 py-1 rounded text-xs">
            {skill}
          </span>
        ))}
      </div>
      
      <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
        <div>
          Posted by: {job.postedBy?.fullname || 'Alumni'} 
          {job.postedBy?.batch && <span> ({job.postedBy.batch})</span>}
        </div>
        <div>
          {new Date(job.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

// Interview Experiences Page
const InterviewExperiencesPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        let url = 'http://localhost:8000/student/get-intexp-students';
        if (searchTerm) {
          url += `?company=${searchTerm}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setInterviews(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching interviews:', err);
        setError(err.message || 'Failed to fetch interview experiences');
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is triggered by the effect when searchTerm changes
  };

  if (loading && !searchTerm) {
    return <div className="flex justify-center items-center h-64">Loading interview experiences...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-center">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Interview Experiences</h1>
        
        <form onSubmit={handleSearch} className="w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-red-400 transition"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </form>
      </div>

      {loading && searchTerm ? (
        <div className="text-center text-gray-400 py-10">Searching...</div>
      ) : interviews.length === 0 ? (
        <div className="text-center text-gray-400 py-10">No interview experiences found</div>
      ) : (
        <div className="space-y-6">
          {interviews.map((interview) => (
            <InterviewCard key={interview._id} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
};

// Interview Card Component
const InterviewCard = ({ interview }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">{interview.companyName}</h2>
          <p className="text-gray-300">{interview.role || 'Role not specified'}</p>
        </div>
        <span className="bg-red-400 text-black px-3 py-1 rounded-full text-sm font-medium">
          {interview.result || 'Experience'}
        </span>
      </div>
      
      <div className="mt-4">
        {expanded ? (
          <p className="text-gray-300">{interview.experience}</p>
        ) : (
          <p className="text-gray-300">
            {interview.experience?.substring(0, 150)}
            {interview.experience?.length > 150 ? '...' : ''}
          </p>
        )}
        
        {interview.experience?.length > 150 && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-red-400 hover:text-red-300 mt-2 text-sm font-medium"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
      
      <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
        <div>
          Posted by: {interview.postedBy?.fullname || 'Alumni'} 
          {interview.postedBy?.batch && <span> ({interview.postedBy.batch})</span>}
        </div>
        <div>
          {interview.interviewDate ? new Date(interview.interviewDate).toLocaleDateString() : 
            interview.createdAt ? new Date(interview.createdAt).toLocaleDateString() : 'Date not available'}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;