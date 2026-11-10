"use client";

import { Line } from "react-chartjs-2";
import { money } from "@/lib/finance";
import { ACCENT, GRID, INK, MUTED, useChartFont } from "./chart-setup";

const compact = new Intl.NumberFormat("en-KE", { notation: "compact" });

export function WeeklyLine({ days }: { days: { label: string; total: number }[] }) {
  const font = useChartFont();
  const total = days.reduce((sum, d) => sum + d.total, 0);

  return (
    <div>
      <div className="h-56 sm:h-64">
        {font && (
          <Line
            data={{
              labels: days.map((d) => d.label),
              datasets: [
                {
                  data: days.map((d) => d.total),
                  borderColor: ACCENT,
                  backgroundColor: "rgba(15, 118, 110, 0.10)",
                  borderWidth: 2,
                  fill: true,
                  tension: 0.25,
                  pointRadius: 4,
                  pointHoverRadius: 6,
                  pointBackgroundColor: "#fff",
                  pointBorderColor: ACCENT,
                  pointBorderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: { mode: "index", intersect: false },
              plugins: {
                legend: { display: false },
                tooltip: {
                  titleFont: { family: font, size: 14 },
                  bodyFont: { family: font, size: 14 },
                  callbacks: { label: (ctx) => ` ${money(ctx.parsed.y ?? 0)}` },
                },
              },
              scales: {
                x: { grid: { display: false }, ticks: { color: MUTED, font: { family: font, size: 13 } } },
                y: {
                  beginAtZero: true,
                  grid: { color: GRID },
                  border: { display: false },
                  ticks: { color: MUTED, font: { family: font, size: 13 }, callback: (v) => compact.format(Number(v)) },
                },
              },
            }}
          />
        )}
      </div>
      <p className="mt-4 italic text-[var(--gray-11)]">
        {money(total)} over seven days, an average of {money(total / days.length)} a day.
      </p>
    </div>
  );
}
