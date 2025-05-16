import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AlumnigetJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('alumniToken');
        
        const response = await axios.get('http://localhost:8000/alumni/blogs/get-jobs', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setJobs(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.response?.data?.error || 'Failed to fetch job postings');
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mt-4">
        <p>Error: {error}</p>
        <button 
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-lg text-gray-600">No job postings available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Available Job Openings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
            <p className="text-gray-600 mb-2">
              Posted by: {job.postedBy?.fullname || 'Anonymous'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Company: {job.postedBy?.company || 'Not specified'}
            </p>
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-700">Job Description:</h3>
              <p className="text-gray-600 line-clamp-3">{job.jd}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-700">Requirements:</h3>
              <p className="text-gray-600 line-clamp-2">{job.requirements}</p>
            </div>
            
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <p>Batch: {job.batch}</p>
              <p>Ends: {new Date(job.endDate).toLocaleDateString()}</p>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-gray-500">
                Posted: {new Date(job.createdAt).toLocaleDateString()}
              </span>
              <a 
                href={job.jobLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlumnigetJobs;