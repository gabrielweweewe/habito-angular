"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Icon } from "@/components/ui/Icon";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const CHART_MUTED = "#71717a";
const LINE_XP = "#22c55e";
const LINE_AUTONOMIA = "#3b82f6";

interface Experiment {
  _id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  targetMetric: string;
  complianceLog: { date: string; completed: boolean; value?: number }[];
}

interface CorrelationData {
  complianceByWeek: {
    weekStart: string;
    completed: number;
    total: number;
    pct: number;
  }[];
  weeklyXP: { weekStart: string; points: number }[];
  weeklyAutonomy: { weekStart: string; avg: number }[];
}

export default function ExperimentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [correlation, setCorrelation] = useState<CorrelationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [complianceDate, setComplianceDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [complianceChecked, setComplianceChecked] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/experiments/${id}`, { credentials: "include" }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error("Não encontrado"))
      ),
      fetch(`/api/experiments/${id}/correlation`, { credentials: "include" }).then(
        (r) => (r.ok ? r.json() : null)
      ),
    ])
      .then(([exp, corr]) => {
        setExperiment(exp);
        setCorrelation(corr);
      })
      .catch(() => router.push("/experiments"))
      .finally(() => setLoading(false));
  }, [id, router]);

  function handleLogCompliance(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    fetch(`/api/experiments/${id}/compliance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        date: complianceDate,
        completed: complianceChecked,
      }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Erro"))))
      .then((updated) => {
        setExperiment(updated);
        return fetch(`/api/experiments/${id}/correlation`, {
          credentials: "include",
        });
      })
      .then((r) => (r.ok ? r.json() : null))
      .then(setCorrelation)
      .catch(() => {})
      .finally(() => setSubmitting(false));
  }

  if (loading || !experiment) {
    return (
      <p className="text-muted-foreground animate-pulse-soft">Carregando...</p>
    );
  }

  const chartData =
    correlation?.weeklyXP.map((w, i) => ({
      weekStart: w.weekStart.slice(5),
      xp: w.points,
      autonomia: correlation.weeklyAutonomy[i]?.avg ?? 0,
      compliance: correlation.complianceByWeek[i]?.pct ?? 0,
    })) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/experiments"
          className="hover:text-accent transition-colors duration-200"
        >
          Experimentos
        </Link>
        <Icon name="chevron_right" size={16} />
        <span className="text-foreground">{experiment.name}</span>
      </div>

      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <Icon name="science" size={28} className="text-accent" />
        {experiment.name}
      </h1>
      {experiment.description && (
        <p className="text-muted-foreground">{experiment.description}</p>
      )}
      <p className="text-sm text-muted-foreground">
        {format(new Date(experiment.startDate), "dd/MM/yyyy")} –{" "}
        {format(new Date(experiment.endDate), "dd/MM/yyyy")} ·{" "}
        {experiment.targetMetric}
      </p>

      <div className="rounded-xl border border-border bg-card p-4 max-w-md">
        <h2 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <Icon name="check_circle" size={20} className="text-accent" />
          Registrar compliance
        </h2>
        <form
          onSubmit={handleLogCompliance}
          className="flex flex-wrap items-end gap-2"
        >
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Data
            </label>
            <input
              type="date"
              value={complianceDate}
              onChange={(e) => setComplianceDate(e.target.value)}
              className="border border-border rounded-xl bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <label className="flex items-center gap-2 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={complianceChecked}
              onChange={(e) => setComplianceChecked(e.target.checked)}
              className="rounded border-border"
            />
            <span className="text-sm">Cumpriu</span>
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="px-3 py-2 rounded-xl gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all duration-200"
          >
            {submitting ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </div>

      {experiment.complianceLog && experiment.complianceLog.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Icon name="history" size={20} className="text-accent" />
            Histórico de compliance
          </h2>
          <ul className="text-sm space-y-1 text-foreground">
            {experiment.complianceLog
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .slice(0, 14)
              .map((entry) => (
                <li key={entry.date} className="flex items-center gap-2">
                  {format(new Date(entry.date), "dd/MM/yyyy")}:
                  {entry.completed ? (
                    <Icon name="check_circle" size={16} className="text-accent" />
                  ) : (
                    <Icon name="cancel" size={16} className="text-red-400" />
                  )}
                  {entry.completed ? "Cumpriu" : "Não cumpriu"}
                </li>
              ))}
          </ul>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 transition-shadow duration-200 hover:shadow-lg">
          <h2 className="font-semibold text-foreground mb-2">
            Correlação: XP semanal e autonomia
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_MUTED}
                  opacity={0.4}
                />
                <XAxis
                  dataKey="weekStart"
                  fontSize={11}
                  tickLine={false}
                  stroke={CHART_MUTED}
                  tick={{ fill: CHART_MUTED }}
                />
                <YAxis
                  yAxisId="left"
                  fontSize={11}
                  tickLine={false}
                  width={28}
                  stroke={CHART_MUTED}
                  tick={{ fill: CHART_MUTED }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  fontSize={11}
                  tickLine={false}
                  width={28}
                  domain={[0, 10]}
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
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: CHART_MUTED }}>{value}</span>
                  )}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="xp"
                  stroke={LINE_XP}
                  name="XP"
                  dot={{ r: 3, fill: LINE_XP }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="autonomia"
                  stroke={LINE_AUTONOMIA}
                  name="Autonomia"
                  dot={{ r: 3, fill: LINE_AUTONOMIA }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
