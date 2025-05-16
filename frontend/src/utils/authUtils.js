import axios from 'axios';

/**
 * Utility functions for authentication
 */

// Set up axios interceptor to handle expired/invalid tokens
export const setupAuthInterceptor = (navigate) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle 401 Unauthorized and 403 Forbidden errors
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Check if the error is auth-related
        const errorMsg = error.response.data?.message?.toLowerCase() || '';
        if (
          errorMsg.includes('unauthorized') ||
          errorMsg.includes('invalid token') ||
          errorMsg.includes('token expired') ||
          errorMsg.includes('pending approval')
        ) {
          // Clear stored token
          localStorage.removeItem('alumniToken');
          
          // Redirect to login page
          navigate('/alumni-login');
        }
      }
      return Promise.reject(error);
    }
  );
};

// Check if token exists
export const hasAuthToken = () => {
  return !!localStorage.getItem('alumniToken');
};

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem('alumniToken');
};

// Get auth header configuration for API calls
export const getAuthHeader = () => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Clear auth token
export const clearAuthToken = () => {
  localStorage.removeItem('alumniToken');
};

// Function to verify token with backend
export const verifyToken = async () => {
  try {
    const token = getAuthToken();
    if (!token) return false;
    
    const response = await axios.get('http://localhost:8000/alumni/verify', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data.verified;
  } catch (error) {
    console.error('Token verification error:', error);
    clearAuthToken();
    return false;
  }
};