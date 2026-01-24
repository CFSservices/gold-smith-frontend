/**
 * Public route component - redirects authenticated users away from auth pages
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/config/routes';
import type { ReactNode } from 'react';

interface PublicRouteProps {
  children: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  // Get the redirect path from location state or default based on role
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  // If already authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    // Redirect to the page they tried to visit or default dashboard
    if (from) {
      return <Navigate to={from} replace />;
    }

    // Redirect based on role
    if (user?.role === 'admin') {
      return <Navigate to={ROUTES.admin.dashboard} replace />;
    }
    
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <>{children}</>;
}

export default PublicRoute;
