/**
 * Deliver Order Modal Component
 */

import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { type Order } from '@/mocks/data/orders';
import { deliveryService } from '@/api/services/delivery.service';
import type { ApiError } from '@/types';

interface DeliverOrderModalProps {
  order: Order;
  visible: boolean;
  onHide: () => void;
  onConfirmDelivery: (data: {
    otp: string;
    deliveryMode: string;
    comments: string;
  }) => void;
}

export function DeliverOrderModal({
  order,
  visible,
  onHide,
  onConfirmDelivery,
}: DeliverOrderModalProps) {
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [deliveryMode, setDeliveryMode] = useState<string | null>(null);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState({
    sendOtp: false,
    verifyOtp: false,
    confirmDelivery: false,
  });
  const [error, setError] = useState<string | null>(null);

  const deliveryModeOptions = [
    { label: 'Home Delivery', value: 'home_delivery' },
    { label: 'Self Collection', value: 'self_collection' },
    { label: 'Store Pickup', value: 'store_pickup' },
  ];

  // Format phone number to show last 4 digits
  const maskedPhone = order?.customer?.phone
    ? `XXXXXX${order.customer.phone.slice(-4)}`
    : 'XXXXXX1278';

  // Handle OTP send
  const handleSendOtp = async () => {
    if (!order?.id) return;
    
    setError(null);
    setLoading((prev) => ({ ...prev, sendOtp: true }));
    
    try {
      const response = await deliveryService.sendOtp(order.id);
      
      if (response.success) {
        setOtpSent(true);
        setResendTimer(response.data.expiresIn);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading((prev) => ({ ...prev, sendOtp: false }));
    }
  };

  // Handle OTP verify
  const handleVerifyOtp = async () => {
    if (!order?.id || otp.length !== 6) return;
    
    setError(null);
    setLoading((prev) => ({ ...prev, verifyOtp: true }));
    
    try {
      const response = await deliveryService.verifyOtp(order.id, otp);
      
      if (response.success && response.data.verified) {
        setOtpVerified(true);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Invalid OTP. Please try again.');
      setOtp('');
    } finally {
      setLoading((prev) => ({ ...prev, verifyOtp: false }));
    }
  };

  // Handle confirm delivery
  const handleConfirmDelivery = async () => {
    if (!order?.id || !otpVerified || !deliveryMode) return;
    
    setError(null);
    setLoading((prev) => ({ ...prev, confirmDelivery: true }));
    
    try {
      const response = await deliveryService.confirmDelivery({
        orderId: order.id,
        otp,
        deliveryMode,
        comments,
      });
      
      if (response.success) {
        // Call parent callback
        onConfirmDelivery({
          otp,
          deliveryMode,
          comments,
        });
        
        // Reset form
        setOtp('');
        setOtpSent(false);
        setOtpVerified(false);
        setDeliveryMode(null);
        setComments('');
        onHide();
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to confirm delivery. Please try again.');
    } finally {
      setLoading((prev) => ({ ...prev, confirmDelivery: false }));
    }
  };

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setOtp('');
      setOtpSent(false);
      setOtpVerified(false);
      setResendTimer(0);
      setDeliveryMode(null);
      setComments('');
      setError(null);
      setLoading({
        sendOtp: false,
        verifyOtp: false,
        confirmDelivery: false,
      });
    }
  }, [visible]);

  return (
    <Dialog
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
            Deliver Order
          </h2>
        </div>
      }
      visible={visible}
      onHide={onHide}
      style={{ width: '90vw', maxWidth: '600px' }}
      className="deliver-order-modal"
      modal
      draggable={false}
      resizable={false}
      dismissableMask
      blockScroll
    >
      <div className="h-px bg-gray-200 dark:bg-secondary-700 w-full" />
      <div className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="relative">
            <Message
              severity="error"
              text={error}
              className="w-full"
            />
            <button
              onClick={() => setError(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close error message"
            >
              <i className="pi pi-times" />
            </button>
          </div>
        )}

        {/* Before Delivery Checklist */}
        <div>
          <h3 className="font-semibold text-md mb-3 text-secondary-900 dark:text-white">
            Before Delivery:
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-gray-500">1.</span>
              <span>Ensure the customer's KYC is complete</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-500">2.</span>
              <span>
                IF KYC not completed, goto 'Customers' and completed KYC for the
                customer and then continue with OTP
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-500">3.</span>
              <span>Communicate to the customer that there are no refunds</span>
            </li>
          </ul>
        </div>

        {/* OTP Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {!otpSent ? (
              <Button
                label="Send OTP"
                icon="pi pi-send"
                onClick={handleSendOtp}
                severity="info"
                className="flex-shrink-0"
                loading={loading.sendOtp}
                disabled={loading.sendOtp}
              />
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  label="Send OTP"
                  icon="pi pi-send"
                  onClick={handleSendOtp}
                  severity="info"
                  disabled={resendTimer > 0 || loading.sendOtp}
                  className="flex-shrink-0"
                  loading={loading.sendOtp}
                />
                {resendTimer > 0 && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Resend OTP in {resendTimer} seconds
                  </span>
                )}
              </div>
            )}
          </div>

          {otpSent && (
            <div className="space-y-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Enter the OTP sent to customer's mobile number {maskedPhone}
              </p>
              <div className="flex items-center gap-3">
                <InputText
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="OTP"
                  maxLength={6}
                  className="flex-1"
                  disabled={otpVerified}
                />
                <Button
                  label="✓ Verify OTP"
                  icon="pi pi-check"
                  onClick={handleVerifyOtp}
                  severity="success"
                  disabled={otp.length !== 6 || otpVerified || loading.verifyOtp}
                  loading={loading.verifyOtp}
                />
              </div>
              {otpVerified && (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                  <i className="pi pi-check-circle" />
                  OTP verified successfully
                </p>
              )}
            </div>
          )}
        </div>

        {/* Delivery Mode */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Delivery Mode
          </label>
          <Dropdown
            value={deliveryMode}
            onChange={(e) => setDeliveryMode(e.value)}
            options={deliveryModeOptions}
            placeholder="Select"
            className="w-full"
            disabled={!otpVerified}
          />
        </div>

        {/* Comments */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Comments (If Any)
          </label>
          <InputTextarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add any comments..."
            rows={3}
            className="w-full"
            disabled={!otpVerified}
          />
        </div>

        {/* Confirm Delivery Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-secondary-700">
          <Button
            label="✓ Confirm Delivery"
            icon="pi pi-check"
            onClick={handleConfirmDelivery}
            severity="warning"
            disabled={!otpVerified || !deliveryMode || loading.confirmDelivery}
            loading={loading.confirmDelivery}
            className="px-6 py-3 text-base font-semibold"
          />
        </div>
      </div>
    </Dialog>
  );
}
