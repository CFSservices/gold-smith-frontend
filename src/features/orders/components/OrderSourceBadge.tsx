/**
 * Order Source Badge - displays order source as a styled chip
 * Figma node: 224:28744
 */

import type { OrderSource } from '@/features/orders/types';

interface OrderSourceBadgeProps {
  source: OrderSource;
}

export function OrderSourceBadge({ source }: OrderSourceBadgeProps) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs-medium bg-surface-ground dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 border border-border-default dark:border-secondary-700 whitespace-nowrap">
      {source}
    </span>
  );
}
