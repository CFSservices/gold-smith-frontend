/**
 * Register Page
 */

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import { cn } from '@/utils/cn';
import { registerSchema, type RegisterFormData } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';

export function RegisterPage() {
  const { register, isLoading, error, clearError } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      acceptTerms: false,
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    clearError();
    register(data);
  };

  // Password strength indicator
  const passwordHeader = <div className="font-bold mb-2">Pick a password</div>;
  const passwordFooter = (
    <>
      <Divider />
      <p className="mt-2 text-xs">Requirements:</p>
      <ul className="pl-2 mt-0 text-xs list-disc list-inside text-secondary-500">
        <li>At least 8 characters</li>
        <li>At least one uppercase letter</li>
        <li>At least one lowercase letter</li>
        <li>At least one number</li>
        <li>At least one special character</li>
      </ul>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Create Account</h1>
        <p className="mt-2 text-secondary-500 dark:text-secondary-400">
          Join Gold Smith to manage your business
        </p>
      </div>

      {/* Error message */}
      {error && <Message severity="error" text={error} className="w-full" />}

      {/* Register Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              First Name
            </label>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <InputText
                  id="firstName"
                  {...field}
                  placeholder="First name"
                  className={cn('w-full', errors.firstName && 'p-invalid')}
                  disabled={isLoading}
                />
              )}
            />
            {errors.firstName && (
              <small className="text-red-500">{errors.firstName.message}</small>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              Last Name
            </label>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <InputText
                  id="lastName"
                  {...field}
                  placeholder="Last name"
                  className={cn('w-full', errors.lastName && 'p-invalid')}
                  disabled={isLoading}
                />
              )}
            />
            {errors.lastName && (
              <small className="text-red-500">{errors.lastName.message}</small>
            )}
          </div>
        </div>

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

        {/* Phone */}
        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
          >
            Phone Number <span className="text-secondary-400">(Optional)</span>
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <InputText
                id="phone"
                {...field}
                placeholder="10-digit mobile number"
                className={cn('w-full', errors.phone && 'p-invalid')}
                disabled={isLoading}
                maxLength={10}
              />
            )}
          />
          {errors.phone && (
            <small className="text-red-500">{errors.phone.message}</small>
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
                placeholder="Create a strong password"
                className={cn('w-full', errors.password && 'p-invalid')}
                inputClassName="w-full"
                header={passwordHeader}
                footer={passwordFooter}
                toggleMask
                disabled={isLoading}
              />
            )}
          />
          {errors.password && (
            <small className="text-red-500">{errors.password.message}</small>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
          >
            Confirm Password
          </label>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Password
                id="confirmPassword"
                {...field}
                placeholder="Confirm your password"
                className={cn('w-full', errors.confirmPassword && 'p-invalid')}
                inputClassName="w-full"
                feedback={false}
                toggleMask
                disabled={isLoading}
              />
            )}
          />
          {errors.confirmPassword && (
            <small className="text-red-500">{errors.confirmPassword.message}</small>
          )}
        </div>

        {/* Terms and conditions */}
        <div className="space-y-2">
          <Controller
            name="acceptTerms"
            control={control}
            render={({ field }) => (
              <div className="flex items-start gap-2">
                <Checkbox
                  inputId="acceptTerms"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.checked)}
                  disabled={isLoading}
                  className={cn(errors.acceptTerms && 'p-invalid')}
                />
                <label
                  htmlFor="acceptTerms"
                  className="text-sm text-secondary-600 dark:text-secondary-400 cursor-pointer"
                >
                  I agree to the{' '}
                  <a href="#" className="text-gold-600 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-gold-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            )}
          />
          {errors.acceptTerms && (
            <small className="text-red-500">{errors.acceptTerms.message}</small>
          )}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          label="Create Account"
          icon="pi pi-user-plus"
          loading={isLoading}
          className="w-full"
        />
      </form>

      {/* Login link */}
      <div className="text-center">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Already have an account?{' '}
          <Link
            to={ROUTES.login}
            className="font-medium text-gold-600 hover:text-gold-700 dark:text-gold-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
