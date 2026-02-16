/**
 * Mock schemes data for development
 */

export interface PaymentMonth {
  month: string;
  year: number;
  status: 'completed' | 'due' | 'pending';
  paymentMethod?: string;
  amountReceived?: number;
  dateTime?: string;
  transactionId?: string;
}

export interface GiftCollection {
  status: 'pending' | 'completed';
  collectionType?: 'self_collection' | 'home_delivery';
  giftName?: string;
  collectedAt?: string;
  collectedBy?: string;
  authenticatedBy?: string;
  otp?: string;
}

export interface Scheme {
  id: number;
  schemeId: string;
  plan: {
    name: string;
    code: string;
  };
  monthlyDeposit: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  startedOn: string;
  status: 'on_track' | 'completed' | 'breached' | 'paused' | 'stopped';
  progress: {
    completed: number;
    total: number;
  };
  dues: {
    hasDues: boolean;
    currentDue?: string;
    nextDue?: string;
  };
  gracePeriod?: {
    isActive: boolean;
    message?: string;
    daysExtended?: number;
  };
  totalPaid?: number;
  totalAmount?: number;
  paymentTimeline?: PaymentMonth[];
  giftCollection?: GiftCollection;
}

export const schemesList: Scheme[] = [
  {
    id: 1,
    schemeId: '#1122334455',
    plan: {
      name: 'Golden 11',
      code: 'GS001',
    },
    monthlyDeposit: 1000,
    customer: {
      name: 'Angel Rosser',
      email: 'angel.rosser@gmail.com',
      phone: '9876543210',
      avatar: 'assets/users/u2.jpg',
    },
    startedOn: '10/11/2024',
    status: 'on_track',
    progress: {
      completed: 4,
      total: 11,
    },
    dues: {
      hasDues: true,
      currentDue: '5th Month (March) Due',
    },
    totalPaid: 4000,
    totalAmount: 11000,
    paymentTimeline: [
      { 
        month: 'Nov', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'UPI',
        amountReceived: 1000,
        dateTime: '10/11/2024 10:15:30',
        transactionId: 'TXN9876543210'
      },
      { 
        month: 'Dec', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'Bank Transfer',
        amountReceived: 1000,
        dateTime: '10/12/2024 11:20:45',
        transactionId: 'TXN9876543211'
      },
      { 
        month: 'Jan', 
        year: 2025, 
        status: 'completed',
        paymentMethod: 'RazorPay',
        amountReceived: 1000,
        dateTime: '10/01/2025 09:30:15',
        transactionId: 'TXN9876543212'
      },
      { 
        month: 'Feb', 
        year: 2025, 
        status: 'completed',
        paymentMethod: 'UPI',
        amountReceived: 1000,
        dateTime: '10/02/2025 14:45:20',
        transactionId: 'TXN9876543213'
      },
      { month: 'Mar', year: 2025, status: 'due' },
      { month: 'Apr', year: 2025, status: 'pending' },
      { month: 'May', year: 2025, status: 'pending' },
      { month: 'Jun', year: 2025, status: 'pending' },
      { month: 'Jul', year: 2025, status: 'pending' },
      { month: 'Aug', year: 2025, status: 'pending' },
      { month: 'Sep', year: 2025, status: 'pending' },
    ],
  },
  {
    id: 2,
    schemeId: '#5566778899',
    plan: {
      name: 'Golden 11 Flexi',
      code: 'GS002',
    },
    monthlyDeposit: 5000,
    customer: {
      name: 'Lydia Bator',
      email: 'lydia.bator@gmail.com',
      phone: '9876543210',
      avatar: 'assets/users/u3.jpg',
    },
    startedOn: '10/03/2024',
    status: 'on_track',
    progress: {
      completed: 1,
      total: 11,
    },
    dues: {
      hasDues: true,
      currentDue: '2nd Month (April) Due',
    },
    totalPaid: 5000,
    totalAmount: 55000,
    paymentTimeline: [
      { 
        month: 'Mar', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'RazorPay',
        amountReceived: 5000,
        dateTime: '15/03/2024 14:30:25',
        transactionId: 'TXN1234567890'
      },
      { month: 'Apr', year: 2024, status: 'due' },
      { month: 'May', year: 2024, status: 'pending' },
      { month: 'Jun', year: 2024, status: 'pending' },
      { month: 'Jul', year: 2024, status: 'pending' },
      { month: 'Aug', year: 2024, status: 'pending' },
      { month: 'Sep', year: 2024, status: 'pending' },
      { month: 'Oct', year: 2024, status: 'pending' },
      { month: 'Nov', year: 2024, status: 'pending' },
      { month: 'Dec', year: 2024, status: 'pending' },
      { month: 'Jan', year: 2025, status: 'pending' },
    ],
    giftCollection: {
      status: 'completed',
      collectionType: 'self_collection',
      giftName: 'Prestige Stainless Steel Pressure Cooker 5 Litre',
      collectedAt: '02/11/2025',
      collectedBy: 'Rinkesh Rahul',
      authenticatedBy: 'Angel Rosser',
      otp: 'GS-123411',
    },
  },
  {
    id: 3,
    schemeId: '#0987654321',
    plan: {
      name: 'Golden 11 Flexi',
      code: 'GS002',
    },
    monthlyDeposit: 500,
    customer: {
      name: 'Rayna Stanton',
      email: 'raynastanton@email.com',
      phone: '9876543210',
      avatar: 'assets/users/u4.jpg',
    },
    startedOn: '10/10/2024',
    status: 'breached',
    progress: {
      completed: 4,
      total: 11,
    },
    dues: {
      hasDues: true,
      currentDue: '5th Month (March) Due',
      nextDue: '6th Month (April) Started',
    },
    gracePeriod: {
      isActive: true,
      message: 'Under Grace Period',
    },
    totalPaid: 2000,
    totalAmount: 5500,
    paymentTimeline: [
      { 
        month: 'Oct', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'RazorPay',
        amountReceived: 500,
        dateTime: '10/10/2024 15:20:30',
        transactionId: 'TXN20241010152030'
      },
      { 
        month: 'Nov', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'UPI',
        amountReceived: 500,
        dateTime: '10/11/2024 16:25:45',
        transactionId: 'TXN20241110162545'
      },
      { 
        month: 'Dec', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'Bank Transfer',
        amountReceived: 500,
        dateTime: '10/12/2024 14:30:20',
        transactionId: 'TXN20241210143020'
      },
      { 
        month: 'Jan', 
        year: 2025, 
        status: 'completed',
        paymentMethod: 'RazorPay',
        amountReceived: 500,
        dateTime: '10/01/2025 11:15:10',
        transactionId: 'TXN20250110111510'
      },
      { month: 'Feb', year: 2025, status: 'due' },
      { month: 'Mar', year: 2025, status: 'due' },
      { month: 'Apr', year: 2025, status: 'pending' },
      { month: 'May', year: 2025, status: 'pending' },
      { month: 'Jun', year: 2025, status: 'pending' },
      { month: 'Jul', year: 2025, status: 'pending' },
      { month: 'Aug', year: 2025, status: 'pending' },
    ],
  },
  {
    id: 4,
    schemeId: '#1234567890',
    plan: {
      name: 'Golden 11',
      code: 'GS001',
    },
    monthlyDeposit: 10000,
    customer: {
      name: 'Tatiana Workman',
      email: 'tatiana@email.com',
      phone: '9876543210',
      avatar: 'assets/users/u5.jpg',
    },
    startedOn: '10/01/2024',
    status: 'on_track',
    progress: {
      completed: 10,
      total: 11,
    },
    dues: {
      hasDues: false,
    },
    totalPaid: 100000,
    totalAmount: 110000,
    paymentTimeline: [
      { 
        month: 'Jan', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'RazorPay',
        amountReceived: 10000,
        dateTime: '10/01/2024 09:30:00',
        transactionId: 'TXN20240110093000'
      },
      { 
        month: 'Feb', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'UPI',
        amountReceived: 10000,
        dateTime: '10/02/2024 10:15:30',
        transactionId: 'TXN20240210101530'
      },
      { 
        month: 'Mar', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'Bank Transfer',
        amountReceived: 10000,
        dateTime: '10/03/2024 11:20:45',
        transactionId: 'TXN20240310112045'
      },
      { 
        month: 'Apr', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'RazorPay',
        amountReceived: 10000,
        dateTime: '10/04/2024 14:25:15',
        transactionId: 'TXN20240410142515'
      },
      { 
        month: 'May', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'UPI',
        amountReceived: 10000,
        dateTime: '10/05/2024 15:30:20',
        transactionId: 'TXN20240510153020'
      },
      { 
        month: 'Jun', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'RazorPay',
        amountReceived: 10000,
        dateTime: '10/06/2024 16:35:30',
        transactionId: 'TXN20240610163530'
      },
      { 
        month: 'Jul', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'Bank Transfer',
        amountReceived: 10000,
        dateTime: '10/07/2024 09:40:45',
        transactionId: 'TXN20240710094045'
      },
      { 
        month: 'Aug', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'UPI',
        amountReceived: 10000,
        dateTime: '10/08/2024 10:45:15',
        transactionId: 'TXN20240810104515'
      },
      { 
        month: 'Sep', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'RazorPay',
        amountReceived: 10000,
        dateTime: '10/09/2024 11:50:30',
        transactionId: 'TXN20240910115030'
      },
      { 
        month: 'Oct', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'UPI',
        amountReceived: 10000,
        dateTime: '10/10/2024 12:55:45',
        transactionId: 'TXN20241010125545'
      },
      { month: 'Nov', year: 2024, status: 'pending' },
    ],
  },
  {
    id: 5,
    schemeId: '#1234567456',
    plan: {
      name: 'Golden 11 Flexi',
      code: 'GS002',
    },
    monthlyDeposit: 2000,
    customer: {
      name: 'James Geidt',
      email: 'james.geidt@email.com',
      phone: '9876543210',
      avatar: 'assets/users/u4.jpg',
    },
    startedOn: '10/08/2024',
    status: 'on_track',
    progress: {
      completed: 3,
      total: 11,
    },
    dues: {
      hasDues: false,
    },
    totalPaid: 6000,
    totalAmount: 22000,
    paymentTimeline: [
      { 
        month: 'Aug', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'RazorPay',
        amountReceived: 2000,
        dateTime: '10/08/2024 13:20:15',
        transactionId: 'TXN20240810132015'
      },
      { 
        month: 'Sep', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'UPI',
        amountReceived: 2000,
        dateTime: '10/09/2024 14:25:30',
        transactionId: 'TXN20240910142530'
      },
      { 
        month: 'Oct', 
        year: 2024, 
        status: 'completed',
        paymentMethod: 'Bank Transfer',
        amountReceived: 2000,
        dateTime: '10/10/2024 15:30:45',
        transactionId: 'TXN20241010153045'
      },
      { month: 'Nov', year: 2024, status: 'pending' },
      { month: 'Dec', year: 2024, status: 'pending' },
      { month: 'Jan', year: 2025, status: 'pending' },
      { month: 'Feb', year: 2025, status: 'pending' },
      { month: 'Mar', year: 2025, status: 'pending' },
      { month: 'Apr', year: 2025, status: 'pending' },
      { month: 'May', year: 2025, status: 'pending' },
      { month: 'Jun', year: 2025, status: 'pending' },
    ],
  },
  {
    id: 6,
    schemeId: '#9876543210',
    plan: {
      name: 'Golden 11',
      code: 'GS001',
    },
    monthlyDeposit: 3000,
    customer: {
      name: 'Ahmad Franci',
      email: 'ahmad.franci@email.com',
      phone: '9876543210',
      avatar: 'assets/users/u5.jpg',
    },
    startedOn: '10/01/2023',
    status: 'completed',
    progress: {
      completed: 11,
      total: 11,
    },
    dues: {
      hasDues: false,
    },
    totalPaid: 33000,
    totalAmount: 33000,
    paymentTimeline: [
      { month: 'Jan', year: 2023, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 3000, dateTime: '10/01/2023 09:00:00', transactionId: 'TXN20230110090000' },
      { month: 'Feb', year: 2023, status: 'completed', paymentMethod: 'UPI', amountReceived: 3000, dateTime: '10/02/2023 10:15:30', transactionId: 'TXN20230210101530' },
      { month: 'Mar', year: 2023, status: 'completed', paymentMethod: 'Bank Transfer', amountReceived: 3000, dateTime: '10/03/2023 11:30:45', transactionId: 'TXN20230310113045' },
      { month: 'Apr', year: 2023, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 3000, dateTime: '10/04/2023 12:45:15', transactionId: 'TXN20230410124515' },
      { month: 'May', year: 2023, status: 'completed', paymentMethod: 'UPI', amountReceived: 3000, dateTime: '10/05/2023 14:00:30', transactionId: 'TXN20230510140030' },
      { month: 'Jun', year: 2023, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 3000, dateTime: '10/06/2023 15:15:45', transactionId: 'TXN20230610151545' },
      { month: 'Jul', year: 2023, status: 'completed', paymentMethod: 'Bank Transfer', amountReceived: 3000, dateTime: '10/07/2023 16:30:00', transactionId: 'TXN20230710163000' },
      { month: 'Aug', year: 2023, status: 'completed', paymentMethod: 'UPI', amountReceived: 3000, dateTime: '10/08/2023 09:45:15', transactionId: 'TXN20230810094515' },
      { month: 'Sep', year: 2023, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 3000, dateTime: '10/09/2023 11:00:30', transactionId: 'TXN20230910110030' },
      { month: 'Oct', year: 2023, status: 'completed', paymentMethod: 'UPI', amountReceived: 3000, dateTime: '10/10/2023 12:15:45', transactionId: 'TXN20231010121545' },
      { month: 'Nov', year: 2023, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 3000, dateTime: '10/11/2023 13:30:00', transactionId: 'TXN20231110133000' },
    ],
  },
  {
    id: 7,
    schemeId: '#1122334466',
    plan: {
      name: 'Golden 11 Flexi',
      code: 'GS002',
    },
    monthlyDeposit: 1500,
    customer: {
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '9876543211',
      avatar: 'assets/users/u2.jpg',
    },
    startedOn: '10/02/2023',
    status: 'completed',
    progress: {
      completed: 11,
      total: 11,
    },
    dues: {
      hasDues: false,
    },
    totalPaid: 16500,
    totalAmount: 16500,
    paymentTimeline: [
      { month: 'Feb', year: 2023, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 1500, dateTime: '10/02/2023 10:20:00', transactionId: 'TXN20230210102000' },
      { month: 'Mar', year: 2023, status: 'completed', paymentMethod: 'UPI', amountReceived: 1500, dateTime: '10/03/2023 11:35:15', transactionId: 'TXN20230310113515' },
      { month: 'Apr', year: 2023, status: 'completed', paymentMethod: 'Bank Transfer', amountReceived: 1500, dateTime: '10/04/2023 12:50:30', transactionId: 'TXN20230410125030' },
      { month: 'May', year: 2023, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 1500, dateTime: '10/05/2023 14:05:45', transactionId: 'TXN20230510140545' },
      { month: 'Jun', year: 2023, status: 'completed', paymentMethod: 'UPI', amountReceived: 1500, dateTime: '10/06/2023 15:20:00', transactionId: 'TXN20230610152000' },
      { month: 'Jul', year: 2023, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 1500, dateTime: '10/07/2023 16:35:15', transactionId: 'TXN20230710163515' },
      { month: 'Aug', year: 2023, status: 'completed', paymentMethod: 'Bank Transfer', amountReceived: 1500, dateTime: '10/08/2023 09:50:30', transactionId: 'TXN20230810095030' },
      { month: 'Sep', year: 2023, status: 'completed', paymentMethod: 'UPI', amountReceived: 1500, dateTime: '10/09/2023 11:05:45', transactionId: 'TXN20230910110545' },
      { month: 'Oct', year: 2023, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 1500, dateTime: '10/10/2023 12:20:00', transactionId: 'TXN20231010122000' },
      { month: 'Nov', year: 2023, status: 'completed', paymentMethod: 'UPI', amountReceived: 1500, dateTime: '10/11/2023 13:35:15', transactionId: 'TXN20231110133515' },
      { month: 'Dec', year: 2023, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 1500, dateTime: '10/12/2023 14:50:30', transactionId: 'TXN20231210145030' },
    ],
  },
  {
    id: 8,
    schemeId: '#2233445566',
    plan: {
      name: 'Golden 11',
      code: 'GS001',
    },
    monthlyDeposit: 7500,
    customer: {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '9876543212',
      avatar: 'assets/users/u1.jpg',
    },
    startedOn: '10/03/2023',
    status: 'completed',
    progress: {
      completed: 11,
      total: 11,
    },
    dues: {
      hasDues: false,
    },
    totalPaid: 82500,
    totalAmount: 82500,
    paymentTimeline: [
      { month: 'Mar', year: 2023, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 7500, dateTime: '10/03/2023 11:10:00', transactionId: 'TXN20230310111000' },
      { month: 'Apr', year: 2023, status: 'completed', paymentMethod: 'UPI', amountReceived: 7500, dateTime: '10/04/2023 12:25:15', transactionId: 'TXN20230410122515' },
      { month: 'May', year: 2023, status: 'completed', paymentMethod: 'Bank Transfer', amountReceived: 7500, dateTime: '10/05/2023 13:40:30', transactionId: 'TXN20230510134030' },
      { month: 'Jun', year: 2023, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 7500, dateTime: '10/06/2023 14:55:45', transactionId: 'TXN20230610145545' },
      { month: 'Jul', year: 2023, status: 'completed', paymentMethod: 'UPI', amountReceived: 7500, dateTime: '10/07/2023 16:10:00', transactionId: 'TXN20230710161000' },
      { month: 'Aug', year: 2023, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 7500, dateTime: '10/08/2023 09:25:15', transactionId: 'TXN20230810092515' },
      { month: 'Sep', year: 2023, status: 'completed', paymentMethod: 'Bank Transfer', amountReceived: 7500, dateTime: '10/09/2023 10:40:30', transactionId: 'TXN20230910104030' },
      { month: 'Oct', year: 2023, status: 'completed', paymentMethod: 'UPI', amountReceived: 7500, dateTime: '10/10/2023 11:55:45', transactionId: 'TXN20231010115545' },
      { month: 'Nov', year: 2023, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 7500, dateTime: '10/11/2023 13:10:00', transactionId: 'TXN20231110131000' },
      { month: 'Dec', year: 2023, status: 'completed', paymentMethod: 'UPI', amountReceived: 7500, dateTime: '10/12/2023 14:25:15', transactionId: 'TXN20231210142515' },
      { month: 'Jan', year: 2024, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 7500, dateTime: '10/01/2024 15:40:30', transactionId: 'TXN20240110154030' },
    ],
  },
  {
    id: 9,
    schemeId: '#3344556677',
    plan: {
      name: 'Golden 11 Flexi',
      code: 'GS002',
    },
    monthlyDeposit: 2500,
    customer: {
      name: 'Sunita Devi',
      email: 'sunita.devi@email.com',
      phone: '9876543213',
      avatar: 'assets/users/u3.jpg',
    },
    startedOn: '10/04/2023',
    status: 'completed',
    progress: {
      completed: 11,
      total: 11,
    },
    dues: {
      hasDues: false,
    },
    totalPaid: 27500,
    totalAmount: 27500,
    paymentTimeline: [
      { month: 'Apr', year: 2023, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 2500, dateTime: '10/04/2023 12:00:00', transactionId: 'TXN20230410120000' },
      { month: 'May', year: 2023, status: 'completed', paymentMethod: 'UPI', amountReceived: 2500, dateTime: '10/05/2023 13:15:30', transactionId: 'TXN20230510131530' },
      { month: 'Jun', year: 2023, status: 'completed', paymentMethod: 'Bank Transfer', amountReceived: 2500, dateTime: '10/06/2023 14:30:45', transactionId: 'TXN20230610143045' },
      { month: 'Jul', year: 2023, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 2500, dateTime: '10/07/2023 15:45:15', transactionId: 'TXN20230710154515' },
      { month: 'Aug', year: 2023, status: 'completed', paymentMethod: 'UPI', amountReceived: 2500, dateTime: '10/08/2023 17:00:30', transactionId: 'TXN20230810170030' },
      { month: 'Sep', year: 2023, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 2500, dateTime: '10/09/2023 09:15:45', transactionId: 'TXN20230910091545' },
      { month: 'Oct', year: 2023, status: 'completed', paymentMethod: 'Bank Transfer', amountReceived: 2500, dateTime: '10/10/2023 10:30:00', transactionId: 'TXN20231010103000' },
      { month: 'Nov', year: 2023, status: 'completed', paymentMethod: 'UPI', amountReceived: 2500, dateTime: '10/11/2023 11:45:15', transactionId: 'TXN20231110114515' },
      { month: 'Dec', year: 2023, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 2500, dateTime: '10/12/2023 13:00:30', transactionId: 'TXN20231210130030' },
      { month: 'Jan', year: 2024, status: 'completed', paymentMethod: 'UPI', amountReceived: 2500, dateTime: '10/01/2024 14:15:45', transactionId: 'TXN20240110141545' },
      { month: 'Feb', year: 2024, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 2500, dateTime: '10/02/2024 15:30:00', transactionId: 'TXN20240210153000' },
    ],
  },
  {
    id: 10,
    schemeId: '#4455667788',
    plan: {
      name: 'Golden 11',
      code: 'GS001',
    },
    monthlyDeposit: 4000,
    customer: {
      name: 'Vikram Singh',
      email: 'vikram.singh@email.com',
      phone: '9876543214',
      avatar: 'assets/users/u4.jpg',
    },
    startedOn: '10/10/2024',
    status: 'breached',
    progress: {
      completed: 2,
      total: 11,
    },
    dues: {
      hasDues: true,
      currentDue: '3rd Month (January) Due',
    },
    totalPaid: 8000,
    totalAmount: 44000,
    paymentTimeline: [
      { month: 'Oct', year: 2024, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 4000, dateTime: '10/10/2024 16:00:00', transactionId: 'TXN20241010160000' },
      { month: 'Nov', year: 2024, status: 'completed', paymentMethod: 'UPI', amountReceived: 4000, dateTime: '10/11/2024 17:15:30', transactionId: 'TXN20241110171530' },
      { month: 'Dec', year: 2024, status: 'due' },
      { month: 'Jan', year: 2025, status: 'due' },
      { month: 'Feb', year: 2025, status: 'pending' },
      { month: 'Mar', year: 2025, status: 'pending' },
      { month: 'Apr', year: 2025, status: 'pending' },
      { month: 'May', year: 2025, status: 'pending' },
      { month: 'Jun', year: 2025, status: 'pending' },
      { month: 'Jul', year: 2025, status: 'pending' },
      { month: 'Aug', year: 2025, status: 'pending' },
    ],
  },
  {
    id: 11,
    schemeId: '#5566778899',
    plan: {
      name: 'Golden 11 Flexi',
      code: 'GS002',
    },
    monthlyDeposit: 6000,
    customer: {
      name: 'Meera Nair',
      email: 'meera.nair@email.com',
      phone: '9876543215',
      avatar: 'assets/users/u5.jpg',
    },
    startedOn: '10/06/2024',
    status: 'paused',
    progress: {
      completed: 5,
      total: 11,
    },
    dues: {
      hasDues: false,
    },
    totalPaid: 30000,
    totalAmount: 66000,
    paymentTimeline: [
      { month: 'Jun', year: 2024, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 6000, dateTime: '10/06/2024 10:00:00', transactionId: 'TXN20240610100000' },
      { month: 'Jul', year: 2024, status: 'completed', paymentMethod: 'UPI', amountReceived: 6000, dateTime: '10/07/2024 11:15:30', transactionId: 'TXN20240710111530' },
      { month: 'Aug', year: 2024, status: 'completed', paymentMethod: 'Bank Transfer', amountReceived: 6000, dateTime: '10/08/2024 12:30:45', transactionId: 'TXN20240810123045' },
      { month: 'Sep', year: 2024, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 6000, dateTime: '10/09/2024 13:45:15', transactionId: 'TXN20240910134515' },
      { month: 'Oct', year: 2024, status: 'completed', paymentMethod: 'UPI', amountReceived: 6000, dateTime: '10/10/2024 15:00:30', transactionId: 'TXN20241010150030' },
      { month: 'Nov', year: 2024, status: 'pending' },
      { month: 'Dec', year: 2024, status: 'pending' },
      { month: 'Jan', year: 2025, status: 'pending' },
      { month: 'Feb', year: 2025, status: 'pending' },
      { month: 'Mar', year: 2025, status: 'pending' },
      { month: 'Apr', year: 2025, status: 'pending' },
    ],
  },
  {
    id: 12,
    schemeId: '#6677889900',
    plan: {
      name: 'Golden 11',
      code: 'GS001',
    },
    monthlyDeposit: 8000,
    customer: {
      name: 'Suresh Reddy',
      email: 'suresh.reddy@email.com',
      phone: '9876543216',
      avatar: 'assets/users/u1.jpg',
    },
    startedOn: '10/10/2024',
    status: 'stopped',
    progress: {
      completed: 1,
      total: 11,
    },
    dues: {
      hasDues: true,
      currentDue: '2nd Month (December) Due',
    },
    totalPaid: 8000,
    totalAmount: 88000,
    paymentTimeline: [
      { month: 'Oct', year: 2024, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 8000, dateTime: '10/10/2024 18:00:00', transactionId: 'TXN20241010180000' },
      { month: 'Nov', year: 2024, status: 'due' },
      { month: 'Dec', year: 2024, status: 'due' },
      { month: 'Jan', year: 2025, status: 'pending' },
      { month: 'Feb', year: 2025, status: 'pending' },
      { month: 'Mar', year: 2025, status: 'pending' },
      { month: 'Apr', year: 2025, status: 'pending' },
      { month: 'May', year: 2025, status: 'pending' },
      { month: 'Jun', year: 2025, status: 'pending' },
      { month: 'Jul', year: 2025, status: 'pending' },
      { month: 'Aug', year: 2025, status: 'pending' },
    ],
  },
  {
    id: 13,
    schemeId: '#7788990011',
    plan: {
      name: 'Golden 11 Flexi',
      code: 'GS002',
    },
    monthlyDeposit: 1200,
    customer: {
      name: 'Anita Gupta',
      email: 'anita.gupta@email.com',
      phone: '9876543217',
      avatar: 'assets/users/u2.jpg',
    },
    startedOn: '10/05/2024',
    status: 'on_track',
    progress: {
      completed: 6,
      total: 11,
    },
    dues: {
      hasDues: false,
    },
    totalPaid: 7200,
    totalAmount: 13200,
    paymentTimeline: [
      { month: 'May', year: 2024, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 1200, dateTime: '10/05/2024 08:00:00', transactionId: 'TXN20240510080000' },
      { month: 'Jun', year: 2024, status: 'completed', paymentMethod: 'UPI', amountReceived: 1200, dateTime: '10/06/2024 09:15:30', transactionId: 'TXN20240610091530' },
      { month: 'Jul', year: 2024, status: 'completed', paymentMethod: 'Bank Transfer', amountReceived: 1200, dateTime: '10/07/2024 10:30:45', transactionId: 'TXN20240710103045' },
      { month: 'Aug', year: 2024, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 1200, dateTime: '10/08/2024 11:45:15', transactionId: 'TXN20240810114515' },
      { month: 'Sep', year: 2024, status: 'completed', paymentMethod: 'UPI', amountReceived: 1200, dateTime: '10/09/2024 13:00:30', transactionId: 'TXN20240910130030' },
      { month: 'Oct', year: 2024, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 1200, dateTime: '10/10/2024 14:15:45', transactionId: 'TXN20241010141545' },
      { month: 'Nov', year: 2024, status: 'pending' },
      { month: 'Dec', year: 2024, status: 'pending' },
      { month: 'Jan', year: 2025, status: 'pending' },
      { month: 'Feb', year: 2025, status: 'pending' },
      { month: 'Mar', year: 2025, status: 'pending' },
    ],
  },
  {
    id: 14,
    schemeId: '#8899001122',
    plan: {
      name: 'Golden 11',
      code: 'GS001',
    },
    monthlyDeposit: 3500,
    customer: {
      name: 'Ravi Patel',
      email: 'ravi.patel@email.com',
      phone: '9876543218',
      avatar: 'assets/users/u3.jpg',
    },
    startedOn: '10/04/2024',
    status: 'on_track',
    progress: {
      completed: 7,
      total: 11,
    },
    dues: {
      hasDues: false,
    },
    totalPaid: 24500,
    totalAmount: 38500,
    paymentTimeline: [
      { month: 'Apr', year: 2024, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 3500, dateTime: '10/04/2024 09:00:00', transactionId: 'TXN20240410090000' },
      { month: 'May', year: 2024, status: 'completed', paymentMethod: 'UPI', amountReceived: 3500, dateTime: '10/05/2024 10:15:30', transactionId: 'TXN20240510101530' },
      { month: 'Jun', year: 2024, status: 'completed', paymentMethod: 'Bank Transfer', amountReceived: 3500, dateTime: '10/06/2024 11:30:45', transactionId: 'TXN20240610113045' },
      { month: 'Jul', year: 2024, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 3500, dateTime: '10/07/2024 12:45:15', transactionId: 'TXN20240710124515' },
      { month: 'Aug', year: 2024, status: 'completed', paymentMethod: 'UPI', amountReceived: 3500, dateTime: '10/08/2024 14:00:30', transactionId: 'TXN20240810140030' },
      { month: 'Sep', year: 2024, status: 'completed', paymentMethod: 'RazorPay', amountReceived: 3500, dateTime: '10/09/2024 15:15:45', transactionId: 'TXN20240910151545' },
      { month: 'Oct', year: 2024, status: 'completed', paymentMethod: 'UPI', amountReceived: 3500, dateTime: '10/10/2024 16:30:00', transactionId: 'TXN20241010163000' },
      { month: 'Nov', year: 2024, status: 'pending' },
      { month: 'Dec', year: 2024, status: 'pending' },
      { month: 'Jan', year: 2025, status: 'pending' },
      { month: 'Feb', year: 2025, status: 'pending' },
    ],
  },
];
