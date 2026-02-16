/**
 * Application route configuration
 */

import type { NavItem, UserRole } from '@/types';

// Route paths
export const ROUTES = {
  // Public routes
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',

  // Protected routes - Dashboard
  dashboard: '/dashboard',
  orders:'/orders',
  schemes:'/schemes',
  profile: '/profile',
  settings: '/settings',

  // Protected routes - Admin
  admin: {
    root: '/admin',
    dashboard: '/admin/dashboard',
    orders: '/admin/orders',
    users: '/admin/users',
    userDetail: (id: string) => `/admin/users/${id}`,
    merchants: '/admin/merchants',
    merchantDetail: (id: string) => `/admin/merchants/${id}`,
    reports: '/admin/reports',
    settings: '/admin/settings',
  },

  // Error pages
  notFound: '/404',
  unauthorized: '/403',
  serverError: '/500',
} as const;

// Navigation items for sidebar
export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.dashboard,
    icon: 'pi pi-home',
  },
  {
    label: 'Orders',
    path: ROUTES.orders,
    icon: 'pi pi-box',
  },
  {
    label: 'Schemes',
    path: ROUTES.schemes,
    icon: 'pi pi-book',
  },
  {
    label: 'Profile',
    path: ROUTES.profile,
    icon: 'pi pi-user',
  },
  {
    label: 'Settings',
    path: ROUTES.settings,
    icon: 'pi pi-cog',
  },
];

// Admin navigation items
export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.admin.dashboard,
    icon: 'pi pi-th-large',
    roles: ['admin'],
  },
  {
    label: 'Orders',
    path: ROUTES.admin.orders,
    icon: 'pi pi-shopping-bag',
    roles: ['admin'],
  },
  {
    label: 'Users',
    path: ROUTES.admin.users,
    icon: 'pi pi-users',
    roles: ['admin'],
  },
  {
    label: 'Merchants',
    path: ROUTES.admin.merchants,
    icon: 'pi pi-building',
    roles: ['admin'],
  },
  {
    label: 'Reports',
    path: ROUTES.admin.reports,
    icon: 'pi pi-chart-bar',
    roles: ['admin'],
  },
  {
    label: 'Settings',
    path: ROUTES.admin.settings,
    icon: 'pi pi-cog',
    roles: ['admin'],
  },
];

// Helper function to check if user has access to route
export const hasRouteAccess = (roles: UserRole[] | undefined, userRole: UserRole): boolean => {
  if (!roles || roles.length === 0) {
    return true;
  }
  return roles.includes(userRole);
};

// Helper to get route title
export const getRouteTitle = (pathname: string): string => {
  const routeTitles: Record<string, string> = {
    [ROUTES.home]: 'Home',
    [ROUTES.login]: 'Login',
    [ROUTES.register]: 'Register',
    [ROUTES.forgotPassword]: 'Forgot Password',
    [ROUTES.dashboard]: 'Dashboard',
    [ROUTES.profile]: 'Profile',
    [ROUTES.schemes]:'Schemes',
    [ROUTES.orders]: 'Orders',
    [ROUTES.settings]: 'Settings',
    [ROUTES.admin.dashboard]: 'Admin Dashboard',
    [ROUTES.admin.orders]: 'Orders',
    [ROUTES.admin.users]: 'User Management',
    [ROUTES.admin.merchants]: 'Merchant Management',
    [ROUTES.admin.reports]: 'Reports',
    [ROUTES.admin.settings]: 'Admin Settings',
  };

  return routeTitles[pathname] ?? 'Gold Smith';
};
