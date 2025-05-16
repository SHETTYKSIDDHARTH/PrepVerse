import React, { useState, useEffect } from 'react';
import { UserCircle, Users, X, LogOut, Search, Check, Trash2, ExternalLink, AlertTriangle } from 'lucide-react';
import axios from 'axios';

function AdminDashboard() {
  const [pendingAlumni, setPendingAlumni] = useState([]);
  const [approvedAlumni, setApprovedAlumni] = useState([]);
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

  const fetchPendingAlumni = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await axios.get('http://localhost:8000/alumniAdmin/pending-alumni', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setPendingAlumni(response.data);
      }
    } catch (err) {
      setError("Failed to fetch pending alumni");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedAlumni = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await axios.get('http://localhost:8000/alumniAdmin/registered-alumni', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.data) {
        setApprovedAlumni(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch approved alumni");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAlumni();
    fetchApprovedAlumni();
  }, []);

  const handleAlumniAction = async (id, action) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (action === 'approve' || action === 'reject') {
        await axios.post('http://localhost:8000/alumniAdmin/handle-alumni', 
          { alumniId: id, decision: action },
          { headers: { 'Authorization': `Bearer ${token}` }}
        );
        
        // Refresh data
        fetchPendingAlumni();
        if (action === 'approve') fetchApprovedAlumni();
        
        // Show notification
        setNotification({
          type: 'success',
          message: `Alumni ${action === 'approve' ? 'approved' : 'rejected'} successfully`
        });
      } else if (action === 'delete') {
        await axios.delete(`http://localhost:8000/alumniAdmin/delete-alumni/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Refresh data
        fetchApprovedAlumni();
        
        // Show notification
        setNotification({
          type: 'success',
          message: 'Alumni deleted successfully'
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: `Failed to ${action} alumni`
      });
      console.error(err);
    }
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Filter alumni based on search term
  const filteredPendingAlumni = pendingAlumni.filter(alumni => 
    alumni.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumni.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumni.usn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApprovedAlumni = approvedAlumni.filter(alumni => 
    alumni.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumni.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumni.usn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate a sample profile picture with initials
  const getInitials = (name) => {
    if (!name) return "NA";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-black text-white transition-all duration-300 ease-in-out fixed h-full z-30 border-r border-gray-800`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className={`text-xl font-bold ${!sidebarOpen && 'hidden'}`}>
            <span className="text-red-400">Admin</span> Panel
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
                {pendingAlumni.length > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full bg-red-500">
                    {pendingAlumni.length}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button 
                className={`flex items-center p-3 rounded-lg w-full hover:bg-gray-800 ${activeTab === 'approved' && 'bg-red-400 text-white hover:bg-red-500'} transition-all duration-200`}
                onClick={() => setActiveTab('approved')}
              >
                <Users size={18} className={`${!sidebarOpen && 'mx-auto'}`} />
                {sidebarOpen && <span className="ml-3">Alumni Records</span>}
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
              {activeTab === 'pending' ? 'Pending Alumni Requests' : 'Alumni Directory'}
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
                <h3 className="text-lg font-medium text-white">Pending Approval ({filteredPendingAlumni.length})</h3>
                <span className="text-sm text-gray-400">Showing {filteredPendingAlumni.length} of {pendingAlumni.length} requests</span>
              </div>
              
              {filteredPendingAlumni.length === 0 ? (
                <div className="text-center py-16 bg-gray-900 rounded-lg shadow-md">
                  <AlertTriangle size={48} className="mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-medium text-white mb-2">No Pending Requests</h3>
                  <p className="text-gray-400">All alumni registration requests have been processed</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPendingAlumni.map((alumni) => (
                    <div key={alumni._id} className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-800 hover:shadow-lg transition-all duration-200">
                      <div className="bg-gray-800 p-4 flex items-center space-x-4 border-b border-gray-700">
                        <div className="w-12 h-12 rounded-full bg-red-400 flex items-center justify-center text-white font-bold">
                          {getInitials(alumni.fullname)}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{alumni.fullname}</h4>
                          <p className="text-sm text-gray-400">{alumni.email}</p>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-400 uppercase font-medium">USN</p>
                            <p className="text-white">{alumni.usn || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase font-medium">Phone</p>
                            <p className="text-white">{alumni.phone || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase font-medium">Current Role</p>
                            <p className="text-white">{alumni.currentRole || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase font-medium">Company</p>
                            <p className="text-white">{alumni.company || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleAlumniAction(alumni._id, 'approve')}
                            className="flex-1 flex items-center justify-center py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                          >
                            <Check size={16} className="mr-1" /> Approve
                          </button>
                          <button 
                            onClick={() => handleAlumniAction(alumni._id, 'reject')}
                            className="flex-1 flex items-center justify-center py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg transition-colors duration-200"
                          >
                            <Trash2 size={16} className="mr-1" /> Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'approved' ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-white">Alumni Directory ({filteredApprovedAlumni.length})</h3>
                <span className="text-sm text-gray-400">Showing {filteredApprovedAlumni.length} of {approvedAlumni.length} alumni</span>
              </div>
              
              {filteredApprovedAlumni.length === 0 ? (
                <div className="text-center py-16 bg-gray-900 rounded-lg shadow-md">
                  <Users size={48} className="mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-medium text-white mb-2">No Alumni Records</h3>
                  <p className="text-gray-400">No approved alumni found in the system</p>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Alumni
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            USN
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Current Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Company
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-900 divide-y divide-gray-800">
                        {filteredApprovedAlumni.map((alumni) => (
                          <tr key={alumni._id} className="hover:bg-gray-800 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-red-400 flex items-center justify-center text-white font-bold text-sm">
                                  {getInitials(alumni.fullname)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-white">{alumni.fullname}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{alumni.email}</div>
                              <div className="text-sm text-gray-400">+91 {alumni.phone || "N/A"}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {alumni.usn || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {alumni.currentRole || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {alumni.company || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {alumni.linkedInProfile && (
                                <a 
                                  href={alumni.linkedInProfile} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 inline-flex items-center mr-4"
                                >
                                  <ExternalLink size={16} className="mr-1" /> LinkedIn
                                </a>
                              )}
                              <button 
                                onClick={() => handleAlumniAction(alumni._id, 'delete')} 
                                className="text-red-400 hover:text-red-300 inline-flex items-center transition-colors duration-200"
                              >
                                <Trash2 size={16} className="mr-1" /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;