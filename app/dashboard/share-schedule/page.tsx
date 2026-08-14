"use client";

import Sidebar from "@/components/Sidebar";
import { appointmentsAPI, doctorsAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Copy,
  ExternalLink,
  Menu,
  Phone,
  RefreshCw,
  Share2,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

interface DoctorOption {
  _id: string;
  name: string;
  specialization?: string;
  active?: boolean;
}

function copyWithTextArea(value: string) {
  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();
  if (!copied) throw new Error("Your browser could not copy the link");
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      copyWithTextArea(value);
      return;
    }
  }
  copyWithTextArea(value);
}

export default function ShareSchedulePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [copying, setCopying] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { data: doctors = [], isPending, error: doctorsError } = useQuery<DoctorOption[]>({
    queryKey: ["appointment-doctors"],
    queryFn: async () => {
      const response = await doctorsAPI.getAll();
      return (response.data.doctors || []).filter((doctor: DoctorOption) => doctor.active !== false);
    },
  });

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor._id === doctorId),
    [doctorId, doctors]
  );

  const copyPublicLink = async () => {
    if (!selectedDoctor) {
      setError("Select a doctor first.");
      return;
    }

    setCopying(true);
    setError("");
    setMessage("");
    try {
      const response = await appointmentsAPI.getDisplayLink(selectedDoctor._id);
      const publicId = response.data?.publicId;
      if (!publicId) throw new Error("The public link could not be created");

      const publicUrl = `${window.location.origin}/appointments/${encodeURIComponent(publicId)}`;
      await copyText(publicUrl);
      setCopiedUrl(publicUrl);
      setMessage(`Dr. ${selectedDoctor.name}'s schedule link has been copied.`);
    } catch (copyError) {
      const apiMessage = (copyError as { response?: { data?: { error?: string } } })
        ?.response?.data?.error;
      setError(apiMessage || (copyError instanceof Error ? copyError.message : "Failed to copy the public link"));
    } finally {
      setCopying(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-40 rounded-xl border border-slate-200 bg-white p-3 shadow-lg lg:hidden"
        aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 px-4 pb-12 pt-20 sm:px-6 lg:ml-64 lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-6xl">
          <header className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Appointments</p>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Share appointment schedule</h1>
              <p className="mt-2 text-sm text-slate-500">Give a doctor one private link to their live upcoming appointment list.</p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700">
              <Share2 className="h-3.5 w-3.5" /> Public link
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <h2 className="text-lg font-bold text-slate-900">Create the link</h2>
                <p className="mt-1 text-sm text-slate-500">Select the doctor whose schedule you want to share.</p>
              </div>

              <div className="p-5 sm:p-6">
                {message && (
                  <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700" role="status">
                    <CheckCircle2 className="h-5 w-5 shrink-0" /> {message}
                  </div>
                )}
                {(error || doctorsError) && (
                  <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    {error || (doctorsError instanceof Error ? doctorsError.message : "Failed to load doctors")}
                  </div>
                )}

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-800">Doctor</span>
                  <div className="relative">
                    <Stethoscope className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <select
                      value={doctorId}
                      onChange={(event) => {
                        setDoctorId(event.target.value);
                        setCopiedUrl("");
                        setMessage("");
                        setError("");
                      }}
                      disabled={isPending}
                      className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-12 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:bg-slate-50"
                    >
                      <option value="">{isPending ? "Loading doctors..." : "Choose a doctor"}</option>
                      {doctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          Dr. {doctor.name}{doctor.specialization ? ` · ${doctor.specialization}` : ""}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">▼</span>
                  </div>
                </label>

                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Selected doctor</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {selectedDoctor ? `Dr. ${selectedDoctor.name}` : "No doctor selected"}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {selectedDoctor?.specialization || "Choose a doctor to continue"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => void copyPublicLink()}
                  disabled={!doctorId || copying}
                  className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 text-sm font-bold text-white shadow-md shadow-orange-100 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copying ? <RefreshCw className="h-4 w-4 animate-spin" /> : copiedUrl ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copying ? "Preparing link..." : copiedUrl ? "Link copied" : "Copy public link"}
                </button>

                {copiedUrl && (
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                    <p className="min-w-0 flex-1 truncate text-xs font-medium text-slate-500">{copiedUrl}</p>
                    <a
                      href={copiedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:text-orange-700"
                    >
                      Open <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}

                <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <p className="leading-5">Anyone with the link can see patient names, phone numbers, and appointment times. Share it carefully.</p>
                </div>
              </div>
            </section>

            <aside className="rounded-2xl bg-slate-950 p-4 shadow-xl shadow-slate-200 sm:p-5">
              <div className="flex items-center justify-between px-1 pb-4">
                <div>
                  <p className="text-sm font-bold text-white">Public page preview</p>
                  <p className="mt-0.5 text-xs text-slate-400">What the shared link will show</p>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">Live</span>
              </div>

              <div className="overflow-hidden rounded-xl bg-[#fffaf5] ring-1 ring-white/10">
                <div className="flex items-center justify-between border-b border-orange-100 bg-white px-4 py-3">
                  <span className="text-sm font-black tracking-tight text-slate-900">Digital<span className="text-orange-600">Bot</span>.AI</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live schedule
                  </span>
                </div>

                <div className="p-4">
                  <div className="rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 p-4 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-orange-100">Upcoming appointments</p>
                    <p className="mt-1 text-lg font-extrabold">{selectedDoctor ? `Dr. ${selectedDoctor.name}` : "Doctor name"}</p>
                  </div>

                  <div className="mt-3 overflow-hidden rounded-xl border border-orange-100 bg-white">
                    <div className="flex items-center gap-2 border-b border-orange-100 bg-orange-50 px-3 py-2 text-xs font-bold text-slate-700">
                      <CalendarDays className="h-3.5 w-3.5 text-orange-500" /> Today&apos;s schedule
                    </div>
                    {["10:30 AM", "11:00 AM", "11:30 AM"].map((time, index) => (
                      <div key={time} className="grid grid-cols-[26px_minmax(0,1fr)_auto] items-center gap-2 border-b border-slate-100 px-3 py-2.5 last:border-b-0">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">{index + 1}</span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-slate-800">Patient name</p>
                          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400"><Phone className="h-2.5 w-2.5" /> +91 ••••• ••{21 + index}</p>
                        </div>
                        <span className="rounded-md bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-700">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs font-bold text-white">Always current</p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-400">New appointments appear automatically.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs font-bold text-white">No login needed</p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-400">Anyone with the link can open it.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
