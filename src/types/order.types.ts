/**
 * Order types for dashboard and reports
 */

import type { BaseEntity, ID } from './common.types';

export type OrderStatus = 'pending' | 'delivered' | 'cancelled';

export interface OrderContact {
  id: ID;
  name: string;
  phone: string;
  avatarUrl?: string;
}

export interface OrderItem {
  id: ID;
  name: string;
  imageUrl: string;
  quantity: number;
  weightGrams?: number;
  sku?: string;
  category?: string;
}

export interface Order extends BaseEntity {
  orderNumber: string;
  status: OrderStatus;
  amount: number;
  itemCount: number;
  items: OrderItem[];
  staff: OrderContact;
  customer: OrderContact;
}

export type OrderStatusSummary = Record<OrderStatus, number>;
