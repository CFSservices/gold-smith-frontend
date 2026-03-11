/**
 * Order API service
 */

import { api } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { env } from '@/config/env';
import { mockHandlers } from '@/mocks/handlers';
import type { ApiResponse } from '@/types';

// Types for order operations
export interface SendOtpRequest {
  orderId: string | number;
}

export interface SendOtpResponse {
  message: string;
  expiresIn: number; // seconds
}

export interface VerifyOtpRequest {
  orderId: string | number;
  otp: string;
}

export interface VerifyOtpResponse {
  verified: boolean;
  message: string;
}

export interface CancelOrderRequest {
  orderId: string | number;
  staffName: string;
  otp: string;
  reason: string;
}

export interface CancelOrderResponse {
  orderId: string | number;
  cancelledAt: string;
  message: string;
}

// Check if mock API is enabled (evaluated at runtime)
const isMockEnabled = (): boolean => env.enableMockApi;

export const orderService = {
  /**
   * Send OTP for order cancellation
   */
  sendCancelOtp: async (
    orderId: string | number
  ): Promise<ApiResponse<SendOtpResponse>> => {
    if (isMockEnabled()) {
      return mockHandlers.sendOtp(orderId);
    }
    return api.post<SendOtpResponse>(API_ENDPOINTS.orders.sendCancelOtp(orderId));
  },

  /**
   * Verify OTP for order cancellation
   */
  verifyCancelOtp: async (
    orderId: string | number,
    otp: string
  ): Promise<ApiResponse<VerifyOtpResponse>> => {
    if (isMockEnabled()) {
      return mockHandlers.verifyOtp(orderId, otp);
    }
    return api.post<VerifyOtpResponse>(API_ENDPOINTS.orders.verifyCancelOtp(orderId), {
      otp,
    });
  },

  /**
   * Cancel an order
   */
  cancelOrder: async (
    data: CancelOrderRequest
  ): Promise<ApiResponse<CancelOrderResponse>> => {
    if (isMockEnabled()) {
      // Mock implementation - in real scenario, this would call the API
      return {
        success: true,
        data: {
          orderId: data.orderId,
          cancelledAt: new Date().toISOString(),
          message: 'Order cancelled successfully',
        },
      };
    }
    return api.post<CancelOrderResponse>(
      API_ENDPOINTS.orders.cancel(data.orderId),
      {
        staffName: data.staffName,
        otp: data.otp,
        reason: data.reason,
      }
    );
  },
};
