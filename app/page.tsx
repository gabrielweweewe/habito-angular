import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">DevLevel</h1>
      <p className="text-gray-600 mb-8">Personal behavioral tracking for developers</p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Entrar
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
        >
          Cadastrar
        </Link>
      </div>
    </main>
  );
}
