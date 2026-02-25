import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r p-4 flex flex-col gap-2">
        <Link href="/dashboard" className="font-semibold">
          DevLevel
        </Link>
        <nav className="flex flex-col gap-1 mt-4">
          <Link href="/dashboard" className="px-3 py-2 rounded hover:bg-gray-100">
            Dashboard
          </Link>
          <Link href="/entries" className="px-3 py-2 rounded hover:bg-gray-100">
            Entradas
          </Link>
          <Link href="/reflection" className="px-3 py-2 rounded hover:bg-gray-100">
            Reflexão
          </Link>
          <Link href="/experiments" className="px-3 py-2 rounded hover:bg-gray-100">
            Experimentos
          </Link>
          <div className="mt-auto pt-4">
            <LogoutButton />
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
