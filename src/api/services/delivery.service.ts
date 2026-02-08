/**
 * Delivery API service
 */

import { api } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { env } from '@/config/env';
import { mockHandlers } from '@/mocks/handlers';
import type { ApiResponse } from '@/types';

// Types for delivery operations
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

export interface ConfirmDeliveryRequest {
  orderId: string | number;
  otp: string;
  deliveryMode: string;
  comments?: string;
}

export interface ConfirmDeliveryResponse {
  orderId: string | number;
  deliveredAt: string;
  message: string;
}

// Check if mock API is enabled (evaluated at runtime)
const isMockEnabled = (): boolean => env.enableMockApi;

export const deliveryService = {
  /**
   * Send OTP to customer's mobile number for order delivery
   */
  sendOtp: async (
    orderId: string | number
  ): Promise<ApiResponse<SendOtpResponse>> => {
    if (isMockEnabled()) {
      return mockHandlers.sendOtp(orderId);
    }
    return api.post<SendOtpResponse>(API_ENDPOINTS.orders.sendOtp(orderId));
  },

  /**
   * Verify OTP entered by admin
   */
  verifyOtp: async (
    orderId: string | number,
    otp: string
  ): Promise<ApiResponse<VerifyOtpResponse>> => {
    if (isMockEnabled()) {
      return mockHandlers.verifyOtp(orderId, otp);
    }
    return api.post<VerifyOtpResponse>(API_ENDPOINTS.orders.verifyOtp(orderId), {
      otp,
    });
  },

  /**
   * Confirm order delivery
   */
  confirmDelivery: async (
    data: ConfirmDeliveryRequest
  ): Promise<ApiResponse<ConfirmDeliveryResponse>> => {
    if (isMockEnabled()) {
      return mockHandlers.confirmDelivery(data.orderId, {
        otp: data.otp,
        deliveryMode: data.deliveryMode,
        comments: data.comments,
      });
    }
    return api.post<ConfirmDeliveryResponse>(
      API_ENDPOINTS.orders.deliver(data.orderId),
      {
        otp: data.otp,
        deliveryMode: data.deliveryMode,
        comments: data.comments,
      }
    );
  },
};
