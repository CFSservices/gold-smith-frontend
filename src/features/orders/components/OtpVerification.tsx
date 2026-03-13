/**
 * Shared OTP Verification Component
 * Used by DeliverOrderModal and CancelOrderModal
 */

import { useState, useEffect, useCallback } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Icon } from '@/components/ui/Icon';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';

interface OtpVerificationProps {
  maskedPhone: string;
  isVerified: boolean;
  onSendOtp: () => Promise<{ expiresIn: number }>;
  onVerifyOtp: (otp: string) => Promise<boolean>;
}

export function OtpVerification({
  maskedPhone,
  isVerified,
  onSendOtp,
  onVerifyOtp,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) { return; }
    const timer = setTimeout(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => { clearTimeout(timer); };
  }, [resendTimer]);

  const handleSendOtp = useCallback(async () => {
    setSendingOtp(true);
    try {
      const result = await onSendOtp();
      setOtpSent(true);
      setResendTimer(result.expiresIn);
    } finally {
      setSendingOtp(false);
    }
  }, [onSendOtp]);

  const handleVerifyOtp = useCallback(async () => {
    if (otp.length !== 6) { return; }
    setVerifyingOtp(true);
    try {
      const success = await onVerifyOtp(otp);
      if (!success) {
        setOtp('');
      }
    } finally {
      setVerifyingOtp(false);
    }
  }, [otp, onVerifyOtp]);

  const handleOtpChange = useCallback((value: string) => {
    if (value === '' || /^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          label="Send OTP"
          icon={<PrimeReactIcon name="send" size={20} />}
          onClick={() => { void handleSendOtp(); }}
          severity="info"
          className="shrink-0"
          loading={sendingOtp}
          disabled={sendingOtp || (otpSent && resendTimer > 0) || isVerified}
          aria-label="Send OTP"
        />
        {otpSent && resendTimer > 0 && !isVerified && (
          <span className="text-sm-normal text-secondary-600 dark:text-secondary-400">
            Resend OTP in {resendTimer} seconds
          </span>
        )}
      </div>

      {otpSent && (
        <div className="space-y-3">
          <p className="text-sm-normal text-secondary-700 dark:text-secondary-300">
            Enter the OTP sent to customer&apos;s mobile number {maskedPhone}
          </p>
          <div className="flex items-center gap-3">
            <InputText
              value={otp}
              onChange={(e) => { handleOtpChange(e.target.value); }}
              placeholder="OTP"
              maxLength={6}
              inputMode="numeric"
              className="flex-1"
              disabled={isVerified}
              aria-label="Enter OTP"
            />
            <Button
              label="Verify OTP"
              icon={<PrimeReactIcon name="check" size={20} />}
              onClick={() => { void handleVerifyOtp(); }}
              severity="success"
              disabled={otp.length !== 6 || isVerified || verifyingOtp}
              loading={verifyingOtp}
              aria-label="Verify OTP"
            />
          </div>
          {isVerified && (
            <p className="text-sm-normal text-green-600 dark:text-green-400 flex items-center gap-2">
              <Icon name="check_circle" size={20} className="text-green-600 dark:text-green-400" />
              OTP verified successfully
            </p>
          )}
        </div>
      )}
    </div>
  );
}
