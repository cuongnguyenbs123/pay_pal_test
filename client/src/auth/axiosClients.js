import axios from 'axios';
import { getCookie } from './cookies';

const API_BASE =
  process.env.REACT_APP_API_URL !== undefined
    ? process.env.REACT_APP_API_URL
    : 'http://localhost:8000';

// Default API client: attaches access token (if present in cookie)
export const apiClient = axios.create({
  baseURL: API_BASE,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getCookie('access_token');
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Auth client: needs cookies for refresh flow
export const authClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Refresh-only request client to avoid infinite loops.
const refreshClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export async function refreshAccessToken() {
  const res = await refreshClient.post('/api/auth/refresh');
  return res.data?.accessToken || res.data?.token || null;
}

export function setupAuthRefreshInterceptor() {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (!originalRequest) throw error;

      // Avoid infinite retry loops
      if (originalRequest._retry) throw error;

      if (error.response?.status === 401) {
        originalRequest._retry = true;
        const newAccessToken = await refreshAccessToken();

        if (!newAccessToken) {
          throw error;
        }

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      }

      throw error;
    },
  );
}

// Call once at module import time
setupAuthRefreshInterceptor();

