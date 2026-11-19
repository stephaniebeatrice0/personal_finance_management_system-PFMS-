import type { Transaction } from "@/lib/types";

const TZ = "Africa/Nairobi";
const keyFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }); // YYYY-MM-DD

export const dayKey = (d: Date | string) => keyFmt.format(new Date(d));
export const isExpense = (t: Transaction) => t.type === "expense";

const sum = (list: Transaction[]) =>
  list.reduce((total, t) => total + Number(t.amount), 0);

export const totalSpent = (list: Transaction[]) => sum(list.filter(isExpense));
export const totalIncome = (list: Transaction[]) =>
  sum(list.filter((t) => !isExpense(t)));

function labelFor(key: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${key}T00:00:00Z`));
}

export type WeekDay = {
  key: string;
  label: string;
  isToday: boolean;
  spent: number;
  items: Transaction[];
};

/** Monday → today of the current week, most recent day first. */
export function buildWeek(transactions: Transaction[], now: Date): WeekDay[] {
  const today = dayKey(now);
  const base = new Date(`${today}T00:00:00Z`);
  const sinceMonday = (base.getUTCDay() + 6) % 7;

  return Array.from({ length: sinceMonday + 1 }, (_, i) => {
    const d = new Date(base);
    d.setUTCDate(base.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    const items = transactions.filter((t) => dayKey(t.date) === key);
    return {
      key,
      label: labelFor(key),
      isToday: key === today,
      spent: totalSpent(items),
      items,
    };
  });
}
