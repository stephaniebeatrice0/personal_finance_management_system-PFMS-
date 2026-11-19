import { z } from "zod";

const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(255, "Name is too long"),
    email,
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type FormState = {
  message?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
  success?: boolean;
};

export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export const transactionSchema = z.object({
  type: z.enum(["expense", "income"]),
  amount: z.coerce.number().positive("Enter an amount greater than 0."),
  category: z.string().min(1, "Choose a category."),
  description: z.string().trim().max(255, "Keep it under 255 characters."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date."),
});
