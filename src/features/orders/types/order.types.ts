/**
 * Order feature types
 */

import type { ID } from '@/types/common.types';

// --- Union types ---

export type OrderStatus = 'pending' | 'delivered' | 'cancelled';

export type OrderSource =
  | 'Scheme Redemption'
  | 'Purchase - iOS'
  | 'Purchase - Android'
  | 'Advance Redemption'
  | 'Cash / Card / UPI';

export type DeliveryMode = 'home_delivery' | 'self_collection';

export type PaymentMethod =
  | 'scheme_redemption'
  | 'advance_redemption'
  | 'cash_card_upi';

export type GiftCollectionStatus = 'pending' | 'store_collection' | 'completed';

// --- Entities ---

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  material: string;
  weight: string;
  productId?: string;
  stockIds?: string[];
}

export interface OrderPerson {
  name: string;
  phone: string;
  avatar: string;
}

export interface OrderSourceDetails {
  id: string;
  title: string;
  subtitle?: string;
}

export interface GiftCollection {
  status: GiftCollectionStatus;
  deliveryMode?: DeliveryMode;
  giftName?: string;
  collectedAt?: string;
  collectedBy?: string;
  otp?: string;
}

export interface DeliveryInfo {
  mode: DeliveryMode;
  deliveredAt: string;
  recipientName: string;
  authenticatedBy: string;
}

export interface CancellationInfo {
  cancelledAt: string;
  reason?: string;
  authenticatedBy: string;
}

export interface Order {
  id: number;
  orderId: string;
  amount: number;
  itemCount: number;
  images: string[];
  staff: OrderPerson;
  customer: OrderPerson;
  orderedOn: string;
  orderDateTime?: string;
  source: OrderSource;
  status: OrderStatus;
  expectedDelivery?: string;

  // Payment details
  totalPaid?: number;
  transactionId?: string;
  paymentMethod?: string;

  // Items
  items?: OrderItem[];
  jewelCount?: number;
  unitCount?: number;

  // Source/scheme details
  sourceDetails?: OrderSourceDetails;

  // Delivery
  deliveryStatus?: 'pending' | 'delivered';
  deliveryInfo?: DeliveryInfo;

  // Cancellation
  cancellationInfo?: CancellationInfo;

  // Gift
  giftCollection?: GiftCollection;
}

// --- Request/Response DTOs ---

export interface GetOrdersParams {
  status?: OrderStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateOrderRequest {
  customer: {
    name: string;
    phone: string;
    avatar?: string;
  };
  items: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    weight: string;
    barcode: string;
  }>;
  paymentMethod: PaymentMethod;
  totalValue: number;
}

export interface DeliverOrderRequest {
  orderId: ID;
  otp: string;
  deliveryMode: DeliveryMode;
  comments?: string;
}

export interface CancelOrderRequest {
  orderId: ID;
  staffName: string;
  otp: string;
  reason: string;
}

export interface UpdateExpectedDeliveryRequest {
  orderId: ID;
  expectedDelivery: string;
}

export interface ScanStockRequest {
  orderId: ID;
  stockIds: string[];
}

// --- OTP DTOs ---

export interface SendOtpResponse {
  message: string;
  expiresIn: number;
}

export interface VerifyOtpResponse {
  verified: boolean;
  message: string;
}

export interface DeliverOrderResponse {
  orderId: ID;
  deliveredAt: string;
  message: string;
}

export interface CancelOrderResponse {
  orderId: ID;
  cancelledAt: string;
  message: string;
}
