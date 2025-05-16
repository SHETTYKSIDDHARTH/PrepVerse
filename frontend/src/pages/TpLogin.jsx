import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import HomeNavbar from '../components/HomeNavbar';

function TpLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate form
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/tp/login', {
        email,
        password
      });

      if (response.data && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('tpToken', response.data.token);
        localStorage.setItem('tpName', response.data.name);
        localStorage.setItem('tpId', response.data._id);
        console.log(localStorage.getItem('tpId'))
        // Redirect to dashboard
        setLoading(false);
        navigate('/tp-dashboard');
      } else {
        setError('Login failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <HomeNavbar />
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <Briefcase size={24} className="text-red-400" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold">Training & Placement Login</h2>
            <p className="mt-2 text-sm text-gray-400">
              Enter your credentials to access the dashboard
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-800">
            {error && (
              <div className="mb-4 flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-3 rounded-md">
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 text-red-400 focus:ring-red-400 border-gray-700 rounded bg-gray-800"
                  />
                  <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-red-400 hover:text-red-300 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 font-medium transition-colors duration-300 disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      Sign in
                      <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Need an account?{" "}
              <a href="/tp-register" className="font-medium text-red-400 hover:text-red-300 transition-colors">
                Register as TP Department
              </a>
            </p>
          </div>
        </div>
      </div>
      
      <footer className="mt-auto py-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} PrepVerse. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default TpLogin;