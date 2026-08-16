import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Headphones,
  Microscope,
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
    <main className="min-h-screen bg-white text-slate-950 lg:h-screen lg:overflow-hidden">
      <div className="grid min-h-screen lg:h-screen lg:grid-cols-[minmax(0,0.98fr)_minmax(560px,1.02fr)]">
        <section className="hidden h-screen overflow-hidden border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="relative min-h-0 flex-1">
            <Image
              src="/images/get-started-team-v2.png"
              alt="A service operations team collaborating in a modern office"
              fill
              priority
              sizes="(min-width: 1280px) 50vw, 50vw"
              quality={82}
              className="object-cover object-center"
            />
            <Link href="/" className="absolute left-8 top-5 z-10 inline-flex">
              <Image
                src="https://res.cloudinary.com/dew9qfpbl/image/upload/v1762971494/Gemini_Generated_Image_a19f1ha19f1ha19f-Kittl_b9jogz.svg"
                alt="DigitalBot.AI"
                width={1450}
                height={460}
                priority
                className="h-9 w-auto"
              />
            </Link>
          </div>
          <div className="shrink-0 px-10 py-7 xl:px-12 xl:py-8">
            <h1 className="max-w-xl text-3xl font-bold leading-tight text-slate-950 xl:text-4xl">
              Choose the workspace built for your team.
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
              Start with one focused dashboard, then connect your team, records, and voice workflow.
            </p>
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