import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { AppShell } from "@/components/shell/AppShell";

export const metadata: Metadata = {
  title: "Bayora | Enterprise AI Security Platform",
  description: "Enterprise-grade isolated AI security platform: Red Team adversarial workbench, Blue Team defenses, SHA-256 audit ledger, and regulatory assurance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070A0F] text-[#F5F7FA] antialiased selection:bg-[#39D9FF]/20 selection:text-[#39D9FF]">
        <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
