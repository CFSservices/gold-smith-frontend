/**
 * Forgot Password Page
 */

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { cn } from '@/utils/cn';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';
import { Icon } from '@/components/ui/Icon';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';

export function ForgotPasswordPage() {
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    clearError();
    forgotPassword(data.email);
    setSubmitted(true);
  };

  // Show success state after submission
  if (submitted && !error) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <Icon name="check_circle" size={32} className="text-green-600 dark:text-green-400" filled />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Check Your Email
          </h1>
          <p className="mt-2 text-secondary-500 dark:text-secondary-400">
            We&apos;ve sent password reset instructions to{' '}
            <span className="font-medium text-secondary-700 dark:text-secondary-300">
              {getValues('email')}
            </span>
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Didn&apos;t receive the email? Check your spam folder or
          </p>
          <Button
            label="Try again"
            text
            severity="secondary"
            onClick={() => setSubmitted(false)}
          />
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center">
          <Icon name="lock" size={32} className="text-gold-600 dark:text-gold-400" />
        </div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Forgot Password?
        </h1>
        <p className="mt-2 text-secondary-500 dark:text-secondary-400">
          No worries! Enter your email and we&apos;ll send you reset instructions.
        </p>
      </div>

      {/* Error message */}
      {error && <Message severity="error" text={error} className="w-full" />}

      {/* Forgot Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
          >
            Email Address
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <InputText
                id="email"
                {...field}
                placeholder="Enter your email"
                className={cn('w-full', errors.email && 'p-invalid')}
                disabled={isLoading}
              />
            )}
          />
          {errors.email && (
            <small className="text-red-500">{errors.email.message}</small>
          )}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          label="Send Reset Link"
          icon={<PrimeReactIcon name="send" size={20} />}
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
  );
}

export default ForgotPasswordPage;
