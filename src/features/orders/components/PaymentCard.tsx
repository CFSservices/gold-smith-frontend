/**
 * Payment Card - 4 states: Default, Hover, Selected, Pressed
 * Figma node: 405:35995
 */

import { memo, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface PaymentCardProps {
  id: string;
  label: string;
  icon: string;
  iconType: 'icon' | 'text';
  selected: boolean;
  onSelect: (id: string) => void;
}

export const PaymentCard = memo(function PaymentCard({
  id,
  label,
  icon,
  iconType,
  selected,
  onSelect,
}: PaymentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={() => { onSelect(id); }}
      onMouseEnter={() => { setIsHovered(true); }}
      onMouseLeave={() => { setIsHovered(false); }}
      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
        selected
          ? 'border-gold-500 bg-gold-50 dark:bg-gold-950/20'
          : isHovered
            ? 'border-gold-300 dark:border-gold-700 bg-surface-ground dark:bg-secondary-800'
            : 'border-border-default dark:border-secondary-700 bg-white dark:bg-secondary-800'
      }`}
      aria-label={`Select ${label}`}
      aria-pressed={selected}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {iconType === 'icon' ? (
            <Icon
              name={icon}
              size={24}
              className={
                selected
                  ? 'text-gold-600 dark:text-gold-400'
                  : 'text-secondary-500 dark:text-secondary-400'
              }
            />
          ) : (
            <div
              className={`text-2xl-bold flex items-center justify-center w-8 h-8 rounded-full ${
                selected
                  ? 'text-gold-600 dark:text-gold-400 bg-gold-100 dark:bg-gold-900/30'
                  : 'text-secondary-500 dark:text-secondary-400 bg-surface-ground dark:bg-secondary-700'
              }`}
            >
              {icon}
            </div>
          )}
          <span
            className={`text-lg-semibold ${
              selected
                ? 'text-secondary-900 dark:text-white'
                : 'text-secondary-900 dark:text-white'
            }`}
          >
            {label}
          </span>
        </div>
        {selected && (
          <Icon
            name="check_circle"
            size={24}
            filled
            className="text-gold-600 dark:text-gold-400"
          />
        )}
      </div>
    </button>
  );
});
