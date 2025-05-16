
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export function Profile() {
  const [profile, setProfile] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('tpToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8000/tp/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(response.data);
      setFormData({
        name: response.data.name,
        phone: response.data.phone,
        department: response.data.department
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('tpToken');
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('tpToken');
      if (!token) {
        navigate('/login');
        return;
      }

      // This endpoint needs to be implemented in your backend
      await axios.put('http://localhost:8000/tp/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile({
        ...profile,
        name: formData.name,
        phone: formData.phone,
        department: formData.department
      });
      
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-3xl font-bold mb-4">Profile</h2>
        <div className="text-gray-400">Loading profile information...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Profile</h2>
      
      {success && (
        <div className="mb-6 p-4 bg-green-600 rounded-lg">
          <p className="text-white">Profile updated successfully!</p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-600 rounded-lg">
          <p className="text-white">{error}</p>
        </div>
      )}
      
      <div className="bg-gray-800 p-6 rounded-lg">
        {editing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white opacity-70"
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Name</h3>
                <p className="text-lg">{profile.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Email</h3>
                <p className="text-lg">{profile.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Phone</h3>
                <p className="text-lg">{profile.phone || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Department</h3>
                <p className="text-lg">{profile.department || 'Not provided'}</p>
              </div>
            </div>
            
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-8 bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Account Security</h3>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-400">Change Password</h4>
          <p className="text-gray-400 mt-1">
            Password changes are managed by the system administrator.
            Please contact them if you need to reset your password.
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-400">Account Creation Date</h4>
          <p className="text-gray-400 mt-1">
            {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
          </p>
        </div>
      </div>
    </div>
  );
}
