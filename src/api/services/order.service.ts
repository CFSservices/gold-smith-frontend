/**
 * Order API service
 */

import { api } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { env } from '@/config/env';
import { mockHandlers } from '@/mocks/handlers';
import { ordersList } from '@/mocks/data/orders';
import type { ApiResponse } from '@/types';
import type {
  Order,
  GetOrdersParams,
  CreateOrderRequest,
  DeliverOrderRequest,
  CancelOrderRequest,
  UpdateExpectedDeliveryRequest,
  ScanStockRequest,
  SendOtpResponse,
  VerifyOtpResponse,
  DeliverOrderResponse,
  CancelOrderResponse,
} from '@/features/orders/types';

const isMockEnabled = (): boolean => env.enableMockApi;

export const orderService = {
  /**
   * Get orders list with optional filtering
   */
  getOrders: async (params?: GetOrdersParams): Promise<ApiResponse<Order[]>> => {
    if (isMockEnabled()) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      let filtered = [...ordersList];

      if (params?.status) {
        filtered = filtered.filter((o) => o.status === params.status);
      }

      if (params?.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(
          (o) =>
            o.orderId.toLowerCase().includes(search) ||
            o.customer.name.toLowerCase().includes(search)
        );
      }

      return {
        success: true,
        data: filtered,
        timestamp: new Date().toISOString(),
      };
    }
    return api.get<Order[]>(API_ENDPOINTS.orders.list, { params });
  },

  /**
   * Get single order by ID
   */
  getOrder: async (id: string | number): Promise<ApiResponse<Order>> => {
    if (isMockEnabled()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const order = ordersList.find((o) => o.id === Number(id));
      if (!order) {
        throw {
          success: false,
          message: 'Order not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: true,
        data: order,
        timestamp: new Date().toISOString(),
      };
    }
    return api.get<Order>(API_ENDPOINTS.orders.detail(id));
  },

  /**
   * Create a new order
   */
  createOrder: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    if (isMockEnabled()) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const newOrder: Order = {
        id: ordersList.length + 1,
        orderId: `#${Math.floor(Math.random() * 10000000)}`,
        amount: data.totalValue,
        itemCount: data.items.length,
        images: data.items.map((item) => item.image),
        staff: { name: 'John Doe', phone: '7998139111', avatar: 'assets/users/u1.jpg' },
        customer: {
          name: data.customer.name,
          phone: data.customer.phone,
          avatar: data.customer.avatar ?? 'assets/users/u2.jpg',
        },
        orderedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        orderDateTime: `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}, ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}`,
        source: 'Cash / Card / UPI',
        status: 'pending',
        totalPaid: data.totalValue * 1.18,
        transactionId: Math.floor(Math.random() * 100000000).toString(),
        paymentMethod: 'RazorPay',
        items: data.items.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          unitPrice: item.price,
          quantity: 1,
          material: 'Gold',
          weight: item.weight,
          productId: item.barcode,
        })),
        jewelCount: data.items.length,
        unitCount: data.items.length,
        deliveryStatus: 'pending',
      };
      ordersList.unshift(newOrder);
      return {
        success: true,
        data: newOrder,
        timestamp: new Date().toISOString(),
      };
    }
    return api.post<Order>(API_ENDPOINTS.orders.create, data);
  },

  /**
   * Update expected delivery date
   */
  updateExpectedDelivery: async (
    data: UpdateExpectedDeliveryRequest
  ): Promise<ApiResponse<Order>> => {
    if (isMockEnabled()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const order = ordersList.find((o) => o.id === Number(data.orderId));
      if (order) {
        order.expectedDelivery = data.expectedDelivery;
      }
      return {
        success: true,
        data: order!,
        timestamp: new Date().toISOString(),
      };
    }
    return api.patch<Order>(API_ENDPOINTS.orders.updateExpectedDelivery(data.orderId), {
      expectedDelivery: data.expectedDelivery,
    });
  },

  /**
   * Send OTP for delivery
   */
  sendDeliveryOtp: async (orderId: string | number): Promise<ApiResponse<SendOtpResponse>> => {
    if (isMockEnabled()) {
      return mockHandlers.sendOtp(orderId);
    }
    return api.post<SendOtpResponse>(API_ENDPOINTS.orders.sendDeliveryOtp(orderId));
  },

  /**
   * Verify OTP for delivery
   */
  verifyDeliveryOtp: async (
    orderId: string | number,
    otp: string
  ): Promise<ApiResponse<VerifyOtpResponse>> => {
    if (isMockEnabled()) {
      return mockHandlers.verifyOtp(orderId, otp);
    }
    return api.post<VerifyOtpResponse>(API_ENDPOINTS.orders.verifyDeliveryOtp(orderId), { otp });
  },

  /**
   * Deliver an order
   */
  deliverOrder: async (data: DeliverOrderRequest): Promise<ApiResponse<DeliverOrderResponse>> => {
    if (isMockEnabled()) {
      return mockHandlers.confirmDelivery(data.orderId, {
        otp: data.otp,
        deliveryMode: data.deliveryMode,
        comments: data.comments,
      });
    }
    return api.post<DeliverOrderResponse>(API_ENDPOINTS.orders.deliver(data.orderId), {
      otp: data.otp,
      deliveryMode: data.deliveryMode,
      comments: data.comments,
    });
  },

  /**
   * Send OTP for cancellation
   */
  sendCancelOtp: async (orderId: string | number): Promise<ApiResponse<SendOtpResponse>> => {
    if (isMockEnabled()) {
      return mockHandlers.sendOtp(orderId);
    }
    return api.post<SendOtpResponse>(API_ENDPOINTS.orders.sendCancelOtp(orderId));
  },

  /**
   * Verify OTP for cancellation
   */
  verifyCancelOtp: async (
    orderId: string | number,
    otp: string
  ): Promise<ApiResponse<VerifyOtpResponse>> => {
    if (isMockEnabled()) {
      return mockHandlers.verifyOtp(orderId, otp);
    }
    return api.post<VerifyOtpResponse>(API_ENDPOINTS.orders.verifyCancelOtp(orderId), { otp });
  },

  /**
   * Cancel an order
   */
  cancelOrder: async (data: CancelOrderRequest): Promise<ApiResponse<CancelOrderResponse>> => {
    if (isMockEnabled()) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        success: true,
        data: {
          orderId: data.orderId,
          cancelledAt: new Date().toISOString(),
          message: 'Order cancelled successfully',
        },
        timestamp: new Date().toISOString(),
      };
    }
    return api.post<CancelOrderResponse>(API_ENDPOINTS.orders.cancel(data.orderId), {
      staffName: data.staffName,
      otp: data.otp,
      reason: data.reason,
    });
  },

  /**
   * Scan stock for an order
   */
  scanStock: async (data: ScanStockRequest): Promise<ApiResponse<{ message: string }>> => {
    if (isMockEnabled()) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        success: true,
        data: { message: 'Stock scanned successfully' },
        timestamp: new Date().toISOString(),
      };
    }
    return api.post<{ message: string }>(API_ENDPOINTS.orders.scanStock(data.orderId), {
      stockIds: data.stockIds,
    });
  },
};
