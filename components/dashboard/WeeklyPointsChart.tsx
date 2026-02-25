"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CHART_MUTED = "#71717a";
const BAR_FILL = "#22c55e";

interface WeekPoint {
  weekStart: string;
  points: number;
}

export function WeeklyPointsChart({ data }: { data: WeekPoint[] }) {
  const shortLabel = (d: string) => {
    const [y, m, day] = d.split("-");
    return `${day}/${m}`;
  };
  return (
    <div className="rounded-xl border border-border bg-card p-4 h-64 transition-shadow duration-200 hover:shadow-lg hover:shadow-accent/5">
      <h3 className="font-semibold text-sm text-muted-foreground mb-2">
        Pontos por semana
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="weekStart"
            tickFormatter={shortLabel}
            fontSize={11}
            tickLine={false}
            stroke={CHART_MUTED}
            tick={{ fill: CHART_MUTED }}
          />
          <YAxis
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
            labelFormatter={(_, payload) =>
              payload?.[0]
                ? shortLabel((payload[0].payload as WeekPoint).weekStart)
                : ""
            }
            formatter={(value: number) => [value, "Pontos"]}
          />
          <Bar dataKey="points" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={BAR_FILL} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
