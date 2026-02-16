/**
 * Pause Scheme Modal Component
 */

import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import { type Scheme } from '@/mocks/data/schemes';

interface PauseSchemeModalProps {
  scheme: Scheme;
  visible: boolean;
  onHide: () => void;
  onConfirmPause: (data: {
    otp: string;
    comments: string;
  }) => void;
}

export function PauseSchemeModal({
  scheme,
  visible,
  onHide,
  onConfirmPause,
}: PauseSchemeModalProps) {
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState({
    sendOtp: false,
    verifyOtp: false,
    pauseScheme: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Format phone number to show last 4 digits
  const maskedPhone = scheme?.customer?.phone
    ? `XXXXXX${scheme.customer.phone.slice(-4)}`
    : 'XXXXXX1278';

  // Handle OTP send
  const handleSendOtp = async () => {
    if (!scheme?.id) return;
    
    setError(null);
    setLoading((prev) => ({ ...prev, sendOtp: true }));
    
    try {
      // Mock OTP sending - in real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      setOtpSent(true);
      setResendTimer(30);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading((prev) => ({ ...prev, sendOtp: false }));
    }
  };

  // Handle OTP verify
  const handleVerifyOtp = async () => {
    if (!scheme?.id || otp.length !== 6) return;
    
    setError(null);
    setLoading((prev) => ({ ...prev, verifyOtp: true }));
    
    try {
      // Mock OTP verification - in real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      // For demo purposes, accept any 6-digit OTP
      if (otp.length === 6) {
        setOtpVerified(true);
        setResendTimer(0); // Stop the countdown timer
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      setOtp('');
    } finally {
      setLoading((prev) => ({ ...prev, verifyOtp: false }));
    }
  };

  // Handle pause scheme
  const handlePauseScheme = () => {
    if (!otpVerified || !comments.trim()) return;
    
    setError(null);
    setLoading((prev) => ({ ...prev, pauseScheme: true }));
    
    try {
      onConfirmPause({
        otp,
        comments: comments.trim(),
      });
      
      // Reset form
      setOtp('');
      setOtpSent(false);
      setOtpVerified(false);
      setComments('');
      setResendTimer(0);
      onHide();
    } catch (err) {
      setError('Failed to pause scheme. Please try again.');
    } finally {
      setLoading((prev) => ({ ...prev, pauseScheme: false }));
    }
  };

  // Countdown timer for resend OTP (only when OTP is not verified)
  useEffect(() => {
    if (resendTimer > 0 && !otpVerified) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer, otpVerified]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setOtp('');
      setOtpSent(false);
      setOtpVerified(false);
      setResendTimer(0);
      setComments('');
      setError(null);
      setLoading({
        sendOtp: false,
        verifyOtp: false,
        pauseScheme: false,
      });
    }
  }, [visible]);

  return (
    <Dialog
      header="Pause Scheme"
      visible={visible}
      onHide={onHide}
      style={{ width: '90vw', maxWidth: '500px' }}
      className="pause-scheme-modal"
      modal
      draggable={false}
      resizable={false}
      dismissableMask
      blockScroll
      closable
    >
      <div className="space-y-6">
        {/* Warning Message */}
        <div className="text-base text-secondary-900 dark:text-white">
          Are you sure you want to pause this scheme? By Pausing, customer will not be able to make payments against this scheme, until resumed.
        </div>

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

        {/* OTP Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {!otpSent ? (
              <Button
                label="Send OTP"
                icon="pi pi-play"
                onClick={handleSendOtp}
                severity="info"
                className="flex-shrink-0"
                loading={loading.sendOtp}
                disabled={loading.sendOtp}
              />
            ) : !otpVerified ? (
              <div className="flex items-center gap-3">
                <Button
                  label="Send OTP"
                  icon="pi pi-play"
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
            ) : null}
          </div>

          {otpSent && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                  Enter the OTP sent to customer's mobile number '{maskedPhone}'
                </label>
                <InputText
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                  }}
                  placeholder="Enter OTP"
                  maxLength={6}
                  className="w-full"
                  disabled={otpVerified || loading.verifyOtp}
                />
              </div>

              {!otpVerified && (
                <Button
                  label="Verify OTP"
                  icon="pi pi-check"
                  onClick={handleVerifyOtp}
                  severity="success"
                  className="w-full"
                  loading={loading.verifyOtp}
                  disabled={otp.length !== 6 || loading.verifyOtp}
                />
              )}

              {otpVerified && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <i className="pi pi-check-circle" />
                  <span>OTP Verified Successfully</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div>
          <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
            Reason for pausing scheme<span className="text-red-500">*</span>
          </label>
          <InputTextarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Comments"
            rows={4}
            className="w-full"
            disabled={!otpVerified}
          />
        </div>

        {/* Pause Scheme Button */}
        {otpVerified && (
          <div className="pt-4 border-t border-gray-200 dark:border-secondary-700">
            <Button
              label="Pause Scheme"
              icon="pi pi-pause"
              severity="warning"
              onClick={handlePauseScheme}
              className="w-full"
              loading={loading.pauseScheme}
              disabled={!comments.trim() || loading.pauseScheme}
            />
          </div>
        )}
      </div>
    </Dialog>
  );
}
