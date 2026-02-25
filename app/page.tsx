import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.15),transparent)] pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in flex items-center gap-3">
          <Icon name="terminal" size={48} className="text-accent" />
          DevLevel
        </h1>
        <p className="text-muted-foreground text-lg mb-10 animate-slide-up max-w-md opacity-0" style={{ animationDelay: "0.1s" }}>
          Acompanhe hábitos e evolução como desenvolvedor
        </p>
        <div className="flex gap-4 animate-slide-up opacity-0" style={{ animationDelay: "0.2s" }}>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl border border-border bg-card text-foreground hover:bg-muted hover:border-accent/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl gradient-accent text-accent-foreground font-medium hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/20"
          >
            Cadastrar
          </Link>
        </div>
      </div>
    </main>
  );
}
