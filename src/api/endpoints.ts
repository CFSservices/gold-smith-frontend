/**
 * API Endpoints configuration
 */

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh-token',
    forgotPassword: '/auth/forgot-password',
    verifyResetOtp: '/auth/verify-otp',
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

  // Jewel Products
  jewelProducts: {
    list: '/products/getAllProducts',
    detail: (id: string) => `/products/getProduct/${id}`,
    create: '/products/createProduct',
    update: (id: string) => `/products/updateProduct/${id}`,
    toArchive: (id: string) => `/products/archiveProduct/${id}`,
    toPublish: (id: string) => `/products/unArchiveProduct/${id}`,
    delete: (id: string) => `/products/deleteProduct/${id}`,
  },

  // Stock Items
  stockManagement: {
    list: (productId: string) => `/stocks/${productId}/getStockItems`,
    detail: (id: string) => `/stock/getStock/${id}`,
    create: (productId: string) => `/stocks/${productId}/addNewStockItem`,
    update: (productId: string, id: string) => `/stocks/${productId}/${id}`,
    changeStatus: (id: string) => `/stocks/${id}/changeStatus`,
    delete: (productId: string, id: string) => `/stocks/${productId}/${id}`,
  },
} as const;

// Type for endpoints
export type ApiEndpoint = typeof API_ENDPOINTS;
