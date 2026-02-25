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
    <div className="rounded border p-4 bg-white h-64">
      <h3 className="font-semibold text-sm text-gray-700 mb-2">Autonomia (tendência)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tickFormatter={shortLabel}
            fontSize={11}
            tickLine={false}
          />
          <YAxis domain={[0, 10]} fontSize={11} tickLine={false} width={28} />
          <Tooltip
            labelFormatter={(label) => shortLabel(String(label))}
            formatter={(value: number) => [value, "Autonomia"]}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
