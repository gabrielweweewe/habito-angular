"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface EntryTypeItem {
  type: string;
  count: number;
}

const COLORS: Record<string, string> = {
  project: "#059669",
  incident: "#dc2626",
  study: "#2563eb",
};

const LABELS: Record<string, string> = {
  project: "Projeto",
  incident: "Incidente",
  study: "Estudo",
};

export function EntryTypeChart({ data }: { data: EntryTypeItem[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (total === 0) {
    return (
      <div className="rounded border p-4 bg-white h-64 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Nenhuma entrada ainda</p>
      </div>
    );
  }
  const chartData = data.map((d) => ({ ...d, name: LABELS[d.type] ?? d.type }));
  return (
    <div className="rounded border p-4 bg-white h-64">
      <h3 className="font-semibold text-sm text-gray-700 mb-2">Tipos de entrada</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={70}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={COLORS[entry.type] ?? "#94a3b8"} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [value, "Entradas"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
