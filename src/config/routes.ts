/**
 * Application route configuration
 */

import type { NavItem, UserRole } from '@/types';

// Route paths
export const ROUTES = {
  // Public routes
  home: '/',
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',

  // Protected routes - Dashboard (admin-only app)
  dashboard: '/dashboard',
  orders: '/orders',
  schemes: '/schemes',
  jewels: '/jewels',
  content: '/content',
  customers: '/customers',
  profile: '/profile',
  settings: '/settings',

  // Error pages
  notFound: '/404',
  unauthorized: '/403',
  serverError: '/500',
} as const;

// Navigation items for sidebar - Updated to match Figma design
// Icons use Material Symbols Rounded names directly (matching Figma design)
export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.dashboard,
    icon: 'area_chart', // Material Symbols - matches Figma
    hasDropdown: true,
  },
  {
    label: 'Orders',
    path: ROUTES.orders,
    icon: 'package_2', // Material Symbols - matches Figma
    hasDropdown: true,
  },
  {
    label: 'Schemes',
    path: ROUTES.schemes,
    icon: 'book_5', // Material Symbols - matches Figma
    hasDropdown: true,
  },
  {
    label: 'Jewels',
    path: ROUTES.jewels,
    icon: 'diamond', // Material Symbols - matches Figma
    hasDropdown: true,
  },
  {
    label: 'Content',
    path: ROUTES.content,
    icon: 'app_registration', // Material Symbols - matches Figma
    hasDropdown: true,
  },
  {
    label: 'Customers',
    path: ROUTES.customers,
    icon: 'person', // Material Symbols - matches Figma (PERSON)
    hasDropdown: true,
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
    [ROUTES.forgotPassword]: 'Forgot Password',
    [ROUTES.dashboard]: 'Dashboard',
    [ROUTES.orders]: 'Orders',
    [ROUTES.schemes]: 'Schemes',
    [ROUTES.jewels]: 'Jewels',
    [ROUTES.content]: 'Content',
    [ROUTES.customers]: 'Customers',
    [ROUTES.profile]: 'Profile',
    [ROUTES.settings]: 'Settings',
  };

  return routeTitles[pathname] ?? 'Gold Smith';
};
