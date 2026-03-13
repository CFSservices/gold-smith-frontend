/**
 * Pending Status Cell - date picker + deliver order button + gift badge
 * Figma node: 78:17117 (Pending tab status column)
 */

import { useRef } from 'react';

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Icon } from '@/components/ui/Icon';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';
import type { Order } from '@/features/orders/types';

interface PendingStatusCellProps {
  order: Order;
  deliveryDate: Date | null;
  onDateChange: (orderId: number, date: Date | null) => void;
  onDeliverOrder: (order: Order) => void;
}

export function PendingStatusCell({
  order,
  deliveryDate,
  onDateChange,
  onDeliverOrder,
}: PendingStatusCellProps) {
  const calendarRef = useRef<Calendar>(null);

  const formatDateDisplay = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-GB', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleDateChange = (e: { value: Date | null | (Date | null)[] }) => {
    const date = Array.isArray(e.value) ? e.value[0] : e.value;
    onDateChange(order.id, date ?? null);
  };

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateChange(order.id, null);
  };

  const handleDeliverClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeliverOrder(order);
  };

  const hasGift = order.giftCollection?.status === 'pending';

  return (
    <div className="flex flex-col gap-2 min-w-[230px]">
      <div className="text-xs-medium text-secondary-600 dark:text-secondary-400">
        Expected Delivery By
      </div>

      {/* Date picker */}
      <div
        className="relative w-full cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          calendarRef.current?.show();
        }}
      >
        <div className="w-full h-9 sm:h-10 rounded-lg border border-border-default dark:border-secondary-600 flex items-center px-3 pr-12 text-sm bg-white dark:bg-secondary-800">
          <span
            className={
              deliveryDate
                ? 'text-secondary-800 dark:text-secondary-200'
                : 'text-secondary-400 dark:text-secondary-500'
            }
          >
            {deliveryDate ? formatDateDisplay(deliveryDate) : 'Select Date'}
          </span>
          {deliveryDate && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClearDate}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleClearDate(e as unknown as React.MouseEvent);
                }
              }}
              className="absolute right-8 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 cursor-pointer"
              aria-label="Clear date"
            >
              <Icon name="close" size={18} />
            </span>
          )}
          <Icon
            name="calendar_month"
            size={20}
            className="absolute right-3 text-gold-dark dark:text-gold-400"
          />
        </div>
        <Calendar
          ref={calendarRef}
          value={deliveryDate}
          onChange={handleDateChange}
          dateFormat="dd M yy"
          className="hidden"
          showIcon={false}
        />
      </div>

      {/* Deliver Order button */}
      <div className="flex items-center gap-2">
        <Button
          label="Deliver Order"
          icon={<PrimeReactIcon name="package_2" size={20} />}
          size="small"
          onClick={handleDeliverClick}
          className="flex-1"
        />
        {hasGift && (
          <div className="relative">
            <Icon
              name="featured_seasonal_and_gifts"
              size={24}
              className="text-gold-700 dark:text-gold-400"
            />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-secondary-800" />
          </div>
        )}
      </div>
    </div>
  );
}
