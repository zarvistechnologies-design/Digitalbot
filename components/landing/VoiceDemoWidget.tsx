"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mic, Phone, PhoneOff, Sparkles, Volume2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const VAPI_PUBLIC_KEY = "00119fad-8530-413f-9699-e47cada57939";
const VAPI_ASSISTANT_ID = "9ca19724-1f6c-48d1-8c62-a6107d585592";

type MicPermission = "granted" | "denied" | "pending";

export default function VoiceDemoWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [vapiLoaded, setVapiLoaded] = useState(false);
  const [micPermission, setMicPermission] = useState<MicPermission>("pending");
  const [transcript, setTranscript] = useState(
    "Click 'Start Voice Demo' to begin talking with our AI assistant. Speak clearly and naturally!"
  );
  const [callStatus, setCallStatus] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const vapiRef = useRef<any>(null);
  const originalConsoleErrorRef = useRef<typeof console.error | null>(null);

  const [soundBars] = useState(() =>
    Array.from({ length: 8 }, () => Math.random())
  );

  const cleanupTimers = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
  };

  const resetUi = () => {
    setIsCallActive(false);
    setIsSpeaking(false);
    setIsConnecting(false);
    setCallDuration(0);
    setVolumeLevel(0);
    cleanupTimers();
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (vapiRef.current) return;

    originalConsoleErrorRef.current = console.error;
    console.error = (...args: any[]) => {
      const errorMessage = args[0]?.toString?.() || "";
      if (
        errorMessage.includes("setSinkId") ||
        errorMessage.includes("unsupported input processor") ||
        errorMessage.includes("AbortError") ||
        errorMessage.includes("Meeting has ended") ||
        errorMessage.includes("Meeting ended") ||
        errorMessage.includes("ejection") ||
        errorMessage.includes("krisp") ||
        errorMessage.includes("WASM") ||
        errorMessage.includes("unloading")
      ) {
        return;
      }
      originalConsoleErrorRef.current?.apply(console, args);
    };

    const init = async () => {
      try {
        const VapiModule = await import("@vapi-ai/web");
        const vapi = new VapiModule.default(VAPI_PUBLIC_KEY);
        vapiRef.current = vapi;
        setVapiLoaded(true);

        vapi.on("call-start", () => {
          setIsCallActive(true);
          setIsConnecting(false);
          setTranscript("✓ Connected! I'm listening — speak now...");
          setCallStatus("Active - Listening");
          setCallDuration(0);

          cleanupTimers();
          callTimerRef.current = setInterval(() => {
            setCallDuration((prev) => prev + 1);
          }, 1000);
        });

        vapi.on("call-end", () => {
          resetUi();
          setIsConnecting(false);
          setTranscript("Call ended. Click to start again!");
          setCallStatus("Call ended");
        });

        vapi.on("speech-start", () => {
          setIsSpeaking(true);
          setCallStatus("Assistant speaking...");
          volumeIntervalRef.current = setInterval(() => {
            setVolumeLevel(Math.random() * 100);
          }, 120);
        });

        vapi.on("speech-end", () => {
          setIsSpeaking(false);
          setCallStatus("Active - Listening");
          setVolumeLevel(0);
          if (volumeIntervalRef.current) {
            clearInterval(volumeIntervalRef.current);
            volumeIntervalRef.current = null;
          }
        });

        vapi.on("volume-level", (level: number) => {
          if (typeof level === "number") setVolumeLevel(level);
        });

        vapi.on("message", (message: any) => {
          if (!message) return;

          if (message.type === "transcript") {
            const text = message.transcript || message.transcriptText || "";
            if (!text) return;

            if (message.transcriptType === "final") {
              if (message.role === "user") {
                setTranscript(`You: ${text}`);
              } else if (message.role === "assistant") {
                setTranscript(`AI: ${text}`);
              } else {
                setTranscript(text);
              }
            } else if (message.transcriptType === "partial") {
              const who = message.role === "user" ? "You" : "AI";
              setTranscript(`${who}: ${text}...`);
            }
            return;
          }

          if (message.type === "speech-update") {
            if (message.status === "started") {
              setCallStatus(message.role === "user" ? "Listening..." : "Speaking...");
            }
            return;
          }
        });

        vapi.on("error", (error: any) => {
          const errorMsg =
            error?.message || error?.error?.message || "Unknown error";
          resetUi();
          setCallStatus(`Error: ${errorMsg}`);
          setTranscript(`Voice demo error: ${errorMsg}`);
        });
      } catch {
        setCallStatus("Failed to initialize voice assistant");
      }
    };

    init();

    return () => {
      if (originalConsoleErrorRef.current) console.error = originalConsoleErrorRef.current;
      cleanupTimers();
      try {
        vapiRef.current?.stop?.();
      } catch {}
      vapiRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (micPermission !== "pending") return;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((t) => t.stop());
        setMicPermission("granted");
        setCallStatus("Ready");
      })
      .catch(() => {
        setMicPermission("denied");
        setCallStatus("Microphone access needed");
        setTranscript("Please allow microphone access to use the voice assistant.");
      });
  }, [isOpen, micPermission]);

  const startCall = async () => {
    if (!vapiRef.current || !vapiLoaded) {
      setCallStatus("Initializing...");
      return;
    }

    if (micPermission === "denied") {
      setCallStatus("Microphone permission denied");
      setTranscript("Please allow microphone access and refresh the page.");
      return;
    }

    if (micPermission === "pending") {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
        setMicPermission("granted");
      } catch {
        setMicPermission("denied");
        setCallStatus("Microphone permission denied");
        setTranscript("Please allow microphone access to use the voice assistant.");
        return;
      }
    }

    try {
      setIsConnecting(true);
      setCallStatus("Connecting...");
      setTranscript("Connecting to AI assistant...");

      await vapiRef.current.start(VAPI_ASSISTANT_ID, {
        clientMessages: ["transcript", "speech-update", "volume-level"],
      });
    } catch (error: any) {
      const errorMsg =
        error?.message || error?.error?.message || "Unknown error";
      resetUi();
      setCallStatus(`Failed: ${errorMsg}`);
      setTranscript(`Failed to start call: ${errorMsg}. Please try again.`);
    }
  };

  const endCall = () => {
    try {
      vapiRef.current?.stop?.();
      setCallStatus("Stopping call...");
    } catch {}
    resetUi();
    setTranscript("Call ended. Click to start again!");
    setCallStatus("Call ended");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-2xl shadow-orange-500/40 flex items-center justify-center hover:scale-110 transition-transform group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(249, 115, 22, 0.35)",
            "0 0 40px rgba(249, 115, 22, 0.55)",
            "0 0 20px rgba(249, 115, 22, 0.35)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        type="button"
      >
        <Mic className="h-7 w-7 text-white" />
        <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-20" />
        <span className="absolute -inset-1 rounded-full border-2 border-orange-400/50 animate-pulse" />
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Try AI Voice Demo
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => !isCallActive && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-gradient-to-br from-slate-900 via-orange-900/90 to-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-orange-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  endCall();
                  setIsOpen(false);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                type="button"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-full mb-4">
                  <Sparkles className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-300 text-sm font-medium">
                    Live AI Demo
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Talk to DigitalBot
                </h3>
                <p className="text-gray-400 text-sm">
                  Experience our AI voice assistant in real-time
                </p>
              </div>

              <div className="relative h-32 flex items-center justify-center mb-8">
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    isCallActive ? "bg-orange-500/10" : "bg-gray-800/50"
                  }`}
                />
                <div className="flex items-center gap-1 h-16">
                  {soundBars.map((height, i) => (
                    <motion.div
                      key={i}
                      className={`w-2 rounded-full ${
                        isCallActive
                          ? "bg-gradient-to-t from-orange-500 to-orange-400"
                          : "bg-gray-600"
                      }`}
                      animate={{
                        height: isSpeaking
                          ? [16, 32 + height * 32, 16]
                          : isCallActive
                          ? [12, 20, 12]
                          : 16,
                      }}
                      transition={{
                        duration: 0.3,
                        repeat: Infinity,
                        delay: i * 0.05,
                      }}
                    />
                  ))}
                </div>

                {isConnecting && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="bg-black/30 rounded-2xl p-4 mb-6 min-h-[80px]">
                <div className="flex items-start gap-2">
                  <Volume2 className="h-4 w-4 text-orange-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {transcript}
                  </p>
                </div>
              </div>

              {isCallActive && (
                <div className="text-center mb-4">
                  <span className="text-orange-400 font-mono text-lg">
                    {formatTime(callDuration)}
                  </span>
                </div>
              )}

              <motion.button
                onClick={isCallActive ? endCall : startCall}
                disabled={isConnecting}
                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  isCallActive
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white"
                } ${isConnecting ? "opacity-50 cursor-not-allowed" : ""}`}
                whileHover={{ scale: isConnecting ? 1 : 1.02 }}
                whileTap={{ scale: isConnecting ? 1 : 0.98 }}
                type="button"
              >
                {isConnecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : isCallActive ? (
                  <>
                    <PhoneOff className="h-5 w-5" />
                    End Call
                  </>
                ) : (
                  <>
                    <Phone className="h-5 w-5" />
                    Start Voice Demo
                  </>
                )}
              </motion.button>

              <div className="flex justify-center gap-6 mt-6 text-xs text-gray-500">
                <span>🌍 Multilingual</span>
                <span>⚡ Real-time</span>
                <span>🔒 Secure</span>
              </div>

              {isCallActive && (
                <div className="mt-3 text-center text-xs text-gray-500">
                  Input level: {Math.round(volumeLevel)}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}