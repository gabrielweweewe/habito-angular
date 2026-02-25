import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import * as dashboardService from "@/lib/services/dashboardService";
import { handleApiError } from "@/lib/utils/errors";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const data = await dashboardService.getDashboardData(userId);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof Response) return err;
    return handleApiError(err);
  }
}
