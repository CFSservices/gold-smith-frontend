/**
 * Application routing configuration
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

// Layouts
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// Route guards
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

// Loading component
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));

const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const OrdersPage = lazy(() => import('@/features/dashboard/pages/OrdersPage'));
const SchemesPage = lazy(() => import('@/features/dashboard/pages/SchemesPage'));
const JewelsPage = lazy(() => import('@/features/dashboard/pages/JewelsPage'));
const ContentPage = lazy(() => import('@/features/dashboard/pages/ContentPage'));
const CustomersPage = lazy(() => import('@/features/dashboard/pages/CustomersPage'));
const ProfilePage = lazy(() => import('@/features/dashboard/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/features/dashboard/pages/SettingsPage'));

const NotFoundPage = lazy(() => import('@/features/auth/pages/NotFoundPage'));

// Suspense wrapper for lazy loaded components
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>{children}</Suspense>
);

// Router configuration
export const router = createBrowserRouter([
  // Public routes (auth pages)
  {
    element: (
      <PublicRoute>
        <AuthLayout>
          <SuspenseWrapper>
            <Outlet />
          </SuspenseWrapper>
        </AuthLayout>
      </PublicRoute>
    ),
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
    ],
  },

  // Protected routes (admin dashboard)
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <SuspenseWrapper>
            <Outlet />
          </SuspenseWrapper>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/orders',
        element: <OrdersPage />,
      },
      {
        path: '/schemes',
        element: <SchemesPage />,
      },
      {
        path: '/jewels',
        element: <JewelsPage />,
      },
      {
        path: '/content',
        element: <ContentPage />,
      },
      {
        path: '/customers',
        element: <CustomersPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
    ],
  },

  // Root redirect
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  // 404 Not Found
  {
    path: '*',
    element: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },
]);

export default router;
