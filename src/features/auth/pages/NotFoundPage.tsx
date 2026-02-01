/**
 * 404 Not Found Page
 */

import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ROUTES } from '@/config/routes';
import { useAuthStore } from '@/store/authStore';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';

export function NotFoundPage() {
  const { isAuthenticated, user } = useAuthStore();

  // Determine where to redirect (admin-only app)
  const homeRoute = isAuthenticated ? ROUTES.dashboard : ROUTES.login;

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 px-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="mb-8">
          <span className="text-9xl font-bold text-gold-500/20">404</span>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-secondary-500 dark:text-secondary-400 mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={homeRoute}>
            <Button
              label="Go Home"
              icon={<PrimeReactIcon name="home" size={20} />}
              className="w-full sm:w-auto"
            />
          </Link>
          <Button
            label="Go Back"
            icon={<PrimeReactIcon name="arrow_back" size={20} />}
            severity="secondary"
            outlined
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
