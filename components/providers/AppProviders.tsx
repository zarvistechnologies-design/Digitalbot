"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { installDashboardFetchCache } from "@/lib/dashboard-fetch-cache";
import QueryProvider from "./QueryProvider";

const MarketingRuntime = dynamic(() => import("./MarketingRuntime"), {
  ssr: false,
});

export default function AppProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  if (isDashboard) installDashboardFetchCache();

  useEffect(() => {
    if (isDashboard) return;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://digital-api-46ss.onrender.com/api";
    const healthUrl = new URL("/health", apiBaseUrl).toString();
    void fetch(healthUrl, { cache: "no-store", mode: "cors" }).catch(() => {});
  }, [isDashboard]);

  return (
    <QueryProvider>
      {children}
      {!isDashboard && <MarketingRuntime />}
    </QueryProvider>
  );
}
