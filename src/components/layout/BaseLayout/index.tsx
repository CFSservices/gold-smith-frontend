/**
 * BaseLayout Component - Shared layout logic for Dashboard and Admin layouts
 */

import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { STORAGE_KEYS } from '@/config/constants';
import { ROUTES } from '@/config/routes';
import type { NavItem } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useBreakpoint } from '@/hooks/useMediaQuery';
import { getInitials } from '@/utils/format';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';

interface BaseLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  showAdminBadge?: boolean;
  showQuickLinks?: boolean;
  quickLinksPath?: string;
  quickLinksLabel?: string;
  showBreadcrumb?: boolean;
  breadcrumbLabel?: string;
  showNotifications?: boolean;
  notificationCount?: number;
}

export function BaseLayout({
  children,
  navItems,
  showAdminBadge = false,
  showQuickLinks = false,
  quickLinksPath,
  quickLinksLabel,
  showBreadcrumb = false,
  breadcrumbLabel,
  showNotifications = false,
  notificationCount = 0,
}: BaseLayoutProps) {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { isMobile } = useBreakpoint();
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage(
    STORAGE_KEYS.sidebarCollapsed,
    false
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get user display data for sidebar (mobile)
  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const userRole = user?.role === 'admin' ? 'Super Admin' : user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';
  const userInitials = user ? getInitials(`${user.firstName} ${user.lastName}`) : 'U';

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

  const handleMobileMenuClose = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Header - Fixed at top */}
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        showBreadcrumb={showBreadcrumb}
        breadcrumbLabel={breadcrumbLabel}
        showNotifications={showNotifications}
        notificationCount={notificationCount}
        onLogout={handleLogout}
      />

      {/* Sidebar - Fixed, starts below header (top-24 = 96px) */}
      <Sidebar
        navItems={navItems}
        collapsed={sidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        isMobile={isMobile}
        onMobileMenuClose={handleMobileMenuClose}
        showAdminBadge={showAdminBadge}
        showQuickLinks={showQuickLinks}
        quickLinksPath={quickLinksPath}
        quickLinksLabel={quickLinksLabel}
        onLogout={handleLogout}
        userName={userName}
        userRole={userRole}
        userInitials={userInitials}
      />

      {/* Mobile overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content - Fixed position, scrollable */}
      {/* Mobile-first: full width, then desktop adjusts based on sidebar */}
      <div
        className={cn(
          'fixed top-24 left-0 right-0 w-screen',
          'transition-all duration-300 overflow-y-auto',
          'h-[calc(100vh-96px)]',
          // Desktop: adjust position and width based on sidebar state
          'md:transition-all md:duration-300',
          !sidebarCollapsed && 'md:left-[225px] md:w-[calc(100vw-225px)]',
          sidebarCollapsed && 'md:left-0 md:w-screen'
        )}
      >
        {/* Page content - Mobile-first: smaller padding, then desktop padding */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
