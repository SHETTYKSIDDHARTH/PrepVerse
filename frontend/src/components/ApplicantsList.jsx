import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function ApplicantsList() {
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const { id } = useParams();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem('tpToken');
        
        // First fetch job details
        const jobResponse = await axios.get(`http://localhost:8000/tp/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setJob(jobResponse.data);
        
        // Then fetch applicants for this job
        const applicantsResponse = await axios.get(`http://localhost:8000/tp/jobs/${id}/applicants`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setApplicants(applicantsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching applicants:', error);
        setError('Failed to load applicants. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchApplicants();
  }, [id]);

  const updateApplicationStatus = async (studentId, newStatus) => {
    try {
      const token = localStorage.getItem('tpToken');
      
      await axios.put(
        `http://localhost:8000/tp/jobs/${id}/applicants/${studentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Update state to reflect the change
      setApplicants(applicants.map(applicant => 
        applicant.student === studentId 
          ? { ...applicant, status: newStatus } 
          : applicant
      ));
      
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    }
  };

  const getFilteredApplicants = () => {
    if (statusFilter === 'all') {
      return applicants;
    }
    return applicants.filter(applicant => applicant.status === statusFilter);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'eligible':
        return 'bg-green-500';
      case 'not_eligible':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-white">Loading applicants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-600 text-white p-4 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {job ? (
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">{job.jobtitle} - Applicants</h2>
          <p className="text-gray-300">Company: {job.company}</p>
          <div className="mt-4 flex items-center">
            <Link 
              to={`/tp-dashboard/jobs/${id}`} 
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg mr-4"
            >
              Back to Job Details
            </Link>
            <span className="text-gray-300">
              Total Applicants: <span className="font-bold">{applicants.length}</span>
            </span>
          </div>
        </div>
      ) : (
        <h2 className="text-3xl font-bold mb-6">Applicants</h2>
      )}

      {/* Filter controls */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap items-center">
          <span className="mr-4">Filter by status:</span>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded ${statusFilter === 'all' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded ${statusFilter === 'pending' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setStatusFilter('eligible')}
              className={`px-3 py-1 rounded ${statusFilter === 'eligible' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              Eligible
            </button>
            <button 
              onClick={() => setStatusFilter('not_eligible')}
              className={`px-3 py-1 rounded ${statusFilter === 'not_eligible' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              Not Eligible
            </button>
          </div>
        </div>
      </div>

      {/* Applicants list */}
      {getFilteredApplicants().length === 0 ? (
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-gray-400">No applicants found for the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {getFilteredApplicants().map((applicant) => (
            <div key={applicant.student} className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{applicant.name}</h3>
                    <p className="text-gray-300">{applicant.email} | {applicant.phone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(applicant.status)}`}>
                    {applicant.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400">Branch</p>
                    <p className="font-medium">{applicant.branch}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">CGPA</p>
                    <p className="font-medium">{applicant.cgpa}</p>
                  </div>
                </div>

                {applicant.studentDetails && applicant.studentDetails.skills && (
                  <div className="mb-4">
                    <p className="text-gray-400 mb-1">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {applicant.studentDetails.skills.map((skill, index) => (
                        <span key={index} className="bg-gray-700 px-2 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <p className="text-gray-400 mb-2">Actions</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateApplicationStatus(applicant.student, 'eligible')}
                      disabled={applicant.status === 'eligible'}
                      className={`px-4 py-2 rounded ${
                        applicant.status === 'eligible' 
                          ? 'bg-green-900 cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      Mark Eligible
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(applicant.student, 'not_eligible')}
                      disabled={applicant.status === 'not_eligible'}
                      className={`px-4 py-2 rounded ${
                        applicant.status === 'not_eligible' 
                          ? 'bg-red-900 cursor-not-allowed' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      Mark Not Eligible
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(applicant.student, 'pending')}
                      disabled={applicant.status === 'pending'}
                      className={`px-4 py-2 rounded ${
                        applicant.status === 'pending' 
                          ? 'bg-yellow-900 cursor-not-allowed' 
                          : 'bg-yellow-600 hover:bg-yellow-700'
                      }`}
                    >
                      Reset to Pending
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApplicantsList;