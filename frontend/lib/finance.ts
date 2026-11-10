export type TxType = "income" | "expense";

export interface Transaction {
  id: string | number;
  type: TxType;
  amount: number;
  category: string;
  description: string;
  /** ISO timestamp or YYYY-MM-DD */
  date: string;
}

export const TIME_ZONE = "Africa/Nairobi";
export const CURRENCY = "KES";

const dayFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** YYYY-MM-DD in the app's time zone, so "today" means the user's today. */
export function dayKey(value: Date | string): string {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return dayFormat.format(new Date(value));
}

export function money(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function greeting(now = new Date()): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, hour: "numeric", hourCycle: "h23" }).format(now),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export const longDate = (now = new Date()) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

export const shortDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, day: "numeric", month: "short" }).format(
    new Date(value),
  );

const MAX_SLICES = 6;

export function summarize(transactions: Transaction[], now = new Date()) {
  const today = dayKey(now);
  const month = today.slice(0, 7);

  let income = 0;
  let expense = 0;
  let spentToday = 0;
  const byCategory = new Map<string, number>();
  const byDay = new Map<string, number>();

  for (const t of transactions) {
    if (t.type === "income") {
      income += t.amount;
      continue;
    }
    expense += t.amount;
    const key = dayKey(t.date);
    byDay.set(key, (byDay.get(key) ?? 0) + t.amount);
    if (key === today) spentToday += t.amount;
    if (key.startsWith(month)) byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + t.amount);
  }

  const sorted = [...byCategory].map(([category, total]) => ({ category, total })).sort((a, b) => b.total - a.total);
  const slices = sorted.slice(0, MAX_SLICES);
  const rest = sorted.slice(MAX_SLICES).reduce((sum, c) => sum + c.total, 0);
  if (rest > 0) slices.push({ category: "Other", total: rest });

  const dayLabel = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, weekday: "short", day: "numeric" });
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now.getTime() - (6 - i) * 86_400_000);
    return { label: dayLabel.format(date), total: byDay.get(dayKey(date)) ?? 0 };
  });

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || Number(b.id) - Number(a.id))
    .slice(0, 8);

  const monthLabel = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, month: "long", year: "numeric" }).format(now);

  return { balance: income - expense, spentToday, monthLabel, byCategory: slices, week, recent };
}
