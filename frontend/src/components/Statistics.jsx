import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('all');
  const [detailedJobsStats, setDetailedJobsStats] = useState(null);
  const [applicantTrends, setApplicantTrends] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('tpToken');
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }
        
        // Fetch basic stats
        const statsResponse = await axios.get('http://localhost:8000/tp/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setStats(statsResponse.data);
        
        // Fetch jobs for detailed analysis
        const jobsResponse = await axios.get('http://localhost:8000/tp/jobs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Process jobs data for visualization
        processJobsData(jobsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError('Failed to load statistics. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const processJobsData = (jobs) => {
    if (!jobs || jobs.length === 0) return;
    
    // Count jobs by company
    const jobsByCompany = {};
    jobs.forEach(job => {
      if (jobsByCompany[job.company]) {
        jobsByCompany[job.company]++;
      } else {
        jobsByCompany[job.company] = 1;
      }
    });
    
    // Sort companies by job count
    const sortedCompanies = Object.keys(jobsByCompany).sort((a, b) => 
      jobsByCompany[b] - jobsByCompany[a]
    );
    
    // Get top 5 companies
    const topCompanies = sortedCompanies.slice(0, 5);
    
    // Jobs by branch eligibility
    const jobsByBranch = {
      'CSE': 0,
      'ECE': 0,
      'IS': 0
    };
    
    jobs.forEach(job => {
      if (job.eligibleBranches && job.eligibleBranches.length) {
        job.eligibleBranches.forEach(branch => {
          if (jobsByBranch[branch] !== undefined) {
            jobsByBranch[branch]++;
          }
        });
      }
    });
    
    // Calculate applicant trends (mock data since we don't have time-series data)
    // In a real app, you'd fetch this from an API endpoint with proper date filtering
    const mockApplicantTrends = [
      { month: 'Jan', applicants: 23 },
      { month: 'Feb', applicants: 45 },
      { month: 'Mar', applicants: 56 },
      { month: 'Apr', applicants: 37 },
      { month: 'May', applicants: 42 },
      { month: 'Jun', applicants: 65 }
    ];
    
    setDetailedJobsStats({
      jobsByCompany: {
        labels: topCompanies,
        data: topCompanies.map(company => jobsByCompany[company])
      },
      jobsByBranch
    });
    
    setApplicantTrends(mockApplicantTrends);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-white">Loading statistics...</div>
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Placement Statistics</h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeframe('all')}
            className={`px-3 py-1 rounded ${timeframe === 'all' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            All Time
          </button>
          <button 
            onClick={() => setTimeframe('year')}
            className={`px-3 py-1 rounded ${timeframe === 'year' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            This Year
          </button>
          <button 
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1 rounded ${timeframe === 'month' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Total Jobs</h3>
          <p className="text-4xl font-bold text-blue-400">{stats.totalJobs}</p>
          <div className="mt-4 text-sm">
            <div className="flex justify-between">
              <span>Open:</span>
              <span className="font-medium text-green-400">{stats.openJobs}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Closed:</span>
              <span className="font-medium text-red-400">{stats.closedJobs}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Upcoming:</span>
              <span className="font-medium text-yellow-400">{stats.upcomingJobs}</span>
            </div>
          </div>
        </div>
        
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
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Placement Rate</h3>
          <p className="text-4xl font-bold text-green-400">
            {stats.totalApplicants > 0 
              ? `${Math.round((stats.eligibleApplicants / stats.totalApplicants) * 100)}%`
              : '0%'
            }
          </p>
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ 
                  width: stats.totalApplicants > 0 
                    ? `${Math.round((stats.eligibleApplicants / stats.totalApplicants) * 100)}%`
                    : '0%'
                }}
              ></div>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              {stats.eligibleApplicants} eligible out of {stats.totalApplicants} applicants
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Average Applicants</h3>
          <p className="text-4xl font-bold text-yellow-400">
            {stats.totalJobs > 0 
              ? Math.round(stats.totalApplicants / stats.totalJobs) 
              : 0}
          </p>
          <div className="mt-4 text-sm text-gray-400">
            Average number of applicants per job posting
          </div>
        </div>
      </div>

      {/* Job Statistics */}
      {detailedJobsStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Jobs by Company */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Top Companies by Job Postings</h3>
            {detailedJobsStats.jobsByCompany.labels.length > 0 ? (
              <div className="space-y-3">
                {detailedJobsStats.jobsByCompany.labels.map((company, index) => (
                  <div key={company} className="flex flex-col">
                    <div className="flex justify-between mb-1">
                      <span>{company}</span>
                      <span>{detailedJobsStats.jobsByCompany.data[index]} jobs</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ 
                          width: `${(detailedJobsStats.jobsByCompany.data[index] / 
                            Math.max(...detailedJobsStats.jobsByCompany.data)) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No company data available</p>
            )}
          </div>
          
          {/* Jobs by Branch */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Jobs by Branch Eligibility</h3>
            <div className="space-y-4">
              <div className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <span>Computer Science (CSE)</span>
                  <span>{detailedJobsStats.jobsByBranch['CSE']} jobs</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{ 
                      width: `${(detailedJobsStats.jobsByBranch['CSE'] / stats.totalJobs) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <span>Electronics & Communication (ECE)</span>
                  <span>{detailedJobsStats.jobsByBranch['ECE']} jobs</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ 
                      width: `${(detailedJobsStats.jobsByBranch['ECE'] / stats.totalJobs) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <span>Information Science (IS)</span>
                  <span>{detailedJobsStats.jobsByBranch['IS']} jobs</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-purple-500 h-4 rounded-full"
                    style={{ 
                      width: `${(detailedJobsStats.jobsByBranch['IS'] / stats.totalJobs) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applicant Trends */}
      {applicantTrends && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">Applicant Trends</h3>
          <div className="h-64 flex items-end justify-between">
            {applicantTrends.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="bg-blue-500 w-12 rounded-t-lg"
                  style={{ 
                    height: `${(item.applicants / Math.max(...applicantTrends.map(i => i.applicants))) * 180}px`
                  }}
                ></div>
                <div className="mt-2 text-xs text-gray-400">{item.month}</div>
                <div className="text-sm">{item.applicants}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-400 text-center">
            Number of applicants over recent months
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/tp-dashboard/jobs" 
            className="bg-blue-600 hover:bg-blue-700 text-center py-3 px-4 rounded"
          >
            View All Jobs
          </Link>
          <Link 
            to="/tp-dashboard/students" 
            className="bg-green-600 hover:bg-green-700 text-center py-3 px-4 rounded"
          >
            Browse Students
          </Link>
          <Link 
            to="/tp-dashboard/create-job" 
            className="bg-purple-600 hover:bg-purple-700 text-center py-3 px-4 rounded"
          >
            Create New Job
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Statistics;