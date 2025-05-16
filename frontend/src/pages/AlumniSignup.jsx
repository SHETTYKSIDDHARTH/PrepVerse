import React, { useState, useEffect } from 'react';
import HomeNavbar from '../components/HomeNavbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, AtSign, Hash, Calendar, BookOpen, Lock, Linkedin, Building, Briefcase, Phone } from 'lucide-react';

function AlumniSignup() {
  const [formData, setFormData] = useState({
    fullname: '',
    usn: '',
    batch: '',
    email: '',
    department: '',
    password: '',
    linkedIn: '',
    company: '',
    currentRole: '',
    phone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showToast, setShowToast] = useState(false);
  const [batchYears, setBatchYears] = useState([]);
  const navigate = useNavigate();

  // Generate batch years from 1970 to current year
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1970; year--) {
      years.push(year);
    }
    setBatchYears(years);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      await axios.post('http://localhost:8000/alumni/register', {
        fullname: formData.fullname,
        usn: formData.usn,
        Batch: formData.batch,
        email: formData.email,
        department: formData.department,
        password: formData.password,
        linkedIn: formData.linkedIn,
        company: formData.company,
        currentRole: formData.currentRole,
        phone: formData.phone
      });
      
      setMessage({ text: 'Registration request submitted successfully!', type: 'success' });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/alumni-login'); 
      }, 3000);
      
    } catch (error) {
      console.log(error);
      setMessage({ text: 'Error in registering. Please try again.', type: 'error' });
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
      
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-red-500">Alumni</span> Registration
          </h1>
          <p className="mt-3 text-gray-400">Join our alumni network and stay connected with your alma mater</p>
        </div>
        
        <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-800">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
            <h2 className="text-xl font-bold">Create Your Alumni Account</h2>
            <p className="text-gray-100 mt-1 text-sm">Complete the form below to request registration</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Form grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-6">
                <div className="relative">
                  <label htmlFor="fullname" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-800 text-gray-400">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      className="rounded-r-md flex-1 w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <label htmlFor="usn" className="block text-sm font-medium text-gray-300 mb-1">USN</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-800 text-gray-400">
                      <Hash size={18} />
                    </span>
                    <input
                      type="text"
                      id="usn"
                      name="usn"
                      value={formData.usn}
                      onChange={handleChange}
                      className="rounded-r-md flex-1 w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <label htmlFor="batch" className="block text-sm font-medium text-gray-300 mb-1">Batch Year</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-800 text-gray-400">
                      <Calendar size={18} />
                    </span>
                    <select
                      id="batch"
                      name="batch"
                      value={formData.batch}
                      onChange={handleChange}
                      className="rounded-r-md flex-1 w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
                      required
                    >
                      <option value="" disabled>Select Graduation Year</option>
                      {batchYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
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
                  <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-1">Department</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-800 text-gray-400">
                      <BookOpen size={18} />
                    </span>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="rounded-r-md flex-1 w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Right column */}
              <div className="space-y-6">
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
                
                <div className="relative">
                  <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-300 mb-1">LinkedIn Profile</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-800 text-gray-400">
                      <Linkedin size={18} />
                    </span>
                    <input
                      type="url"
                      id="linkedIn"
                      name="linkedIn"
                      value={formData.linkedIn}
                      onChange={handleChange}
                      className="rounded-r-md flex-1 w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="https://linkedin.com/in/yourusername"
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-800 text-gray-400">
                      <Building size={18} />
                    </span>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="rounded-r-md flex-1 w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <label htmlFor="currentRole" className="block text-sm font-medium text-gray-300 mb-1">Current Role</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-800 text-gray-400">
                      <Briefcase size={18} />
                    </span>
                    <input
                      type="text"
                      id="currentRole"
                      name="currentRole"
                      value={formData.currentRole}
                      onChange={handleChange}
                      className="rounded-r-md flex-1 w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-800 text-gray-400">
                      <Phone size={18} />
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="rounded-r-md flex-1 w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
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
                    <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Registration Submitted Successfully!</p>
                    <p className="mt-1 text-sm text-gray-400">
                      Your registration is under admin consideration. You will be notified through email once approved.
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
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
                    Submitting...
                  </span>
                ) : 'Request Registration'}
              </button>
            </div>
            
            {/* Footer Section */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="text-center">
                <p className="text-gray-300">
                  Already registered? <a href="/alumni-login" className="text-red-400 hover:text-red-300 font-medium transition-colors duration-300">Login here</a>
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  Note: Your registration will be reviewed by an administrator. 
                  You will receive notification via email once approved.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AlumniSignup;