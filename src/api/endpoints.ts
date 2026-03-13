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

  // Orders
  orders: {
    list: '/orders',
    detail: (id: string | number) => `/orders/${id}`,
    create: '/orders',
    cancel: (id: string | number) => `/orders/${id}/cancel`,
    deliver: (id: string | number) => `/orders/${id}/deliver`,
    updateExpectedDelivery: (id: string | number) => `/orders/${id}/expected-delivery`,
    sendDeliveryOtp: (id: string | number) => `/orders/${id}/delivery/send-otp`,
    verifyDeliveryOtp: (id: string | number) => `/orders/${id}/delivery/verify-otp`,
    sendCancelOtp: (id: string | number) => `/orders/${id}/cancel/send-otp`,
    verifyCancelOtp: (id: string | number) => `/orders/${id}/cancel/verify-otp`,
    scanStock: (id: string | number) => `/orders/${id}/scan-stock`,
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
