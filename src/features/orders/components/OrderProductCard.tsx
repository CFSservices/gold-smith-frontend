/**
 * Order Product Card - 3 states (Default/Hover/Pressed)
 * Figma node: 126:22129
 * Shows: row#, 120px image, name, unit price, material, weight, total price, stock IDs, unit count, chevron on hover
 */

import { memo, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { formatCurrency } from '@/utils/format';
import type { OrderItem } from '@/features/orders/types';

interface OrderProductCardProps {
  item: OrderItem;
  index: number;
  onClick?: (item: OrderItem) => void;
}

export const OrderProductCard = memo(function OrderProductCard({
  item,
  index,
  onClick,
}: OrderProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const totalPrice = item.unitPrice * item.quantity;
  const stockIdsList = item.stockIds?.join(', ') ?? (item.productId ? `#${item.productId.replace('#', '')}` : '');

  return (
    <div
      className={`flex gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
        isHovered
          ? 'border-gold-300 dark:border-gold-700 bg-gold-50/30 dark:bg-gold-950/10'
          : 'border-border-default dark:border-secondary-700 bg-white dark:bg-secondary-800'
      }`}
      onMouseEnter={() => { setIsHovered(true); }}
      onMouseLeave={() => { setIsHovered(false); }}
      onClick={() => onClick?.(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onClick?.(item);
        }
      }}
    >
      {/* Row number */}
      <div className="text-sm-normal text-secondary-500 dark:text-secondary-400 pt-1 w-4 shrink-0">
        {index}
      </div>

      {/* Product image — 120px */}
      <img
        src={item.image}
        alt={item.name}
        className="w-[120px] h-[120px] rounded-lg object-cover shrink-0"
      />

      {/* Product info */}
      <div className="flex-1 min-w-0">
        <div className="text-base-semibold text-secondary-900 dark:text-white mb-1">
          {item.name}
        </div>
        <div className="text-sm-normal text-secondary-600 dark:text-secondary-400">
          Unit price {formatCurrency(item.unitPrice)}
        </div>
        <div className="text-sm-normal text-secondary-600 dark:text-secondary-400 mb-2">
          {item.material} &bull; {item.weight}
        </div>

        {/* Total price */}
        <div className="text-xl-bold text-secondary-900 dark:text-white">
          {formatCurrency(totalPrice)}
        </div>

        {/* Stock IDs */}
        {stockIdsList && (
          <div className="text-xs-normal text-secondary-500 dark:text-secondary-400 mt-1 break-all">
            {stockIdsList}
          </div>
        )}
      </div>

      {/* Right side — unit count + chevron */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm-normal text-secondary-600 dark:text-secondary-400">
          {item.quantity} {item.quantity === 1 ? 'Unit' : 'Units'}
        </span>
        {isHovered && (
          <Icon
            name="chevron_right"
            size={20}
            className="text-secondary-400 dark:text-secondary-500"
          />
        )}
      </div>
    </div>
  );
});
