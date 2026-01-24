/**
 * API-related types
 */

import type { FieldError } from './common.types';

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// API Error response
export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
  errors?: FieldError[];
  timestamp: string;
  path?: string;
}

// Request config
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  withCredentials?: boolean;
}

// API Endpoints
export interface ApiEndpoints {
  auth: {
    login: string;
    register: string;
    logout: string;
    refresh: string;
    forgotPassword: string;
    resetPassword: string;
    verifyEmail: string;
    me: string;
  };
  users: {
    list: string;
    detail: (id: string) => string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
  };
  // Add more endpoint groups as needed
}

// Query keys for React Query
export const QueryKeys = {
  // Auth
  currentUser: ['auth', 'currentUser'] as const,
  
  // Users
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  
  // Add more query keys as needed
} as const;

// Mutation keys
export const MutationKeys = {
  login: ['auth', 'login'] as const,
  register: ['auth', 'register'] as const,
  logout: ['auth', 'logout'] as const,
  // Add more mutation keys as needed
} as const;
