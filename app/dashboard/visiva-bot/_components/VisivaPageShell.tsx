"use client";

import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

interface VisivaPageShellProps {
  title: string;
  description: string;
  icon: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  maxWidth?: string;
}

export function VisivaPageShell({
  title,
  description,
  icon,
  actions,
  children,
  maxWidth = "max-w-7xl",
}: VisivaPageShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f7faf9]">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-slate-200"
        aria-label="Toggle navigation"
      >
        {sidebarOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
      </button>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setSidebarOpen(false)}>
          <div className="w-64 h-full" onClick={(event) => event.stopPropagation()}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}

      <div className="hidden lg:block">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      <main className="flex-1 lg:ml-60 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className={cn("mx-auto space-y-6", maxWidth)}>
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-100">
                {icon}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
                <p className="text-sm text-slate-500">{description}</p>
              </div>
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
