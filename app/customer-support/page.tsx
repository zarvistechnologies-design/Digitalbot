"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerSupportDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to campaigns page (first/main page)
    router.replace('/customer-support/campaigns');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-gray-500">Redirecting to campaigns...</div>
    </div>
  );
}
