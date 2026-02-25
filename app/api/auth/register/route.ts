import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validators/auth";
import * as authService from "@/lib/services/authService";
import { handleApiError } from "@/lib/utils/errors";
import { setAuthCookie } from "@/lib/middleware/auth";
import { checkAuthRateLimit } from "@/lib/middleware/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    if (!checkAuthRateLimit(request, "register")) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente em 15 minutos." },
        { status: 429 }
      );
    }
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { name, email, password } = parsed.data;
    const result = await authService.register(name, email, password);
    const res = NextResponse.json({ user: result.user });
    res.headers.set("Set-Cookie", setAuthCookie(result.token));
    return res;
  } catch (error) {
    return handleApiError(error);
  }
}
