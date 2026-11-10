"use client";

import { useEffect, useState } from "react";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

// Canvas can't read Radix's CSS variables reliably (P3 colour values), so the chart palette is fixed hex.
export const CHART_COLORS = ["#0f766e", "#d08a2e", "#6c5b9e", "#c2563d", "#4a7fb0", "#8a9a3b", "#a8577e", "#7b8794"];
export const INK = "#1c2b33";
export const MUTED = "#5b6b73";
export const GRID = "rgba(28, 43, 51, 0.10)";
export const ACCENT = CHART_COLORS[0];

/** next/font gives the family a generated name, so read what the page actually uses. */
export function useChartFont(): string | null {
  const [font, setFont] = useState<string | null>(null);
  useEffect(() => {
    setFont(getComputedStyle(document.body).fontFamily);
  }, []);
  return font;
}
