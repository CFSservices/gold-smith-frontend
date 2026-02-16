/**
 * Application routing configuration
 */

import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Layouts
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Route guards
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { PublicRoute } from './PublicRoute';

// Loading component
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));

const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const ProfilePage = lazy(() => import('@/features/dashboard/pages/ProfilePage'));
const SchemesPage = lazy(() => import('@/features/dashboard/pages/SchemesPage'));

const OrdersPage = lazy(() => import('@/features/dashboard/pages/OrdersPage'));
const SettingsPage = lazy(() => import('@/features/dashboard/pages/SettingsPage'));

const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage'));
const UsersPage = lazy(() => import('@/features/admin/pages/UsersPage'));
const AdminSettingsPage = lazy(() => import('@/features/admin/pages/AdminSettingsPage'));

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
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
    ],
  },

  // Protected routes (user dashboard)
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
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },

    ],
  },

  // Admin routes
  {
    element: (
      <AdminRoute>
        <AdminLayout>
          <SuspenseWrapper>
            <Outlet />
          </SuspenseWrapper>
        </AdminLayout>
      </AdminRoute>
    ),
    children: [
      {
        path: '/admin',
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: '/admin/dashboard',
        element: <AdminDashboardPage />,
      },
      {
        path: '/admin/users',
        element: <UsersPage />,
      },
      {
        path: '/admin/settings',
        element: <AdminSettingsPage />,
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
