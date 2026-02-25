export const POINTS = {
  DEEP_WORK_BLOCK: 2,
  INCIDENT_RESOLVED: 3,
  NEW_APPLIED_LEARNING: 4,
  LARGE_TASK_COMPLETED: 5,
  INTERRUPTION_MANAGED: 1,
} as const;

export const LEVEL_BASE_XP = 100;
export const LEVEL_EXPONENT = 1.5;

export function xpRequiredForLevel(level: number): number {
  return Math.floor(LEVEL_BASE_XP * Math.pow(level, LEVEL_EXPONENT));
}

export function getLevelFromTotalXP(totalXP: number): {
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  xpInCurrentLevel: number;
} {
  let level = 1;
  let accumulated = 0;
  while (true) {
    const nextLevelReq = xpRequiredForLevel(level + 1);
    if (accumulated + nextLevelReq > totalXP) break;
    accumulated += nextLevelReq;
    level++;
  }
  const currentLevelReq = xpRequiredForLevel(level);
  const nextLevelReq = xpRequiredForLevel(level + 1);
  const xpInCurrentLevel = totalXP - accumulated;
  return {
    level,
    currentLevelXP: totalXP - accumulated,
    nextLevelXP: nextLevelReq,
    xpInCurrentLevel,
  };
}
