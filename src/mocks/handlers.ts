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

import type { ApiResponse, AuthTokens, LoginResponse, User } from '@/types';
import { findUserByEmail, mockUsers, validateCredentials } from './data/users';

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

/**
 * Mock Forgot Password Handler
 */
export async function mockForgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
  await delay(600);

  const user = findUserByEmail(email);

  // Always return success to prevent email enumeration
  return createResponse(
    { message: 'If an account with that email exists, we sent password reset instructions.' },
    'Password reset email sent'
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
  refreshToken: mockRefreshToken,
  logout: mockLogout,
};

export default mockHandlers;
