"use client"

const brands = [
  { name: "Akira", tagline: "AI Care", mark: "A", accent: "text-orange-600", ring: "border-orange-200 bg-orange-50" },
  { name: "Healthiqure", tagline: "Patient Ops", mark: "Hq", accent: "text-cyan-700", ring: "border-cyan-200 bg-cyan-50" },
  { name: "Finora", tagline: "Finance Desk", mark: "F", accent: "text-blue-700", ring: "border-blue-200 bg-blue-50" },
  { name: "CloudKart", tagline: "Commerce AI", mark: "C", accent: "text-violet-700", ring: "border-violet-200 bg-violet-50" },
  { name: "EduSpring", tagline: "Admissions", mark: "E", accent: "text-emerald-700", ring: "border-emerald-200 bg-emerald-50" },
  { name: "RouteMint", tagline: "Logistics", mark: "R", accent: "text-amber-700", ring: "border-amber-200 bg-amber-50" },
  { name: "EstateFlow", tagline: "Realty CRM", mark: "Ef", accent: "text-sky-700", ring: "border-sky-200 bg-sky-50" },
  { name: "SalonIQ", tagline: "Bookings", mark: "S", accent: "text-pink-700", ring: "border-pink-200 bg-pink-50" },
  { name: "LegalLoop", tagline: "Case Desk", mark: "L", accent: "text-slate-700", ring: "border-slate-200 bg-slate-50" },
  { name: "TelePulse", tagline: "Support AI", mark: "T", accent: "text-teal-700", ring: "border-teal-200 bg-teal-50" },
  { name: "HotelNexa", tagline: "Guest Ops", mark: "N", accent: "text-rose-700", ring: "border-rose-200 bg-rose-50" },
  { name: "AutoHive", tagline: "Dealer Desk", mark: "Ah", accent: "text-indigo-700", ring: "border-indigo-200 bg-indigo-50" },
]

function BrandLogo({ brand }: { brand: (typeof brands)[number] }) {
  return (
    <div className="flex min-w-[170px] items-center justify-center gap-3 px-5 py-3 sm:min-w-[200px]">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl border text-base font-black ${brand.accent} ${brand.ring}`}>
        {brand.mark}
      </span>
      <span className="min-w-0">
        <span className={`block whitespace-nowrap text-xl font-black leading-none tracking-normal ${brand.accent}`}>
          {brand.name}
        </span>
        <span className="mt-1 block whitespace-nowrap text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {brand.tagline}
        </span>
      </span>
    </div>
  )
}

export default function TrustedBrands() {
  const marqueeBrands = [...brands, ...brands]

  return (
    <section className="relative overflow-hidden bg-white pt-5 sm:pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-base">
            Trusted by growing teams
          </p>
        </div>
      </div>

      <div className="relative pb-5 sm:pb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent sm:w-32" />

        <div className="marquee overflow-hidden">
          <div className="marquee-track flex w-max items-center">
            {marqueeBrands.map((brand, index) => (
              <BrandLogo key={`${brand.name}-${index}`} brand={brand} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: logo-marquee 38s linear infinite;
        }

        .marquee:hover .marquee-track {
          animation-play-state: paused;
        }

        @keyframes logo-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}
