"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"
import { createElement } from "react"

const VAPI_PUBLIC_KEY = "00119fad-8530-413f-9699-e47cada57939"
const VAPI_ASSISTANT_ID = "9ca19724-1f6c-48d1-8c62-a6107d585592"
const VAPI_WIDGET_SRC = "https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js"

export default function VapiChatWidget() {
  const pathname = usePathname()

  if (pathname?.startsWith("/dashboard")) return null

  return (
    <>
      <Script id="vapi-chat-widget-script" src={VAPI_WIDGET_SRC} strategy="afterInteractive" />
      <div className="pointer-events-none fixed bottom-24 left-5 z-[9998] hidden items-end gap-2 sm:flex">
        <img
          src="/images/bot-peeking.png"
          alt=""
          className="h-16 w-16 rounded-full border-2 border-orange-200 bg-white object-cover object-[74%_45%] shadow-lg shadow-orange-200/50"
        />
        <div className="mb-2 rounded-full border border-orange-100 bg-white px-4 py-2 shadow-lg shadow-slate-200/70">
          <p className="text-xs font-bold text-slate-800">AI Agent</p>
          <p className="text-[10px] font-medium text-orange-600">Try live chat</p>
        </div>
      </div>
      {createElement("vapi-widget", {
        "public-key": VAPI_PUBLIC_KEY,
        "assistant-id": VAPI_ASSISTANT_ID,
        mode: "chat",
        theme: "light",
        position: "bottom-left",
        size: "compact",
        radius: "large",
        "base-color": "#ffffff",
        "accent-color": "#f97316",
        "button-base-color": "#f97316",
        "button-accent-color": "#ffffff",
        "main-label": "AI Agent",
        "empty-chat-message": "Hi, I'm your DigitalBot AI agent. Ask me about voice agents, WhatsApp bots, pricing, or setup.",
        "chat-first-message": "Hi, I'm your DigitalBot AI agent. Ask me about voice agents, WhatsApp bots, pricing, or setup.",
        "chat-placeholder": "Type your message...",
        "local-storage-key": "digitalbot_vapi_widget_consent",
      })}
    </>
  )
}
