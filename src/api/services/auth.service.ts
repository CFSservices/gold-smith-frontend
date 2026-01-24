/**
 * Authentication API service
 */

import { api } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { env } from '@/config/env';
import { mockHandlers } from '@/mocks/handlers';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  User,
  ApiResponse,
} from '@/types';

// Check if mock API is enabled (evaluated at runtime)
const isMockEnabled = (): boolean => env.enableMockApi;

export const authService = {
  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    if (isMockEnabled()) {
      return mockHandlers.login(data.email, data.password);
    }
    return api.post<LoginResponse>(API_ENDPOINTS.auth.login, data);
  },

  /**
   * Register new user
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
    if (isMockEnabled()) {
      return mockHandlers.register({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });
    }
    return api.post<RegisterResponse>(API_ENDPOINTS.auth.register, data);
  },

  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse<void>> => {
    if (isMockEnabled()) {
      return mockHandlers.logout();
    }
    return api.post<void>(API_ENDPOINTS.auth.logout);
  },

  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    if (isMockEnabled()) {
      // For mock, we return the first user as current user
      // In real scenario, this would be based on the token
      return mockHandlers.getCurrentUser('1');
    }
    return api.get<User>(API_ENDPOINTS.auth.me);
  },

  /**
   * Forgot password - send reset email
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> => {
    if (isMockEnabled()) {
      return mockHandlers.forgotPassword(data.email);
    }
    return api.post<{ message: string }>(API_ENDPOINTS.auth.forgotPassword, data);
  },

  /**
   * Reset password with token
   */
  resetPassword: (data: ResetPasswordRequest) =>
    api.post<{ message: string }>(API_ENDPOINTS.auth.resetPassword, data),

  /**
   * Change password (authenticated)
   */
  changePassword: (data: ChangePasswordRequest) =>
    api.post<{ message: string }>(API_ENDPOINTS.auth.changePassword, data),

  /**
   * Verify email with token
   */
  verifyEmail: (token: string) =>
    api.post<{ message: string }>(API_ENDPOINTS.auth.verifyEmail, { token }),

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
    if (isMockEnabled()) {
      return mockHandlers.refreshToken(refreshToken);
    }
    return api.post<{ accessToken: string; refreshToken: string }>(
      API_ENDPOINTS.auth.refresh,
      { refreshToken }
    );
  },
};
