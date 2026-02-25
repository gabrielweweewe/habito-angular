const store = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000; // 15 min
const MAX_LOGIN = 10;
const MAX_REGISTER = 5;

function getKey(ip: string, path: string): string {
  return `${ip}:${path}`;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

export function checkAuthRateLimit(request: Request, path: "login" | "register"): boolean {
  const ip = getClientIp(request);
  const key = getKey(ip, path);
  const now = Date.now();
  const max = path === "login" ? MAX_LOGIN : MAX_REGISTER;
  let entry = store.get(key);
  if (!entry) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (now > entry.resetAt) {
    entry = { count: 1, resetAt: now + WINDOW_MS };
    store.set(key, entry);
    return true;
  }
  entry.count++;
  if (entry.count > max) return false;
  return true;
}
