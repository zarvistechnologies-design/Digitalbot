export function PageBackground() {
    return (
        <>
            {/* Subtle grid background with orange tones */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, rgba(99, 102, 241, 0.2) 1px, transparent 1px), " +
                            "linear-gradient(to bottom, rgba(139, 92, 246, 0.2) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                        filter: "drop-shadow(0 0 3px rgba(99, 102, 241, 0.15)) drop-shadow(0 0 3px rgba(139, 92, 246, 0.15))"
                    }}
                />
            </div>

            {/* Subtle Gradient Orbs - orange/Violet Theme */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-gradient-radial from-orange-500/10 to-transparent rounded-full blur-3xl shadow-[0_0_100px_rgba(99,102,241,0.15)]"></div>
                <div className="absolute bottom-[10%] right-[5%] w-[700px] h-[700px] bg-gradient-radial from-violet-500/8 to-transparent rounded-full blur-3xl shadow-[0_0_120px_rgba(139,92,246,0.12)]"></div>
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-orange-400/8 to-transparent rounded-full blur-3xl shadow-[0_0_80px_rgba(99,102,241,0.1)]"></div>
            </div>
        </>
    )
}
