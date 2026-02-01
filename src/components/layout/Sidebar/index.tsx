/**
 * Sidebar Component - Pure NavBar matching Figma design exactly
 * No logo, no user section, no quick links - just navigation buttons
 * On mobile: includes user profile and logout button at the bottom
 */

import { NavLink } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';
import { cn } from '@/utils/cn';
import type { NavItem } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';

interface SidebarProps {
  navItems: NavItem[];
  collapsed: boolean;
  mobileMenuOpen: boolean;
  isMobile: boolean;
  onMobileMenuClose: () => void;
  showQuickLinks?: boolean;
  quickLinksPath?: string;
  quickLinksLabel?: string;
  // Mobile header content props
  onLogout?: () => void;
  userName?: string;
  userRole?: string;
  userInitials?: string;
}

export function Sidebar({
  navItems,
  collapsed,
  mobileMenuOpen,
  isMobile,
  onMobileMenuClose,
  showQuickLinks = false,
  quickLinksPath,
  quickLinksLabel = 'Dashboard',
  onLogout,
  userName = 'Admin',
  userRole = 'Admin',
  userInitials = 'A',
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed top-24 left-0 z-40 transition-all duration-300',
        // Figma: Radial gradient background (#54421c → #2e240f)
        'bg-gradient-radial',
        // Figma: Border stroke with 0.1 opacity white
        'border-r border-white/10',
        // Mobile-first: hidden by default, shown when mobileMenuOpen
        // Desktop: width based on collapsed state
        'h-[calc(100vh-96px)]',
        'rounded-tr-3xl',
        // Mobile: overlay style, hidden when menu closed
        isMobile && (mobileMenuOpen ? 'w-[225px]' : '-translate-x-full w-[225px]'),
        // Desktop: width based on collapsed state
        !isMobile && (collapsed ? 'w-0 overflow-hidden border-r-0' : 'w-[225px]')
      )}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Navigation - Pure NavBar from Figma */}
        {/* Hide content during transition to prevent it showing before sidebar is fully open */}
        <nav 
          className={cn(
            // Mobile-first: smaller padding, then desktop padding
            'p-3 md:p-4 space-y-2 flex-1 overflow-y-auto',
            // Content fade transitions synchronized with sidebar width animation
            // When closing: fade out quickly (150ms) before width finishes (300ms)
            // When opening: fade in after delay (150ms) so content appears as sidebar opens
            (isMobile ? !mobileMenuOpen : collapsed)
              ? 'opacity-0 pointer-events-none invisible transition-opacity duration-150 delay-0' 
              : 'opacity-100 pointer-events-auto visible transition-opacity duration-200 delay-150'
          )}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  // Figma: Nav Button - Height 41px, Corner Radius 8px, Width 201px (with padding)
                  'flex items-center gap-3 rounded-lg transition-all duration-200',
                  'h-[41px]',
                  // Remove underline from NavLink
                  'no-underline',
                  // Figma: Padding ~12px horizontal (px-3 = 12px)
                  'px-3',
                  // Figma: Default state - transparent bg, white text (#ffffff)
                  !isActive && [
                    'bg-transparent text-white',
                    'hover:bg-white/15', // Figma: Hover - white overlay 15% opacity
                    'active:bg-white/25', // Figma: Pressed - white overlay 25% opacity
                  ],
                  // Figma: Active state - white bg (#ffffff), dark text (#2e240f)
                  isActive && 'bg-white text-[#2e240f] font-medium'
                )
              }
              onClick={onMobileMenuClose}
            >
              {item.icon && (
                <Icon 
                  name={item.icon} 
                  size={24} 
                  className="text-inherit flex-shrink-0"
                />
              )}
              <span 
                className="flex-1"
                style={{
                  fontFamily: "'Noto Sans', 'Inter', sans-serif",
                  fontStyle: 'SemiCondensed Bold',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '21.79px',
                  letterSpacing: 0,
                }}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Mobile Header Content - Shown only on mobile at bottom of sidebar */}
        {isMobile && (
          <div
            className={cn(
              'border-t border-white/10 p-4 space-y-3',
              // Content fade transitions synchronized with sidebar width animation
              !mobileMenuOpen
                ? 'opacity-0 pointer-events-none invisible transition-opacity duration-150 delay-0' 
                : 'opacity-100 pointer-events-auto visible transition-opacity duration-200 delay-150'
            )}
          >
            {/* User Profile Section */}
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <Avatar
                label={userInitials}
                shape="circle"
                size="large"
                className="bg-[#cc668e] text-white shrink-0 w-10 h-10 text-sm"
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-base font-medium text-white leading-tight m-0 truncate"
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
                  className="text-xs font-semibold text-white/80 leading-tight m-0 truncate"
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
            {onLogout && (
              <button
                onClick={() => {
                  onLogout();
                  onMobileMenuClose();
                }}
                className="flex items-center gap-3 rounded-lg transition-all duration-200 h-[41px] px-3 bg-white/15 hover:bg-white/25 text-white w-full justify-start"
              >
                <PrimeReactIcon name="logout" size={24} className="text-white" />
                <span
                  className="text-base font-medium"
                  style={{
                    fontFamily: "'Noto Sans', 'Inter', sans-serif",
                    fontStyle: 'SemiCondensed Bold',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '21.79px',
                  }}
                >
                  Logout
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
