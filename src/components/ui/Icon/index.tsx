/**
 * Icon Component - Material Symbols Rounded wrapper
 * Matches Figma design which uses Material Symbols Rounded
 */

import { cn } from '@/utils/cn';

export interface IconProps {
  name: string;
  size?: number | string;
  filled?: boolean;
  className?: string;
}

/**
 * Icon component using Material Symbols Rounded
 * @param name - Material Symbols icon name (e.g., "area_chart", "notifications")
 * @param size - Icon size in pixels (default: 24)
 * @param filled - Whether to use filled variant (default: false)
 * @param className - Additional CSS classes
 */
export function Icon({ name, size = 24, filled = false, className }: IconProps) {
  return (
    <span
      className={cn(
        'material-symbols-rounded',
        filled && 'material-symbols-rounded-filled',
        className
      )}
      style={{ fontSize: typeof size === 'number' ? `${size}px` : size }}
    >
      {name}
    </span>
  );
}

/**
 * Helper function to render Material Symbols icon as ReactNode (for PrimeReact components)
 */
export function renderMaterialIcon(name: string, size = 24, filled = false): ReactNode {
  return <Icon name={name} size={size} filled={filled} />;
}
