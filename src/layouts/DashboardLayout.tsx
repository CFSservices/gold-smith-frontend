/**
 * Dashboard Layout - for authenticated user pages
 * Uses shared BaseLayout component
 */

import type { ReactNode } from 'react';
import { BaseLayout } from '@/components/layout';
import { DASHBOARD_NAV_ITEMS } from '@/config/routes';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <BaseLayout navItems={DASHBOARD_NAV_ITEMS}>
      {children}
    </BaseLayout>
  );
}

export default DashboardLayout;
