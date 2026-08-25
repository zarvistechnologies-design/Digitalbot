import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  Headphones,
  Microscope,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

const services = [
  {
    title: "Event Booking CRM",
    service: "event-booking-crm",
    icon: CalendarDays,
    soft: "bg-amber-50 text-amber-700 ring-amber-200",
    summary: "Bookings, venues, campaigns, and follow-ups.",
  },
  {
    title: "Pathology Diagnostic",
    service: "pathology-diagnostic",
    icon: Microscope,
    soft: "bg-teal-50 text-teal-700 ring-teal-200",
    summary: "Patients, samples, reports, and lab bookings.",
  },
  {
    title: "Lead Analysis",
    service: "lead-analysis",
    icon: BarChart3,
    soft: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    summary: "Lead capture, qualification, and call insights.",
  },
  {
    title: "Real Estate CRM",
    service: "real-estate-crm",
    icon: Building2,
    soft: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    summary: "Properties, buyer pipeline, site visits, and AI lead qualification.",
  },
  {
    title: "Customer Support",
    service: "customer-support",
    icon: Headphones,
    soft: "bg-rose-50 text-rose-700 ring-rose-200",
    summary: "Support agents, campaigns, and customer records.",
  },
  {
    title: "Doctor Dashboard",
    service: "doctor-dashboard",
    icon: Stethoscope,
    soft: "bg-orange-50 text-orange-700 ring-orange-200",
    summary: "Doctors, appointments, calls, and connectors.",
  },
];

export default function GetStartedPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf8] text-slate-950 lg:h-screen lg:overflow-hidden">
      <div className="grid min-h-screen lg:h-screen lg:grid-cols-[minmax(0,0.88fr)_minmax(600px,1.12fr)]">
        <section className="relative hidden h-screen overflow-hidden border-r border-orange-100 lg:block">
            <Image
              src="/images/get-started-team-v2.png"
              alt="A service operations team collaborating in a modern office"
              fill
              priority
              sizes="(min-width: 1280px) 50vw, 50vw"
              quality={88}
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-slate-950/80" />
            <Link href="/" className="absolute left-8 top-7 z-10 inline-flex rounded-xl bg-white/95 px-4 py-2 shadow-lg backdrop-blur">
              <Image
                src="https://res.cloudinary.com/dew9qfpbl/image/upload/v1762971494/Gemini_Generated_Image_a19f1ha19f1ha19f-Kittl_b9jogz.svg"
                alt="DigitalBot.AI"
                width={1450}
                height={460}
                priority
                className="h-8 w-auto"
              />
            </Link>

          <div className="absolute inset-x-0 bottom-0 p-9 xl:p-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-orange-300" /> Built for focused teams
            </span>
            <h1 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">
              One platform. A workspace made for you.
            </h1>
            <p className="mt-3 max-w-lg text-xs leading-5 text-slate-200 xl:text-sm">
              Select your starting point and launch a dashboard tailored to the way your team works.
            </p>
            <div className="mt-5 inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-white backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-teal-300" /> Secure setup in just a few minutes
            </div>
          </div>
        </section>

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-7 sm:px-8 lg:h-screen lg:min-h-0 lg:px-12 xl:px-16">
          <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-teal-100/45 blur-3xl" />
          <div className="relative w-full max-w-3xl">
            <div className="mb-8 flex items-center justify-between gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-orange-700 hover:shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-700"
              >
                Login
              </Link>
            </div>

            <div className="mb-7 lg:hidden">
              <Image
                src="https://res.cloudinary.com/dew9qfpbl/image/upload/v1762971494/Gemini_Generated_Image_a19f1ha19f1ha19f-Kittl_b9jogz.svg"
                alt="DigitalBot.AI"
                width={1450}
                height={460}
                priority
                className="h-11 w-auto"
              />
            </div>

            <div className="mb-7">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-700">
                <span className="h-px w-7 bg-orange-500" /> Get started
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">What would you like to manage?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Pick a workspace to personalize your signup and dashboard.
              </p>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.service}
                    href={"/signup?service=" + service.service}
                    className={`group relative flex min-h-[108px] flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_6px_24px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_12px_32px_rgba(249,115,22,0.12)] ${index === services.length - 1 ? 'sm:col-span-2 sm:min-h-[90px] sm:flex-row sm:items-center' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className={["grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1", service.soft].join(" ")}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="font-mono text-[10px] font-bold text-slate-300">0{index + 1}</span>
                    </div>
                    <div className={`mt-3 min-w-0 ${index === services.length - 1 ? 'sm:mt-0 sm:flex-1 sm:px-4' : ''}`}>
                      <h3 className="text-sm font-bold text-slate-950">{service.title}</h3>
                      <p className="mt-0.5 text-[11px] leading-4 text-slate-500">{service.summary}</p>
                    </div>
                    <span className={`absolute bottom-3 right-3 grid h-7 w-7 place-items-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-orange-600 group-hover:text-white ${index === services.length - 1 ? 'sm:static' : ''}`}>
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                );
              })}
            </div>

            <p className="mt-5 text-center text-xs text-slate-400">
              You can add integrations and invite teammates after signup.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
