import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    jobtitle: '',
    company: '',
    jobdesc: '',
    location: '',
    salary: '',
    requiredSkills: '',
    minimumCGPA: '',
    eligibleBranches: [],
    deadline: '',
    jobStatus: ''
  });

  const branches = ['CSE', 'ECE', 'IS'];

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const token = localStorage.getItem('tpToken');
        const response = await axios.get(`http://localhost:8000/tp/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJob(response.data);
        
        // Prepare form data
        setFormData({
          jobtitle: response.data.jobtitle,
          company: response.data.company,
          jobdesc: response.data.jobdesc,
          location: response.data.location || '',
          salary: response.data.salary || '',
          requiredSkills: response.data.requiredSkills?.join(', ') || '',
          minimumCGPA: response.data.minimumCGPA || '',
          eligibleBranches: response.data.eligibleBranches || [],
          deadline: response.data.deadline ? new Date(response.data.deadline).toISOString().split('T')[0] : '',
          jobStatus: response.data.jobStatus
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setLoading(false);
        navigate('/tp-dashboard/jobs');
      }
    };

    fetchJobDetails();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'eligibleBranches') {
      const branch = value;
      const updated = formData.eligibleBranches.includes(branch)
        ? formData.eligibleBranches.filter(b => b !== branch)
        : [...formData.eligibleBranches, branch];
      setFormData({ ...formData, eligibleBranches: updated });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const submitUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('tpToken');
      const payload = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()).filter(Boolean)
      };
      
      const response = await axios.put(`http://localhost:8000/tp/jobs/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setJob(response.data);
      setIsEditing(false);
      alert('Job updated successfully!');
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Failed to update job');
    }
  };

  if (loading) {
    return <div className="text-center my-8">Loading job details...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{isEditing ? 'Edit Job' : 'Job Details'}</h2>
        <div className="space-x-3">
          <button 
            onClick={() => navigate('/tp-dashboard/jobs')}
            className="bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded"
          >
            Back to Jobs
          </button>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded"
            >
              Edit Job
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="bg-gray-800 rounded-lg p-6">
          <form onSubmit={submitUpdate} className="space-y-4">
            <div>
              <label className="block mb-1">Job Title</label>
              <input
                name="jobtitle"
                value={formData.jobtitle}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">Company</label>
              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">Job Description</label>
              <textarea
                name="jobdesc"
                value={formData.jobdesc}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 h-32"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Location</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                />
              </div>
              
              <div>
                <label className="block mb-1">Salary</label>
                <input
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                />
              </div>
              
              <div>
                <label className="block mb-1">Required Skills (comma-separated)</label>
                <input
                  name="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                />
              </div>
              
              <div>
                <label className="block mb-1">Minimum CGPA</label>
                <input
                  type="number"
                  name="minimumCGPA"
                  value={formData.minimumCGPA}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="10"
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                />
              </div>
              
              <div>
                <label className="block mb-1">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                />
              </div>
              
              <div>
                <label className="block mb-1">Status</label>
                <select
                  name="jobStatus"
                  value={formData.jobStatus}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block mb-2">Eligible Branches:</label>
              <div className="flex flex-wrap gap-4">
                {branches.map(branch => (
                  <label key={branch} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="eligibleBranches"
                      value={branch}
                      checked={formData.eligibleBranches.includes(branch)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {branch}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold">{job.jobtitle}</h3>
              <p className="text-xl text-gray-400">{job.company}</p>
            </div>
            <div>
              {job.jobStatus === 'open' && (
                <span className="bg-green-500 text-white px-3 py-1 rounded">Open</span>
              )}
              {job.jobStatus === 'closed' && (
                <span className="bg-red-500 text-white px-3 py-1 rounded">Closed</span>
              )}
              {job.jobStatus === 'upcoming' && (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded">Upcoming</span>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Job Description</h4>
            <p className="whitespace-pre-line">{job.jobdesc}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Details</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400">Location: </span>
                  <span>{job.location || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Salary: </span>
                  <span>{job.salary || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Application Deadline: </span>
                  <span>{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline'}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Requirements</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400">Minimum CGPA: </span>
                  <span>{job.minimumCGPA || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Eligible Branches: </span>
                  <span>{job.eligibleBranches?.join(', ') || 'All branches'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Required Skills: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {job.requiredSkills && job.requiredSkills.length > 0 ? (
                      job.requiredSkills.map((skill, idx) => (
                        <span key={idx} className="bg-blue-900 text-blue-100 px-2 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span>None specified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-2">Applications</h4>
            <div className="flex justify-between items-center">
              <div>
                <p>Total Applicants: {job.applicants?.length || 0}</p>
              </div>
              <button
                onClick={() => navigate(`/tp-dashboard/jobs/${job._id}/applicants`)}
                className="bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded"
              >
                View Applicants
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetails;
