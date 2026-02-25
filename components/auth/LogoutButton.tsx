"use client";

import { Icon } from "@/components/ui/Icon";

export function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/";
  }
  return (
    <button
      type="button"
      onClick={handleLogout}
      className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200"
    >
      <Icon name="logout" size={22} />
      Sair
    </button>
  );
}
