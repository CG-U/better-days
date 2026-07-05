"use client";

import type { SavingsPoint } from "@better-days/shared";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const monthDayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

function formatHour(hour: number): string {
  if (hour === 0) return "12a";
  if (hour < 12) return `${hour}a`;
  if (hour === 12) return "12p";
  return `${hour - 12}p`;
}

const tooltipStyle = {
  borderRadius: "0.75rem",
  border: "1px solid var(--border)",
  background: "var(--card)",
  fontSize: "0.875rem",
};

export function WeekdayChart({ counts }: { counts: number[] }) {
  const data = counts.map((count, index) => ({
    label: WEEKDAY_LABELS[index],
    count,
  }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, left: 0, right: 0 }}>
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={tooltipStyle} />
        <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HourChart({ counts }: { counts: number[] }) {
  const data = counts.map((count, hour) => ({
    label: formatHour(hour),
    count,
  }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, left: 0, right: 0 }}>
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          fontSize={11}
          interval={5}
        />
        <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={tooltipStyle} />
        <Bar dataKey="count" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SavingsChart({ points }: { points: SavingsPoint[] }) {
  const data = points.map((point) => ({
    label: monthDayFormatter.format(new Date(`${point.date}T00:00:00`)),
    saved: point.savedCents / 100,
  }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 4, left: 8, right: 8 }}>
        <defs>
          <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          minTickGap={32}
        />
        <YAxis hide />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value) => [
            moneyFormatter.format(Number(value)),
            "Saved",
          ]}
        />
        <Area
          type="monotone"
          dataKey="saved"
          stroke="var(--primary)"
          strokeWidth={2.5}
          fill="url(#savingsFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
