"use client";

import { useActionState, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  SegmentedControl,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { addTransactionAction } from "@/app/dashboard/transactions/actions";
import type { FormState } from "@/lib/validation";

const CATEGORIES = {
  expense: [
    "Food",
    "Transport",
    "Rent",
    "Bills",
    "Shopping",
    "Health",
    "Entertainment",
    "Other",
  ],
  income: ["Salary", "Business", "Gift", "Investment", "Other"],
} as const;

const today = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi" }).format(
    new Date(),
  );

const initial: FormState = {};

function FieldError({ state, name }: { state: FormState; name: string }) {
  const raw = (
    state.fieldErrors as
      | Record<string, string | string[] | undefined>
      | undefined
  )?.[name];
  const msg = Array.isArray(raw) ? raw[0] : raw;
  return msg ? (
    <Text as="p" size="1" color="red" className="mt-1">
      {msg}
    </Text>
  ) : null;
}

export function AddTransactionDialog() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [state, action, pending] = useActionState(
    addTransactionAction,
    initial,
  );

  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button size="3" radius="full" className="cursor-pointer font-semibold">
          <HugeiconsIcon icon={Add01Icon} size={18} />
          Add transaction
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="460px" className="!rounded-3xl">
        <Dialog.Title>Add transaction</Dialog.Title>

        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="type" value={type} />

          <SegmentedControl.Root
            value={type}
            onValueChange={(v) => setType(v as "expense" | "income")}
            size="3"
            radius="full"
          >
            <SegmentedControl.Item value="expense">
              Expense
            </SegmentedControl.Item>
            <SegmentedControl.Item value="income">Income</SegmentedControl.Item>
          </SegmentedControl.Root>

          <label className="block">
            <Text as="div" size="3" weight="bold" mb="1">
              Category
            </Text>
            <Select.Root
              key={type}
              name="category"
              defaultValue={CATEGORIES[type][0]}
              size="3"
            >
              <Select.Trigger style={{ width: "100%" }} />
              <Select.Content position="popper">
                {CATEGORIES[type].map((c) => (
                  <Select.Item key={c} value={c}>
                    {c}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            <FieldError state={state} name="category" />
          </label>
          <label>
            <Text as="div" size="3" weight="bold" mb="1">
              Amount (Ksh)
            </Text>
            <TextField.Root
              name="amount"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              size="3"
              required
              autoFocus
            />
            <FieldError state={state} name="amount" />
          </label>
          <label>
            <Text as="div" size="3" weight="bold" mb="1">
              Description
            </Text>
            <TextField.Root
              name="description"
              placeholder="e.g. Lunch at the market"
              size="3"
            />
            <FieldError state={state} name="description" />
          </label>

          <label>
            <Text as="div" size="3" weight="bold" mb="1">
              Date
            </Text>
            <TextField.Root
              name="date"
              type="date"
              defaultValue={today()}
              size="3"
              required
            />
            <FieldError state={state} name="date" />
          </label>

          {state.message && (
            <Text size="2" color="red">
              {state.message}
            </Text>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <Dialog.Close>
              <Button
                type="button"
                variant="soft"
                color="gray"
                size="3"
                radius="full"
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit" size="3" radius="full" loading={pending}>
              Save transaction
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
