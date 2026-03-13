/**
 * Deliver Order Modal - Pre-delivery checklist, OTP flow, delivery mode, comments
 * Figma node: 224:29058
 */

import { useState, useEffect, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';
import { OtpVerification } from './OtpVerification';
import { orderService } from '@/api/services/order.service';
import type { Order, DeliveryMode } from '@/features/orders/types';
import type { ApiError } from '@/types';

interface DeliverOrderModalProps {
  order: Order;
  visible: boolean;
  onHide: () => void;
  onConfirmDelivery: (data: {
    otp: string;
    deliveryMode: DeliveryMode;
    comments: string;
  }) => void;
}

const deliveryModeOptions = [
  { label: 'Home Delivery', value: 'home_delivery' as const },
  { label: 'Self Collection', value: 'self_collection' as const },
];

export function DeliverOrderModal({
  order,
  visible,
  onHide,
  onConfirmDelivery,
}: DeliverOrderModalProps) {
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState('');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode | null>(null);
  const [comments, setComments] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maskedPhone = order.customer.phone
    ? `XXXXXX${order.customer.phone.slice(-4)}`
    : 'XXXXXX1278';

  // Reset on close
  useEffect(() => {
    if (!visible) {
      setOtpVerified(false);
      setVerifiedOtp('');
      setDeliveryMode(null);
      setComments('');
      setConfirming(false);
      setError(null);
    }
  }, [visible]);

  const handleSendOtp = useCallback(async () => {
    setError(null);
    const response = await orderService.sendDeliveryOtp(order.id);
    return { expiresIn: response.data.expiresIn };
  }, [order.id]);

  const handleVerifyOtp = useCallback(async (otp: string) => {
    setError(null);
    try {
      const response = await orderService.verifyDeliveryOtp(order.id, otp);
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

  const handleConfirmDelivery = useCallback(async () => {
    if (!otpVerified || !deliveryMode) { return; }

    setError(null);
    setConfirming(true);
    try {
      await orderService.deliverOrder({
        orderId: order.id,
        otp: verifiedOtp,
        deliveryMode,
        comments: comments || undefined,
      });
      onConfirmDelivery({ otp: verifiedOtp, deliveryMode, comments });
      onHide();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to confirm delivery. Please try again.');
    } finally {
      setConfirming(false);
    }
  }, [otpVerified, deliveryMode, verifiedOtp, comments, order.id, onConfirmDelivery, onHide]);

  return (
    <Dialog
      header={
        <h2 className="text-xl-bold text-secondary-900 dark:text-white">
          Deliver Order
        </h2>
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
      <div className="space-y-6">
        {error && (
          <Message severity="error" text={error} className="w-full" />
        )}

        {/* Before Delivery Checklist */}
        <div>
          <h3 className="text-base-semibold text-secondary-900 dark:text-white mb-3">
            Before Delivery:
          </h3>
          <ol className="space-y-2 text-sm-normal text-secondary-700 dark:text-secondary-300 list-decimal list-inside">
            <li>Ensure the customer&apos;s KYC is complete</li>
            <li>
              IF KYC not completed, goto &apos;Customers&apos; and complete KYC for the
              customer and then continue with OTP
            </li>
            <li>Communicate to the customer that there are no refunds</li>
          </ol>
        </div>

        {/* OTP Section */}
        <OtpVerification
          maskedPhone={maskedPhone}
          isVerified={otpVerified}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
        />

        {/* Delivery Mode */}
        <div>
          <label className="block text-sm-semibold text-secondary-700 dark:text-secondary-300 mb-2">
            Delivery Mode
          </label>
          <Dropdown
            value={deliveryMode}
            onChange={(e) => { setDeliveryMode(e.value as DeliveryMode); }}
            options={deliveryModeOptions}
            placeholder="Select"
            className="w-full"
            disabled={!otpVerified}
          />
        </div>

        {/* Comments */}
        <div>
          <label className="block text-sm-semibold text-secondary-700 dark:text-secondary-300 mb-2">
            Comments (If Any)
          </label>
          <InputTextarea
            value={comments}
            onChange={(e) => { setComments(e.target.value); }}
            placeholder="Add any comments..."
            rows={3}
            className="w-full"
            disabled={!otpVerified}
          />
        </div>

        {/* Confirm Delivery Button */}
        <div className="flex justify-end pt-4 border-t border-border-default dark:border-secondary-700">
          <Button
            label="Confirm Delivery"
            icon={<PrimeReactIcon name="check" size={20} />}
            onClick={() => { void handleConfirmDelivery(); }}
            severity="warning"
            disabled={!otpVerified || !deliveryMode || confirming}
            loading={confirming}
            aria-label="Confirm delivery"
          />
        </div>
      </div>
    </Dialog>
  );
}
