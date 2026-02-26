/**
 * Forgot Password Page
 * Flow: email → send OTP → verify OTP → new password + confirm → reset
 */

import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Password } from 'primereact/password';
import { cn } from '@/utils/cn';
import {
  forgotPasswordFirstStepSchema,
  forgotPasswordOtpSchema,
  resetPasswordSchema,
  type ForgotPasswordFirstStepFormData,
  type ResetPasswordFormData,
} from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';
import { Icon } from '@/components/ui/Icon';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';
import { VERIFY_OTP_PURPOSE } from '@/types/auth.types';
import { Toast } from 'primereact/toast';

type Step = 'email' | 'otp' | 'password';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const toastRef = useRef<Toast>(null);
  const {
    forgotPasswordAsync,
    verifyResetOtpAsync,
    resetPassword,
    isLoading,
    error,
    clearError,
  } = useAuth();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const form1 = useForm<ForgotPasswordFirstStepFormData>({
    resolver: zodResolver(forgotPasswordFirstStepSchema),
    defaultValues: { email: '', otp: '' },
  });

  const form2 = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSendOtp = form1.handleSubmit(async (data) => {
    clearError();
    if (step === 'otp') {
      const parsed = forgotPasswordOtpSchema.safeParse(data);
      if (!parsed.success) {
        const otpError = parsed.error.flatten().fieldErrors.otp?.[0];
        if (otpError) form1.setError('otp', { message: otpError });
        return;
      }
      try {
        const res = await verifyResetOtpAsync({ email: parsed.data.email, otp: parsed.data.otp, purpose: VERIFY_OTP_PURPOSE.PASSWORD_RESET });
        setEmail(parsed.data.email);
        setResetToken(res.data.reset_token);
        setStep('password');
      } catch (error) {
        // Error shown via useAuth store
      }
      return;
    }
    try {
      await forgotPasswordAsync(data.email);
      setEmail(data.email);
      setStep('otp');
    } catch {
      // Error shown via useAuth store
    }
  });

  const onResetPassword = form2.handleSubmit((data) => {
    clearError();
    resetPassword(
      {
        email,
        new_password: data.password,
        reset_token: resetToken,
      },
      {
        onSuccess: () => {
          setResetSuccess(true);
          navigate(ROUTES.login);
        },
      }
    );
  });

  // Success after reset -> show message and link to login
  if (resetSuccess && !error) {
    return (
      <div className="space-y-6 text-center">
        <Toast ref={toastRef}/>
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <Icon name="check_circle" size={32} className="text-green-600 dark:text-green-400" filled />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Password reset successfully
          </h1>
          <p className="mt-2 text-secondary-500 dark:text-secondary-400">
            You can now sign in with your new password.
          </p>
        </div>
        <Link
          to={ROUTES.login}
          className="inline-flex items-center gap-2 text-sm text-gold-600 hover:text-gold-700 dark:text-gold-400"
        >
          <Icon name="arrow_back" size={16} />
          Back to login
        </Link>
      </div>
    );
  }

  // Step 2: Set new password (second screen)
  if (step === 'password') {
    return (
      <div className="space-y-6">
        <Toast ref={toastRef}/>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Icon name="check_circle" size={32} className="text-green-600 dark:text-green-400" filled />
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mt-4">
            Check Your Email
          </h1>
          <p className="mt-2 text-secondary-500 dark:text-secondary-400">
            We&apos;ve sent password reset instructions to{' '}
            <span className="font-medium text-secondary-700 dark:text-secondary-300">{email}</span>
          </p>
        </div>

        <div className="text-center mb-0 border-[#704f01] shadow-md rounded-lg p-3">
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1 mb-2">
            Didn&apos;t receive the email? Check your spam folder or
          </p>
          <Button
            label="Try again"
            severity="secondary"
            style={{ padding: '8px 8px' }}
            onClick={() => {
              setStep('email');
              setEmail('');
              setResetToken('');
              form1.reset({ email: '', otp: '' });
              clearError();
            }}
          />
        </div>

        <div className="text-center mb-1 mt-2">
          <Link
            to={ROUTES.login}
            className="inline-flex items-center gap-2 text-sm text-gold-600 hover:text-gold-700 dark:text-gold-400"
          >
            <Icon name="arrow_back" size={16} />
            Back to login
          </Link>
        </div>

        {error && <Message severity="error" text={error} className="w-full" />}

        <form onSubmit={onResetPassword} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              New Password
            </label>
            <Controller
              name="password"
              control={form2.control}
              render={({ field }) => (
                <Password
                  id="new-password"
                  {...field}
                  placeholder="Enter new password"
                  className={cn('w-full', form2.formState.errors.password && 'p-invalid')}
                  style={{width: '100%'}}
                  disabled={isLoading}
                  toggleMask
                  feedback={false}
                />
              )}
            />
            {form2.formState.errors.password && (
              <small className="text-red-500">{form2.formState.errors.password.message}</small>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              Confirm Password
            </label>
            <Controller
              name="confirmPassword"
              control={form2.control}
              render={({ field }) => (
                <Password
                  id="confirm-password"
                  {...field}
                  placeholder="Confirm new password"
                  className={cn('w-full', form2.formState.errors.confirmPassword && 'p-invalid')}
                  disabled={isLoading}
                  pt={{root: {className: 'w-full'}}}
                  toggleMask
                  feedback={false}
                />
              )}
            />
            {form2.formState.errors.confirmPassword && (
              <small className="text-red-500">
                {form2.formState.errors.confirmPassword.message}
              </small>
            )}
          </div>

          <Button
            type="submit"
            label="Reset Password"
            icon={<PrimeReactIcon name="lock" size={20} />}
            loading={isLoading}
            className="w-full"
          />
        </form>
      </div>
    );
  }

  // Step 1: Email and optionally OTP (first screen)
  return (
    <>
      <div className="space-y-6">
        <Toast ref={toastRef} />
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center">
            <Icon name="lock" size={32} className="text-gold-600 dark:text-gold-400" />
          </div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Forgot Password?
        </h1>
        <p className="mt-2 text-secondary-500 dark:text-secondary-400">
          {step === 'email'
            ? "No worries! Enter your email and we'll send you a reset code."
            : "Enter the code we sent to your email."}
        </p>
      </div>

      {error && <Message severity="error" text={error} className="w-full" />}

      <form onSubmit={onSendOtp} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
          >
            Email Address
          </label>
          <Controller
            name="email"
            control={form1.control}
            render={({ field }) => (
              <InputText
                id="email"
                {...field}
                placeholder="Enter your email"
                className={cn('w-full', form1.formState.errors.email && 'p-invalid')}
                disabled={isLoading || step === 'otp'}
              />
            )}
          />
          {form1.formState.errors.email && (
            <small className="text-red-500">{form1.formState.errors.email.message}</small>
          )}
        </div>

        {step === 'otp' && (
          <div className="space-y-2">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              Reset code
            </label>
            <Controller
              name="otp"
              control={form1.control}
              render={({ field }) => (
                <InputText
                  id="otp"
                  {...field}
                  placeholder="Enter 6-digit code"
                  className={cn('w-full', form1.formState.errors.otp && 'p-invalid')}
                  disabled={isLoading}
                  maxLength={8}
                />
              )}
            />
            {form1.formState.errors.otp && (
              <small className="text-red-500">{form1.formState.errors.otp.message}</small>
            )}
          </div>
        )}

        <Button
          type="submit"
          label={step === 'email' ? 'Send Reset Code' : 'Verify Code'}
          icon={<PrimeReactIcon name={step === 'email' ? 'send' : 'verified_user'} size={20} />}
          loading={isLoading}
          className="w-full"
        />
      </form>

      {/* Back to login */}
      <div className="text-center">
        <Link
          to={ROUTES.login}
          className="inline-flex items-center gap-2 text-sm text-gold-600 hover:text-gold-700 dark:text-gold-400"
        >
          <Icon name="arrow_back" size={16} />
          Back to login
        </Link>
      </div>
    </div>
    </>
  );
}

export default ForgotPasswordPage;
