/**
 * Admin Layout - for admin panel pages
 */

import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { cn } from '@/utils/cn';
import { APP_CONFIG, STORAGE_KEYS } from '@/config/constants';
import { ADMIN_NAV_ITEMS, ROUTES } from '@/config/routes';
import { useAuthStore } from '@/store/authStore';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useBreakpoint } from '@/hooks/useMediaQuery';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { getInitials } from '@/utils/format';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
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
          'bg-secondary-900 dark:bg-secondary-950 border-r border-secondary-800',
          sidebarCollapsed ? 'w-20' : 'w-64',
          isMobile && !mobileMenuOpen && '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-secondary-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0">
              <i className="pi pi-shopping-bag text-white text-xl" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <span className="text-lg font-bold text-white block leading-tight">
                  {APP_CONFIG.name}
                </span>
                <Badge value="Admin" severity="warning" className="text-xs" />
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  'text-secondary-300',
                  'hover:bg-secondary-800 hover:text-gold-400',
                  isActive && 'bg-gold-900/40 text-gold-400 border-l-4 border-gold-400',
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

        {/* Divider */}
        <div className="mx-4 border-t border-secondary-800" />

        {/* Quick links */}
        {!sidebarCollapsed && (
          <div className="p-4">
            <p className="text-xs uppercase tracking-wider text-secondary-500 mb-3">
              Quick Links
            </p>
            <NavLink
              to={ROUTES.dashboard}
              className="flex items-center gap-2 text-secondary-400 hover:text-gold-400 text-sm py-2"
            >
              <i className="pi pi-external-link text-xs" />
              <span>User Dashboard</span>
            </NavLink>
          </div>
        )}

        {/* User section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary-800">
          <div className={cn('flex items-center gap-3', sidebarCollapsed && 'justify-center')}>
            <div className="w-10 h-10 rounded-full bg-gold-600 flex items-center justify-center text-white font-semibold ring-2 ring-gold-400">
              {user ? getInitials(`${user.firstName} ${user.lastName}`) : 'A'}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-secondary-400 truncate">Administrator</p>
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
          <div className="h-full px-6 flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-4">
              {/* Shopping bag icon */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0">
                <i className="pi pi-shopping-bag text-white text-xl" />
              </div>

              {/* Title */}
              <h1 className="text-xl font-bold text-secondary-900 dark:text-white">
                Gold Smith - Admin Panel
              </h1>

              {/* Menu toggle */}
              <Button
                icon="pi pi-bars"
                text
                severity="secondary"
                onClick={toggleSidebar}
                className="lg:hidden ml-auto"
              />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* New Order Button */}
              <Button
                label="New Order"
                icon="pi pi-plus-circle"
                severity="warning"
                className="hidden md:flex"
              />

              <ThemeToggle />

              {/* Notifications */}
              <Button
                icon="pi pi-bell"
                text
                severity="secondary"
                badge="1"
                badgeClassName="p-badge-danger"
              />

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-600 flex items-center justify-center text-white font-semibold ring-2 ring-gold-400">
                  {user ? getInitials(`${user.firstName} ${user.lastName}`) : 'JD'}
                </div>
                <div className="hidden lg:flex flex-col">
                  <span className="text-sm font-semibold text-secondary-900 dark:text-white">
                    {user ? `${user.firstName} ${user.lastName}` : 'John Doe'}
                  </span>
                  <span className="text-xs text-secondary-500 dark:text-secondary-400">
                    Super Admin
                  </span>
                </div>
              </div>

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

export default AdminLayout;
