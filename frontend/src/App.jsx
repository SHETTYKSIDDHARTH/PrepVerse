import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

// Pages
import LandingPage from './pages/Landingpage';
import AdminLogin from './pages/AdminLogin';
import StudentSignup from './pages/StudentSignup';
import StudentLogin from './pages/StudentLogin';
import AlumniLogin from './pages/AlumniLogin';
import AlumniSignup from './pages/AlumniSignup';
import AdminDashboard from './pages/AdminDashboard';
import TpLogin from './pages/TpLogin';
import TpSignup from './pages/TpSignup';
import AlumniDashboard from './pages/AlumniDashboard';
import StudentDashboard from './pages/StudentDashboard';

// Protected Routes
import AdminProtectedRoutes from './ProtectedRoutes/AdminProtectedRoutes';
import AlumniProtectedRoute from './ProtectedRoutes/AlumniProtectedRoute';
import Postinterview from '../src/components/Postinterview'
// Auth Utilities
import { setupAuthInterceptor } from './utils/authUtils';
import PostJob from './components/Postjob';
import AlumnigetJobs from './components/AlumnigetJobs';
import JobpostedbyAlumni from './components/JobpostedbyAlumni';
import AdminStudentDashboard from './pages/AdminStudentdashboard';
// import StudentDashboard from './pages/StudentDashboard';
import StudentProtectedRoutes from './ProtectedRoutes/StudentProtectedRoutes'
import TpDashboard from './pages/TpDashboard';
import TpProtectedRoutes from './ProtectedRoutes/TpProtectedRotues';

import TPDashboard from './components/TPDashboard';
// import Nobuddies from './components/Nobuddies';
function App() {
  const navigate = useNavigate();
  
  // Set up axios interceptor for auth errors
  useEffect(() => {
    setupAuthInterceptor(navigate);
  }, [navigate]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/student-signup" element={<StudentSignup />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/alumni-login" element={<AlumniLogin />} />
      <Route path="/alumni-signup" element={<AlumniSignup />} />
      <Route path="/tplogin" element={<TpLogin />} />
      <Route path="/tpsignup" element={<TpSignup />} />

<Route element={<TpProtectedRoutes />}>
  <Route path="/tp-dashboard/*" element={<TPDashboard />} />
</Route>
      {/* Protected Admin Routes */}
      <Route element={<AdminProtectedRoutes />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/AdminStudent" element={<AdminStudentDashboard />} />
        {/* Add other admin protected routes here */}
      </Route>

      {/* Protected Alumni Routes */}
      <Route element={<AlumniProtectedRoute />}>
        <Route path="/alumni-dashboard" element={<AlumniDashboard />} />
        {/* Add other alumni protected routes here */}
        <Route path='/alumni-dashboard/postjob' element={<PostJob/>}/>
        <Route path='/alumni-dashboard/postint' element={<Postinterview/>}/>
        <Route path='/alumni-dashboard/getalljobs' element={<AlumnigetJobs/>}/>
        <Route path='/alumni-dashboard/getjobpostedbyalumni' element={<JobpostedbyAlumni/>}/>

      </Route>
      <Route element={<StudentProtectedRoutes/>}>
         <Route path="/student-dashboard" element={<StudentDashboard/>} />
         {/* <Route path="/student-nobuddies" element={<Nobuddies/>} /> */}
      </Route>



    </Routes>

    
     
    
  );
}

export default App;