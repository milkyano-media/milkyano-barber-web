import axios from 'axios';

// Dashboard API client for connecting to barber-dash-api
const dashboardApi = axios.create({
  baseURL: `${import.meta.env.VITE_DASHBOARD_API_URL || 'http://localhost:3001'}/api/v2`,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor (if authentication is needed in the future)
dashboardApi.interceptors.request.use(
  (config) => {
    // Add authentication headers if needed in the future
    // const token = localStorage.getItem('dashboardToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
dashboardApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Get team members with their display order from the dashboard API
 * This will be used to sync barber ordering between BookList and BarberManagement
 * @returns Promise with team members data including displayOrder
 */
export const getTeamMembersDisplayOrder = async (): Promise<any> => {
  try {
    const response = await dashboardApi.get('/teams/members');
    
    // The API returns { success: true, data: [...] }
    if (response.data?.success && response.data?.data) {
      return { data: response.data.data };
    }
    
    return null;
  } catch (error: any) {
    // Return null so BookList can fallback to hardcoded ordering
    return null;
  }
};

export default dashboardApi;