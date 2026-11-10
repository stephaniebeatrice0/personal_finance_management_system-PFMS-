import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { requireUser } from "@/lib/session";
import { fetchTransactions } from "@/lib/transactions";
import { greeting, longDate, money, summarize } from "@/lib/finance";
import { SpendingPie } from "@/components/dashboard/spending-pie";
import { WeeklyLine } from "@/components/dashboard/weekly-line";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";

export default async function DashboardPage() {
  const user = await requireUser();
  const transactions = await fetchTransactions();
  const now = new Date();
  const s = summarize(transactions, now);
  const firstName = user.name.split(" ")[0];

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      {/* Top: greeting left, balance and today's spend right */}
      <section className="rounded-lg bg-[var(--accent-a3)] px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Heading as="h1" size={{ initial: "7", md: "8" }}>
              {greeting(now)}, {firstName}
            </Heading>
            <Text as="p" size="3" color="gray" className="mt-2 italic">
              {longDate(now)}
            </Text>
          </div>

          <dl className="flex flex-wrap gap-x-12 gap-y-5 md:text-right">
            <div>
              <dt className="italic text-[var(--gray-11)]">Balance</dt>
              <dd
                className={`text-3xl font-bold tabular-nums ${s.balance < 0 ? "text-[var(--red-11)]" : ""}`}
              >
                {money(s.balance)}
              </dd>
            </div>
            <div className="md:border-l md:border-[var(--accent-a6)] md:pl-12">
              <dt className="italic text-[var(--gray-11)]">Spent today</dt>
              <dd className="text-3xl font-bold tabular-nums">
                {money(s.spentToday)}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Middle: one panel, two halves */}
      <section className="grid divide-y divide-[var(--gray-a5)] rounded-lg border border-[var(--gray-a6)] bg-[var(--color-panel-solid)] lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <div className="p-5 sm:p-7">
          <Heading as="h2" size="5">
            Where it went
          </Heading>
          <Text as="p" color="gray" className="mb-6 mt-1 italic">
            Spending by category, {s.monthLabel}
          </Text>
          <SpendingPie data={s.byCategory} />
        </div>
        <div className="p-5 sm:p-7">
          <Heading as="h2" size="5">
            The past week
          </Heading>
          <Text as="p" color="gray" className="mb-6 mt-1 italic">
            Daily spending, last seven days
          </Text>
          <WeeklyLine days={s.week} />
        </div>
      </section>

      {/* Bottom: recent records */}
      <section>
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <Heading as="h2" size="5">
            Recent records
          </Heading>
          <Link
            href="/dashboard/transactions"
            className="text-[var(--accent-11)] underline-offset-4 hover:underline"
          >
            View all transactions
          </Link>
        </div>
        <RecentTransactions rows={s.recent} />
      </section>
    </div>
  );
}
