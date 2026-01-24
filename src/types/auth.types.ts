/**
 * Authentication and Authorization types
 */

import type { BaseEntity, UserRole, Status } from './common.types';

// User entity
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: Status;
  emailVerified: boolean;
  lastLoginAt?: string;
}

// Auth tokens
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

// Login request
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Login response
export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

// Register request
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  acceptTerms: boolean;
}

// Register response
export interface RegisterResponse {
  user: User;
  message: string;
}

// Forgot password request
export interface ForgotPasswordRequest {
  email: string;
}

// Reset password request
export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// Change password request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Update profile request
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

// Auth state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Permission
export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

// Role permissions mapping
export type RolePermissions = Record<UserRole, Permission[]>;
