/**
 * Dashboard Layout - for authenticated user pages
 */

import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { cn } from '@/utils/cn';
import { APP_CONFIG, STORAGE_KEYS } from '@/config/constants';
import { DASHBOARD_NAV_ITEMS, ROUTES } from '@/config/routes';
import { useAuthStore } from '@/store/authStore';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useBreakpoint } from '@/hooks/useMediaQuery';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { getInitials } from '@/utils/format';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isMobile } = useBreakpoint();
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage(
    STORAGE_KEYS.sidebarCollapsed,
    false
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login);
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen transition-transform duration-300',
          'bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700',
          sidebarCollapsed ? 'w-20' : 'w-64',
          isMobile && !mobileMenuOpen && '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0">
              <i className="pi pi-star-fill text-white text-xl" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-lg font-bold text-secondary-900 dark:text-white">
                {APP_CONFIG.name}
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {DASHBOARD_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  'text-secondary-600 dark:text-secondary-300',
                  'hover:bg-gold-50 hover:text-gold-600 dark:hover:bg-secondary-700',
                  isActive && 'bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400',
                  sidebarCollapsed && 'justify-center'
                )
              }
              onClick={() => isMobile && setMobileMenuOpen(false)}
            >
              <i className={cn(item.icon, 'text-lg')} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary-200 dark:border-secondary-700">
          <div className={cn('flex items-center gap-3', sidebarCollapsed && 'justify-center')}>
            <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-white font-semibold">
              {user ? getInitials(`${user.firstName} ${user.lastName}`) : 'U'}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div
        className={cn(
          'transition-all duration-300',
          !isMobile && (sidebarCollapsed ? 'ml-20' : 'ml-64')
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 h-16 bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700">
          <div className="h-full px-4 flex items-center justify-between">
            {/* Menu toggle */}
            <Button
              icon="pi pi-bars"
              text
              severity="secondary"
              onClick={toggleSidebar}
              className="lg:hidden"
            />

            {/* Desktop collapse toggle */}
            <Button
              icon={sidebarCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'}
              text
              severity="secondary"
              onClick={toggleSidebar}
              className="hidden lg:flex"
            />

            {/* Right side */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                icon="pi pi-sign-out"
                text
                severity="secondary"
                tooltip="Logout"
                tooltipOptions={{ position: 'bottom' }}
                onClick={handleLogout}
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
