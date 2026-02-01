/**
 * Validation utilities and Zod schemas
 */

import { VALIDATION } from '@/config/constants';
import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(VALIDATION.email.maxLength, `Email must be less than ${VALIDATION.email.maxLength} characters`);

// Password validation schema
export const passwordSchema = z
  .string()
  .min(VALIDATION.password.minLength, `Password must be at least ${VALIDATION.password.minLength} characters`)
  .max(VALIDATION.password.maxLength, `Password must be less than ${VALIDATION.password.maxLength} characters`)
  .refine(
    (val) => !VALIDATION.password.requireUppercase || /[A-Z]/.test(val),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    (val) => !VALIDATION.password.requireLowercase || /[a-z]/.test(val),
    'Password must contain at least one lowercase letter'
  )
  .refine(
    (val) => !VALIDATION.password.requireNumber || /\d/.test(val),
    'Password must contain at least one number'
  )
  .refine(
    (val) => !VALIDATION.password.requireSpecial || /[!@#$%^&*(),.?":{}|<>]/.test(val),
    'Password must contain at least one special character'
  );

// Name validation schema
export const nameSchema = z
  .string()
  .min(VALIDATION.name.minLength, `Name must be at least ${VALIDATION.name.minLength} characters`)
  .max(VALIDATION.name.maxLength, `Name must be less than ${VALIDATION.name.maxLength} characters`)
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

// Phone validation schema (Indian mobile numbers)
export const phoneSchema = z
  .string()
  .regex(VALIDATION.phone.pattern, 'Please enter a valid 10-digit Indian mobile number')
  .optional()
  .or(z.literal(''));

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Reset password schema
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

// Update profile schema
export const updateProfileSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  phone: phoneSchema,
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
