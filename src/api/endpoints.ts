/**
 * API Endpoints configuration
 */

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    me: '/auth/me',
    changePassword: '/auth/change-password',
  },

  // Users
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
    create: '/users',
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
    profile: '/users/profile',
    updateProfile: '/users/profile',
  },

  // Merchants
  merchants: {
    list: '/merchants',
    detail: (id: string) => `/merchants/${id}`,
    create: '/merchants',
    update: (id: string) => `/merchants/${id}`,
    delete: (id: string) => `/merchants/${id}`,
  },

  // Dashboard
  dashboard: {
    stats: '/dashboard/stats',
    recentActivity: '/dashboard/recent-activity',
    charts: '/dashboard/charts',
  },
} as const;

// Type for endpoints
export type ApiEndpoint = typeof API_ENDPOINTS;
