"use client";

interface StreakCounterProps {
  current: number;
  longest: number;
}

export function StreakCounter({ current, longest }: StreakCounterProps) {
  return (
    <div className="rounded border p-4 bg-white">
      <h3 className="font-semibold text-sm text-gray-700 mb-2">Sequência</h3>
      <div className="flex gap-4">
        <div>
          <p className="text-2xl font-bold text-amber-600">{current}</p>
          <p className="text-xs text-gray-500">dias atual</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-700">{longest}</p>
          <p className="text-xs text-gray-500">recorde</p>
        </div>
      </div>
    </div>
  );
}
