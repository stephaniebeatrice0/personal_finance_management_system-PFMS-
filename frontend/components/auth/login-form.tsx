"use client";
import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import { loginAction } from "@/lib/actions";
import type { FormState } from "@/lib/validation";

export function LoginForm({
  callbackUrl,
  expired,
}: {
  callbackUrl?: string;
  expired?: boolean;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    loginAction,
    {},
  );

  const notice = expired
    ? "Your session has expired. Please sign in again."
    : callbackUrl
      ? "Please sign in to continue."
      : "";

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back to Money Manager.
        </p>
      </div>

      {notice && (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {notice}
        </p>
      )}
      {state.message && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="mail@example.com"
          defaultValue={state.values?.email}
          required
          autoFocus
        />
        <FieldError message={state.fieldErrors?.email} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <FieldError message={state.fieldErrors?.password} />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Don’t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-slate-900 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
