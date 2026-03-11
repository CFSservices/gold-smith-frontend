/**
 * Mock user data for development
 * 
 * Note: Web app is admin-only. Admin users can login to web app.
 * Other roles (merchant, user, staff) are for mobile app customers.
 */

import type { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@goldsmith.com',
    firstName: 'Admin',
    lastName: 'User',
    phone: '9876543210',
    role: 'admin',
    status: 'active',
    emailVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    lastLoginAt: '2024-06-15T10:30:00.000Z',
  },
  {
    id: '2',
    email: 'merchant@goldsmith.com',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    phone: '9876543211',
    role: 'merchant',
    status: 'active',
    emailVerified: true,
    createdAt: '2024-02-15T00:00:00.000Z',
    updatedAt: '2024-02-15T00:00:00.000Z',
    lastLoginAt: '2024-06-14T14:20:00.000Z',
  },
  {
    id: '3',
    email: 'user@goldsmith.com',
    firstName: 'Priya',
    lastName: 'Sharma',
    phone: '9876543212',
    role: 'user',
    status: 'active',
    emailVerified: true,
    createdAt: '2024-03-10T00:00:00.000Z',
    updatedAt: '2024-03-10T00:00:00.000Z',
    lastLoginAt: '2024-06-13T09:15:00.000Z',
  },
];

// Mock passwords (for development only - NOT for production!)
export const mockPasswords: Record<string, string> = {
  'admin@goldsmith.com': 'Admin@123',
  'merchant@goldsmith.com': 'Merchant@123',
  'user@goldsmith.com': 'User@123',
};

export const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

export const validateCredentials = (email: string, password: string): User | null => {
  const user = findUserByEmail(email);
  if (user && mockPasswords[email] === password) {
    return user;
  }
  return null;
};
