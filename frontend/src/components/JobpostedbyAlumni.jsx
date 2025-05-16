import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

function JobpostedbyAlumni() {
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    jd: '',
    batch: '',
    jobLink: '',
    startDate: '',
    endDate: '',
    requirements: ''
  });
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('alumniToken');
      
      if (!token) {
        setError('You must be logged in to view your job postings');
        setLoading(false);
        return;
      }

      // Decode token to get alumni ID
      const decoded = jwt_decode(token);
      const alumniId = decoded.id;

      const response = await axios.get(`http://localhost:8000/alumni/blogs/myjobs/${alumniId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setMyJobs(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching my jobs:', err);
      setError(err.response?.data?.error || 'Failed to fetch your job postings');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job._id);
    setFormData({
      title: job.title,
      jd: job.jd,
      batch: job.batch,
      jobLink: job.jobLink,
      startDate: job.startDate.split('T')[0],
      endDate: job.endDate.split('T')[0],
      requirements: job.requirements
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('alumniToken');
      
      await axios.put(
        `http://localhost:8000/alumni/blogs/update-job/${editingJob}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Refresh job listings
      fetchMyJobs();
      setEditingJob(null);
    } catch (err) {
      console.error('Error updating job:', err);
      setError(err.response?.data?.error || 'Failed to update job posting');
    }
  };

  const handleDelete = async (jobId) => {
    try {
      const token = localStorage.getItem('alumniToken');
      
      await axios.delete(
        `http://localhost:8000/alumni/blogs/delete-job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Refresh job listings
      fetchMyJobs();
      setShowConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting job:', err);
      setError(err.response?.data?.error || 'Failed to delete job posting');
    }
  };

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
          onClick={fetchMyJobs}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (myJobs.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-lg text-gray-600">You haven't posted any jobs yet.</p>
        <button 
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => window.location.href = '/alumni-dashboard/postjob'}
        >
          Post Your First Job
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Jobs Posted by You</h1>
      
      <div className="space-y-6">
        {myJobs.map((job) => (
          <div key={job._id} className="bg-white rounded-lg shadow-md p-6">
            {editingJob === job._id ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Job Description</label>
                  <textarea
                    name="jd"
                    value={formData.jd}
                    onChange={handleChange}
                    className="w-full p-2 border rounded h-24"
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Batch</label>
                    <input
                      type="text"
                      name="batch"
                      value={formData.batch}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Job Link</label>
                    <input
                      type="url"
                      name="jobLink"
                      value={formData.jobLink}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Requirements</label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    className="w-full p-2 border rounded h-24"
                    required
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditingJob(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Update Job
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(job)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(job._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {showConfirmDelete === job._id && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-700 mb-2">Are you sure you want to delete this job posting?</p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setShowConfirmDelete(null)}
                        className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Confirm Delete
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700">Job Description:</h3>
                  <p className="text-gray-600">{job.jd}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700">Requirements:</h3>
                  <p className="text-gray-600">{job.requirements}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Batch:</span>
                    <span className="ml-2 text-gray-600">{job.batch}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Application Link:</span>
                    <a 
                      href={job.jobLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:underline"
                    >
                      Apply
                    </a>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Start Date:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(job.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">End Date:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(job.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Posted: {new Date(job.createdAt).toLocaleDateString()}
                  {job.createdAt !== job.updatedAt && 
                    ` • Updated: ${new Date(job.updatedAt).toLocaleDateString()}`
                  }
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobpostedbyAlumni;