/**
 * Auth Layout - for login, register, and other auth pages
 */

import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { APP_CONFIG } from '@/config/constants';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import AppIcon from '@/assets/AppIcon.svg';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gold-50 via-white to-gold-100 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img 
              src={AppIcon} 
              alt={`${APP_CONFIG.name} Logo`}
              className="w-12 h-12 md:w-16 md:h-16 shrink-0"
            />
            <span className="text-xl font-bold text-secondary-900 dark:text-white">
              {APP_CONFIG.name}
            </span>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div
          className={cn(
            'w-full max-w-md',
            'bg-white dark:bg-secondary-800',
            'rounded-2xl shadow-xl',
            'border border-secondary-100 dark:border-secondary-700',
            'p-8'
          )}
        >
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-secondary-500 dark:text-secondary-400">
        <p>
          &copy; {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default AuthLayout;
