import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Bayora | AI Security Laboratory",
  description: "Enterprise-grade isolated AI security platform: Red Team adversarial workbench, Blue Team defenses, and SHA-256 audit ledger.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070B12] text-slate-100 antialiased selection:bg-purple-900 selection:text-white">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t border-[#1E293B] bg-[#070B12] py-6 px-6 text-center text-xs font-mono text-slate-500">
              <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-4">
                <span>BAYORA AI SECURITY PLATFORM • ENTERPRISE AIRGAP EDITION</span>
                <span>SHA-256 HASH CHAIN • DEFAULT-DENY NETWORK POLICY • STRICT RBAC</span>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
