"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { installDashboardFetchCache } from "@/lib/dashboard-fetch-cache";
import QueryProvider from "./QueryProvider";

const MarketingRuntime = dynamic(() => import("./MarketingRuntime"), {
  ssr: false,
});

export default function AppProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  if (isDashboard) installDashboardFetchCache();

  return (
    <QueryProvider>
      {children}
      {!isDashboard && <MarketingRuntime />}
    </QueryProvider>
  );
}
