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
      <body className="min-h-screen bg-[#080A0D] text-[#EEF2F5] antialiased selection:bg-[#4FD1C5]/20 selection:text-[#4FD1C5]">
        <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
