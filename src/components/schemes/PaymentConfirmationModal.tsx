/**
 * Payment Confirmation Modal Component
 */

import { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Message } from 'primereact/message';
import { type PaymentMonth, type Scheme } from '@/mocks/data/schemes';

interface PaymentConfirmationModalProps {
  payment: PaymentMonth;
  scheme: Scheme;
  visible: boolean;
  onHide: () => void;
  onRecordPayment?: (paymentData: {
    paymentMethod: string;
    amountReceived: number;
    dateTime: string;
    transactionId: string;
  }) => void;
}

type PaymentMethod = 'Card' | 'UPI' | 'Bank Transfer' | 'RazorPay' | 'Cash' | 'Other';

export function PaymentConfirmationModal({
  payment,
  scheme,
  visible,
  onHide,
  onRecordPayment,
}: PaymentConfirmationModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [amountReceived, setAmountReceived] = useState<number | null>(scheme.monthlyDeposit);
  const [paymentDate, setPaymentDate] = useState<Date | null>(new Date());
  const [paymentTime, setPaymentTime] = useState<Date | null>(new Date());
  const [transactionId, setTransactionId] = useState<string>('');
  const dateCalendarRef = useRef<Calendar>(null);
  const timeCalendarRef = useRef<Calendar>(null);

  const paymentMethods: { label: string; value: PaymentMethod }[] = [
    { label: 'Card', value: 'Card' },
    { label: 'UPI', value: 'UPI' },
    { label: 'Bank Transfer', value: 'Bank Transfer' },
    { label: 'RazorPay', value: 'RazorPay' },
    { label: 'Cash', value: 'Cash' },
    { label: 'Other', value: 'Other' },
  ];

  // Reset form when modal opens/closes or payment changes
  useEffect(() => {
    if (visible) {
      if (payment.status === 'completed' && payment.paymentMethod) {
        // If payment is already completed, populate with existing data
        setPaymentMethod(payment.paymentMethod as PaymentMethod);
        setAmountReceived(payment.amountReceived || scheme.monthlyDeposit);
        if (payment.dateTime) {
          const dateTime = new Date(payment.dateTime);
          setPaymentDate(dateTime);
          setPaymentTime(dateTime);
        } else {
          setPaymentDate(new Date());
          setPaymentTime(new Date());
        }
        setTransactionId(payment.transactionId || '');
      } else {
        // New payment - initialize with defaults
        setPaymentMethod(null);
        setAmountReceived(scheme.monthlyDeposit);
        setPaymentDate(new Date());
        setPaymentTime(new Date());
        setTransactionId('');
      }
    }
  }, [visible, payment, scheme.monthlyDeposit]);

  if (!payment || !scheme) {
    return null;
  }

  const isReadOnly = payment.status === 'completed';

  // Calculate balance if amount exceeds monthly deposit
  const balance = amountReceived && amountReceived > scheme.monthlyDeposit 
    ? amountReceived - scheme.monthlyDeposit 
    : 0;

  const handleRecordPayment = () => {
    if (!paymentMethod || !amountReceived || !paymentDate || !paymentTime) {
      return;
    }

    // Combine date and time
    const combinedDateTime = new Date(paymentDate);
    const time = paymentTime;
    combinedDateTime.setHours(time.getHours());
    combinedDateTime.setMinutes(time.getMinutes());
    combinedDateTime.setSeconds(time.getSeconds());

    // Format as dd/mm/yyyy HH:mm:ss
    const day = String(combinedDateTime.getDate()).padStart(2, '0');
    const month = String(combinedDateTime.getMonth() + 1).padStart(2, '0');
    const year = combinedDateTime.getFullYear();
    const hours = String(combinedDateTime.getHours()).padStart(2, '0');
    const minutes = String(combinedDateTime.getMinutes()).padStart(2, '0');
    const seconds = String(combinedDateTime.getSeconds()).padStart(2, '0');
    const dateTimeString = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    if (onRecordPayment) {
      onRecordPayment({
        paymentMethod,
        amountReceived,
        dateTime: dateTimeString,
        transactionId: transactionId || `TXN${Date.now()}`,
      });
    }

    onHide();
  };

  const formatDateDisplay = (date: Date | null) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTimeDisplay = (time: Date | null) => {
    if (!time) return '';
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <Dialog
      header={`${payment.month} ${payment.year} - Payment Confirmation`}
      visible={visible}
      onHide={onHide}
      style={{ width: '90vw', maxWidth: '500px' }}
      className="payment-confirmation-modal"
      modal
      draggable={false}
      resizable={false}
      dismissableMask
      blockScroll
      closable
    >
      <div className="space-y-6">
        {/* Confirmation Prompt */}
        <div className="text-base text-secondary-900 dark:text-white">
          Confirm payment received for {payment.month} {payment.year} for Scheme ID {scheme.schemeId}?
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm text-secondary-600 dark:text-secondary-400 mb-2">
            Payment Method
          </label>
          <Dropdown
            value={paymentMethod}
            options={paymentMethods}
            onChange={(e) => setPaymentMethod(e.value)}
            placeholder="Select Payment Method"
            className="w-full"
            disabled={isReadOnly}
          />
        </div>

        {/* Amount Received */}
        <div>
          <label className="block text-sm text-secondary-600 dark:text-secondary-400 mb-2">
            Amount Received (₹)
          </label>
          <div className="relative">
            <InputNumber
              value={amountReceived}
              onValueChange={(e) => setAmountReceived(e.value)}
              mode="decimal"
              min={0}
              max={999999999}
              useGrouping={true}
              className="w-full"
              disabled={isReadOnly}
            />
            {amountReceived !== null && (
              <button
                type="button"
                onClick={() => setAmountReceived(null)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={isReadOnly}
              >
                <i className="pi pi-times text-sm" />
              </button>
            )}
          </div>
          {balance > 0 && (
            <div className="flex items-center gap-2 mt-2 text-sm text-amber-600 dark:text-amber-400">
              <i className="pi pi-exclamation-triangle" />
              <span>Balance {balance.toLocaleString('en-IN')} will be added to 'Advances'</span>
            </div>
          )}
        </div>

        {/* Date and Time of Payment Received */}
        <div>
          <label className="block text-sm text-secondary-600 dark:text-secondary-400 mb-2">
            Date and Time of Payment Received
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <InputText
                value={formatDateDisplay(paymentDate)}
                onClick={() => !isReadOnly && dateCalendarRef.current?.show()}
                readOnly
                className={`w-full ${!isReadOnly ? 'cursor-pointer' : ''} pr-10`}
                disabled={isReadOnly}
              />
              {paymentDate && !isReadOnly && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPaymentDate(null);
                  }}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <i className="pi pi-times text-sm" />
                </button>
              )}
              <i className="pi pi-calendar absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Calendar
                ref={dateCalendarRef}
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.value as Date)}
                dateFormat="dd/mm/yy"
                showIcon={false}
                className="hidden"
                disabled={isReadOnly}
              />
            </div>
            <div className="flex-1 relative">
              <InputText
                value={formatTimeDisplay(paymentTime)}
                onClick={() => !isReadOnly && timeCalendarRef.current?.show()}
                readOnly
                className={`w-full ${!isReadOnly ? 'cursor-pointer' : ''} pr-10`}
                disabled={isReadOnly}
              />
              {paymentTime && !isReadOnly && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPaymentTime(null);
                  }}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <i className="pi pi-times text-sm" />
                </button>
              )}
              <i className="pi pi-clock absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Calendar
                ref={timeCalendarRef}
                value={paymentTime}
                onChange={(e) => setPaymentTime(e.value as Date)}
                timeOnly
                showIcon={false}
                className="hidden"
                disabled={isReadOnly}
              />
            </div>
          </div>
        </div>

        {/* Transaction ID */}
        <div>
          <label className="block text-sm text-secondary-600 dark:text-secondary-400 mb-2">
            Transaction ID
          </label>
          <div className="relative">
            <InputText
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter Transaction ID"
              className="w-full"
              disabled={isReadOnly}
            />
            {transactionId && !isReadOnly && (
              <button
                type="button"
                onClick={() => setTransactionId('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <i className="pi pi-times text-sm" />
              </button>
            )}
          </div>
        </div>

        {/* Record Payment Button */}
        {!isReadOnly && (
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-secondary-700">
            <Button
              label="Record Payment"
              icon="pi pi-check"
              severity="success"
              onClick={handleRecordPayment}
              disabled={!paymentMethod || !amountReceived || !paymentDate || !paymentTime || !transactionId}
              className="px-6"
            />
          </div>
        )}
      </div>
    </Dialog>
  );
}
