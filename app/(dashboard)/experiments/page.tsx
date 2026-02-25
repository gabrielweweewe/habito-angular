"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";

interface Experiment {
  _id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  targetMetric: string;
  complianceLog?: { date: string; completed: boolean; value?: number }[];
}

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    targetMetric: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/experiments", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Falha ao carregar"))))
      .then((data) => setExperiments(data.experiments || []))
      .catch(() => setError("Erro ao carregar experimentos"))
      .finally(() => setLoading(false));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    fetch("/api/experiments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: form.name,
        description: form.description || undefined,
        startDate: form.startDate,
        endDate: form.endDate,
        targetMetric: form.targetMetric,
      }),
    })
      .then((r) => {
        if (!r.ok) return r.json().then((d) => Promise.reject(new Error(d.error?.message || "Erro")));
        return r.json();
      })
      .then((newExp) => {
        setExperiments((prev) => [newExp, ...prev]);
        setShowForm(false);
        setForm({
          name: "",
          description: "",
          startDate: format(new Date(), "yyyy-MM-dd"),
          endDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
          targetMetric: "",
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setSubmitting(false));
  }

  if (loading) return <p className="text-gray-500">Carregando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Modo experimento</h1>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 text-sm"
        >
          {showForm ? "Cancelar" : "Novo experimento"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded border p-4 bg-white space-y-4 max-w-xl">
          <h2 className="font-semibold">Criar experimento</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Métrica alvo (ex: 90 min deep work diário)</label>
            <input
              type="text"
              value={form.targetMetric}
              onChange={(e) => setForm((f) => ({ ...f, targetMetric: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fim</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting ? "Salvando..." : "Criar"}
          </button>
        </form>
      )}

      {error && !showForm && <p className="text-red-600 text-sm">{error}</p>}

      <div className="space-y-2">
        <h2 className="font-semibold">Experimentos</h2>
        {experiments.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum experimento. Crie um para acompanhar compliance e correlação com autonomia/XP.</p>
        ) : (
          <ul className="space-y-3">
            {experiments.map((exp) => (
              <li key={exp._id} className="rounded border p-4 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/experiments/${exp._id}`} className="font-medium hover:underline">
                      {exp.name}
                    </Link>
                    {exp.description && (
                      <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(exp.startDate), "dd/MM/yyyy")} – {format(new Date(exp.endDate), "dd/MM/yyyy")} · {exp.targetMetric}
                    </p>
                    {exp.complianceLog && (
                      <p className="text-xs text-gray-500">
                        {exp.complianceLog.filter((e) => e.completed).length} / {exp.complianceLog.length} dias em compliance
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/experiments/${exp._id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
