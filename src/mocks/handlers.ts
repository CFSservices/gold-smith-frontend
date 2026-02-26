/**
 * Mock API handlers for development
 * 
 * These mock handlers simulate API responses when the backend is not available.
 * Use these for local development and testing.
 * 
 * To use mock data:
 * 1. Set VITE_ENABLE_MOCK_API=true in your .env file
 * 2. Import and use the mock functions in your API services
 */

import type {
  ApiResponse,
  AuthTokens,
  LoginResponse,
  ResetPasswordRequest,
  User,
  VerifyResetOtpResponse,
} from '@/types';
import { findUserByEmail, mockUsers, validateCredentials } from './data/users';
import { VERIFY_OTP_PURPOSE } from '@/types/auth.types';

// Helper to create API response wrapper
function createResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

// Helper to create error response
function createErrorResponse(message: string, statusCode: number = 400) {
  return {
    success: false,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  };
}

// Generate mock JWT tokens
function generateMockTokens(): AuthTokens {
  const mockAccessToken = `mock_access_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const mockRefreshToken = `mock_refresh_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  return {
    accessToken: mockAccessToken,
    refreshToken: mockRefreshToken,
    expiresIn: 3600,
    tokenType: 'Bearer',
  };
}

// Simulate network delay
function delay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock Login Handler
 * Note: Web app is admin-only. Non-admin users will be blocked by frontend validation.
 */
export async function mockLogin(
  email: string,
  password: string
): Promise<ApiResponse<LoginResponse>> {
  await delay(800); // Simulate network delay

  const user = validateCredentials(email, password);

  if (!user) {
    throw createErrorResponse('Invalid email or password', 401);
  }

  if (user.status !== 'active') {
    throw createErrorResponse('Your account is not active. Please contact support.', 403);
  }

  const tokens = generateMockTokens();
  const response: LoginResponse = {
    user,
    tokens,
  };

  return createResponse(response, 'Login successful');
}

/**
 * Mock Get Current User Handler
 */
export async function mockGetCurrentUser(userId: string): Promise<ApiResponse<User>> {
  await delay(300);

  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    throw createErrorResponse('User not found', 404);
  }

  return createResponse(user);
}

// In-memory store for mock: email -> OTP (use "123456" when testing)
const mockOtpStore = new Map<string, string>();
const MOCK_OTP = '123456';

/**
 * Mock Forgot Password Handler (sends OTP to email)
 */
export async function mockForgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
  await delay(600);

  findUserByEmail(email);

  mockOtpStore.set(email, MOCK_OTP);

  // Always return success to prevent email enumeration
  return createResponse(
    { message: 'If an account with that email exists, we sent a reset code to your email.' },
    'OTP sent'
  );
}

/**
 * Mock Verify Reset OTP Handler
 */
export async function mockVerifyResetOtp(
  email: string,
  otp: string,
  purpose: VERIFY_OTP_PURPOSE
): Promise<ApiResponse<VerifyResetOtpResponse>> {
  await delay(500);

  if (purpose !== VERIFY_OTP_PURPOSE.PASSWORD_RESET) {
    throw createErrorResponse('Invalid purpose', 400);
  }

  const expectedOtp = mockOtpStore.get(email);
  if (!expectedOtp || otp !== expectedOtp) {
    throw createErrorResponse('Invalid or expired OTP', 400);
  }

  const reset_token = `mock_reset_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  return createResponse({ reset_token }, 'OTP verified');
}

/**
 * Mock Reset Password Handler
 */
export async function mockResetPassword(
  data: ResetPasswordRequest
): Promise<ApiResponse<{ message: string }>> {
  await delay(500);

  if (!data.email || !data.new_password || !data.reset_token) {
    throw createErrorResponse('Missing required fields', 400);
  }

  return createResponse(
    { message: 'Your password has been reset successfully.' },
    'Password reset successful'
  );
}

/**
 * Mock Refresh Token Handler
 */
export async function mockRefreshToken(
  _refreshToken: string
): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
  await delay(200);

  const tokens = generateMockTokens();

  return createResponse({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
}

/**
 * Mock Logout Handler
 */
export async function mockLogout(): Promise<ApiResponse<void>> {
  await delay(200);
  return createResponse(undefined, 'Logged out successfully');
}

// Export all handlers
export const mockHandlers = {
  login: mockLogin,
  getCurrentUser: mockGetCurrentUser,
  forgotPassword: mockForgotPassword,
  verifyResetOtp: mockVerifyResetOtp,
  resetPassword: mockResetPassword,
  refreshToken: mockRefreshToken,
  logout: mockLogout,
};

export default mockHandlers;
