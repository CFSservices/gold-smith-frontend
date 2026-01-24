/**
 * Admin route component for admin users only
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/config/routes';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { ReactNode } from 'react';

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  // Show loading while checking auth status
  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }

  // Redirect to dashboard if not admin
  if (!isAdmin) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <>{children}</>;
}

export default AdminRoute;
