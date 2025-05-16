import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FindBuddiesComponent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/student/student-nobuddy`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        }
      );
      
      if (response.data.success) {
        setStudents(response.data.students);
      } else {
        setError('Failed to fetch students');
      }
    } catch (err) {
      setError('Error fetching students: ' + (err.response?.data?.message || err.message));
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const sendBuddyRequest = async (buddyId) => {
    if (requestInProgress) return;
    
    setRequestInProgress(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/student/send-buddy-request`,
        { buddyId },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Buddy request sent successfully!');
        setStudents(students.filter(student => student._id !== buddyId));
      } else {
        toast.error(response.data.message || 'Failed to send request');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send buddy request');
    } finally {
      setRequestInProgress(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.usn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter ? student.branch === branchFilter : true;
    const matchesSemester = semesterFilter ? student.sem === semesterFilter : true;
    
    return matchesSearch && matchesBranch && matchesSemester;
  });

  const branches = [...new Set(students.map(student => student.branch))];
  const semesters = [...new Set(students.map(student => student.sem))];

  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
        <button 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={fetchStudents}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Find Study Buddies</h2>
      
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input
            type="text"
            placeholder="Search by name or USN..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <select 
            className="w-full p-2 border rounded"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
          >
            <option value="">All Branches</option>
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>
        
        <div>
          <select 
            className="w-full p-2 border rounded"
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
          >
            <option value="">All Semesters</option>
            {semesters.map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center p-4 bg-gray-50 rounded">
          <p className="text-gray-500">No study buddies available matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map(student => (
            <div key={student._id} className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg">{student.fullname}</h3>
              <p className="text-gray-600 text-sm">USN: {student.usn}</p>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>Branch: {student.branch}</span>
                <span>Semester: {student.sem}</span>
              </div>
              <button
                className="mt-3 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                onClick={() => sendBuddyRequest(student._id)}
                disabled={requestInProgress}
              >
                {requestInProgress ? 'Sending Request...' : 'Send Buddy Request'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindBuddiesComponent;