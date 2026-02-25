"use client";

export function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/";
  }
  return (
    <button
      type="button"
      onClick={handleLogout}
      className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-600"
    >
      Sair
    </button>
  );
}
