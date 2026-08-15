"use client";

import { AlertCircle, CalendarDays, Clock3, Phone, RefreshCw, Stethoscope, UserRound } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://digital-api-46ss.onrender.com/api";
const TIMEZONE = "Asia/Kolkata";

interface PublicAppointment {
  name: string;
  phone: string;
  date: string;
  time: string;
  queueNumber: string;
}

interface PublicAppointmentResponse {
  success: boolean;
  clinicName: string;
  doctorName: string;
  appointments: PublicAppointment[];
  updatedAt: string;
  error?: string;
}

function getDateKey(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function getDateHeading(value: string) {
  const date = new Date(value);
  const todayKey = getDateKey(new Date().toISOString());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const prefix = getDateKey(value) === todayKey
    ? "Today"
    : getDateKey(value) === getDateKey(tomorrow.toISOString())
      ? "Tomorrow"
      : new Intl.DateTimeFormat("en-IN", { timeZone: TIMEZONE, weekday: "long" }).format(date);

  const calendarDate = new Intl.DateTimeFormat("en-IN", {
    timeZone: TIMEZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return `${prefix}, ${calendarDate}`;
}

function getSlotLabel(appointment: PublicAppointment) {
  return appointment.queueNumber
    ? `Queue ${appointment.queueNumber}`
    : appointment.time || "Time pending";
}

export default function AppointmentList({ publicId }: { publicId: string }) {
  const [data, setData] = useState<PublicAppointmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAppointments = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/appointments/public/${encodeURIComponent(publicId)}`,
        { cache: "no-store" }
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        throw new Error(result.error || "This appointment link is unavailable.");
      }
      setData(result);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load the appointment list."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [publicId]);

  useEffect(() => {
    void loadAppointments();
    const refreshTimer = window.setInterval(() => {
      if (document.visibilityState === "visible") void loadAppointments(true);
    }, 60_000);
    return () => window.clearInterval(refreshTimer);
  }, [loadAppointments]);

  const groupedAppointments = useMemo(() => {
    const groups = new Map<string, PublicAppointment[]>();
    for (const appointment of data?.appointments || []) {
      const key = getDateKey(appointment.date);
      const group = groups.get(key) || [];
      group.push(appointment);
      groups.set(key, group);
    }
    return Array.from(groups.entries());
  }, [data?.appointments]);

  return (
    <main className="min-h-screen bg-[#fffaf5] text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-orange-200/50 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#f97316_1px,transparent_1px),linear-gradient(to_bottom,#f97316_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <header className="relative border-b border-orange-100 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Image
            src="https://res.cloudinary.com/dew9qfpbl/image/upload/v1762971494/Gemini_Generated_Image_a19f1ha19f1ha19f-Kittl_b9jogz.svg"
            alt="DigitalBot.AI"
            width={1450}
            height={460}
            priority
            className="h-14 w-auto sm:h-16"
          />
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Live schedule
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-10">
        {loading ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4" role="status">
            <div className="h-11 w-11 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
            <p className="text-sm font-medium text-slate-500">Loading upcoming appointments...</p>
          </div>
        ) : error ? (
          <div className="mx-auto mt-16 max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl shadow-red-100/40">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <AlertCircle className="h-7 w-7 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Appointment list unavailable</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>
            <button
              onClick={() => void loadAppointments()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4" /> Retry
            </button>
          </div>
        ) : data ? (
          <>
            <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 p-5 text-white shadow-2xl shadow-orange-200/60 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30 backdrop-blur-sm">
                    <Stethoscope className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-100">
                      {data.clinicName}
                    </p>
                    <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                      Dr. {data.doctorName.replace(/^(doctor\.?\s*|dr\.?\s*)/i, "")}
                    </h1>
                    <p className="mt-1 text-sm text-orange-50">Upcoming appointments in chronological order</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <div className="rounded-2xl bg-white/15 px-4 py-2.5 text-center ring-1 ring-white/20 backdrop-blur-sm">
                    <span className="block text-2xl font-black">{data.appointments.length}</span>
                    <span className="text-xs font-semibold text-orange-50">Upcoming</span>
                  </div>
                  <button
                    onClick={() => void loadAppointments(true)}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-xs font-semibold ring-1 ring-white/20 transition hover:bg-white/25 disabled:opacity-60"
                    aria-label="Refresh appointments"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </button>
                </div>
              </div>
            </section>

            {groupedAppointments.length > 0 ? (
              <div className="mt-6 space-y-5">
                {groupedAppointments.map(([dateKey, appointments]) => (
                  <section key={dateKey} className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-lg shadow-orange-100/40">
                    <div className="flex items-center justify-between border-b border-orange-100 bg-orange-50/70 px-4 py-3 sm:px-5">
                      <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800 sm:text-base">
                        <CalendarDays className="h-4 w-4 text-orange-500" />
                        {getDateHeading(appointments[0].date)}
                      </h2>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-orange-700 shadow-sm">
                        {appointments.length}
                      </span>
                    </div>

                    <div className="hidden grid-cols-[46px_minmax(0,1fr)_180px_150px] gap-3 border-b border-slate-100 px-5 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 sm:grid">
                      <span>No.</span><span>Patient</span><span>Phone number</span><span>Time slot</span>
                    </div>

                    <ol className="divide-y divide-slate-100">
                      {appointments.map((appointment, index) => (
                        <li
                          key={`${dateKey}-${appointment.phone}-${appointment.time}-${appointment.queueNumber}-${index}`}
                          className="grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition hover:bg-orange-50/40 sm:grid-cols-[46px_minmax(0,1fr)_180px_150px] sm:px-5"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-extrabold text-slate-500">
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900 sm:text-[15px]">
                              {appointment.name}
                            </p>
                            <a href={`tel:${appointment.phone}`} className="mt-0.5 flex items-center gap-1 text-xs font-medium text-slate-500 sm:hidden">
                              <Phone className="h-3 w-3" /> {appointment.phone}
                            </a>
                          </div>
                          <a href={`tel:${appointment.phone}`} className="hidden items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-600 sm:flex">
                            <Phone className="h-4 w-4 text-slate-400" /> {appointment.phone}
                          </a>
                          <span className="inline-flex items-center justify-end gap-1.5 whitespace-nowrap rounded-lg bg-orange-50 px-2.5 py-1.5 text-xs font-extrabold text-orange-700 sm:justify-start sm:text-sm">
                            <Clock3 className="h-3.5 w-3.5" /> {getSlotLabel(appointment)}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </section>
                ))}
              </div>
            ) : (
              <section className="mt-6 rounded-3xl border border-orange-100 bg-white px-6 py-16 text-center shadow-lg shadow-orange-100/40">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
                  <CalendarDays className="h-8 w-8 text-orange-400" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-slate-900">No upcoming appointments</h2>
                <p className="mt-2 text-sm text-slate-500">New bookings will appear here automatically.</p>
              </section>
            )}

            <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-orange-100 py-5 text-xs text-slate-400 sm:flex-row">
              <span className="flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5" /> Patient schedule</span>
              <span>Times shown in India Standard Time · Powered by DigitalBot.AI</span>
            </footer>
          </>
        ) : null}
      </div>
    </main>
  );
}
