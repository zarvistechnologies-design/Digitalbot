import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Headphones,
  Microscope,
  Sparkles,
  Stethoscope,
} from "lucide-react";

const services = [
  {
    title: "Event Booking CRM",
    service: "event-booking-crm",
    icon: CalendarDays,
    accent: "bg-amber-500",
    summary: "Bookings, venues, campaigns, and follow-ups.",
  },
  {
    title: "Pathology Diagnostic",
    service: "pathology-diagnostic",
    icon: Microscope,
    accent: "bg-teal-600",
    summary: "Patients, samples, reports, and lab bookings.",
  },
  {
    title: "Lead Analysis",
    service: "lead-analysis",
    icon: BarChart3,
    accent: "bg-indigo-600",
    summary: "Lead capture, qualification, and call insights.",
  },
  {
    title: "Customer Support",
    service: "customer-support",
    icon: Headphones,
    accent: "bg-rose-600",
    summary: "Support agents, campaigns, and customer records.",
  },
  {
    title: "Doctor Dashboard",
    service: "doctor-dashboard",
    icon: Stethoscope,
    accent: "bg-orange-600",
    summary: "Doctors, appointments, calls, and connectors.",
  },
];

export default function GetStartedPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950 lg:h-screen lg:overflow-hidden">
      <div className="grid min-h-screen lg:h-screen lg:grid-cols-[minmax(0,0.98fr)_minmax(560px,1.02fr)]">
        <section className="hidden h-screen overflow-hidden bg-slate-950 lg:flex lg:flex-col">
          <div className="px-10 pb-5 pt-9 xl:px-14 xl:pt-11">
            <div className="flex items-center justify-between gap-6">
              <Link href="/" className="inline-flex items-center">
                <Image
                  src="https://res.cloudinary.com/dew9qfpbl/image/upload/v1762971494/Gemini_Generated_Image_a19f1ha19f1ha19f-Kittl_b9jogz.svg"
                  alt="DigitalBot.AI"
                  width={1450}
                  height={460}
                  priority
                  className="h-14 w-auto sm:h-16 drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
                />
              </Link>
              <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/15">
                <Sparkles className="h-4 w-4 text-orange-300" />
                Service workspaces
              </span>
            </div>

            <div className="mt-7 max-w-2xl">
              <h1 className="text-4xl font-bold leading-tight text-white">
                Choose the workspace built for your team.
              </h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-slate-300">
                Start with one focused dashboard, then connect your team, records, and voice workflow.
              </p>
            </div>
          </div>

          <div className="min-h-0 flex-1 px-10 pb-8 xl:px-14">
            <div className="relative h-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
              <Image
              src="/images/get-started-team-v2.png"
              alt="A service operations team collaborating in a modern office"
              fill
              priority
              sizes="(min-width: 1280px) 50vw, 50vw"
              quality={82}
              className="object-contain object-top"
              />
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-8 lg:h-screen lg:min-h-0 lg:px-12 lg:pr-24">
          <div className="w-full max-w-2xl">
            <div className="mb-7 flex items-center justify-between gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-700"
              >
                Login
              </Link>
            </div>

            <div className="mb-6 lg:hidden">
              <Image
                src="https://res.cloudinary.com/dew9qfpbl/image/upload/v1762971494/Gemini_Generated_Image_a19f1ha19f1ha19f-Kittl_b9jogz.svg"
                alt="DigitalBot.AI"
                width={1450}
                height={460}
                priority
                className="h-14 w-auto"
              />
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-700">Get Started</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">Choose your workspace</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your selection will be locked into the signup form.
              </p>
            </div>

            <div className="grid gap-3">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.service}
                    href={"/signup?service=" + service.service}
                    className="group flex min-h-[76px] items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
                  >
                    <span className={["grid h-11 w-11 shrink-0 place-items-center rounded-md text-white shadow-sm", service.accent].join(" ")}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-slate-950">{service.title}</h3>
                      <p className="mt-0.5 truncate text-sm text-slate-500">{service.summary}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-orange-600" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}