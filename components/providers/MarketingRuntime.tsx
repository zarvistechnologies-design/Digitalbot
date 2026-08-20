"use client";

import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import ChatbotWidget from "@/components/chatbot-widget";

export default function MarketingRuntime() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17791353502"
        strategy="afterInteractive"
      />
      <Script id="google-ads" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17791353502');
        `}
      </Script>
      <ChatbotWidget />
      {process.env.NODE_ENV === "production" && <Analytics />}
    </>
  );
}
