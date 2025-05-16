import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';

function AlumniProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('alumniToken');
        
        // If no token exists, redirect to login immediately
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify token with the backend
        const response = await axios.get('http://localhost:8000/alumni/verify', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Check if verification was successful
        if (response.data && response.data.verified) {
          setIsAuthenticated(true);
        } else {
          // Token exists but isn't valid
          localStorage.removeItem('alumniToken');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        // Clear invalid token
        localStorage.removeItem('alumniToken');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-red-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-red-400 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Either render the protected content or redirect to login
  return isAuthenticated ? <Outlet /> : <Navigate to="/alumni-login" replace />;
}

export default AlumniProtectedRoute;