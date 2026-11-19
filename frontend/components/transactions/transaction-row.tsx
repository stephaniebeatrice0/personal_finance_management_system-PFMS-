import type { Transaction } from "@/lib/types";
import { money } from "@/lib/finance";

export function TransactionRow({ t }: { t: Transaction }) {
  const expense = t.type === "expense";
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="truncate font-semibold">{t.description || t.category}</p>
        <p className="text-sm italic text-[var(--gray-11)]">{t.category}</p>
      </div>
      <span
        className={`shrink-0 font-bold tabular-nums ${
          expense ? "text-[var(--gray-12)]" : "text-[var(--green-11)]"
        }`}
      >
        {expense ? "−" : "+"}
        {money(Number(t.amount))}
      </span>
    </li>
  );
}
