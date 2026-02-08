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

import type { LoginResponse, RegisterResponse, User, AuthTokens, ApiResponse } from '@/types';
import { mockUsers, validateCredentials, findUserByEmail } from './data/users';

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
 * Mock Register Handler
 */
export async function mockRegister(
  data: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }
): Promise<ApiResponse<RegisterResponse>> {
  await delay(1000);

  // Check if email already exists
  const existingUser = findUserByEmail(data.email);
  if (existingUser) {
    throw createErrorResponse('Email address is already registered', 409);
  }

  // Create new user
  const newUser: User = {
    id: String(mockUsers.length + 1),
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    role: 'user',
    status: 'pending',
    emailVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add to mock users (in real app, this would be saved to database)
  mockUsers.push(newUser);

  const response: RegisterResponse = {
    user: newUser,
    message: 'Registration successful. Please verify your email.',
  };

  return createResponse(response, 'Registration successful');
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

/**
 * Mock Send OTP Handler
 */
export async function mockSendOtp(
  orderId: string | number
): Promise<ApiResponse<{ message: string; expiresIn: number }>> {
  await delay(600);
  
  // In a real app, this would send OTP to customer's phone
  return createResponse(
    {
      message: 'OTP sent successfully to customer mobile number',
      expiresIn: 30, // seconds
    },
    'OTP sent successfully'
  );
}

/**
 * Mock Verify OTP Handler
 */
export async function mockVerifyOtp(
  orderId: string | number,
  otp: string
): Promise<ApiResponse<{ verified: boolean; message: string }>> {
  await delay(500);
  
  // Mock validation: accept any 6-digit OTP
  if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
    throw createErrorResponse('Invalid OTP format. Please enter a 6-digit code.', 400);
  }
  
  // Mock: accept any OTP starting with 1-9 (reject 000000)
  if (otp === '000000') {
    throw createErrorResponse('Invalid OTP. Please try again.', 400);
  }
  
  return createResponse(
    {
      verified: true,
      message: 'OTP verified successfully',
    },
    'OTP verified successfully'
  );
}

/**
 * Mock Confirm Delivery Handler
 */
export async function mockConfirmDelivery(
  orderId: string | number,
  data: {
    otp: string;
    deliveryMode: string;
    comments?: string;
  }
): Promise<ApiResponse<{ orderId: string | number; deliveredAt: string; message: string }>> {
  await delay(800);
  
  // In a real app, this would update the order status in the database
  return createResponse(
    {
      orderId,
      deliveredAt: new Date().toISOString(),
      message: 'Order delivered successfully',
    },
    'Order delivered successfully'
  );
}

// Export all handlers
export const mockHandlers = {
  login: mockLogin,
  register: mockRegister,
  getCurrentUser: mockGetCurrentUser,
  forgotPassword: mockForgotPassword,
  refreshToken: mockRefreshToken,
  logout: mockLogout,
  sendOtp: mockSendOtp,
  verifyOtp: mockVerifyOtp,
  confirmDelivery: mockConfirmDelivery,
};

export default mockHandlers;
