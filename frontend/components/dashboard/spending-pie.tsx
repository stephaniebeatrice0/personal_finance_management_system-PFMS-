"use client";

import { Pie } from "react-chartjs-2";
import { money } from "@/lib/finance";
import { CHART_COLORS, useChartFont } from "./chart-setup";

export function SpendingPie({ data }: { data: { category: string; total: number }[] }) {
  const font = useChartFont();
  const total = data.reduce((sum, d) => sum + d.total, 0);

  if (data.length === 0) {
    return <p className="py-12 italic text-[var(--gray-11)]">Nothing spent yet this month.</p>;
  }

  const colors = data.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-6">
      <div className="mx-auto h-48 w-48 shrink-0 sm:mx-0">
        {font && (
          <Pie
            data={{
              labels: data.map((d) => d.category),
              datasets: [{ data: data.map((d) => d.total), backgroundColor: colors, borderColor: "#fff", borderWidth: 2 }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  titleFont: { family: font, size: 14 },
                  bodyFont: { family: font, size: 14 },
                  callbacks: { label: (ctx) => ` ${money(ctx.parsed)}` },
                },
              },
            }}
          />
        )}
      </div>

      <ul className="min-w-[12rem] flex-1 space-y-2">
        {data.map((d, i) => (
          <li key={d.category} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: colors[i] }} aria-hidden />
              {d.category}
            </span>
            <span className="tabular-nums">{money(d.total)}</span>
          </li>
        ))}
        <li className="flex items-center justify-between gap-4 border-t border-[var(--gray-a5)] pt-2 font-bold">
          <span>Total</span>
          <span className="tabular-nums">{money(total)}</span>
        </li>
      </ul>
    </div>
  );
}
