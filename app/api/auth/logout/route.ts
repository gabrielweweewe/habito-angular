import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/middleware/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", clearAuthCookie());
  return res;
}
