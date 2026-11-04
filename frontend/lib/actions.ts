'use server';
import { CredentialsSignin } from 'next-auth';
import { signIn, signOut } from '@/auth';
import { API_URL } from './config';
import { safeRedirect } from './utils';
import { loginSchema, registerSchema, toFieldErrors, type FormState } from './validation';

const text = (fd: FormData, key: string) => String(fd.get(key) ?? '');

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = { email: text(formData, 'email'), password: text(formData, 'password') };
  const values = { email: raw.email };

  // 1. validate
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return { fieldErrors: toFieldErrors(parsed.error), values };

  // 2. authenticate through Auth.js (calls authorize() in auth.ts)
  try {
    await signIn('credentials', {
      ...parsed.data,
      redirectTo: safeRedirect(text(formData, 'callbackUrl')),
    });
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return {
        message:
          error.code === 'service_unavailable'
            ? 'Cannot reach the server. Please try again.'
            : 'Invalid email or password.',
        values,
      };
    }
    throw error; // the redirect after a successful login is thrown too: it must propagate
  }
  return {};
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = {
    name: text(formData, 'name'),
    email: text(formData, 'email'),
    password: text(formData, 'password'),
    password_confirmation: text(formData, 'password_confirmation'),
  };
  const values = { name: raw.name, email: raw.email };

  // 1. validate locally
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) return { fieldErrors: toFieldErrors(parsed.error), values };

  // 2. create the account in Laravel
  let res: Response;
  try {
    res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(parsed.data),
    });
  } catch {
    return { message: 'Cannot reach the server. Please try again.', values };
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    // Laravel's own validation errors (e.g. "email has already been taken") -> show under the field
    if (res.status === 422 && data?.errors) {
      const fieldErrors: Record<string, string> = {};
      for (const [field, msgs] of Object.entries(data.errors as Record<string, string[]>)) {
        fieldErrors[field] = msgs[0];
      }
      return { fieldErrors, values };
    }
    return { message: data?.message ?? 'Registration failed.', values };
  }

  // 3. sign the new user in through Auth.js so they get a normal session
  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return { message: 'Account created. Please sign in.', values };
    }
    throw error;
  }
  return {};
}

export async function logoutAction() {
  await signOut({ redirectTo: '/login' }); // events.signOut in auth.ts revokes the Laravel token
}
