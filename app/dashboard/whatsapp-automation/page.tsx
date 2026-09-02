"use client";

import Sidebar from "@/components/Sidebar";
import WhatsAppAutomationPanel from "@/components/leads/WhatsAppAutomationPanel";
import { Bot, Menu, X } from "lucide-react";
import { useState } from "react";

export default function LeadWhatsAppAutomationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 rounded-xl border border-slate-200 bg-white p-2.5 shadow-lg lg:hidden"
        aria-label="Toggle navigation"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="min-w-0 flex-1 p-4 pt-16 lg:ml-64 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-6">
            <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <Bot className="h-4 w-4" /> Lead Service
            </div>
            <h1 className="text-3xl font-bold text-slate-900">WhatsApp Automation</h1>
            <p className="mt-1 text-sm text-slate-500">
              Connect your Meta WhatsApp number, configure AI behavior, and manage the Lead qualification prompt.
            </p>
          </header>

          <WhatsAppAutomationPanel />
        </div>
      </main>
    </div>
  );
}
