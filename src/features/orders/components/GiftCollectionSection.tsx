/**
 * Gift Collection Section - 3 states: Pending, Store Collection, Completed
 * Figma node: 397:19875
 */

import { useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Icon } from '@/components/ui/Icon';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';
import { formatDate } from '@/utils/format';
import type { Order } from '@/features/orders/types';

interface GiftCollectionSectionProps {
  order: Order;
}

const collectionOptions = [
  { label: 'Home Delivery', value: 'home delivery' },
  { label: 'Store Collection', value: 'self collection' },
];

export function GiftCollectionSection({ order }: GiftCollectionSectionProps) {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [giftOtp, setGiftOtp] = useState('');
  const [giftName, setGiftName] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleOtpChange = (value: string) => {
    if (value === '' || /^\d{0,6}$/.test(value)) {
      setGiftOtp(value);
    }
  };

  const handleComplete = () => {
    if (giftOtp.length === 6 && giftName) {
      setCompleted(true);
    }
  };

  const canComplete = giftOtp.length === 6 && giftName.length > 0;

  return (
    <div className="px-6 py-4 bg-red-50/50 dark:bg-red-950/10 border-y border-red-100 dark:border-red-900/30">
      <div className="flex items-center justify-between gap-4">
        {/* Left - Icon + label */}
        <div className="flex items-center gap-3 shrink-0">
          <Icon
            name="featured_seasonal_and_gifts"
            size={24}
            className="text-secondary-500 dark:text-secondary-400"
          />
          <div className="leading-tight">
            <div className="text-base-semibold text-secondary-900 dark:text-white">
              Gift Collection
            </div>
            <div
              className={`text-sm-medium ${
                completed ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {completed ? 'Completed' : 'Pending'}
            </div>
          </div>
        </div>

        {/* Right - State-dependent content */}

        {/* State 1: Initial dropdown */}
        {!selectedCollection && !completed && (
          <Dropdown
            options={collectionOptions}
            placeholder="Select"
            className="w-40"
            value={selectedCollection}
            onChange={(e) => {
              setSelectedCollection(e.value as string);
            }}
          />
        )}

        {/* State 2: Collection selected — show OTP + Gift Name */}
        {selectedCollection && !completed && (
          <div className="flex flex-col gap-3 flex-1 items-end">
            <div className="flex items-center gap-3">
              <Dropdown
                options={collectionOptions}
                value={selectedCollection}
                className="w-40"
                disabled
              />
              <div style={{ width: '120px' }}>
                <InputText
                  value={giftOtp}
                  onChange={(e) => { handleOtpChange(e.target.value); }}
                  placeholder="OTP"
                  className="w-full"
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                />
              </div>
              <Button
                icon={<PrimeReactIcon name="check" size={20} />}
                className={canComplete ? 'text-green-600' : 'text-gray-400'}
                text
                rounded
                onClick={handleComplete}
                tooltip="Complete Gift Collection"
                disabled={!canComplete}
                aria-label="Complete gift collection"
              />
            </div>
            <div className="flex items-center gap-3 w-full justify-end">
              <div style={{ width: '350px' }}>
                <InputText
                  value={giftName}
                  onChange={(e) => { setGiftName(e.target.value); }}
                  placeholder="Gift Name"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* State 3: Completed */}
        {completed && (
          <div className="flex flex-col gap-1 items-end text-right">
            <div className="flex items-center gap-2 text-sm-normal text-secondary-900 dark:text-white">
              <Icon
                name="location_on"
                size={20}
                className="text-secondary-500 dark:text-secondary-400"
              />
              <span>Self Collected At Store</span>
            </div>
            <div className="text-sm-medium text-secondary-700 dark:text-secondary-300">
              {giftName}
            </div>
            <div className="text-xs-normal text-secondary-600 dark:text-secondary-400">
              On {formatDate(new Date())} To {order.customer.name}
            </div>
            <div className="text-xs-normal text-secondary-600 dark:text-secondary-400">
              Authenticated by {order.staff.name} with SMS OTP GS- {giftOtp}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
