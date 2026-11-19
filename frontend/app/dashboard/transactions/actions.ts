"use server";

import { revalidatePath } from "next/cache";
import { createTransaction } from "@/lib/transactions";
import {
  transactionSchema,
  toFieldErrors,
  type FormState,
} from "@/lib/validation";

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "");

export async function addTransactionAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    type: text(formData, "type"),
    amount: text(formData, "amount"),
    category: text(formData, "category"),
    description: text(formData, "description"),
    date: text(formData, "date"),
  };

  const parsed = transactionSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error), values: raw };
  }

  const result = await createTransaction(parsed.data);
  if (!result.ok) {
    return {
      message:
        result.message ?? "Could not save the transaction. Please try again.",
      fieldErrors: Object.fromEntries(
        Object.entries(result.errors ?? {}).map(([k, v]) => [k, v[0]]),
      ),
      values: raw,
    };
  }

  revalidatePath("/dashboard", "layout"); // refreshes Overview and Transactions
  return { success: true };
}
