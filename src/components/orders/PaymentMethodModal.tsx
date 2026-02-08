/**
 * Payment Method Modal Component
 */

import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { formatCurrency } from '@/utils/format';

interface Customer {
  name: string;
  phone: string;
  avatar?: string;
}

interface PaymentMethodModalProps {
  visible: boolean;
  onHide: () => void;
  customer: Customer;
  totalUnits: number;
  totalValue: number;
  items: Array<{ id: string; name: string; image: string; price: number; weight: string; barcode: string }>;
  onConfirm: (orderData: {
    customer: Customer;
    items: Array<{ id: string; name: string; image: string; price: number; weight: string; barcode: string }>;
    paymentMethod: string;
    totalValue: number;
  }) => void;
}

type PaymentMethod = 'advance_redemption' | 'scheme_redemption' | 'cash_card_upi';

export function PaymentMethodModal({
  visible,
  onHide,
  customer,
  totalUnits,
  totalValue,
  items,
  onConfirm,
}: PaymentMethodModalProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

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
      icon: 'pi pi-book',
      iconType: 'icon' as const,
    },
    {
      id: 'cash_card_upi' as PaymentMethod,
      label: 'Cash / Card / UPI etc',
      icon: '₹',
      iconType: 'text' as const,
    },
  ];

  const handleConfirm = () => {
    if (selectedPaymentMethod) {
      onConfirm({
        customer,
        items,
        paymentMethod: selectedPaymentMethod,
        totalValue,
      });
    }
  };

  return (
    <Dialog
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Choose Payment Method
          </h2>
        </div>
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
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700">
          {customer.avatar ? (
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-xl font-bold">
              {customer.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <div className="font-semibold text-lg text-secondary-900 dark:text-white">
              {customer.name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {customer.phone}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total Units
            </div>
            <div className="text-xl font-bold text-secondary-900 dark:text-white">
              {totalUnits}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-1">
              Total Value (Excl.Taxes)
            </div>
            <div className="text-xl font-bold text-secondary-900 dark:text-white">
              {formatCurrency(totalValue)}
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedPaymentMethod(method.id)}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                selectedPaymentMethod === method.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {method.iconType === 'icon' ? (
                    <i
                      className={`${method.icon} text-2xl ${
                        selectedPaymentMethod === method.id
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    />
                  ) : (
                    <div
                      className={`text-2xl font-bold flex items-center justify-center w-8 h-8 rounded-full ${
                        selectedPaymentMethod === method.id
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30'
                          : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-secondary-700'
                      }`}
                    >
                      {method.icon}
                    </div>
                  )}
                  <span
                    className={`font-semibold text-lg ${
                      selectedPaymentMethod === method.id
                        ? 'text-primary-900 dark:text-primary-100'
                        : 'text-secondary-900 dark:text-white'
                    }`}
                  >
                    {method.label}
                  </span>
                </div>
                {selectedPaymentMethod === method.id && (
                  <i className="pi pi-check-circle text-2xl text-primary-600 dark:text-primary-400" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Confirm Button */}
        <div className="pt-4 border-t border-gray-200 dark:border-secondary-700">
          <Button
            label="Confirm & Place Order"
            icon="pi pi-check"
            severity="warning"
            className="w-full"
            onClick={handleConfirm}
            disabled={!selectedPaymentMethod}
          />
        </div>
      </div>
    </Dialog>
  );
}
