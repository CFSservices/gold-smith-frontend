/**
 * PageHeader Component - Reusable page header matching Figma design
 * Fixed height: 80px, includes title, breadcrumb, and optional right-side actions
 */

import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  breadcrumb?: string;
  /** Right-side actions (e.g. New Order button). Use PrimeReact Button. */
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, breadcrumb, actions, className = '' }: PageHeaderProps) {
  return (
    <div className={`page-header shrink-0 ${className}`}>
      <div className="h-full flex items-center justify-between px-3 md:px-4">
        <div className="flex flex-col justify-center">
          <h1 className="page-title">{title}</h1>
          {breadcrumb && (
            <div className="mt-0.5">
              <span className="page-breadcrumb">{breadcrumb}</span>
            </div>
          )}
        </div>
        {actions && <div className="flex items-center shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
