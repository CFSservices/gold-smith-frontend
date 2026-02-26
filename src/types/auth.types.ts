/**
 * Authentication and Authorization types
 */

import type { BaseEntity, Status, UserRole } from './common.types';

// User entity
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  name: string;
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

// Forgot password request
export interface ForgotPasswordRequest {
  email: string;
}

// Verify reset OTP request/response
export interface VerifyResetOtpRequest {
  email: string;
  otp: string;
  purpose: VERIFY_OTP_PURPOSE;
}

export interface VerifyResetOtpResponse {
  reset_token: string;
}

// Reset password request (backend payload: email, new_password, reset_token)
export interface ResetPasswordRequest {
  email: string;
  new_password: string;
  reset_token: string;
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

// Optional: constant for reuse
export enum VERIFY_OTP_PURPOSE {
  PASSWORD_RESET = 'password_reset',
}
// Role permissions mapping
export type RolePermissions = Record<UserRole, Permission[]>;
