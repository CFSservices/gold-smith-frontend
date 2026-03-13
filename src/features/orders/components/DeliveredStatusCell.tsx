/**
 * Delivered Status Cell - green "Delivered" + delivery mode + date + recipient + auth
 * Figma node: 168:24185 (Delivered tab status column)
 */

import { Icon } from '@/components/ui/Icon';
import type { Order } from '@/features/orders/types';

interface DeliveredStatusCellProps {
  order: Order;
}

export function DeliveredStatusCell({ order }: DeliveredStatusCellProps) {
  const info = order.deliveryInfo;

  const deliveryModeLabel =
    info?.mode === 'home_delivery' ? 'Home Delivery' : 'Self Collection At Store';
  const deliveryModeIcon =
    info?.mode === 'home_delivery' ? 'local_shipping' : 'storefront';

  return (
    <div className="flex flex-col gap-1 min-w-[200px]">
      {/* Delivered badge */}
      <div className="flex items-center gap-1.5">
        <Icon name="check_circle" size={18} filled className="text-green-600 dark:text-green-400" />
        <span className="text-sm-semibold text-green-600 dark:text-green-400">Delivered</span>
      </div>

      {/* Delivery mode chip */}
      {info && (
        <>
          <div className="flex items-center gap-1.5 mt-1">
            <Icon name={deliveryModeIcon} size={16} className="text-secondary-600 dark:text-secondary-400" />
            <span className="text-xs-medium text-secondary-700 dark:text-secondary-300">
              {deliveryModeLabel}
            </span>
          </div>

          <div className="text-xs-normal text-secondary-600 dark:text-secondary-400">
            On <span className="text-xs-semibold">{info.deliveredAt}</span>
          </div>

          <div className="text-xs-normal text-secondary-600 dark:text-secondary-400">
            To <span className="text-xs-semibold">{info.recipientName}</span>
          </div>

          <div className="text-xs-normal text-secondary-500 dark:text-secondary-400">
            Authenticated by {info.authenticatedBy}
          </div>
        </>
      )}
    </div>
  );
}
