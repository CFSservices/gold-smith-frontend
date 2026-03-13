/**
 * Cancel Order Modal - Staff name, OTP flow, cancellation reason
 * Follows pattern from old CancelOrderModal with feature module structure
 */

import { useState, useEffect, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';
import { OtpVerification } from './OtpVerification';
import { orderService } from '@/api/services/order.service';
import { useUser } from '@/store/authStore';
import type { Order } from '@/features/orders/types';
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
  const user = useUser();
  const [staffName, setStaffName] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState('');
  const [reason, setReason] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maskedPhone = order.customer.phone
    ? `XXXXXX${order.customer.phone.slice(-4)}`
    : 'XXXXXX1278';

  // Pre-fill staff name and reset on close
  useEffect(() => {
    if (visible) {
      const userName = user ? `${user.firstName} ${user.lastName}`.trim() : '';
      setStaffName(userName || order.staff.name);
    } else {
      setStaffName('');
      setOtpVerified(false);
      setVerifiedOtp('');
      setReason('');
      setConfirming(false);
      setError(null);
    }
  }, [visible, user, order.staff.name]);

  const handleSendOtp = useCallback(async () => {
    setError(null);
    const response = await orderService.sendCancelOtp(order.id);
    return { expiresIn: response.data.expiresIn };
  }, [order.id]);

  const handleVerifyOtp = useCallback(async (otp: string) => {
    setError(null);
    try {
      const response = await orderService.verifyCancelOtp(order.id, otp);
      if (response.data.verified) {
        setOtpVerified(true);
        setVerifiedOtp(otp);
        return true;
      }
      setError('Invalid OTP. Please try again.');
      return false;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Invalid OTP. Please try again.');
      return false;
    }
  }, [order.id]);

  const handleConfirmCancel = useCallback(async () => {
    if (!otpVerified || !staffName.trim() || !reason.trim()) { return; }

    setError(null);
    setConfirming(true);
    try {
      await orderService.cancelOrder({
        orderId: order.id,
        staffName,
        otp: verifiedOtp,
        reason,
      });
      onConfirmCancel({ staffName, otp: verifiedOtp, reason });
      onHide();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to cancel order. Please try again.');
    } finally {
      setConfirming(false);
    }
  }, [otpVerified, staffName, reason, verifiedOtp, order.id, onConfirmCancel, onHide]);

  return (
    <Dialog
      header={
        <h2 className="text-xl-bold text-secondary-900 dark:text-white">
          Cancel Order
        </h2>
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
        {error && (
          <Message severity="error" text={error} className="w-full" />
        )}

        {/* Confirmation */}
        <p className="text-lg-medium text-secondary-900 dark:text-white">
          Are you sure you want to cancel the order &ldquo;{order.orderId}&rdquo;?
        </p>

        {/* Cancellation Implications */}
        <ul className="space-y-2 text-sm-normal text-secondary-700 dark:text-secondary-300 list-disc list-inside">
          <li>
            If purchased through app directly, the amount will be reversed to source
            account or transferred to advances as per the user&apos;s preference.
          </li>
          <li>
            If redeemed via scheme closure, the amount will be transferred to advances
          </li>
          <li>
            If redeemed via advances, it will be reversed back to advances
          </li>
        </ul>

        {/* Note */}
        <div className="bg-gold-50 dark:bg-gold-950/20 border border-gold-200 dark:border-gold-800 rounded-lg p-4">
          <p className="text-sm-normal text-gold-800 dark:text-gold-200">
            <strong>Note:</strong> Reversal to source account has to be done manually via
            IMPS or RTGS from company account. Admin Panel does not have the permissions
            to do such actions in app.
          </p>
        </div>

        {/* Staff Name */}
        <div>
          <label className="block text-sm-semibold text-secondary-700 dark:text-secondary-300 mb-2">
            Enter Staff Full Name
          </label>
          <InputText
            value={staffName}
            onChange={(e) => { setStaffName(e.target.value); }}
            placeholder="Enter staff full name"
            className="w-full"
            disabled={otpVerified}
          />
        </div>

        {/* OTP Section */}
        <OtpVerification
          maskedPhone={maskedPhone}
          isVerified={otpVerified}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
        />

        {/* Reason */}
        <div>
          <label className="block text-sm-semibold text-secondary-700 dark:text-secondary-300 mb-2">
            Reason
          </label>
          <InputTextarea
            value={reason}
            onChange={(e) => { setReason(e.target.value); }}
            placeholder="Enter the reason for cancellation"
            rows={4}
            className="w-full"
            disabled={!otpVerified}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border-default dark:border-secondary-700">
          <Button
            label="Cancel Order"
            icon={<PrimeReactIcon name="block" size={20} />}
            onClick={() => { void handleConfirmCancel(); }}
            severity="danger"
            disabled={!otpVerified || !staffName.trim() || !reason.trim() || confirming}
            loading={confirming}
            aria-label="Confirm cancel order"
          />
          <Button
            label="Don't Cancel"
            icon={<PrimeReactIcon name="close" size={20} />}
            onClick={onHide}
            severity="secondary"
            aria-label="Don't cancel"
          />
        </div>
      </div>
    </Dialog>
  );
}
