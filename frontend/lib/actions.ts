"use server";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { loginSchema, toFieldErrors, type FormState } from "./validation";
import { safeRedirect } from "./utils";

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "");

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    email: text(formData, "email"),
    password: text(formData, "password"),
  };
  const values = { email: raw.email };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success)
    return { fieldErrors: toFieldErrors(parsed.error), values };

  try {
    const rawCallback = text(formData, "callbackUrl");
    const redirectTo = safeRedirect(rawCallback) ?? "/dashboard";
    await signIn("credentials", {
      ...parsed.data, 
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Invalid email or password.", values };
    }
    throw error; // NEXT_REDIRECT must rethrow
  }
  return {};
}
