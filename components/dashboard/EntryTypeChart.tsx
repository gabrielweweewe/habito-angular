"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CHART_MUTED = "#71717a";
const COLORS: Record<string, string> = {
  project: "#22c55e",
  incident: "#ef4444",
  study: "#3b82f6",
};

interface EntryTypeItem {
  type: string;
  count: number;
}

const LABELS: Record<string, string> = {
  project: "Projeto",
  incident: "Incidente",
  study: "Estudo",
};

export function EntryTypeChart({ data }: { data: EntryTypeItem[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (total === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 h-64 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Nenhuma entrada ainda</p>
      </div>
    );
  }
  const chartData = data.map((d) => ({
    ...d,
    name: LABELS[d.type] ?? d.type,
  }));
  return (
    <div className="rounded-xl border border-border bg-card p-4 h-64 transition-shadow duration-200 hover:shadow-lg">
      <h3 className="font-semibold text-sm text-muted-foreground mb-2">
        Tipos de entrada
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={70}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[entry.type] ?? "#71717a"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "8px",
            }}
            formatter={(value: number) => [value, "Entradas"]}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value) => (
              <span style={{ color: CHART_MUTED }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
