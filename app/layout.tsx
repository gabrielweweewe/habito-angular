import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevLevel",
  description: "Personal behavioral tracking for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
