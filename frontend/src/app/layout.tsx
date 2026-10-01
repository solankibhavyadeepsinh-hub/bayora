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
      <body className="min-h-screen bg-[#0A0D10] text-[#F1F4F6] antialiased selection:bg-[#4BC7B5]/20 selection:text-[#4BC7B5]">
        <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
