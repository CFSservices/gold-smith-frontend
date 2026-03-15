/**
 * Authentication API service
 */

import { env } from '@/config/env';
import { mockHandlers } from '@/mocks/handlers';
import type {
    ApiResponse,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    LoginResponse,
    ResetPasswordRequest,
    User,
    VerifyResetOtpRequest,
    VerifyResetOtpResponse,
} from '@/types';
import { api } from '../client';
import { API_ENDPOINTS } from '../endpoints';

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
   * Forgot password - send OTP to email
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> => {
    if (isMockEnabled()) {
      return mockHandlers.forgotPassword(data.email);
    }
    // console.log('data in forgotPassword:', data);
    return api.post<{ message: string }>(API_ENDPOINTS.auth.forgotPassword, data);
  },

  /**
   * Verify reset OTP (returns reset_token for reset password step)
   */
  verifyResetOtp: async (
    data: VerifyResetOtpRequest
  ): Promise<ApiResponse<VerifyResetOtpResponse>> => {
    if (isMockEnabled()) {
      return mockHandlers.verifyResetOtp(data.email, data.otp, data.purpose);
    }
    // console.log('data in verifyResetOtp:', data);
    return api.post<VerifyResetOtpResponse>(API_ENDPOINTS.auth.verifyResetOtp, data);
  },

  /**
   * Reset password (payload: email, new_password, reset_token)
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> => {
    if (isMockEnabled()) {
      return mockHandlers.resetPassword(data);
    }
    // console.log('data in resetPassword:', data);
    return api.post<{ message: string }>(API_ENDPOINTS.auth.resetPassword, data);
  },

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
