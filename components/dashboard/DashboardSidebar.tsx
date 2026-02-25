"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { LogoutButton } from "@/components/auth/LogoutButton";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/entries", label: "Entradas", icon: "edit_note" },
  { href: "/reflection", label: "Reflexão", icon: "psychology" },
  { href: "/experiments", label: "Experimentos", icon: "science" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r border-border bg-card/50 flex flex-col gap-2 p-4 shrink-0">
      <Link
        href="/dashboard"
        className="font-semibold text-lg text-foreground hover:text-accent transition-colors duration-200 flex items-center gap-2"
      >
        <Icon name="terminal" size={28} className="text-accent" />
        DevLevel
      </Link>
      <nav className="flex flex-col gap-1 mt-4">
        {navItems.map(({ href, label, icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-accent/15 text-accent font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon name={icon} size={22} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-border">
        <LogoutButton />
      </div>
    </aside>
  );
}
