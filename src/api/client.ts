/**
 * Axios API Client with interceptors
 */

import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError, ApiResponse } from '@/types';
import { env, AUTH_KEYS, debugLog } from '@/config/env';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/utils/storage';
import { useAuthStore } from '@/store/authStore';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Token management
export const setAuthToken = (token: string): void => {
  setStorageItem(AUTH_KEYS.accessToken, token);
};

export const clearAuthToken = (): void => {
  removeStorageItem(AUTH_KEYS.accessToken);
  removeStorageItem(AUTH_KEYS.refreshToken);
};

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token to request
    const token = getStorageItem<string>(AUTH_KEYS.accessToken);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug logging
    debugLog(`API Request: ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },
  (error: AxiosError) => {
    debugLog('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    debugLog(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    debugLog('API Response Error:', error.response?.data);

    // Handle 401 Unauthorized - Token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getStorageItem<string>(AUTH_KEYS.refreshToken);
        
        if (refreshToken) {
          // Attempt to refresh token
          const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
            `${env.apiBaseUrl}/auth/refresh`,
            { refreshToken }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          // Update tokens
          setStorageItem(AUTH_KEYS.accessToken, accessToken);
          setStorageItem(AUTH_KEYS.refreshToken, newRefreshToken);

          // Update auth header and retry
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        const { logout } = useAuthStore.getState();
        logout();
        
        // Redirect to login
        window.location.href = '/login';
      }
    }

    // Handle other errors
    const apiError: ApiError = error.response?.data ?? {
      success: false,
      message: error.message || 'An unexpected error occurred',
      statusCode: error.response?.status ?? 500,
      timestamp: new Date().toISOString(),
    };

    return Promise.reject(apiError);
  }
);

// Generic request methods
export const api = {
  get: <T>(url: string, config?: object) =>
    apiClient.get<ApiResponse<T>>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: object, config?: object) =>
    apiClient.post<ApiResponse<T>>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: object, config?: object) =>
    apiClient.put<ApiResponse<T>>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: object, config?: object) =>
    apiClient.patch<ApiResponse<T>>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: object) =>
    apiClient.delete<ApiResponse<T>>(url, config).then((res) => res.data),
};

export default apiClient;
