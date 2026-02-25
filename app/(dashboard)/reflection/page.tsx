"use client";

import { useEffect, useState } from "react";
import { startOfWeek, format } from "date-fns";

interface Reflection {
  _id: string;
  weekStartDate: string;
  whatDidILearn?: string;
  whereDidIImprove?: string;
  mainChallenge?: string;
  autonomyAverage?: number;
}

export default function ReflectionPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    weekStartDate: format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd"),
    whatDidILearn: "",
    whereDidIImprove: "",
    mainChallenge: "",
    autonomyAverage: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/reflections", { credentials: "include" })
      .then((r) => r.ok ? r.json() : Promise.reject(new Error("Falha ao carregar")))
      .then((data) => setReflections(data.reflections || []))
      .catch(() => setError("Erro ao carregar reflexões"))
      .finally(() => setLoading(false));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    fetch("/api/reflections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        weekStartDate: form.weekStartDate,
        whatDidILearn: form.whatDidILearn || undefined,
        whereDidIImprove: form.whereDidIImprove || undefined,
        mainChallenge: form.mainChallenge || undefined,
        autonomyAverage: form.autonomyAverage ? Number(form.autonomyAverage) : undefined,
      }),
    })
      .then((r) => {
        if (!r.ok) return r.json().then((d) => Promise.reject(new Error(d.error?.message || "Erro")));
        return r.json();
      })
      .then((newReflection) => {
        setReflections((prev) => [newReflection, ...prev]);
        setForm({
          weekStartDate: format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd"),
          whatDidILearn: "",
          whereDidIImprove: "",
          mainChallenge: "",
          autonomyAverage: "",
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setSubmitting(false));
  }

  if (loading) return <p className="text-gray-500">Carregando...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reflexão semanal</h1>

      <form onSubmit={handleSubmit} className="rounded border p-4 bg-white space-y-4 max-w-xl">
        <h2 className="font-semibold">Nova reflexão</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Semana (início)</label>
          <input
            type="date"
            value={form.weekStartDate}
            onChange={(e) => setForm((f) => ({ ...f, weekStartDate: e.target.value }))}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">O que aprendi</label>
          <textarea
            value={form.whatDidILearn}
            onChange={(e) => setForm((f) => ({ ...f, whatDidILearn: e.target.value }))}
            className="w-full border rounded px-3 py-2"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Onde melhorei</label>
          <textarea
            value={form.whereDidIImprove}
            onChange={(e) => setForm((f) => ({ ...f, whereDidIImprove: e.target.value }))}
            className="w-full border rounded px-3 py-2"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Principal desafio</label>
          <textarea
            value={form.mainChallenge}
            onChange={(e) => setForm((f) => ({ ...f, mainChallenge: e.target.value }))}
            className="w-full border rounded px-3 py-2"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Média de autonomia (0-10)</label>
          <input
            type="number"
            min={0}
            max={10}
            step={0.5}
            value={form.autonomyAverage}
            onChange={(e) => setForm((f) => ({ ...f, autonomyAverage: e.target.value }))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? "Salvando..." : "Salvar reflexão"}
        </button>
      </form>

      <div className="space-y-2">
        <h2 className="font-semibold">Reflexões anteriores</h2>
        {reflections.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhuma reflexão ainda.</p>
        ) : (
          <ul className="space-y-3">
            {reflections.map((r) => (
              <li key={r._id} className="rounded border p-4 bg-white">
                <p className="text-sm font-medium text-gray-600">
                  Semana de {format(new Date(r.weekStartDate), "dd/MM/yyyy")}
                </p>
                {r.whatDidILearn && <p className="mt-1"><span className="text-gray-500">Aprendi:</span> {r.whatDidILearn}</p>}
                {r.whereDidIImprove && <p className="mt-1"><span className="text-gray-500">Melhorei:</span> {r.whereDidIImprove}</p>}
                {r.mainChallenge && <p className="mt-1"><span className="text-gray-500">Desafio:</span> {r.mainChallenge}</p>}
                {r.autonomyAverage != null && <p className="mt-1 text-sm text-gray-600">Autonomia média: {r.autonomyAverage}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
