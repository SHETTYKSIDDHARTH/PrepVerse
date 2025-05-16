import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('tpToken');
        const response = await axios.get('http://localhost:8000/tp/jobs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.jobStatus === filter);

  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const token = localStorage.getItem('tpToken');
        await axios.delete(`http://localhost:8000/tp/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(jobs.filter(job => job._id !== jobId));
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job');
      }
    }
  };

  if (loading) {
    return <div className="text-center my-8">Loading jobs...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Jobs</h2>
        <Link to="/tp-dashboard/create-job" className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded">
          Create New Job
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setFilter('all')}
          >
            All Jobs
          </button>
          <button 
            className={`px-4 py-2 rounded ${filter === 'open' ? 'bg-green-600' : 'bg-gray-700'}`}
            onClick={() => setFilter('open')}
          >
            Open
          </button>
          <button 
            className={`px-4 py-2 rounded ${filter === 'upcoming' ? 'bg-yellow-600' : 'bg-gray-700'}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`px-4 py-2 rounded ${filter === 'closed' ? 'bg-red-600' : 'bg-gray-700'}`}
            onClick={() => setFilter('closed')}
          >
            Closed
          </button>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-xl">No jobs found.</p>
          <Link to="/tp-dashboard/create-job" className="text-blue-400 hover:underline mt-2 inline-block">
            Create your first job
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredJobs.map(job => (
            <div key={job._id} className="bg-gray-800 rounded-lg p-6 relative">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{job.jobtitle}</h3>
                  <p className="text-gray-400">{job.company}</p>
                </div>
                <div className="flex space-x-2">
                  {job.jobStatus === 'open' && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">Open</span>
                  )}
                  {job.jobStatus === 'closed' && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">Closed</span>
                  )}
                  {job.jobStatus === 'upcoming' && (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">Upcoming</span>
                  )}
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p>{job.location || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Salary</p>
                  <p>{job.salary || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Min CGPA</p>
                  <p>{job.minimumCGPA || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Eligible Branches</p>
                  <p>{job.eligibleBranches?.join(', ') || 'All'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Deadline</p>
                  <p>{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Applicants</p>
                  <p>{job.applicants?.length || 0} applicants</p>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-3">
                <Link 
                  to={`/tp-dashboard/jobs/${job._id}`} 
                  className="bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded text-sm"
                >
                  View Details
                </Link>
                <Link 
                  to={`/tp-dashboard/jobs/${job._id}/applicants`} 
                  className="bg-purple-600 hover:bg-purple-700 py-1 px-3 rounded text-sm"
                >
                  View Applicants
                </Link>
                <button 
                  onClick={() => deleteJob(job._id)} 
                  className="bg-red-600 hover:bg-red-700 py-1 px-3 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobsList;