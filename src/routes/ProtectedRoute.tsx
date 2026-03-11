/**
 * Protected route component for authenticated users
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/config/routes';
import { AUTH_ERRORS } from '@/config/constants';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = ROUTES.login 
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading, user, logout } = useAuthStore();

  // Show loading while checking auth status
  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Verify admin role (web app is admin-only)
  if (user?.role !== 'admin') {
    // Logout non-admin users
    logout();
    return (
      <Navigate 
        to={redirectTo} 
        state={{ 
          from: location, 
          error: AUTH_ERRORS.ACCESS_DENIED 
        }} 
        replace 
      />
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
