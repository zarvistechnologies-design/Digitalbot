export function PageBackground() {
    return (
        <>
            {/* Subtle grid background with sky tones */}
            <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, rgba(249, 115, 22, 0.4) 1px, transparent 1px), " +
                            "linear-gradient(to bottom, rgba(251, 146, 60, 0.4) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                        filter: "drop-shadow(0 0 3px rgba(249, 115, 22, 0.3)) drop-shadow(0 0 3px rgba(251, 146, 60, 0.3))"
                    }}
                />
            </div>

            {/* Subtle Gradient Orbs - sky Theme */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-gradient-radial from-sky-500/15 to-transparent rounded-full blur-3xl shadow-[0_0_100px_rgba(249,115,22,0.3)]"></div>
                <div className="absolute bottom-[10%] right-[5%] w-[700px] h-[700px] bg-gradient-radial from-sky-600/12 to-transparent rounded-full blur-3xl shadow-[0_0_120px_rgba(249,115,22,0.25)]"></div>
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-sky-500/10 to-transparent rounded-full blur-3xl shadow-[0_0_80px_rgba(249,115,22,0.2)]"></div>
            </div>
        </>
    )
}
