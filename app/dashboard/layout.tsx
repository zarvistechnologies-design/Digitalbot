import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "DigitalBot Dashboard",
  description: "DigitalBot workspace dashboard",
  keywords: [],
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="dashboard-shell">{children}</div>;
}
