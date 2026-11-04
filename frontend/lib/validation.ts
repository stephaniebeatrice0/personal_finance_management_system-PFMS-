import { z } from 'zod';

const email = z.string().trim().min(1, 'Email is required').email('Enter a valid email address');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(255, 'Name is too long'),
    email,
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

// Shape returned by the server actions and read by the forms via useActionState
export type FormState = {
  message?: string;                      // form-level error (bad credentials, server down…)
  fieldErrors?: Record<string, string>;  // per-field errors
  values?: Record<string, string>;       // re-fill inputs after a failed submit
};

// Turns a ZodError into { fieldName: firstMessage }
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
