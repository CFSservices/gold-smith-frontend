/**
 * BaseLayout Component - Shared layout logic for Dashboard (admin-only app)
 */

import { STORAGE_KEYS } from '@/config/constants';
import { ROUTES } from '@/config/routes';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useBreakpoint } from '@/hooks/useMediaQuery';
import { useAuthStore } from '@/store/authStore';
import type { NavItem } from '@/types';
import { cn } from '@/utils/cn';
import { formatUserRole, getInitials } from '@/utils/format';
import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';

interface BaseLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
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
  const userName = user ? `${user.firstName} ${user.lastName}` : 'Admin';
  const userRole = formatUserRole(user?.role);
  const userInitials = user ? getInitials(`${user.firstName} ${user.lastName}`) : 'A';

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
    <div className="min-h-screen">
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
          onClick={() => { setMobileMenuOpen(false); }}
        />
      )}

      {/* Main content - Fixed position, scrollable */}
      {/* Mobile-first: full width, then desktop adjusts based on sidebar */}
      <div
        className={cn(
          'fixed top-24 left-0 right-0 w-screen',
          'transition-all duration-300 overflow-hidden',
          'h-[calc(100vh-96px)]',
          'flex flex-col',
          // Desktop: adjust position and width based on sidebar state
          'md:transition-all md:duration-300',
          !sidebarCollapsed && 'md:left-[250px] md:w-[calc(100vw-250px)]',
          sidebarCollapsed && 'md:left-0 md:w-screen'
        )}
      >
        {/* Content container - Pure white background with border, margin outside border, top border radius */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-white dark:bg-secondary-800 border border-[#cccccc] dark:border-secondary-700 rounded-t-xl mx-4 md:mx-12">
          {/* Page content - Inner padding for content spacing */}
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
