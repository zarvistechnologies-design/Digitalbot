"use client";

import { Loader2, Send, User, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function AryaAvatar({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative rounded-full overflow-hidden flex-shrink-0 ring-2 ring-orange-300/50"
    >
      <Image
        src="/images/female-real-estate.jpg"
        alt="Arya"
        width={size * 3}
        height={size * 3}
        className="object-cover w-full h-full"
        style={{ objectPosition: "68% 15%" }}
        priority
      />
    </div>
  );
}

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
  time: string;
}

interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What services do you offer?",
  "How does pricing work?",
  "Which industries do you serve?",
  "How quickly can I get started?",
];

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatbotWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: "Hi there! 👋 I'm Arya, your AI assistant at DigitalBot. Ask me anything about our AI voice agents, WhatsApp bots, pricing, integrations, or how we can help your business!",
        sender: "bot",
        time: getTime(),
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now(),
      text: text.trim(),
      sender: "user",
      time: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const newHistory: ChatHistoryItem[] = [
      ...chatHistory,
      { role: "user", content: text.trim() },
    ];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });

      const data = await res.json();
      const reply = data.reply || data.error || "Sorry, something went wrong. Please try again.";

      const botMsg: Message = {
        id: Date.now() + 1,
        text: reply,
        sender: "bot",
        time: getTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setChatHistory([...newHistory, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Sorry, I'm having trouble connecting right now. Please try again or email us at contact@digitalbot.ai",
          sender: "bot",
          time: getTime(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Hide chatbot on dashboard pages
  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-[9999] w-[380px] max-w-[calc(100vw-2rem)] transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: "520px" }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 via-orange-500 to-orange-500 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/40 shadow-lg">
                <AryaAvatar size={40} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Arya — AI Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/80 text-xs">Powered by GPT</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-orange-50/30 to-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-1">
                    <AryaAvatar size={28} />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md"
                      : "bg-white text-gray-700 border border-gray-100 shadow-sm rounded-bl-md"
                  }`}
                >
                  <span className="whitespace-pre-line">{msg.text}</span>
                  <div
                    className={`text-[10px] mt-1 ${
                      msg.sender === "user" ? "text-white/60" : "text-gray-400"
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                  <AryaAvatar size={28} />
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Action Area */}
          <div className="border-t border-gray-100 bg-white">
            {/* Suggested questions — only show if no user messages yet */}
            {messages.length === 1 && !isTyping && (
              <div className="px-4 pt-3 space-y-1.5">
                <p className="text-xs text-gray-400 font-medium px-1">Try asking:</p>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="block w-full text-left text-xs px-3 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl hover:bg-orange-100 hover:border-orange-300 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="px-4 py-3 flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isTyping}
                  className="w-full pl-4 pr-4 py-2.5 bg-gray-100 rounded-full text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white hover:shadow-lg hover:shadow-orange-300/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>

            <p className="text-[10px] text-gray-400 text-center pb-2">
              Powered by DigitalBot.ai
            </p>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">
        {!isOpen && (
          <div className="bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200 animate-bounce-slow">
            <p className="text-xs font-semibold text-gray-700">Ask <span className="text-orange-500">Arya</span> anything 💬</p>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isOpen
              ? "bg-gray-800 hover:bg-gray-700"
              : "hover:shadow-orange-400/40 hover:shadow-2xl"
          }`}
          aria-label={isOpen ? "Close chat" : "Chat with Arya"}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative w-16 h-16 rounded-full overflow-hidden ring-[3px] ring-orange-400 hover:ring-orange-500 transition-all">
              <Image
                src="/images/female-real-estate.jpg"
                alt="Arya"
                width={192}
                height={192}
                className="object-cover w-full h-full"
                style={{ objectPosition: "68% 15%" }}
                priority
              />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 rounded-full border-2 border-white animate-pulse" />
            </div>
          )}
        </button>
      </div>

      {/* Pulse ring behind button when closed */}
      {!isOpen && (
        <div className="fixed z-[9998] w-16 h-16 rounded-full bg-orange-400/30 animate-ping pointer-events-none" style={{ bottom: '24px', right: '24px' }} />
      )}
    </>
  );
}
