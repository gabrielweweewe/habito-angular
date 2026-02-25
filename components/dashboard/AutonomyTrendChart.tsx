"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CHART_MUTED = "#71717a";
const LINE_STROKE = "#3b82f6";

interface AutonomyPoint {
  date: string;
  score: number;
}

export function AutonomyTrendChart({ data }: { data: AutonomyPoint[] }) {
  const shortLabel = (d: string) => {
    const parts = d.split("-");
    return parts.length >= 2 ? `${parts[2]}/${parts[1]}` : d;
  };
  return (
    <div className="rounded-xl border border-border bg-card p-4 h-64 transition-shadow duration-200 hover:shadow-lg hover:shadow-blue-500/5">
      <h3 className="font-semibold text-sm text-muted-foreground mb-2">
        Autonomia (tendência)
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_MUTED}
            opacity={0.4}
          />
          <XAxis
            dataKey="date"
            tickFormatter={shortLabel}
            fontSize={11}
            tickLine={false}
            stroke={CHART_MUTED}
            tick={{ fill: CHART_MUTED }}
          />
          <YAxis
            domain={[0, 10]}
            fontSize={11}
            tickLine={false}
            width={28}
            stroke={CHART_MUTED}
            tick={{ fill: CHART_MUTED }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#fafafa" }}
            labelFormatter={(label) => shortLabel(String(label))}
            formatter={(value: number) => [value, "Autonomia"]}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke={LINE_STROKE}
            strokeWidth={2}
            dot={{ r: 3, fill: LINE_STROKE }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
