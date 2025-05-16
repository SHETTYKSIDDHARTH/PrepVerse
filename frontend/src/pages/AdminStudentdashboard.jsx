import React, { useState, useEffect } from 'react';
import { UserCircle, Users, X, LogOut, Search, Check, Trash2, AlertTriangle, FileText, Mail, Phone, Calendar, BookOpen, Code } from 'lucide-react';
import axios from 'axios';

function AdminStudentDashboard() {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [acceptedStudents, setAcceptedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [notification, setNotification] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/';
  };

  const fetchPendingStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await axios.get('http://localhost:8000/alumniAdmin/pending-students', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.data) {
        setPendingStudents(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch pending students");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAcceptedStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await axios.get('http://localhost:8000/alumniAdmin/accepted-students', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.data) {
        setAcceptedStudents(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch accepted students");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingStudents();
    fetchAcceptedStudents();
  }, []);

  const handleStudentAction = async (id, action) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (action === 'accept' || action === 'reject') {
        await axios.post('http://localhost:8000/alumniAdmin/handle-student', 
          { studentId: id, decision: action },
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Refresh data
        fetchPendingStudents();
        if (action === 'accept') fetchAcceptedStudents();
        
        // Show notification
        setNotification({
          type: 'success',
          message: `Student ${action === 'accept' ? 'accepted' : 'rejected'} successfully`
        });
      } else if (action === 'delete') {
        await axios.delete(`http://localhost:8000/alumniAdmin/delete-student/${id}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Refresh data
        fetchAcceptedStudents();
        
        // Show notification
        setNotification({
          type: 'success',
          message: 'Student deleted successfully'
        });
      }
    } catch (err) {
      console.error('API Error:', err.response ? err.response.data : err.message);
      setNotification({
        type: 'error',
        message: `Failed to ${action} student: ${err.response ? err.response.data.message || err.message : err.message}`
      });
    }
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Filter students based on search term
  const filteredPendingStudents = pendingStudents.filter(student => 
    student.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.usn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAcceptedStudents = acceptedStudents.filter(student => 
    student.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.usn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate a sample profile picture with initials
  const getInitials = (name) => {
    if (!name) return "NA";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Get branch full name
  const getBranchFullName = (code) => {
    const branches = {
      'CSE': 'Computer Science & Engineering',
      'ISE': 'Information Science & Engineering',
      'ECE': 'Electronics & Communication Engineering',
      'AI-DS': 'AI & Data Science',
      'AI-ML': 'AI & Machine Learning'
    };
    
    return branches[code] || code;
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-black text-white transition-all duration-300 ease-in-out fixed h-full z-30 border-r border-gray-800`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className={`text-xl font-bold ${!sidebarOpen && 'hidden'}`}>
            <span className="text-red-400">Student</span> Admin
          </h1>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800"
          >
            {sidebarOpen ? <X size={20} /> : <Users size={20} />}
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li className={`mb-2 ${!sidebarOpen && 'text-center'}`}>
              {sidebarOpen && <p className="text-xs uppercase text-gray-400 mb-2">Management</p>}
            </li>
            <li>
              <button 
                className={`flex items-center p-3 rounded-lg w-full hover:bg-gray-800 ${activeTab === 'pending' && 'bg-red-400 text-white hover:bg-red-500'} transition-all duration-200`}
                onClick={() => setActiveTab('pending')}
              >
                <AlertTriangle size={18} className={`${!sidebarOpen && 'mx-auto'}`} />
                {sidebarOpen && <span className="ml-3">Pending Requests</span>}
                {pendingStudents.length > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full bg-red-500">
                    {pendingStudents.length}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button 
                className={`flex items-center p-3 rounded-lg w-full hover:bg-gray-800 ${activeTab === 'accepted' && 'bg-red-400 text-white hover:bg-red-500'} transition-all duration-200`}
                onClick={() => setActiveTab('accepted')}
              >
                <Users size={18} className={`${!sidebarOpen && 'mx-auto'}`} />
                {sidebarOpen && <span className="ml-3">Student Directory</span>}
              </button>
            </li>
            <li className="fixed bottom-4 pr-4">
              <button 
                className="flex items-center p-2 rounded-lg text-red-400 hover:text-white hover:bg-red-500 transition-all duration-200"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={18} className={`${!sidebarOpen && 'mx-auto'}`} />
                {sidebarOpen && <span className="ml-2">Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 overflow-hidden flex flex-col`}>
        {/* Top Bar */}
        <div className="bg-black p-4 flex items-center justify-between sticky top-0 z-20 border-b border-gray-800">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-white">
              {activeTab === 'pending' ? 'Pending Student Requests' : 'Student Directory'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <div className="w-10 h-10 rounded-full bg-red-400 flex items-center justify-center text-white">
              <UserCircle size={24} />
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-900 text-green-100 border-l-4 border-green-500' : 'bg-red-900 text-red-100 border-l-4 border-red-500'} transition-all duration-300`}>
            {notification.message}
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-400"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-8 bg-gray-900 rounded-lg shadow-md">
              <AlertTriangle size={48} className="mx-auto mb-4" />
              <p>{error}</p>
            </div>
          ) : activeTab === 'pending' ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-white">Pending Approval ({filteredPendingStudents.length})</h3>
                <span className="text-sm text-gray-400">Showing {filteredPendingStudents.length} of {pendingStudents.length} requests</span>
              </div>
              
              {filteredPendingStudents.length === 0 ? (
                <div className="text-center py-16 bg-gray-900 rounded-lg shadow-md">
                  <AlertTriangle size={48} className="mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-medium text-white mb-2">No Pending Requests</h3>
                  <p className="text-gray-400">All student registration requests have been processed</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPendingStudents.map((student) => (
                    <div key={student._id} className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-800 hover:shadow-lg transition-all duration-200">
                      <div className="bg-gray-800 p-4 flex items-center space-x-4 border-b border-gray-700">
                        <div className="w-12 h-12 rounded-full bg-red-400 flex items-center justify-center text-white font-bold">
                          {getInitials(student.fullname)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-white">{student.fullname}</h3>
                          <p className="text-sm text-gray-400">{getBranchFullName(student.branch)} | {student.sem} Semester</p>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Mail size={16} className="text-gray-500" />
                          <span className="text-sm">{student.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Phone size={16} className="text-gray-500" />
                          <span className="text-sm">{student.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <UserCircle size={16} className="text-gray-500" />
                          <span className="text-sm">{student.usn}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Calendar size={16} className="text-gray-500" />
                          <span className="text-sm">Batch: {student.batch}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <BookOpen size={16} className="text-gray-500" />
                          <span className="text-sm">CGPA: {student.cgpa}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-gray-300">
                            <Code size={16} className="text-gray-500" />
                            <span className="text-sm">Skills:</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {student.skills && student.skills.map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-800 text-xs rounded-full text-gray-300">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <FileText size={16} className="text-gray-500" />
                          <a 
                            href={student.resume} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:underline"
                          >
                            View Resume
                          </a>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-800 flex justify-between gap-4">
                        <button 
                          onClick={() => handleStudentAction(student._id, 'accept')}
                          className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <Check size={16} />
                          <span>Accept</span>
                        </button>
                        <button 
                          onClick={() => handleStudentAction(student._id, 'reject')}
                          className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <X size={16} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Accepted Students View
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-white">Student Directory ({filteredAcceptedStudents.length})</h3>
                <span className="text-sm text-gray-400">Showing {filteredAcceptedStudents.length} of {acceptedStudents.length} students</span>
              </div>
              
              {filteredAcceptedStudents.length === 0 ? (
                <div className="text-center py-16 bg-gray-900 rounded-lg shadow-md">
                  <Users size={48} className="mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-medium text-white mb-2">No Students Found</h3>
                  <p className="text-gray-400">{searchTerm ? 'Try a different search term' : 'No students have been accepted yet'}</p>
                </div>
              ) : (
                <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-md border border-gray-800">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800 text-gray-400 text-left">
                        <th className="p-4">Name</th>
                        <th className="p-4">USN</th>
                        <th className="p-4">Branch & Semester</th>
                        <th className="p-4">Batch</th>
                        <th className="p-4">CGPA</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {filteredAcceptedStudents.map((student) => (
                        <tr key={student._id} className="hover:bg-gray-800 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-red-400 flex items-center justify-center text-white font-bold">
                                {getInitials(student.fullname)}
                              </div>
                              <div>
                                <p className="font-medium text-white">{student.fullname}</p>
                                <p className="text-xs text-gray-400">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-300">{student.usn}</td>
                          <td className="p-4 text-gray-300">{student.branch} | {student.sem} Sem</td>
                          <td className="p-4 text-gray-300">{student.batch}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student.cgpa >= 8.0 ? 'bg-green-900 text-green-300' : 
                              student.cgpa >= 7.0 ? 'bg-blue-900 text-blue-300' : 
                              student.cgpa >= 6.0 ? 'bg-yellow-900 text-yellow-300' : 
                              'bg-red-900 text-red-300'
                            }`}>
                              {student.cgpa}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <a 
                                href={student.resume} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                title="View Resume"
                              >
                                <FileText size={16} />
                              </a>
                              <button 
                                onClick={() => handleStudentAction(student._id, 'delete')}
                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                title="Delete Student"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminStudentDashboard;