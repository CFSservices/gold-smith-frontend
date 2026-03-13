/**
 * Payment Method Modal - Customer header, total units/value, 3 payment cards, confirm
 * Figma node: 397:32485
 */

import { useState, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';
import { formatCurrency } from '@/utils/format';
import { PaymentCard } from './PaymentCard';
import type { PaymentMethod } from '@/features/orders/types';

interface PaymentCustomer {
  name: string;
  phone: string;
  avatar?: string;
}

interface PaymentItem {
  id: string;
  name: string;
  image: string;
  price: number;
  weight: string;
  barcode: string;
}

interface PaymentMethodModalProps {
  visible: boolean;
  onHide: () => void;
  customer: PaymentCustomer;
  totalUnits: number;
  totalValue: number;
  items: PaymentItem[];
  onConfirm: (orderData: {
    customer: PaymentCustomer;
    items: PaymentItem[];
    paymentMethod: string;
    totalValue: number;
  }) => void;
}

const paymentMethods = [
  {
    id: 'advance_redemption' as PaymentMethod,
    label: 'Advance Redemption',
    icon: '◆',
    iconType: 'text' as const,
  },
  {
    id: 'scheme_redemption' as PaymentMethod,
    label: 'Scheme Redemption',
    icon: 'book_5',
    iconType: 'icon' as const,
  },
  {
    id: 'cash_card_upi' as PaymentMethod,
    label: 'Cash / Card / UPI etc',
    icon: '₹',
    iconType: 'text' as const,
  },
];

export function PaymentMethodModal({
  visible,
  onHide,
  customer,
  totalUnits,
  totalValue,
  items,
  onConfirm,
}: PaymentMethodModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const handleConfirm = useCallback(() => {
    if (!selectedMethod) { return; }
    onConfirm({
      customer,
      items,
      paymentMethod: selectedMethod,
      totalValue,
    });
  }, [selectedMethod, customer, items, totalValue, onConfirm]);

  const handleSelect = useCallback((id: string) => {
    setSelectedMethod(id as PaymentMethod);
  }, []);

  return (
    <Dialog
      header={
        <h2 className="text-xl-bold text-secondary-900 dark:text-white">
          Choose Payment Method
        </h2>
      }
      visible={visible}
      onHide={onHide}
      style={{ width: '90vw', maxWidth: '600px' }}
      className="payment-method-modal"
      modal
      draggable={false}
      resizable={false}
      dismissableMask
      blockScroll
    >
      <div className="space-y-6">
        {/* Customer Information */}
        <div className="flex items-center gap-4 p-4 bg-surface-ground dark:bg-secondary-800 rounded-lg border border-border-default dark:border-secondary-700">
          {customer.avatar ? (
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gold-500 flex items-center justify-center text-white text-xl-bold">
              {customer.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <div className="text-lg-semibold text-secondary-900 dark:text-white">
              {customer.name}
            </div>
            <div className="text-sm-normal text-secondary-600 dark:text-secondary-400">
              {customer.phone}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm-normal text-secondary-600 dark:text-secondary-400 mb-1">
              Total Units
            </div>
            <div className="text-xl-bold text-secondary-900 dark:text-white">
              {totalUnits}
            </div>
            <div className="text-sm-normal text-secondary-600 dark:text-secondary-400 mt-2 mb-1">
              Total Value (Excl.Taxes)
            </div>
            <div className="text-xl-bold text-secondary-900 dark:text-white">
              {formatCurrency(totalValue)}
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <PaymentCard
              key={method.id}
              id={method.id}
              label={method.label}
              icon={method.icon}
              iconType={method.iconType}
              selected={selectedMethod === method.id}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Confirm Button */}
        <div className="pt-4 border-t border-border-default dark:border-secondary-700">
          <Button
            label="Confirm & Place Order"
            icon={<PrimeReactIcon name="check" size={20} />}
            severity="warning"
            className="w-full"
            onClick={handleConfirm}
            disabled={!selectedMethod}
            aria-label="Confirm and place order"
          />
        </div>
      </div>
    </Dialog>
  );
}
