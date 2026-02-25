import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/utils/jwt";

const COOKIE_NAME = "devlevel_token";

export function getTokenFromRequest(request: NextRequest): string | null {
  const cookie = request.cookies.get(COOKIE_NAME);
  if (cookie?.value) return cookie.value;
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export async function getAuthUserId(request: NextRequest): Promise<string | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload?.userId ?? null;
}

export async function requireAuth(request: NextRequest): Promise<string> {
  const userId = await getAuthUserId(request);
  if (!userId) throw new Response(JSON.stringify({ error: "Não autorizado" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
  return userId;
}

export function setAuthCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`;
}

export function clearAuthCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
