"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { money } from "@/lib/finance";
import type { WeekDay } from "@/lib/week";
import { TransactionRow } from "./transaction-row";

export function WeekAccordion({ days }: { days: WeekDay[] }) {
  return (
    <Accordion.Root
      type="single"
      collapsible
      defaultValue={days.find((d) => d.isToday)?.key}
      className="flex flex-col gap-2"
    >
      {days.map((day) => (
        <Accordion.Item
          key={day.key}
          value={day.key}
          className="overflow-hidden rounded-2xl bg-[var(--gray-a2)] data-[state=open]:bg-[var(--accent-a3)]"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-8)]">
              <span>
                <span className="block font-semibold">
                  {day.label}
                  {day.isToday && (
                    <span className="ml-2 rounded-full bg-[var(--accent-a5)] px-2 py-0.5 text-xs font-bold">
                      Today
                    </span>
                  )}
                </span>
                <span className="text-sm italic text-[var(--gray-11)]">
                  {day.items.length}{" "}
                  {day.items.length === 1 ? "record" : "records"}
                </span>
              </span>
              <span className="flex items-center gap-3">
                <span className="font-bold tabular-nums">
                  {money(day.spent)}
                </span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={18}
                  className="transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Content className="mm-accordion px-4">
            {day.items.length === 0 ? (
              <p className="pb-4 italic text-[var(--gray-11)]">
                Nothing recorded this day.
              </p>
            ) : (
              <ul className="divide-y divide-[var(--gray-a4)] pb-1">
                {day.items.map((t) => (
                  <TransactionRow key={t.id} t={t} />
                ))}
              </ul>
            )}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
