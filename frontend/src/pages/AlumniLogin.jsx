import React, { useState, useEffect } from 'react';
import HomeNavbar from '../components/HomeNavbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AtSign, Lock } from 'lucide-react';

function AlumniLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('alumniToken');
      if (token) {
        try {
          const response = await axios.get('http://localhost:8000/alumni/verify', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data && response.data.verified) {
            // If already authenticated, redirect to dashboard
            navigate('/alumni-dashboard');
          } else {
            // Invalid token, remove it
            localStorage.removeItem('alumniToken');
          }
        } catch (error) {
          console.error("Auth check error:", error);
          localStorage.removeItem('alumniToken');
        }
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form inputs
    if (!formData.email || !formData.password) {
      setMessage({ text: 'Email and password are required', type: 'error' });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const response = await axios.post('http://localhost:8000/alumni/login', {
        email: formData.email,
        password: formData.password
      });
      
      // Check if token was received
      if (!response.data || !response.data.token) {
        throw new Error('No token received from server');
      }
      
      // Store token in localStorage
      localStorage.setItem('alumniToken', response.data.token);
      
      setMessage({ text: 'Login successful!', type: 'success' });
      setShowToast(true);
      
      // Navigate after a short delay
      setTimeout(() => {
        setShowToast(false);
        navigate('/alumni-dashboard');
      }, 1500);
      
    } catch (error) {
      console.error("Login error:", error);
      
      const errorMessage = error.response?.data?.message || 
                         'Login failed. Please check your credentials.';
      
      setMessage({ text: errorMessage, type: 'error' });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Add styles for toast animation
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-20px); }
        10% { opacity: 1; transform: translateY(0); }
        90% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
      }
      .animate-fade-in-out {
        animation: fadeInOut 3s ease-in-out;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <HomeNavbar />
      
      <div className="max-w-md mx-auto px-4 pt-24 pb-12">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-red-500">Alumni</span> Login
          </h1>
          <p className="mt-3 text-gray-400">Access your alumni network and stay connected</p>
        </div>
        
        <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-800">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
            <h2 className="text-xl font-bold">Sign In to Your Account</h2>
            <p className="text-gray-100 mt-1 text-sm">Enter your credentials to access your alumni profile</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-800 text-gray-400">
                    <AtSign size={18} />
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-r-md flex-1 w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-800 text-gray-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="rounded-r-md flex-1 w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-700 rounded bg-gray-800"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-red-400 hover:text-red-300 transition-colors duration-300">
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>
            
            {/* Status message */}
            {message.text && (
              <div className={`mt-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                {message.text}
              </div>
            )}
            
            {/* Toast Notification */}
            {showToast && (
              <div className="fixed top-24 right-5 bg-gray-900 text-white p-4 rounded-md shadow-lg z-50 max-w-md animate-fade-in-out border-l-4 border-red-500">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {message.type === 'success' ? (
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">
                      {message.type === 'success' ? 'Login Successful!' : 'Login Failed'}
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      {message.text}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      type="button"
                      onClick={() => setShowToast(false)}
                      className="inline-flex text-gray-400 hover:text-white"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Submit button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 disabled:opacity-70 transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </button>
            </div>
            
            {/* Footer Section */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="text-center">
                <p className="text-gray-300">
                  Don't have an account? <a href="/alumni-signup" className="text-red-400 hover:text-red-300 font-medium transition-colors duration-300">Register here</a>
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  Note: All alumni accounts require administrator approval.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AlumniLogin;