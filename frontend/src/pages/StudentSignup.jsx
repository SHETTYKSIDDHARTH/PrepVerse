import React, { useState } from 'react';
import axios from 'axios';
import HomeNavbar from '../components/HomeNavbar.jsx';
import { User, Mail, Key, FileText, Award, Code, Book, Phone, Briefcase, GraduationCap } from 'lucide-react';

function StudentSignup() {
  // Form state
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    sem: '',
    branch: '',
    usn: '',
    batch: '',
    skills: [],
    cgpa: '',
    email: '',
    password: '',
    resume: null
  });

  // Error state
  const [errors, setErrors] = useState({});
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  // Success state
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle skill selection
  const handleSkillChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      option => option.value
    );
    setFormData({
      ...formData,
      skills: value
    });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0]
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Enhanced validation
    const newErrors = {};
    if (!formData.fullname.trim()) newErrors.fullname = "Full name is required";
    if (!formData.usn.trim()) newErrors.usn = "USN is required";
    if (!formData.batch.trim()) newErrors.batch = "Batch is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    // New required fields validation
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone number must be 10 digits";
    
    if (!formData.sem.trim()) newErrors.sem = "Semester is required";
    
    if (!formData.branch) newErrors.branch = "Branch is required";
    
    // CGPA validation (required)
    if (!formData.cgpa) {
      newErrors.cgpa = "CGPA is required";
    } else if (isNaN(formData.cgpa) || parseFloat(formData.cgpa) < 0 || parseFloat(formData.cgpa) > 10) {
      newErrors.cgpa = "CGPA must be a number between 0 and 10";
    }
    
    // Skills validation
    if (formData.skills.length === 0) {
      newErrors.skills = "Select at least one skill";
    }
    
    // Resume validation (now required)
    if (!formData.resume) {
      newErrors.resume = "Resume is required";
    } else if (formData.resume.size > 5 * 1024 * 1024) { // 5MB limit
      newErrors.resume = "Resume size should not exceed 5MB";
    } else if (formData.resume.type !== 'application/pdf') {
      newErrors.resume = "Resume must be in PDF format";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      for (const key in formData) {
        if (key === 'skills' && Array.isArray(formData[key])) {
          formData[key].forEach(skill => {
            submitData.append('skills', skill);
          });
        } else {
          submitData.append(key, formData[key]);
        }
      }

      // Submit form
      const response = await axios.post('http://localhost:8000/student/student-signup', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess(true);
      // Reset form after successful submission
      setFormData({
        fullname: '',
        phone: '',
        sem: '',
        branch: '',
        usn: '',
        batch: '',
        skills: [],
        cgpa: '',
        email: '',
        password: '',
        resume: null
      });
      
      console.log('Signup successful:', response.data);
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: error.response?.data?.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Skill options for engineering students
  const skillOptions = [
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Cloud Computing",
    "Cybersecurity",
    "DevOps",
    "Blockchain",
    "Embedded Systems",
    "IoT Development",
    "Robotics",
    "VLSI Design",
    "CAD/CAM",
    "Mechanical Design",
    "3D Modelling",
    "PCB Design",
    "Microcontroller Programming",
    "Circuit Design",
    "Database Management",
    "Big Data Analytics",
    "Software Testing",
    "Computer Networks",
    "Digital Signal Processing",
    "Natural Language Processing",
    "Computer Vision",
    "Game Development",
    "Full Stack Development",
    "Backend Development",
    "Frontend Development",
    "System Administration",
    "Network Security",
    "Technical Writing",
    "Project Management",
    "Python Programming",
    "Java Programming",
    "C/C++ Programming",
    "JavaScript Programming",
    "Go Programming"
  ];

  return (
    <div className="min-h-screen bg-black">
      <HomeNavbar />
      
      <div className="flex justify-center items-center pt-28 pb-10">
        <div className="w-full max-w-3xl px-8">
          <div className="text-center mb-8">
            <h1 className="font-extrabold text-3xl tracking-tight flex items-center justify-center">
              <span className="text-red-500">Student</span>
              <span className="text-white ml-2">Registration</span>
            </h1>
            <div className="mt-2 w-24 h-1 bg-red-500 mx-auto"></div>
          </div>
          
          {success && (
            <div className="bg-green-600 text-white p-4 mb-6 rounded flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Registration successful! Please check your email for verification.
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-500 text-white p-4 mb-6 rounded flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              {errors.submit}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-8 rounded-lg shadow-lg border border-red-300/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullname" className="text-white block font-medium flex items-center">
                  <User size={16} className="mr-2 text-red-400" />
                  Full Name <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md border ${errors.fullname ? 'border-red-400' : 'border-zinc-700'} focus:outline-none focus:ring-2 focus:ring-red-400`}
                  placeholder="John Doe"
                />
                {errors.fullname && <p className="text-red-400 text-sm">{errors.fullname}</p>}
              </div>
              
              {/* Phone Number - New Required Field */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-white block font-medium flex items-center">
                  <Phone size={16} className="mr-2 text-red-400" />
                  Phone Number <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md border ${errors.phone ? 'border-red-400' : 'border-zinc-700'} focus:outline-none focus:ring-2 focus:ring-red-400`}
                  placeholder="9876543210"
                />
                {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}
              </div>
              
              {/* USN */}
              <div className="space-y-2">
                <label htmlFor="usn" className="text-white block font-medium flex items-center">
                  <Code size={16} className="mr-2 text-red-400" />
                  USN <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="usn"
                  name="usn"
                  value={formData.usn}
                  onChange={handleChange}
                  className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md border ${errors.usn ? 'border-red-400' : 'border-zinc-700'} focus:outline-none focus:ring-2 focus:ring-red-400`}
                  placeholder="1XX21XX000"
                />
                {errors.usn && <p className="text-red-400 text-sm">{errors.usn}</p>}
              </div>
              
              {/* Branch - New Required Field */}
              <div className="space-y-2">
                <label htmlFor="branch" className="text-white block font-medium flex items-center">
                  <Briefcase size={16} className="mr-2 text-red-400" />
                  Branch <span className="text-red-400 ml-1">*</span>
                </label>
                <select
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md border ${errors.branch ? 'border-red-400' : 'border-zinc-700'} focus:outline-none focus:ring-2 focus:ring-red-400`}
                >
                  <option value="" disabled>Select your branch</option>
                  <option value="CSE">Computer Science and Engineering (CSE)</option>
                  <option value="ISE">Information Science and Engineering (ISE)</option>
                  <option value="ECE">Electronics and Communication Engineering (ECE)</option>
                  <option value="AI-DS">Artificial Intelligence and Data Science (AI-DS)</option>
                  <option value="AI-ML">Artificial Intelligence and Machine Learning (AI-ML)</option>
                </select>
                {errors.branch && <p className="text-red-400 text-sm">{errors.branch}</p>}
              </div>
              
              {/* Semester - Dropdown for 1st to 8th semester */}
              <div className="space-y-2">
                <label htmlFor="sem" className="text-white block font-medium flex items-center">
                  <GraduationCap size={16} className="mr-2 text-red-400" />
                  Semester <span className="text-red-400 ml-1">*</span>
                </label>
                <select
                  id="sem"
                  name="sem"
                  value={formData.sem}
                  onChange={handleChange}
                  className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md border ${errors.sem ? 'border-red-400' : 'border-zinc-700'} focus:outline-none focus:ring-2 focus:ring-red-400`}
                >
                  <option value="" disabled>Select your semester</option>
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                  <option value="3">3rd Semester</option>
                  <option value="4">4th Semester</option>
                  <option value="5">5th Semester</option>
                  <option value="6">6th Semester</option>
                  <option value="7">7th Semester</option>
                  <option value="8">8th Semester</option>
                </select>
                {errors.sem && <p className="text-red-400 text-sm">{errors.sem}</p>}
              </div>
              
              {/* Batch */}
              <div className="space-y-2">
                <label htmlFor="batch" className="text-white block font-medium flex items-center">
                  <Book size={16} className="mr-2 text-red-400" />
                  Batch <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="batch"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md border ${errors.batch ? 'border-red-400' : 'border-zinc-700'} focus:outline-none focus:ring-2 focus:ring-red-400`}
                  placeholder="2021-2025"
                />
                {errors.batch && <p className="text-red-400 text-sm">{errors.batch}</p>}
              </div>
              
              {/* CGPA - Required */}
              <div className="space-y-2">
                <label htmlFor="cgpa" className="text-white block font-medium flex items-center">
                  <Award size={16} className="mr-2 text-red-400" />
                  CGPA <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="cgpa"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md border ${errors.cgpa ? 'border-red-400' : 'border-zinc-700'} focus:outline-none focus:ring-2 focus:ring-red-400`}
                  placeholder="0.00 - 10.00"
                />
                {errors.cgpa && <p className="text-red-400 text-sm">{errors.cgpa}</p>}
              </div>
              
              {/* Skills - Multiple Selection - Now Required */}
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label htmlFor="skills" className="text-white block font-medium flex items-center">
                  <Code size={16} className="mr-2 text-red-400" />
                  Skills (Select Multiple) <span className="text-red-400 ml-1">*</span>
                </label>
                <select
                  id="skills"
                  name="skills"
                  multiple
                  value={formData.skills}
                  onChange={handleSkillChange}
                  className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md border ${errors.skills ? 'border-red-400' : 'border-zinc-700'} focus:outline-none focus:ring-2 focus:ring-red-400 min-h-32`}
                >
                  {skillOptions.map((skill, index) => (
                    <option key={index} value={skill} className="bg-zinc-800 py-1">
                      {skill}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-zinc-400 mt-1">Hold Ctrl (or Cmd) to select multiple skills</p>
                {errors.skills && <p className="text-red-400 text-sm">{errors.skills}</p>}
                {formData.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-white block font-medium flex items-center">
                  <Mail size={16} className="mr-2 text-red-400" />
                  Email <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md border ${errors.email ? 'border-red-400' : 'border-zinc-700'} focus:outline-none focus:ring-2 focus:ring-red-400`}
                  placeholder="example@email.com"
                />
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
              </div>
              
              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-white block font-medium flex items-center">
                  <Key size={16} className="mr-2 text-red-400" />
                  Password <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md border ${errors.password ? 'border-red-400' : 'border-zinc-700'} focus:outline-none focus:ring-2 focus:ring-red-400`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
              </div>
            </div>
            
            {/* Resume Upload - Now Required */}
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label htmlFor="resume" className="text-white block font-medium flex items-center">
                <FileText size={16} className="mr-2 text-red-400" />
                Resume (PDF) <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="resume" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${errors.resume ? 'border-red-400' : 'border-zinc-600 hover:border-red-400'} transition-colors duration-300 group`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-zinc-400 group-hover:text-red-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-2 text-sm text-zinc-400 group-hover:text-white transition-colors duration-300">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-zinc-400">PDF only (MAX. 5MB)</p>
                  </div>
                  <input 
                    id="resume" 
                    name="resume"
                    onChange={handleFileChange}
                    type="file" 
                    accept=".pdf" 
                    className="hidden" 
                  />
                </label>
              </div>
              {errors.resume && <p className="text-red-400 text-sm">{errors.resume}</p>}
              {formData.resume && (
                <div className="flex items-center mt-2 text-sm text-zinc-400 bg-zinc-800/50 p-2 rounded border border-zinc-700">
                  <FileText size={16} className="mr-2 text-red-400" />
                  <span className="flex-1 truncate">{formData.resume.name}</span>
                  <span className="text-xs text-zinc-500 ml-2">
                    {formData.resume.size ? `(${(formData.resume.size / (1024 * 1024)).toFixed(2)} MB)` : ''}
                  </span>
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-500 hover:bg-red-600 transition-colors text-white py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Register Account"
                )}
              </button>
            </div>
            
            {/* Sign In Link */}
            <div className="text-center text-zinc-400 mt-4">
              Already have an account?{" "}
              <a href="/student-login" className="text-red-400 hover:text-red-300 font-semibold transition-colors relative group">
                Sign In
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
          </form>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 py-6 text-center text-zinc-500 text-sm border-t border-zinc-800">
        <p>© {new Date().getFullYear()} <span className="font-extrabold tracking-tight"><span className="text-red-500">Prep</span><span className="text-white">Verse</span></span>. All rights reserved.</p>
      </div>
    </div>
  );
}

export default StudentSignup;