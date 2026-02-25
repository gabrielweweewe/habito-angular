"use client";

import { POINTS } from "@/lib/constants/gamification";

const LEGEND_ITEMS = [
  { label: "Bloco de deep work concluído", points: POINTS.DEEP_WORK_BLOCK, attribute: "deepWorkBlockCompleted = true" },
  { label: "Incidente resolvido", points: POINTS.INCIDENT_RESOLVED, attribute: "entryType = incident" },
  { label: "Novo aprendizado aplicado", points: POINTS.NEW_APPLIED_LEARNING, attribute: "entryType = study + learned preenchido" },
  { label: "Tarefa grande concluída", points: POINTS.LARGE_TASK_COMPLETED, attribute: "entryType = project + difficulty ≥ 4" },
  { label: "Interrupção bem gerida", points: POINTS.INTERRUPTION_MANAGED, attribute: "interruptionManagedWell = true" },
] as const;

export function PointsLegend() {
  return (
    <div className="rounded border p-4 bg-white">
      <h3 className="font-semibold text-sm text-gray-700 mb-2">Tabela de pontuação (XP)</h3>
      <p className="text-xs text-gray-500 mb-3">Cada entrada diária soma pontos conforme os atributos marcados.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-medium text-gray-700">Ação / Critério</th>
              <th className="py-2 pr-4 font-medium text-gray-700 w-16 text-center">Pontos</th>
              <th className="py-2 font-medium text-gray-700">Atributo na entrada</th>
            </tr>
          </thead>
          <tbody>
            {LEGEND_ITEMS.map((item) => (
              <tr key={item.attribute} className="border-b border-gray-100 last:border-0">
                <td className="py-2 pr-4">{item.label}</td>
                <td className="py-2 pr-4 text-center font-semibold text-emerald-600">+{item.points}</td>
                <td className="py-2 text-gray-500 font-mono text-xs">{item.attribute}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
