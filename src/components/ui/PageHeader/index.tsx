/**
 * PageHeader Component - Reusable page header matching Figma design
 * Fixed height: 80px, includes title and breadcrumb
 */

interface PageHeaderProps {
  title: string;
  breadcrumb?: string;
  className?: string;
}

export function PageHeader({ title, breadcrumb, className = '' }: PageHeaderProps) {
  return (
    <div className={`page-header shrink-0 ${className}`}>
      <div className="h-full flex flex-col justify-center px-3 md:px-4">
        {/* Page Title - Uses global .page-title class */}
        <h1 className="page-title">
          {title}
        </h1>
        {/* Breadcrumb - Uses global .page-breadcrumb class */}
        {breadcrumb && (
          <div className="mt-0.5">
            <span className="page-breadcrumb">
              {breadcrumb}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
