// mockdata for orders

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  material: string;
  weight: string;
  productId?: string;
}

export interface Order {
  id: number;
  orderId: string;
  amount: number;
  itemCount: number;
  images: string[];
  staff: {
    name: string;
    phone: string;
    avatar: string;
  };
  customer: {
    name: string;
    phone: string;
    avatar: string;
  };
  orderedOn: string;
  orderDateTime?: string;
  source: string;
  status: 'pending' | 'delivered' | 'cancelled';
  expectedDelivery?: string;
  // Order details modal fields
  totalPaid?: number;
  transactionId?: string;
  paymentMethod?: string;
  items?: OrderItem[];
  giftCollection?: {
    status: 'pending' | 'collected';
  };
  sourceDetails?: {
  id: string;
  title: string;
  subtitle?: string;
};

  deliveryStatus?: 'pending' | 'delivered';
  jewelCount?: number;
  unitCount?: number;
}
 
export const ordersList: Order[] = [
  {
    id: 1,
    orderId: '#1214456',
    amount: 1260000,
    itemCount: 5,
    images: [
      'assets/jewels/j1.png',
      'assets/jewels/j2.png',
      'assets/jewels/j3.png',
      'assets/jewels/j4.png',
      'assets/jewels/j5.png'
    ],
    staff: {
      name: 'John Doe',
      phone: '7998139111',
      avatar: 'assets/users/u1.jpg'
    },
    customer: {
      name: 'Angel Rosser',
      phone: '9876543210',
      avatar: 'assets/users/u2.jpg'
    },
    orderedOn: '15/12/2025',
    orderDateTime: '15/12/2025 07:16 PM, Friday',
    source: 'Scheme Redemption',
    status: 'pending',
    expectedDelivery: '01/01/2024',
    totalPaid: 1019600,
    transactionId: '29475920',
    paymentMethod: 'RazorPay',
    jewelCount: 4,
    unitCount: 5,
    items: [
      {
        id: '1',
        name: 'Rose Gold Clover Pendant with Chain',
        image: 'assets/jewels/j1.png',
        unitPrice: 32600,
        quantity: 2,
        material: 'Silver',
        weight: '160g per unit'
      },
      {
        id: '2',
        name: 'Platinum Bracelet Twisted',
        image: 'assets/jewels/j2.png',
        unitPrice: 650000,
        quantity: 1,
        material: 'Platinum',
        weight: '6g per unit',
        productId: '#2012110511131'
      }
    ],
    giftCollection: {
      status: 'pending'
    },

   sourceDetails: {
     id: '#1239481',
     title: 'Gold 11 Flexi',
     subtitle: '24 Jan 2025 - 24 Nov 2025'
    },

    deliveryStatus: 'pending'
  },
  {
    id: 2,
    orderId: '#1234567890',
    amount: 1260000,
    itemCount: 2,
    images: [
      'assets/jewels/j2.png',
      'assets/jewels/j3.png'
    ],
    staff: {
      name: 'John Doe',
      phone: '7998139111',
      avatar: 'assets/users/u1.jpg'
    },
    customer: {
      name: 'Tatiana Workman',
      phone: '9876543210',
      avatar: 'assets/users/u3.jpg'
    },
    orderedOn: '13/02/2025',
    orderDateTime: '13/02/2025 10:30 AM, Thursday',
    source: 'Purchase - iOS',
    sourceDetails: {
     id: '#1239481',
     title: 'Gold 11 Flexi',
     subtitle: '26 Jan 2025 - 24 Nov 2025'
    },
    status: 'pending',
    expectedDelivery: '20/02/2025',
    totalPaid: 1260000,
    transactionId: '29475921',
    paymentMethod: 'RazorPay',
    jewelCount: 2,
    unitCount: 2,
    items: [
      {
        id: '3',
        name: 'Gold Ring Classic',
        image: 'assets/jewels/j2.png',
        unitPrice: 630000,
        quantity: 2,
        material: 'Gold',
        weight: '10g per unit'
      }
    ],
    deliveryStatus: 'pending'
  },
  {
    id: 3,
    orderId: '#1234567456',
    amount: 1260000,
    itemCount: 1,
    images: [
      'assets/jewels/j4.png'
    ],
    staff: {
      name: 'John Doe',
      phone: '7998139111',
      avatar: 'assets/users/u1.jpg'
    },
    customer: {
      name: 'James Geidt',
      phone: '9876543210',
      avatar: 'assets/users/u4.jpg'
    },
    orderedOn: '13/02/2025',
    orderDateTime: '13/02/2025 02:15 PM, Thursday',
    source: 'Purchase - Android',
     sourceDetails: {
     id: '#1239481',
     title: 'Gold 11 Flexi',
     subtitle: '24 Jan 2025 - 24 Nov 2025'
    },
    status: 'delivered',
    totalPaid: 1260000,
    transactionId: '29475922',
    paymentMethod: 'RazorPay',
    jewelCount: 1,
    unitCount: 1,
    items: [
      {
        id: '4',
        name: 'Diamond Necklace',
        image: 'assets/jewels/j4.png',
        unitPrice: 1260000,
        quantity: 1,
        material: 'Gold',
        weight: '25g per unit'
      }
    ],
    deliveryStatus: 'delivered'
  },
  {
    id: 4,
    orderId: '#1234567124',
    amount: 1260000,
    itemCount: 2,
    images: [
      'assets/jewels/j1.png',
      'assets/jewels/j5.png'
    ],
    staff: {
      name: 'John Doe',
      phone: '7998139111',
      avatar: 'assets/users/u1.jpg'
    },
    customer: {
      name: 'Ahmad Franci',
      phone: '9876543210',
      avatar: 'assets/users/u5.jpg'
    },
    orderedOn: '13/02/2025',
    orderDateTime: '13/02/2025 04:45 PM, Thursday',
    source: 'Advance Redemption',
     sourceDetails: {
     id: '#1239481',
     title: 'Gold 11 Flexi',
     subtitle: '24 Jan 2025 - 24 Nov 2025'
    },
    status: 'cancelled',
    totalPaid: 0,
    jewelCount: 2,
    unitCount: 2,
    items: [
      {
        id: '5',
        name: 'Silver Earrings',
        image: 'assets/jewels/j1.png',
        unitPrice: 630000,
        quantity: 2,
        material: 'Silver',
        weight: '8g per unit'
      }
    ],
    deliveryStatus: 'pending'
  }
];

