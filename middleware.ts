import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "devlevel_token";
const PROTECTED_PATHS = ["/dashboard", "/entries", "/reflection", "/experiments"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function middleware(request: NextRequest) {
  if (!isProtected(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const login = new URL("/login", request.url);
    login.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/entries/:path*", "/reflection/:path*", "/experiments/:path*"] };
