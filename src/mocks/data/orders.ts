/**
 * Mock order data for development
 */

import type { Order, OrderContact, OrderStatus, OrderStatusSummary } from '@/types';

type OrderSeed = Omit<Order, 'itemCount'> & { itemCount?: number };

const staffMembers: OrderContact[] = [
  {
    id: 'staff-1',
    name: 'John Doe',
    phone: '7998139111',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 'staff-2',
    name: 'Sarah Patel',
    phone: '7998139222',
    avatarUrl: 'https://i.pravatar.cc/150?img=48',
  },
  {
    id: 'staff-3',
    name: 'Arjun Mehta',
    phone: '7998139333',
    avatarUrl: 'https://i.pravatar.cc/150?img=33',
  },
];

const customers: OrderContact[] = [
  {
    id: 'cust-1',
    name: 'Angel Rosser',
    phone: '9876543210',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 'cust-2',
    name: 'Tatiana Workman',
    phone: '9876543211',
    avatarUrl: 'https://i.pravatar.cc/150?img=32',
  },
  {
    id: 'cust-3',
    name: 'James Geidt',
    phone: '9876543212',
    avatarUrl: 'https://i.pravatar.cc/150?img=60',
  },
  {
    id: 'cust-4',
    name: 'Ahmad Franci',
    phone: '9876543213',
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
  },
  {
    id: 'cust-5',
    name: 'Maria Soto',
    phone: '9876543214',
    avatarUrl: 'https://i.pravatar.cc/150?img=44',
  },
  {
    id: 'cust-6',
    name: 'Liam Cook',
    phone: '9876543215',
    avatarUrl: 'https://i.pravatar.cc/150?img=52',
  },
  {
    id: 'cust-7',
    name: 'Neha Rao',
    phone: '9876543216',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: 'cust-8',
    name: 'Noah Carter',
    phone: '9876543217',
    avatarUrl: 'https://i.pravatar.cc/150?img=18',
  },
];

const buildOrder = (order: OrderSeed): Order => {
  const itemCount =
    order.itemCount ??
    order.items.reduce((total, item) => total + item.quantity, 0);

  return {
    ...order,
    itemCount,
  };
};

export const mockOrders: Order[] = [
  buildOrder({
    id: 'order-1001',
    orderNumber: '1122334455',
    status: 'pending',
    amount: 1260000,
    items: [
      {
        id: 'order-1001-item-1',
        name: 'Gold Chain',
        imageUrl: 'https://picsum.photos/seed/gold-chain/120/120',
        quantity: 1,
        weightGrams: 18.2,
        sku: 'GC-104',
        category: 'Chain',
      },
      {
        id: 'order-1001-item-2',
        name: 'Diamond Ring',
        imageUrl: 'https://picsum.photos/seed/diamond-ring/120/120',
        quantity: 1,
        weightGrams: 3.5,
        sku: 'DR-220',
        category: 'Ring',
      },
      {
        id: 'order-1001-item-3',
        name: 'Pearl Pendant',
        imageUrl: 'https://picsum.photos/seed/pearl-pendant/120/120',
        quantity: 1,
        weightGrams: 6.1,
        sku: 'PP-056',
        category: 'Pendant',
      },
      {
        id: 'order-1001-item-4',
        name: 'Gold Earrings',
        imageUrl: 'https://picsum.photos/seed/gold-earrings/120/120',
        quantity: 1,
        weightGrams: 5.4,
        sku: 'GE-311',
        category: 'Earrings',
      },
      {
        id: 'order-1001-item-5',
        name: 'Gold Bracelet',
        imageUrl: 'https://picsum.photos/seed/gold-bracelet/120/120',
        quantity: 1,
        weightGrams: 12.8,
        sku: 'GB-149',
        category: 'Bracelet',
      },
    ],
    staff: staffMembers[0],
    customer: customers[0],
    createdAt: '2024-09-12T09:15:00.000Z',
    updatedAt: '2024-09-12T09:15:00.000Z',
  }),
  buildOrder({
    id: 'order-1002',
    orderNumber: '1234567890',
    status: 'pending',
    amount: 445000,
    items: [
      {
        id: 'order-1002-item-1',
        name: 'Ruby Pendant',
        imageUrl: 'https://picsum.photos/seed/ruby-pendant/120/120',
        quantity: 1,
        weightGrams: 7.2,
        sku: 'RP-082',
        category: 'Pendant',
      },
      {
        id: 'order-1002-item-2',
        name: 'Gold Studs',
        imageUrl: 'https://picsum.photos/seed/gold-studs/120/120',
        quantity: 1,
        weightGrams: 2.9,
        sku: 'GS-207',
        category: 'Earrings',
      },
    ],
    staff: staffMembers[0],
    customer: customers[1],
    createdAt: '2024-09-14T12:30:00.000Z',
    updatedAt: '2024-09-14T12:30:00.000Z',
  }),
  buildOrder({
    id: 'order-1003',
    orderNumber: '1234567456',
    status: 'pending',
    amount: 98000,
    items: [
      {
        id: 'order-1003-item-1',
        name: 'Floral Pendant',
        imageUrl: 'https://picsum.photos/seed/floral-pendant/120/120',
        quantity: 1,
        weightGrams: 4.8,
        sku: 'FP-019',
        category: 'Pendant',
      },
    ],
    staff: staffMembers[0],
    customer: customers[2],
    createdAt: '2024-09-15T10:05:00.000Z',
    updatedAt: '2024-09-15T10:05:00.000Z',
  }),
  buildOrder({
    id: 'order-1004',
    orderNumber: '1234567124',
    status: 'pending',
    amount: 310000,
    items: [
      {
        id: 'order-1004-item-1',
        name: 'Gold Chain',
        imageUrl: 'https://picsum.photos/seed/gold-chain-mini/120/120',
        quantity: 1,
        weightGrams: 9.1,
        sku: 'GC-109',
        category: 'Chain',
      },
      {
        id: 'order-1004-item-2',
        name: 'Classic Ring',
        imageUrl: 'https://picsum.photos/seed/classic-ring/120/120',
        quantity: 1,
        weightGrams: 4.2,
        sku: 'CR-078',
        category: 'Ring',
      },
    ],
    staff: staffMembers[0],
    customer: customers[3],
    createdAt: '2024-09-16T14:45:00.000Z',
    updatedAt: '2024-09-16T14:45:00.000Z',
  }),
  buildOrder({
    id: 'order-1005',
    orderNumber: '2233445566',
    status: 'delivered',
    amount: 820000,
    items: [
      {
        id: 'order-1005-item-1',
        name: 'Temple Necklace',
        imageUrl: 'https://picsum.photos/seed/temple-necklace/120/120',
        quantity: 1,
        weightGrams: 28.6,
        sku: 'TN-414',
        category: 'Necklace',
      },
      {
        id: 'order-1005-item-2',
        name: 'Gold Bangles',
        imageUrl: 'https://picsum.photos/seed/gold-bangles/120/120',
        quantity: 2,
        weightGrams: 19.4,
        sku: 'GB-201',
        category: 'Bangle',
      },
    ],
    staff: staffMembers[1],
    customer: customers[4],
    createdAt: '2024-09-08T11:20:00.000Z',
    updatedAt: '2024-09-10T16:00:00.000Z',
  }),
  buildOrder({
    id: 'order-1006',
    orderNumber: '2233447788',
    status: 'delivered',
    amount: 142000,
    items: [
      {
        id: 'order-1006-item-1',
        name: 'Minimal Pendant',
        imageUrl: 'https://picsum.photos/seed/minimal-pendant/120/120',
        quantity: 1,
        weightGrams: 3.1,
        sku: 'MP-007',
        category: 'Pendant',
      },
      {
        id: 'order-1006-item-2',
        name: 'Gold Studs',
        imageUrl: 'https://picsum.photos/seed/gold-studs-mini/120/120',
        quantity: 1,
        weightGrams: 2.6,
        sku: 'GS-212',
        category: 'Earrings',
      },
    ],
    staff: staffMembers[1],
    customer: customers[5],
    createdAt: '2024-09-05T09:40:00.000Z',
    updatedAt: '2024-09-07T15:20:00.000Z',
  }),
  buildOrder({
    id: 'order-1007',
    orderNumber: '3344556677',
    status: 'cancelled',
    amount: 245000,
    items: [
      {
        id: 'order-1007-item-1',
        name: 'Emerald Ring',
        imageUrl: 'https://picsum.photos/seed/emerald-ring/120/120',
        quantity: 1,
        weightGrams: 5.8,
        sku: 'ER-305',
        category: 'Ring',
      },
      {
        id: 'order-1007-item-2',
        name: 'Gold Bracelet',
        imageUrl: 'https://picsum.photos/seed/gold-bracelet-mini/120/120',
        quantity: 1,
        weightGrams: 7.5,
        sku: 'GB-158',
        category: 'Bracelet',
      },
    ],
    staff: staffMembers[2],
    customer: customers[6],
    createdAt: '2024-09-04T13:10:00.000Z',
    updatedAt: '2024-09-06T10:00:00.000Z',
  }),
  buildOrder({
    id: 'order-1008',
    orderNumber: '3344558899',
    status: 'cancelled',
    amount: 675000,
    items: [
      {
        id: 'order-1008-item-1',
        name: 'Bridal Necklace',
        imageUrl: 'https://picsum.photos/seed/bridal-necklace/120/120',
        quantity: 1,
        weightGrams: 32.3,
        sku: 'BN-901',
        category: 'Necklace',
      },
      {
        id: 'order-1008-item-2',
        name: 'Gold Bangles',
        imageUrl: 'https://picsum.photos/seed/gold-bangles-set/120/120',
        quantity: 2,
        weightGrams: 21.7,
        sku: 'GB-209',
        category: 'Bangle',
      },
      {
        id: 'order-1008-item-3',
        name: 'Pearl Earrings',
        imageUrl: 'https://picsum.photos/seed/pearl-earrings/120/120',
        quantity: 1,
        weightGrams: 4.4,
        sku: 'PE-144',
        category: 'Earrings',
      },
    ],
    staff: staffMembers[2],
    customer: customers[7],
    createdAt: '2024-09-02T08:55:00.000Z',
    updatedAt: '2024-09-03T17:40:00.000Z',
  }),
];

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const getOrdersByStatus = (status: OrderStatus): Order[] => {
  return mockOrders.filter((order) => order.status === status);
};

export const getOrderStatusSummary = (): OrderStatusSummary => {
  const summary: OrderStatusSummary = {
    pending: 0,
    delivered: 0,
    cancelled: 0,
  };

  for (const order of mockOrders) {
    summary[order.status] += 1;
  }

  return summary;
};

export const mockOrderStatusSummary = getOrderStatusSummary();
