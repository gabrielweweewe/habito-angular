"use client";

import { useEffect, useState } from "react";
import { startOfWeek, format } from "date-fns";
import { Icon } from "@/components/ui/Icon";

interface Reflection {
  _id: string;
  weekStartDate: string;
  whatDidILearn?: string;
  whereDidIImprove?: string;
  mainChallenge?: string;
  autonomyAverage?: number;
}

const inputClass =
  "w-full border border-border rounded-xl bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-200";
const labelClass = "block text-sm font-medium text-foreground mb-1.5";

export default function ReflectionPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    weekStartDate: format(
      startOfWeek(new Date(), { weekStartsOn: 1 }),
      "yyyy-MM-dd"
    ),
    whatDidILearn: "",
    whereDidIImprove: "",
    mainChallenge: "",
    autonomyAverage: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/reflections", { credentials: "include" })
      .then((r) =>
        r.ok ? r.json() : Promise.reject(new Error("Falha ao carregar"))
      )
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
        autonomyAverage: form.autonomyAverage
          ? Number(form.autonomyAverage)
          : undefined,
      }),
    })
      .then((r) => {
        if (!r.ok)
          return r.json().then((d) => Promise.reject(new Error(d.error?.message || "Erro")));
        return r.json();
      })
      .then((newReflection) => {
        setReflections((prev) => [newReflection, ...prev]);
        setForm({
          weekStartDate: format(
            startOfWeek(new Date(), { weekStartsOn: 1 }),
            "yyyy-MM-dd"
          ),
          whatDidILearn: "",
          whereDidIImprove: "",
          mainChallenge: "",
          autonomyAverage: "",
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setSubmitting(false));
  }

  if (loading)
    return (
      <p className="text-muted-foreground animate-pulse-soft">Carregando...</p>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <Icon name="psychology" size={28} className="text-accent" />
        Reflexão semanal
      </h1>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-card p-6 space-y-4 max-w-xl"
      >
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Icon name="add_circle" size={22} className="text-accent" />
          Nova reflexão
        </h2>
        <div>
          <label className={labelClass}>Semana (início)</label>
          <input
            type="date"
            value={form.weekStartDate}
            onChange={(e) =>
              setForm((f) => ({ ...f, weekStartDate: e.target.value }))
            }
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>O que aprendi</label>
          <textarea
            value={form.whatDidILearn}
            onChange={(e) =>
              setForm((f) => ({ ...f, whatDidILearn: e.target.value }))
            }
            className={inputClass}
            rows={2}
          />
        </div>
        <div>
          <label className={labelClass}>Onde melhorei</label>
          <textarea
            value={form.whereDidIImprove}
            onChange={(e) =>
              setForm((f) => ({ ...f, whereDidIImprove: e.target.value }))
            }
            className={inputClass}
            rows={2}
          />
        </div>
        <div>
          <label className={labelClass}>Principal desafio</label>
          <textarea
            value={form.mainChallenge}
            onChange={(e) =>
              setForm((f) => ({ ...f, mainChallenge: e.target.value }))
            }
            className={inputClass}
            rows={2}
          />
        </div>
        <div>
          <label className={labelClass}>Média de autonomia (0-10)</label>
          <input
            type="number"
            min={0}
            max={10}
            step={0.5}
            value={form.autonomyAverage}
            onChange={(e) =>
              setForm((f) => ({ ...f, autonomyAverage: e.target.value }))
            }
            className={inputClass}
          />
        </div>
        {error && (
          <p className="text-red-400 text-sm flex items-center gap-1.5">
            <Icon name="error" size={18} />
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2.5 rounded-xl gradient-accent text-accent-foreground font-medium hover:opacity-90 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
        >
          <Icon name="save" size={18} />
          {submitting ? "Salvando..." : "Salvar reflexão"}
        </button>
      </form>

      <div className="space-y-2">
        <h2 className="font-semibold text-foreground">Reflexões anteriores</h2>
        {reflections.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhuma reflexão ainda.
          </p>
        ) : (
          <ul className="space-y-3">
            {reflections.map((r) => (
              <li
                key={r._id}
                className="rounded-xl border border-border bg-card p-4 transition-shadow duration-200 hover:shadow-lg hover:shadow-accent/5"
              >
                <p className="text-sm font-medium text-muted-foreground">
                  Semana de {format(new Date(r.weekStartDate), "dd/MM/yyyy")}
                </p>
                {r.whatDidILearn && (
                  <p className="mt-1 text-foreground">
                    <span className="text-muted-foreground">Aprendi:</span>{" "}
                    {r.whatDidILearn}
                  </p>
                )}
                {r.whereDidIImprove && (
                  <p className="mt-1 text-foreground">
                    <span className="text-muted-foreground">Melhorei:</span>{" "}
                    {r.whereDidIImprove}
                  </p>
                )}
                {r.mainChallenge && (
                  <p className="mt-1 text-foreground">
                    <span className="text-muted-foreground">Desafio:</span>{" "}
                    {r.mainChallenge}
                  </p>
                )}
                {r.autonomyAverage != null && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Autonomia média: {r.autonomyAverage}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
