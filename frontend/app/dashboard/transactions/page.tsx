import { Heading, Text } from "@radix-ui/themes";
import { requireUser } from "@/lib/session";
import { fetchTransactions } from "@/lib/transactions";
import { longDate, money } from "@/lib/finance";
import { buildWeek, totalIncome, totalSpent } from "@/lib/week";
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog";
import { TransactionRow } from "@/components/transactions/transaction-row";
import { WeekAccordion } from "@/components/transactions/week-accordion";

const CARD =
  "rounded-3xl bg-[var(--color-panel-solid)] p-5 sm:p-6 shadow-[0_8px_30px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.05)]";

export default async function TransactionsPage() {
  await requireUser();
  const transactions = await fetchTransactions();
  const now = new Date();

  const week = buildWeek(transactions, now);
  const todayItems = week.find((d) => d.isToday)?.items ?? [];
  const weekItems = week.flatMap((d) => d.items);

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      {/* Header */}
      <section
        className={`${CARD} flex flex-col gap-4 !bg-[var(--accent-a3)] sm:flex-row sm:items-center sm:justify-between`}
      >
        <div>
          <Heading as="h1" size={{ initial: "6", md: "7" }}>
            Transactions
          </Heading>
          <Text as="p" color="gray" className="mt-1 italic">
            {longDate(now)}
          </Text>
        </div>
        <AddTransactionDialog />
      </section>

      <div className="grid items-start gap-4 lg:grid-cols-2 lg:gap-5">
        {/* Left: today */}
        <section className={CARD}>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <Heading as="h2" size="5">
                Today
              </Heading>
              <Text as="p" color="gray" className="mt-1 italic">
                {todayItems.length}{" "}
                {todayItems.length === 1 ? "record" : "records"}
              </Text>
            </div>
            <dl className="text-right">
              <dt className="text-sm italic text-[var(--gray-11)]">Spent</dt>
              <dd className="text-2xl font-bold tabular-nums">
                {money(totalSpent(todayItems))}
              </dd>
            </dl>
          </div>

          {todayItems.length === 0 ? (
            <p className="py-10 text-center italic text-[var(--gray-11)]">
              Nothing recorded today. Use “Add transaction” to start.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--gray-a4)]">
              {todayItems.map((t) => (
                <TransactionRow key={t.id} t={t} />
              ))}
            </ul>
          )}
        </section>

        {/* Right: this week */}
        <section className={CARD}>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <Heading as="h2" size="5">
                This week
              </Heading>
              <Text as="p" color="gray" className="mt-1 italic">
                Tap a day to see its spending
              </Text>
            </div>
            <dl className="text-right">
              <dt className="text-sm italic text-[var(--gray-11)]">Spent</dt>
              <dd className="text-2xl font-bold tabular-nums">
                {money(totalSpent(weekItems))}
              </dd>
              {totalIncome(weekItems) > 0 && (
                <dd className="text-sm font-semibold text-[var(--green-11)]">
                  +{money(totalIncome(weekItems))} in
                </dd>
              )}
            </dl>
          </div>
          <WeekAccordion days={week} />
        </section>
      </div>
    </div>
  );
}
