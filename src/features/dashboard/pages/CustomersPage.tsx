/**
 * Customers Page - Placeholder
 */

import { PageHeader } from '@/components/ui/PageHeader';

export function CustomersPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Fixed Page Title Section */}
      <PageHeader title="Customers" breadcrumb="Customers" />

      {/* Scrollable Content Section */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="space-y-6 p-4 md:p-6 pt-7 md:pt-7">
          <p className="text-secondary-500 dark:text-secondary-400">
            Customers management page - Coming soon
          </p>
        </div>
      </div>
    </div>
  );
}

export default CustomersPage;
