"use client"

import { Pause, Play } from "lucide-react"
import { useRef, useState } from "react"

const WAVEFORM_HEIGHTS = Array.from({ length: 40 }, (_, i) => Math.sin(i * 0.5))

interface VoiceConversationPlayerProps {
  audioSrc: string
}

export function VoiceConversationPlayer({ audioSrc }: VoiceConversationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      void audio.play()
    }
    setIsPlaying((prev) => !prev)
  }

  return (
    <div className="bg-white/90 backdrop-blur-md p-4 shadow-2xl border border-indigo-200 relative overflow-hidden" style={{
      clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
    }}>
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-indigo-100/10 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-center mb-4 h-16 bg-gradient-to-br from-indigo-200/10 to-indigo-100/20 border border-indigo-200 relative overflow-hidden" style={{
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
        }}>
          <div className="flex items-end justify-center gap-1 h-12">
            {WAVEFORM_HEIGHTS.map((sinValue, index) => {
              const playingHeight = sinValue * 15 + 20
              const idleHeight = sinValue * 10 + 12
              const height = isPlaying ? playingHeight : idleHeight

              return (
                <div
                  key={index}
                  className={
                    isPlaying
                      ? "w-1 bg-gradient-to-t from-indigo-600 via-indigo-500 to-indigo-400 rounded-full transition-all duration-300"
                      : "w-1 bg-gradient-to-t from-indigo-600/30 via-indigo-500/20 to-indigo-400/10 rounded-full"
                  }
                  style={{
                    height: `${height}px`,
                    animation: isPlaying
                      ? `sound-wave ${0.5 + (index % 3) * 0.2}s ease-in-out infinite`
                      : undefined,
                    animationDelay: isPlaying ? `${index * 0.05}s` : undefined,
                    boxShadow: isPlaying ? '0 0 4px rgba(99, 102, 241, 0.3)' : undefined
                  }}
                />
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={handlePlayPause}
            className="group relative flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white shadow-xl hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-300 overflow-hidden border border-indigo-400 uppercase tracking-wide text-xs font-bold"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
            }}
            aria-label={isPlaying ? "Pause voice AI demonstration" : "Play voice AI for business sample conversation"}
            type="button"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/30 to-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-2">
              {isPlaying ? <Pause className="w-3 h-3 animate-pulse" /> : <Play className="w-3 h-3" />}
              <span className="font-bold">
                {isPlaying ? "Pause AI Demo" : "Play AI Demo"}
              </span>
            </div>
          </button>
        </div>
      </div>

      <audio ref={audioRef} src={audioSrc} onEnded={() => setIsPlaying(false)} aria-label="Voice AI for business sample conversation audio" />

      <style jsx>{`
        @keyframes sound-wave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  )
}
