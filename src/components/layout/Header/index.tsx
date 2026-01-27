/**
 * Header Component - Matching Figma design exactly
 * Left: App icon, Toggle icon, App heading
 * Right: Notifications, Logged in user
 */

import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { APP_CONFIG } from '@/config/constants';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/utils/format';
import AppIcon from '@/assets/AppIcon.svg';

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  showBreadcrumb?: boolean;
  breadcrumbLabel?: string;
  showNotifications?: boolean;
  notificationCount?: number;
  onLogout: () => void;
  isMobile?: boolean;
}

export function Header({
  sidebarCollapsed,
  onToggleSidebar,
  showBreadcrumb = false,
  breadcrumbLabel = 'Admin Panel',
  showNotifications = false,
  notificationCount = 0,
  onLogout,
}: HeaderProps) {
  const { user } = useAuthStore();
  
  // Get user display name and role
  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const userRole = user?.role === 'admin' ? 'Super Admin' : user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';
  const userInitials = user ? getInitials(`${user.firstName} ${user.lastName}`) : 'U';

  return (
    <header className="fixed top-0 left-0 right-0 z-20 h-24 bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700">
      {/* Mobile-first: smaller padding, then desktop padding */}
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left side - App icon, Toggle, App heading */}
        {/* Mobile-first: smaller gap and icon size, then desktop sizes */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* App Icon - Using AppIcon.svg from assets */}
          <img 
            src={AppIcon} 
            alt={`${APP_CONFIG.name} Logo`}
            className="w-12 h-12 md:w-16 md:h-16 shrink-0"
          />

          {/* Toggle Button - Figma: 32x32px, icon 28px, color #675122 */}
          {/* Property 1=1: left_panel_close (when sidebar is open), Property 1=2: left_panel_open (when sidebar is closed) */}
          <Button
            icon={<PrimeReactIcon name={sidebarCollapsed ? 'left_panel_open' : 'left_panel_close'} size={28} className="text-[#675122] dark:text-[#d4a574]" />}
            text
            onClick={onToggleSidebar}
            className="w-7 h-7 md:w-8 md:h-8 p-0 flex items-center justify-center hover:bg-transparent"
          />

          {/* App Heading - Mobile-first: smaller text, then desktop size */}
          <h1
            className="text-lg md:text-2xl font-semibold text-black dark:text-white truncate"
            style={{
              fontFamily: "'Noto Sans', 'Inter', sans-serif",
              fontStyle: 'SemiCondensed SemiBold',
              fontWeight: 600,
              letterSpacing: 0,
            }}
          >
            <span className="hidden md:inline">
              {APP_CONFIG.name}
              {showBreadcrumb && breadcrumbLabel && ` - ${breadcrumbLabel}`}
            </span>
            <span className="md:hidden">{APP_CONFIG.name}</span>
          </h1>
        </div>

        {/* Right side - Always show Theme Toggle and Notifications */}
        {/* Mobile-first: smaller gap, then desktop gap */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme Toggle - Always visible */}
          <ThemeToggle 
            className="w-7 h-7 md:w-8 md:h-8 p-0 flex items-center justify-center hover:bg-transparent" 
            iconSize={28}
          />

          {/* Notifications - Always visible, Figma: 32x32px button, icon 28px, badge with count */}
          <div className="relative">
            <Button
              icon={<PrimeReactIcon name="notifications" size={28} className="text-[#675122] dark:text-[#d4a574]" />}
              text
              className="w-7 h-7 md:w-8 md:h-8 p-0 flex items-center justify-center hover:bg-transparent"
            />
            {/* Badge only shows when there are notifications */}
            {showNotifications && notificationCount > 0 && (
              <Badge
                value={notificationCount > 99 ? '99+' : String(notificationCount)}
                severity="danger"
                className="absolute -top-1 -right-1 min-w-[26px] h-[15px] text-[11px] px-1 flex items-center justify-center"
                style={{
                  backgroundColor: '#a90000',
                  color: '#ffffff',
                  fontFamily: "'Noto Sans', 'Inter', sans-serif",
                  fontSize: '11px',
                  lineHeight: '14.98px',
                }}
              />
            )}
          </div>

          {/* User Profile and Logout - Desktop only, mobile moved to sidebar */}
          <div className="hidden md:flex items-center gap-2 md:gap-4">
            {/* User Profile */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Avatar - Desktop: 38x38px */}
              <Avatar
                label={userInitials}
                shape="circle"
                size="large"
                className="bg-[#cc668e] text-white shrink-0 w-[38px] h-[38px] text-sm"
              />
              
              {/* User Name and Role */}
              <div>
                <p
                  className="text-base font-medium text-black dark:text-white leading-tight m-0"
                  style={{
                    fontFamily: "'Noto Sans', 'Inter', sans-serif",
                    fontStyle: 'SemiCondensed Bold',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '21.79px',
                  }}
                >
                  {userName}
                </p>
                <p
                  className="text-xs font-semibold text-black dark:text-white leading-tight m-0"
                  style={{
                    fontFamily: "'Noto Sans', 'Inter', sans-serif",
                    fontStyle: 'SemiCondensed SemiBold',
                    fontWeight: 600,
                    fontSize: '12px',
                    lineHeight: '16.34px',
                  }}
                >
                  {userRole}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              icon={<PrimeReactIcon name="logout" size={28} className="text-[#675122] dark:text-[#d4a574]" />}
              text
              onClick={onLogout}
              tooltip="Logout"
              tooltipOptions={{ position: 'bottom' }}
              className="w-8 h-8 p-0 flex items-center justify-center hover:bg-transparent"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
