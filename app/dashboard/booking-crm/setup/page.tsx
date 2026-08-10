"use client";

import Sidebar from "@/components/Sidebar";
import { bookingCrmAPI } from "@/lib/api";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Camera,
  Check,
  GraduationCap,
  Hotel,
  Loader2,
  Menu,
  PackageOpen,
  Scissors,
  Trophy,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CachedUser {
  selectedService?: string;
  bookingOnboardingComplete?: boolean;
  bookingBusinessType?: string;
}

interface BusinessOption {
  value: string;
  label: string;
  note: string;
  icon: LucideIcon;
}

const bookingServices = new Set(["booking-crm", "event-booking-crm"]);

const businessOptions: BusinessOption[] = [
  { value: "workshop", label: "Workshop / training", note: "Registrations, attendees, venues, and seat capacity", icon: GraduationCap },
  { value: "events", label: "Event organizer", note: "Event enquiries, packages, venues, and schedules", icon: CalendarDays },
  { value: "venue", label: "Venue / banquet", note: "Venue inventory, packages, clients, and events", icon: Building2 },
  { value: "salon", label: "Salon / spa", note: "Appointments, clients, services, and team calendars", icon: Scissors },
  { value: "hotel", label: "Hotel / stays", note: "Reservations, guests, room types, and rooms", icon: Hotel },
  { value: "restaurant", label: "Restaurant", note: "Reservations, guests, dining services, and tables", icon: Utensils },
  { value: "photography", label: "Photography", note: "Shoots, clients, packages, and photographers", icon: Camera },
  { value: "rental", label: "Rental", note: "Rental bookings, customers, services, and items", icon: PackageOpen },
  { value: "sports", label: "Sports facility", note: "Sessions, players, activities, and courts", icon: Trophy },
  { value: "training", label: "Coach / classes", note: "Enrollments, students, courses, and classes", icon: BriefcaseBusiness },
];

function updateCachedUser(businessType: string) {
  const raw = localStorage.getItem("user");
  if (!raw) return;
  const user = JSON.parse(raw) as CachedUser;
  localStorage.setItem("user", JSON.stringify({
    ...user,
    bookingOnboardingComplete: true,
    bookingBusinessType: businessType,
  }));
}

export default function BookingCrmSetupPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessName, setBusinessName] = useState("DigitalBot Booking Workspace");
  const [businessType, setBusinessType] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const run = async () => {
      const raw = localStorage.getItem("user");
      const user = raw ? JSON.parse(raw) as CachedUser : null;
      if (!bookingServices.has(String(user?.selectedService || "").toLowerCase())) {
        router.replace("/dashboard");
        return;
      }

      try {
        const response = await bookingCrmAPI.getProfile();
        const profile = response.data.profile;
        if (!active) return;
        setBusinessName(profile?.businessName || "DigitalBot Booking Workspace");
        if (profile?.onboardingComplete) {
          updateCachedUser(profile.businessType);
          router.replace("/dashboard/booking-crm");
          return;
        }
      } catch (setupError: any) {
        if (active) setError(setupError.response?.data?.error || "Could not load business setup");
      } finally {
        if (active) setChecking(false);
      }
    };
    void run();
    return () => { active = false; };
  }, [router]);

  const completeSetup = async () => {
    if (!businessType) return;
    try {
      setSaving(true);
      setError(null);
      const response = await bookingCrmAPI.completeOnboarding({ businessType, businessName: businessName.trim() || "DigitalBot Booking Workspace" });
      updateCachedUser(response.data.profile.businessType);
      router.replace("/dashboard/booking-crm");
    } catch (setupError: any) {
      setError(setupError.response?.data?.error || "Could not create your booking workspace");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      {!sidebarOpen && (
        <button aria-label="Open navigation" onClick={() => setSidebarOpen(true)} className="fixed left-4 top-4 z-40 grid h-11 w-11 place-items-center rounded-md border border-zinc-200 bg-white shadow-sm lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
      )}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="lg:pl-64">
        <header className="border-b border-zinc-200 bg-white">
          <div className="px-4 pb-6 pt-20 sm:px-6 lg:px-8 lg:pt-7">
            <p className="text-xs font-semibold uppercase text-orange-700">Booking Workspace setup</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Choose your business</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-500">This choice sets the workspace terminology and booking behavior for this account.</p>
          </div>
        </header>

        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {checking ? (
            <div className="flex min-h-[420px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-600" /></div>
          ) : (
            <div className="mx-auto max-w-5xl">
              {error && <div className="mb-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">{error}</div>}

              <section className="border-b border-zinc-200 pb-6">
                <label className="block max-w-xl">
                  <span className="mb-1.5 block text-sm font-semibold text-zinc-700">Workspace name</span>
                  <input value={businessName} onChange={(event) => setBusinessName(event.target.value)} className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                </label>
              </section>

              <section className="py-6">
                <h2 className="text-sm font-bold">Business type</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {businessOptions.map((option) => {
                    const Icon = option.icon;
                    const selected = businessType === option.value;
                    return (
                      <button key={option.value} type="button" onClick={() => setBusinessType(option.value)} aria-pressed={selected} className={`min-h-[112px] rounded-md border p-4 text-left transition-colors ${selected ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100" : "border-zinc-200 bg-white hover:border-zinc-300"}`}>
                        <div className="flex items-start gap-3">
                          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded ${selected ? "bg-orange-600 text-white" : "bg-zinc-100 text-zinc-600"}`}><Icon className="h-5 w-5" /></span>
                          <span className="min-w-0 flex-1"><span className="block font-semibold">{option.label}</span><span className="mt-1 block text-xs leading-5 text-zinc-500">{option.note}</span></span>
                          {selected && <Check className="h-5 w-5 shrink-0 text-orange-700" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              <div className="flex justify-end border-t border-zinc-200 pt-5">
                <button onClick={() => void completeSetup()} disabled={!businessType || saving} className="inline-flex h-11 items-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  Create workspace
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
