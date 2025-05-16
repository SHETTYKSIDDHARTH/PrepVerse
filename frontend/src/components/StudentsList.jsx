
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

// StudentsList component
export function StudentsList() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    minimumCGPA: '',
    branches: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (filterParams = {}) => {
    try {
      const token = localStorage.getItem('tpToken');
      if (!token) {
        navigate('/login');
        return;
      }

      // Build query string from filter parameters
      let queryString = '';
      if (filterParams.minimumCGPA) {
        queryString += `minimumCGPA=${filterParams.minimumCGPA}&`;
      }
      if (filterParams.branches && filterParams.branches.length > 0) {
        queryString += `branches=${filterParams.branches.join(',')}&`;
      }

      const response = await axios.get(`http://localhost:8000/tp/students?${queryString}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('tpToken');
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleBranchChange = (e) => {
    const { value, checked } = e.target;
    setFilters(prev => {
      if (checked) {
        return { ...prev, branches: [...prev.branches, value] };
      } else {
        return { ...prev, branches: prev.branches.filter(branch => branch !== value) };
      }
    });
  };

  const applyFilters = () => {
    setLoading(true);
    fetchStudents(filters);
  };

  const resetFilters = () => {
    setFilters({
      minimumCGPA: '',
      branches: []
    });
    setLoading(true);
    fetchStudents({});
  };

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-3xl font-bold mb-4">Eligible Students</h2>
        <div className="text-gray-400">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Eligible Students</h2>
      
      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Minimum CGPA</label>
            <input
              type="number"
              name="minimumCGPA"
              value={filters.minimumCGPA}
              onChange={handleFilterChange}
              step="0.1"
              min="0"
              max="10"
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="e.g. 7.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Branches</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="cse"
                  value="CSE"
                  checked={filters.branches.includes('CSE')}
                  onChange={handleBranchChange}
                  className="mr-2"
                />
                <label htmlFor="cse">Computer Science (CSE)</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is"
                  value="IS"
                  checked={filters.branches.includes('IS')}
                  onChange={handleBranchChange}
                  className="mr-2"
                />
                <label htmlFor="is">Information Science (IS)</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ece"
                  value="ECE"
                  checked={filters.branches.includes('ECE')}
                  onChange={handleBranchChange}
                  className="mr-2"
                />
                <label htmlFor="ece">Electronics & Communication (ECE)</label>
              </div>
            </div>
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      {/* Students List */}
      {students.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-gray-400">No students found matching the criteria</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">USN</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Branch</th>
                <th className="px-4 py-3 text-center">CGPA</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-t border-gray-700">
                  <td className="px-4 py-3">{student.fullname}</td>
                  <td className="px-4 py-3">{student.usn}</td>
                  <td className="px-4 py-3">{student.email}</td>
                  <td className="px-4 py-3">{student.branch}</td>
                  <td className="px-4 py-3 text-center">{student.cgpa}</td>
                  <td className="px-4 py-3 text-center">
                    <Link 
                      to={`/tp-dashboard/jobs?studentId=${student._id}`}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                    >
                      Assign Job
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
