/**
 * Login Page
 */

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Message } from 'primereact/message';
import { cn } from '@/utils/cn';
import { loginSchema, type LoginFormData } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';

export function LoginPage() {
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuth();

  // Get success message from registration redirect
  const successMessage = (location.state as { message?: string })?.message;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormData) => {
    clearError();
    login(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Welcome Back</h1>
        <p className="mt-2 text-secondary-500 dark:text-secondary-400">
          Sign in to your account to continue
        </p>
      </div>

      {/* Success message from registration */}
      {successMessage && (
        <Message severity="success" text={successMessage} className="w-full" />
      )}

      {/* Error message */}
      {error && <Message severity="error" text={error} className="w-full" />}

      {/* Login Form */}
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

        {/* Password */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
          >
            Password
          </label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Password
                id="password"
                {...field}
                placeholder="Enter your password"
                className={cn('w-full', errors.password && 'p-invalid')}
                inputClassName="w-full"
                feedback={false}
                toggleMask
                disabled={isLoading}
              />
            )}
          />
          {errors.password && (
            <small className="text-red-500">{errors.password.message}</small>
          )}
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  inputId="rememberMe"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.checked)}
                  disabled={isLoading}
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-secondary-600 dark:text-secondary-400 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
            )}
          />
          <Link
            to={ROUTES.forgotPassword}
            className="text-sm text-gold-600 hover:text-gold-700 dark:text-gold-400"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          label="Sign In"
          icon={<PrimeReactIcon name="login" size={20} />}
          loading={isLoading}
          className="w-full"
        />
      </form>

      {/* Register link */}
      <div className="text-center">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Don&apos;t have an account?{' '}
          <Link
            to={ROUTES.register}
            className="font-medium text-gold-600 hover:text-gold-700 dark:text-gold-400"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
