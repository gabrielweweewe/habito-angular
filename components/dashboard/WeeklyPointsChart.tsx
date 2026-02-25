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
    <div className="rounded border p-4 bg-white h-64">
      <h3 className="font-semibold text-sm text-gray-700 mb-2">Pontos por semana</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="weekStart"
            tickFormatter={shortLabel}
            fontSize={11}
            tickLine={false}
          />
          <YAxis fontSize={11} tickLine={false} width={28} />
          <Tooltip
            labelFormatter={(_, payload) =>
              payload?.[0] ? shortLabel((payload[0].payload as WeekPoint).weekStart) : ""
            }
            formatter={(value: number) => [value, "Pontos"]}
          />
          <Bar dataKey="points" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill="#059669" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
