"use client";

import { Loader2, Phone, Send, User, X } from "lucide-react";
import Image from "next/image";
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

type Step = "greeting" | "service-type" | "voice-services" | "whatsapp-services" | "collect-name" | "collect-phone" | "submitting" | "done";

const voiceServices = [
  "AI Voice Bot",
  "Voice AI for Business",
  "Voice Automation",
  "Conversational AI",
  "AI Customer Support",
  "AI Call Center",
  "AI Sales Agent",
  "Virtual Receptionist",
];

const whatsappServices = [
  "Education",
  "Car Dealership",
  "Real Estate",
  "Coaching",
  "Automobile",
  "Marketing",
  "Insurance",
  "Consulting",
  "Healthcare",
  "Accounting & Legal",
  "SaaS",
  "Financial Services",
  "E-commerce",
  "IT Services",
  "BPO",
  "Recruitment",
];

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<Step>("greeting");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: "Hi there! \ud83d\udc4b I'm Arya, your AI assistant at DigitalBot. I help businesses automate conversations with AI.\n\nWhat service are you interested in?",
        sender: "bot",
        time: getTime(),
      },
    ]);
    setStep("service-type");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, step]);

  useEffect(() => {
    if (step === "collect-name" && nameRef.current) nameRef.current.focus();
    if (step === "collect-phone" && phoneRef.current) phoneRef.current.focus();
  }, [step]);

  const addBotMessage = (text: string) => {
    return new Promise<void>((resolve) => {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + Math.random(), text, sender: "bot", time: getTime() },
        ]);
        setIsTyping(false);
        resolve();
      }, 800);
    });
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text, sender: "user", time: getTime() },
    ]);
  };

  const handleServiceTypeSelect = async (type: string) => {
    const label = type === "voice" ? "\ud83c\udf99\ufe0f Voice AI Agent" : "\ud83d\udcac WhatsApp Bot Agent";
    addUserMessage(label);
    setSelectedServiceType(type);

    const services = type === "voice" ? voiceServices : whatsappServices;
    const serviceList = services.map((s, i) => `${i + 1}. ${s}`).join("\n");
    await addBotMessage(
      `Great choice! Here are our ${type === "voice" ? "Voice AI" : "WhatsApp Bot"} services:\n\n${serviceList}\n\nWhich service interests you?`
    );
    setStep(type === "voice" ? "voice-services" : "whatsapp-services");
  };

  const handleServiceSelect = async (service: string) => {
    addUserMessage(service);
    setSelectedService(service);
    await addBotMessage(
      `Excellent! "${service}" is one of our most popular solutions. \ud83d\ude80\n\nLet me connect you with our team. Could you share your name?`
    );
    setStep("collect-name");
  };

  const handleNameSubmit = async () => {
    if (!userName.trim()) return;
    const name = userName.trim();
    addUserMessage(name);
    setUserName(name);
    await addBotMessage(`Nice to meet you, ${name}! \ud83d\ude4f\n\nPlease share your phone number so our team can reach you.`);
    setStep("collect-phone");
  };

  const handlePhoneSubmit = async () => {
    if (!userPhone.trim() || userPhone.trim().length < 7) return;
    const phone = userPhone.trim();
    addUserMessage(phone);
    setStep("submitting");

    try {
      setIsSubmitting(true);
      const submitData = new FormData();
      submitData.append("access_key", "8f0556d8-66c3-4e2d-810e-5de948aff5ce");
      submitData.append("subject", `Chatbot Lead: ${userName} - ${selectedServiceType === "voice" ? "Voice AI" : "WhatsApp Bot"} - ${selectedService}`);
      submitData.append("from_name", "DigitalBot Chatbot");
      submitData.append("name", userName);
      submitData.append("phone", phone);
      submitData.append("message", `Service Type: ${selectedServiceType === "voice" ? "Voice AI Agent" : "WhatsApp Bot Agent"}\nService: ${selectedService}\nSource: Website Chatbot`);
      submitData.append("redirect", "false");
      submitData.append("to", "hello@metic.ai");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: submitData,
      });
      const data = await response.json();

      if (data.success) {
        await addBotMessage(
          `Thank you, ${userName}! \u2705\n\nWe've received your request for "${selectedService}". Our team will contact you shortly at ${phone}.\n\nIs there anything else I can help you with?`
        );
        setStep("done");
      } else {
        throw new Error("Submission failed");
      }
    } catch {
      await addBotMessage(
        "Sorry, something went wrong. Please try again or email us directly at hello@metic.ai"
      );
      setStep("collect-phone");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = async () => {
    addUserMessage("Start over");
    setSelectedServiceType("");
    setSelectedService("");
    setUserName("");
    setUserPhone("");
    await addBotMessage("Sure! What service are you interested in?");
    setStep("service-type");
  };

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
                <h3 className="text-white font-bold text-sm">Arya</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                  <span className="text-white/80 text-xs">Online now</span>
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
            {/* Service Type Selection */}
            {step === "service-type" && !isTyping && (
              <div className="px-4 py-3 space-y-2">
                <button
                  onClick={() => handleServiceTypeSelect("voice")}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all text-left"
                >
                  <span className="text-2xl">{"\ud83c\udf99\ufe0f"}</span>
                  <div>
                    <p className="text-sm font-semibold text-orange-800">Voice AI Agent</p>
                    <p className="text-xs text-orange-600">AI-powered phone calls & IVR</p>
                  </div>
                </button>
                <button
                  onClick={() => handleServiceTypeSelect("whatsapp")}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all text-left"
                >
                  <span className="text-2xl">{"\ud83d\udcac"}</span>
                  <div>
                    <p className="text-sm font-semibold text-orange-800">WhatsApp Bot Agent</p>
                    <p className="text-xs text-orange-600">Automated WhatsApp messaging</p>
                  </div>
                </button>
              </div>
            )}

            {/* Voice Services Selection */}
            {step === "voice-services" && !isTyping && (
              <div className="px-4 py-3 max-h-[220px] overflow-y-auto">
                <div className="grid grid-cols-2 gap-1.5">
                  {voiceServices.map((service) => (
                    <button
                      key={service}
                      onClick={() => handleServiceSelect(service)}
                      className="text-xs px-3 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg hover:bg-orange-100 hover:border-orange-300 transition-all text-left"
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp Services Selection */}
            {step === "whatsapp-services" && !isTyping && (
              <div className="px-4 py-3 max-h-[220px] overflow-y-auto">
                <div className="grid grid-cols-2 gap-1.5">
                  {whatsappServices.map((service) => (
                    <button
                      key={service}
                      onClick={() => handleServiceSelect(service)}
                      className="text-xs px-3 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg hover:bg-orange-100 hover:border-orange-300 transition-all text-left"
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Name Input */}
            {step === "collect-name" && !isTyping && (
              <div className="px-4 py-3">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleNameSubmit(); }}
                  className="flex items-center gap-2"
                >
                  <div className="flex-1 relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={nameRef}
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name..."
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-full text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!userName.trim()}
                    className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white hover:shadow-lg hover:shadow-orange-300/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Phone Input */}
            {step === "collect-phone" && !isTyping && (
              <div className="px-4 py-3">
                <form
                  onSubmit={(e) => { e.preventDefault(); handlePhoneSubmit(); }}
                  className="flex items-center gap-2"
                >
                  <div className="flex-1 relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={phoneRef}
                      type="tel"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="Enter your phone number..."
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-full text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!userPhone.trim() || userPhone.trim().length < 7}
                    className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white hover:shadow-lg hover:shadow-orange-300/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Submitting */}
            {step === "submitting" && (
              <div className="px-4 py-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting your details...
              </div>
            )}

            {/* Done - Restart option */}
            {step === "done" && !isTyping && (
              <div className="px-4 py-3">
                <button
                  onClick={handleRestart}
                  className="w-full text-xs px-4 py-2.5 bg-orange-50 border border-orange-200 text-orange-600 rounded-full hover:bg-orange-100 hover:border-orange-300 transition-all font-medium"
                >
                  Explore another service
                </button>
              </div>
            )}

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
            <p className="text-xs font-semibold text-gray-700">Chat with <span className="text-orange-500">Arya</span> 👋</p>
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
