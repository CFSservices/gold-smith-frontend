/**
 * Cancelled Status Cell - red "Cancelled" + date + auth info
 * Figma node: 224:27132 (Cancelled tab status column)
 */

import { Icon } from '@/components/ui/Icon';
import type { Order } from '@/features/orders/types';

interface CancelledStatusCellProps {
  order: Order;
}

export function CancelledStatusCell({ order }: CancelledStatusCellProps) {
  const info = order.cancellationInfo;

  return (
    <div className="flex flex-col gap-1 min-w-[200px]">
      {/* Cancelled badge */}
      <div className="flex items-center gap-1.5">
        <Icon name="cancel" size={18} filled className="text-red-600 dark:text-red-400" />
        <span className="text-sm-semibold text-red-600 dark:text-red-400">Cancelled</span>
      </div>

      {info && (
        <>
          <div className="text-xs-normal text-secondary-600 dark:text-secondary-400">
            On <span className="text-xs-semibold">{info.cancelledAt}</span>
          </div>

          <div className="text-xs-normal text-secondary-500 dark:text-secondary-400">
            Authenticated by {info.authenticatedBy}
          </div>
        </>
      )}
    </div>
  );
}
