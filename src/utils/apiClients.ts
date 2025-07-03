import axios from 'axios';

// Main API client for barber-core-api
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_WEB_BASE_URL as string}/api/v1`,
});

// Add request interceptor to include JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh and error messages
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${import.meta.env.VITE_API_WEB_BASE_URL as string}/api/v1/auth/refresh`,
            { refreshToken }
          );
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    
    // Extract user-friendly error message from the response
    if (error.response?.data?.error) {
      error.message = error.response.data.error;
    } else if (error.response?.data?.message) {
      error.message = error.response.data.message;
    } else if (error.response?.status === 500) {
      error.message = 'Something went wrong. Please try again.';
    } else if (error.response?.status === 404) {
      error.message = 'The requested resource was not found.';
    } else if (!error.response) {
      error.message = 'Unable to connect to the server. Please check your internet connection.';
    }
    
    return Promise.reject(error);
  }
);

// Keep apiSquare for backward compatibility (will be removed later)
const apiSquare = apiClient;

export { apiClient, apiSquare };
