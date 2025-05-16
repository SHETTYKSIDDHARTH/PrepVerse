import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomeNavbar from '../components/HomeNavbar.jsx';
import { Mail, Key, LogIn, AlertCircle } from 'lucide-react';

function StudentLogin() {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Error and loading states
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear errors when typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    // Clear login error when typing
    if (loginError) {
      setLoginError('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.password) newErrors.password = "Password is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call login API
      const response = await axios.post('http://localhost:8000/student/login', formData);
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', 'student');
      
      // Redirect to dashboard
      navigate('/student-dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <HomeNavbar />
      
      <div className="flex justify-center items-center pt-28 pb-10">
        <div className="w-full max-w-md px-6">
          <div className="text-center mb-8">
            <h1 className="font-extrabold text-3xl tracking-tight flex items-center justify-center">
              <span className="text-red-500">Student</span>
              <span className="text-white ml-2">Login</span>
            </h1>
            <div className="mt-2 w-24 h-1 bg-red-500 mx-auto"></div>
          </div>
          
          {loginError && (
            <div className="bg-red-500/10 text-red-400 p-4 mb-6 rounded-lg border border-red-500/20 flex items-center">
              <AlertCircle size={18} className="mr-2 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}
          
          <div className="bg-zinc-900 p-8 rounded-lg shadow-lg border border-red-300/20">
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-2 mb-6">
                <label htmlFor="email" className="text-white block font-medium flex items-center">
                  <Mail size={16} className="mr-2 text-red-400" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md border ${errors.email ? 'border-red-400' : 'border-zinc-700'} focus:outline-none focus:ring-2 focus:ring-red-400`}
                    placeholder="example@email.com"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2 mb-8">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-white block font-medium flex items-center">
                    <Key size={16} className="mr-2 text-red-400" />
                    Password
                  </label>
                  <a href="/forgot-password" className="text-sm text-red-400 hover:text-red-300 transition-colors">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md border ${errors.password ? 'border-red-400' : 'border-zinc-700'} focus:outline-none focus:ring-2 focus:ring-red-400`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-500 hover:bg-red-600 transition-colors text-white py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 disabled:opacity-70 flex justify-center items-center"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <LogIn size={18} className="mr-2" />
                    Sign In
                  </span>
                )}
              </button>

              {/* Registration Link */}
              <div className="text-center text-zinc-400 mt-6">
                Don't have an account?{" "}
                <a href="/student-signup" className="text-red-400 hover:text-red-300 font-semibold transition-colors relative group">
                  Register Now
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>
            </form>
          </div>
          
  
        
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 py-6 text-center text-zinc-500 text-sm border-t border-zinc-800">
        <p>© {new Date().getFullYear()} <span className="font-extrabold tracking-tight"><span className="text-red-500">Prep</span><span className="text-white">Verse</span></span>. All rights reserved.</p>
      </div>
    </div>
  );
}

export default StudentLogin;