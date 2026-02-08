/**
 * Cancel Order Modal Component
 */

import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import { type Order } from '@/mocks/data/orders';
import { orderService } from '@/api/services/order.service';
import type { ApiError } from '@/types';

interface CancelOrderModalProps {
  order: Order;
  visible: boolean;
  onHide: () => void;
  onConfirmCancel: (data: {
    staffName: string;
    otp: string;
    reason: string;
  }) => void;
}

export function CancelOrderModal({
  order,
  visible,
  onHide,
  onConfirmCancel,
}: CancelOrderModalProps) {
  const [staffName, setStaffName] = useState(order?.staff?.name || order?.customer?.name || '');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState({
    sendOtp: false,
    verifyOtp: false,
    confirmCancel: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Format phone number to show last 4 digits
  const maskedPhone = order?.customer?.phone
    ? `XXXXXX${order.customer.phone.slice(-4)}`
    : 'XXXXXX1278';

  // Handle OTP send
  const handleSendOtp = async () => {
    if (!order?.id || !staffName.trim()) return;
    
    setError(null);
    setLoading((prev) => ({ ...prev, sendOtp: true }));
    
    try {
      const response = await orderService.sendCancelOtp(order.id);
      
      if (response.success) {
        setOtpSent(true);
        setResendTimer(response.data.expiresIn || 30);
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
      const response = await orderService.verifyCancelOtp(order.id, otp);
      
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

  // Handle confirm cancel
  const handleConfirmCancel = async () => {
    if (!order?.id || !otpVerified || !staffName.trim() || !reason.trim()) return;
    
    setError(null);
    setLoading((prev) => ({ ...prev, confirmCancel: true }));
    
    try {
      const response = await orderService.cancelOrder({
        orderId: order.id,
        staffName,
        otp,
        reason,
      });
      
      if (response.success) {
        // Call parent callback
        onConfirmCancel({
          staffName,
          otp,
          reason,
        });
        
        // Reset form
        setStaffName(order?.staff?.name || order?.customer?.name || '');
        setOtp('');
        setOtpSent(false);
        setOtpVerified(false);
        setReason('');
        setResendTimer(0);
        onHide();
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to cancel order. Please try again.');
    } finally {
      setLoading((prev) => ({ ...prev, confirmCancel: false }));
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
      setStaffName(order?.staff?.name || order?.customer?.name || '');
      setOtp('');
      setOtpSent(false);
      setOtpVerified(false);
      setResendTimer(0);
      setReason('');
      setError(null);
      setLoading({
        sendOtp: false,
        verifyOtp: false,
        confirmCancel: false,
      });
    }
  }, [visible, order]);

  if (!order) {
    return null;
  }

  return (
    <Dialog
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
            Cancel Order
          </h2>
        </div>
      }
      visible={visible}
      onHide={onHide}
      style={{ width: '90vw', maxWidth: '600px' }}
      className="cancel-order-modal"
      modal
      draggable={false}
      resizable={false}
      dismissableMask
      blockScroll
    >
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

        {/* Confirmation Question */}
        <div>
          <p className="text-lg text-secondary-900 dark:text-white">
            Are you sure you want to cancel the order "{order.orderId}"?
          </p>
        </div>

        {/* Cancellation Implications */}
        <div>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-disc list-inside">
            <li>
              If purchased through app directly, the amount will be reversed to source account or transferred to advances as per the user's preference.
            </li>
            <li>
              If redeemed via scheme closure, the amount will be transferred to advances
            </li>
            <li>
              If redeemed via advances, it will be reversed back to advances
            </li>
          </ul>
        </div>

        {/* Note */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Note:</strong> Reversal to source account has to be done manually via IMPS or RTGS from company account. Admin Panel does not have the permissions to do such actions in app.
          </p>
        </div>

        {/* Staff Authentication */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Enter Staff Full Name
            </label>
            <div className="relative">
              <InputText
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="Enter staff full name"
                className="w-full"
                disabled={otpSent}
              />
              {staffName && (
                <button
                  onClick={() => setStaffName('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Clear"
                >
                  <i className="pi pi-times" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!otpSent ? (
              <Button
                label="Send OTP"
                icon="pi pi-send"
                onClick={handleSendOtp}
                severity="warning"
                className="flex-shrink-0"
                loading={loading.sendOtp}
                disabled={loading.sendOtp || !staffName.trim()}
              />
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  label="Send OTP"
                  icon="pi pi-send"
                  onClick={handleSendOtp}
                  severity="warning"
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
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Enter the OTP sent to customer's mobile number {maskedPhone}
                </label>
                <div className="relative">
                  <InputText
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    maxLength={6}
                    className="w-full"
                    disabled={otpVerified}
                  />
                  {otp && (
                    <button
                      onClick={() => setOtp('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      aria-label="Clear"
                    >
                      <i className="pi pi-times" />
                    </button>
                  )}
                </div>
              </div>
              <Button
                label="Verify OTP"
                icon="pi pi-check"
                onClick={handleVerifyOtp}
                severity="success"
                disabled={otp.length !== 6 || otpVerified || loading.verifyOtp}
                loading={loading.verifyOtp}
              />
              {otpVerified && (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                  <i className="pi pi-check-circle" />
                  OTP verified successfully
                </p>
              )}
            </div>
          )}
        </div>

        {/* Reason Input */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Reason
          </label>
          <InputTextarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter the reason for suspending"
            rows={4}
            className="w-full"
            disabled={!otpVerified}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-secondary-700">
          <Button
            label="Cancel Order"
            icon="pi pi-ban"
            onClick={handleConfirmCancel}
            severity="danger"
            disabled={!otpVerified || !staffName.trim() || !reason.trim() || loading.confirmCancel}
            loading={loading.confirmCancel}
            className="px-6 py-3 text-base font-semibold"
          />
          <Button
            label="Don't Cancel"
            icon="pi pi-times"
            onClick={onHide}
            severity="secondary"
            className="px-6 py-3 text-base font-semibold"
          />
        </div>
      </div>
    </Dialog>
  );
}
