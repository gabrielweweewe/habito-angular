import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import * as gamificationService from "@/lib/services/gamificationService";
import { handleApiError } from "@/lib/utils/errors";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const [levelProgress, streaks] = await Promise.all([
      gamificationService.getLevelProgress(userId),
      gamificationService.getStreaks(userId),
    ]);
    const totalXP = await gamificationService.getTotalXP(userId);
    return NextResponse.json({
      totalXP,
      level: levelProgress.level,
      currentLevelXP: levelProgress.currentLevelXP,
      nextLevelXP: levelProgress.nextLevelXP,
      xpInCurrentLevel: levelProgress.xpInCurrentLevel,
      streak: streaks.current,
      longestStreak: streaks.longest,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    return handleApiError(err);
  }
}
