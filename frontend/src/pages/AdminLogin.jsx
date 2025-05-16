import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, User, Key, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import HomeNavbar from '../components/HomeNavbar';
function AdminLogin() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setSuccess('');
    setLoading(true);

    if (!adminId || !password) {
      setError('Please enter both Admin ID and Password');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000/alumniAdmin/login`, {
        loginId: adminId,
        password: password,
      }, {
        withCredentials: true,
      });

      if (response.data?.token) {
        const token = response.data.token;
        
        // Store token in localStorage instead of using context
        localStorage.setItem('adminToken', token);
        
        // Set the axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setSuccess('Admin login successful');
        
        // Navigate after a short delay to show the success message
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <HomeNavbar/>
    <div className="min-h-screen bg-black text-white overflow-hidden flex items-center justify-center">
      {/* Modern Grid Background */}
      <div className="grid-background fixed inset-0 w-full h-full z-0 opacity-40"></div>
      
      {/* Interactive Gradient Background that follows mouse position */}
      <div 
        className="fixed inset-0 z-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(239, 68, 68, 0.15), transparent 60%)`
        }}
      ></div>
      
      {/* Subtle animated gradients */}
      <div className="fixed top-0 left-0 w-full h-full z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse" 
             style={{animationDelay: '2s', animationDuration: '8s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4 mt-24">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold relative z-10 pb-2 inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-500">Prep</span>
            <span>Verse</span>
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-red-400 to-red-500 mx-auto mt-2"></div>
        </div>

        {/* Login Card */}
        <div className="backdrop-blur-md bg-gray-900/70 rounded-2xl overflow-hidden border border-gray-800 shadow-xl">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 p-6 border-b border-gray-800">
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-gray-800/50 w-12 h-12 rounded-xl flex items-center justify-center">
                <Lock className="h-6 w-6 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Admin Login</h2>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6">
            {error && (
              <div className="flex items-center space-x-2 bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded-lg mb-6">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="flex items-center space-x-2 bg-green-900/30 border border-green-800 text-green-200 px-4 py-3 rounded-lg mb-6">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Admin ID Field */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">Admin ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <input 
                      type="text" 
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      className="bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full pl-10 p-3"
                      placeholder="Enter your admin ID"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-500" />
                    </div>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full pl-10 p-3"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ease-in-out"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Login
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Card Footer */}
          <div className="mt-6 p-3 bg-slate-700/30 border border-slate-600 rounded-lg text-sm text-gray-300">
              <p className="font-semibold mb-1 text-red-300">Admin Access Only</p>
              <p>This portal is restricted to authorized HackMatch administrators only. Unauthorized access attempts will be logged and reported.</p>
            </div>
        </div>

        {/* Footer note */}
        <div className="text-center mt-6 text-gray-500 text-xs">
          © 2025 PrepVerse. All rights reserved.
        </div>
      </div>

      {/* CSS for grid background */}
      <style jsx>{`
        .grid-background {
          --gap: 5em;
          --line: 1px;
          --color: rgba(255, 255, 255, 0.1);
          background-image: linear-gradient(
              -90deg,
              transparent calc(var(--gap) - var(--line)),
              var(--color) calc(var(--gap) - var(--line) + 1px),
              var(--color) var(--gap)
            ),
            linear-gradient(
              0deg,
              transparent calc(var(--gap) - var(--line)),
              var(--color) calc(var(--gap) - var(--line) + 1px),
              var(--color) var(--gap)
            );
          background-size: var(--gap) var(--gap);
        }
      `}</style>
    </div>
    </>
  );
}

export default AdminLogin;