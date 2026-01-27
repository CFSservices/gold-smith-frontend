/**
 * Admin Layout - for admin panel pages
 * Uses shared BaseLayout component
 */

import type { ReactNode } from 'react';
import { BaseLayout } from '@/components/layout';
import { ADMIN_NAV_ITEMS, ROUTES } from '@/config/routes';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <BaseLayout
      navItems={ADMIN_NAV_ITEMS}
      showAdminBadge={true}
      showQuickLinks={true}
      quickLinksPath={ROUTES.dashboard}
      quickLinksLabel="User Dashboard"
      showBreadcrumb={true}
      breadcrumbLabel="Admin Panel"
      showNotifications={true}
      notificationCount={3}
    >
      {children}
    </BaseLayout>
  );
}

export default AdminLayout;
