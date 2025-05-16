import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminProtectedRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify token validity with the backend
        const response = await axios.get('http://localhost:8000/alumniAdmin/verify-token', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.valid) {
          // Set up axios headers for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setIsAuthenticated(true);
        } else {
          // Token invalid, clear it
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication verification failed:', error);
        
        // On error, assume user is not authenticated
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [navigate]);

  // Add a global interceptor for handling expired tokens during requests
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // Clear token and redirect to login
          localStorage.removeItem('adminToken');
          navigate('/admin-login');
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptor when component unmounts
    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate]);

  if (isLoading) {
    // You can replace this with a proper loading component
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin-login" />;
}

export default AdminProtectedRoutes;