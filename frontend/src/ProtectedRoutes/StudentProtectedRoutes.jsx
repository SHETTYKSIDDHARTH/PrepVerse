import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';

function StudentProtectedRoutes() {
  const [isAuth, setIsAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        // If no token exists, set auth to false
        if (!token) {
          setIsAuth(false);
          setIsLoading(false);
          return;
        }
        
        // Verify token with backend
        const response = await axios.get('http://localhost:8000/student/verify-token', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // If verification successful, set auth to true
        if (response.data.success) {
          setIsAuth(true);
        } else {
          // If verification failed, set auth to false and remove token
          setIsAuth(false);
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        // On error, set auth to false and remove any stored tokens
        setIsAuth(false);
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Show loading state while verifying
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-white font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  
  return isAuth ? <Outlet /> : <Navigate to="/student-login" replace />;
}

export default StudentProtectedRoutes;