"use client";

import Sidebar from "@/components/Sidebar";
import { Building2, Menu, X, type LucideIcon } from "lucide-react";
import { ReactNode, useState } from "react";

interface RealEstatePageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  children: ReactNode;
}

export default function RealEstatePageShell({
  eyebrow,
  title,
  description,
  icon: Icon = Building2,
  actions,
  children,
}: RealEstatePageShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <button
        type="button"
        onClick={() => setSidebarOpen((value) => !value)}
        className="fixed left-4 top-4 z-50 rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm lg:hidden"
        aria-label="Toggle navigation"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {sidebarOpen && <button className="fixed inset-0 z-30 bg-slate-950/45 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 lg:translate-x-0`}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </aside>

      <main className="min-h-screen min-w-0 lg:ml-64">
        <header className="border-b border-slate-200 bg-white/95 px-5 py-5 backdrop-blur sm:px-7 lg:px-10">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-3 pl-12 lg:pl-0">
              <div className="hidden rounded-xl bg-emerald-950 p-3 text-white sm:block">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">{eyebrow}</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
              </div>
            </div>
            {actions && <div className="flex min-w-0 flex-wrap items-center gap-2 pl-12 sm:pl-0">{actions}</div>}
          </div>
        </header>
        <div className="mx-auto max-w-[1500px] p-5 sm:p-7 lg:p-10">{children}</div>
      </main>
    </div>
  );
}

export function pretty(value?: string) {
  return String(value || "Not set").replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatCurrency(value?: number, compact = true) {
  const amount = Number(value || 0);
  if (!amount) return "Not set";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(amount);
}

export function apiErrorMessage(error: unknown, fallback: string) {
  const candidate = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
  return candidate.response?.data?.message || candidate.response?.data?.error || candidate.message || fallback;
}
