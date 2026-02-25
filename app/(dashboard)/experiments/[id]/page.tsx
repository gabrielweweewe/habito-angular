"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
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
  complianceByWeek: { weekStart: string; completed: number; total: number; pct: number }[];
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
  const [complianceDate, setComplianceDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [complianceChecked, setComplianceChecked] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/experiments/${id}`, { credentials: "include" }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error("Não encontrado"))
      ),
      fetch(`/api/experiments/${id}/correlation`, { credentials: "include" }).then((r) =>
        r.ok ? r.json() : null
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
      body: JSON.stringify({ date: complianceDate, completed: complianceChecked }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Erro"))))
      .then((updated) => {
        setExperiment(updated);
        return fetch(`/api/experiments/${id}/correlation`, { credentials: "include" });
      })
      .then((r) => (r.ok ? r.json() : null))
      .then(setCorrelation)
      .catch(() => {})
      .finally(() => setSubmitting(false));
  }

  if (loading || !experiment) {
    return <p className="text-gray-500">Carregando...</p>;
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
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/experiments" className="hover:underline">
          Experimentos
        </Link>
        <span>/</span>
        <span>{experiment.name}</span>
      </div>

      <h1 className="text-2xl font-bold">{experiment.name}</h1>
      {experiment.description && (
        <p className="text-gray-600">{experiment.description}</p>
      )}
      <p className="text-sm text-gray-500">
        {format(new Date(experiment.startDate), "dd/MM/yyyy")} –{" "}
        {format(new Date(experiment.endDate), "dd/MM/yyyy")} · {experiment.targetMetric}
      </p>

      <div className="rounded border p-4 bg-white max-w-md">
        <h2 className="font-semibold mb-2">Registrar compliance</h2>
        <form onSubmit={handleLogCompliance} className="flex flex-wrap items-end gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Data</label>
            <input
              type="date"
              value={complianceDate}
              onChange={(e) => setComplianceDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={complianceChecked}
              onChange={(e) => setComplianceChecked(e.target.checked)}
            />
            <span className="text-sm">Cumpriu</span>
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="px-3 py-1 rounded bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </div>

      {experiment.complianceLog && experiment.complianceLog.length > 0 && (
        <div className="rounded border p-4 bg-white">
          <h2 className="font-semibold mb-2">Histórico de compliance</h2>
          <ul className="text-sm space-y-1">
            {experiment.complianceLog
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 14)
              .map((entry) => (
                <li key={entry.date}>
                  {format(new Date(entry.date), "dd/MM/yyyy")}:{" "}
                  {entry.completed ? "Cumpriu" : "Não cumpriu"}
                </li>
              ))}
          </ul>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="rounded border p-4 bg-white">
          <h2 className="font-semibold mb-2">Correlação: XP semanal e autonomia</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="weekStart" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" fontSize={11} tickLine={false} width={28} />
                <YAxis yAxisId="right" orientation="right" fontSize={11} tickLine={false} width={28} domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="xp" stroke="#059669" name="XP" dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="autonomia" stroke="#2563eb" name="Autonomia" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
