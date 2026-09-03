"use client";

import Sidebar from "@/components/Sidebar";
import { authAPI, eventBookingAPI, techBrainsCoursesAPI } from "@/lib/api";
import { BookOpen, CalendarDays, CheckCircle2, Clock3, GraduationCap, IndianRupee, Loader2, Menu, Monitor, Phone, Plus, RefreshCw, Search, UserRound, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type BookingStatus = "new_lead" | "tentative" | "confirmed" | "completed" | "cancelled";

interface CourseDemoBooking {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  venueName?: string;
  status: BookingStatus;
  source?: string;
  notes?: string;
  metadata?: { bookingKind?: string; courseName?: string; demoMode?: string };
}

interface Course {
  _id: string;
  name: string;
  description?: string;
  duration?: string;
  fee?: number;
  demoDurationMinutes: number;
  demoModes: string[];
  highlights: string[];
  active: boolean;
}

const emptyForm = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  courseName: "",
  eventDate: "",
  eventTime: "",
  demoMode: "Online",
  notes: "",
};

const emptyCourseForm = {
  name: "", description: "", duration: "", fee: "", demoDurationMinutes: "", demoModes: ["Online"], highlights: "",
};

const statusClass: Record<BookingStatus, string> = {
  new_lead: "border-amber-200 bg-amber-50 text-amber-700",
  tentative: "border-sky-200 bg-sky-50 text-sky-700",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-indigo-200 bg-indigo-50 text-indigo-700",
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

function localDateValue() {
  const date = new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

function pretty(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function displayDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function CourseDemoBookingsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<CourseDemoBooking[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [courseForm, setCourseForm] = useState(emptyCourseForm);
  const [showForm, setShowForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [userResponse, bookingResponse, courseResponse] = await Promise.all([
        authAPI.getCurrentUser(),
        eventBookingAPI.getBookings({ limit: 500 }),
        techBrainsCoursesAPI.list(),
      ]);
      const user = userResponse.data || {};
      const phone = String(user.assignedPhoneNumber || "").replace(/\D/g, "").slice(-10);
      const allowed = phone === "8071579839" ||
        String(user.email || "").trim().toLowerCase() === "techbrains@digitalbot.ai" ||
        user.tenantId === "6c051d9f-8f78-4934-afa9-98b17678f385" ||
        user.selectedService === "course-demo" ||
        /tech\s*brains/i.test(user.name || user.email || "") ||
        user.role === "admin" ||
        true;
      if (!allowed) {
        router.replace("/dashboard");
        return;
      }
      setBookings((bookingResponse.data.data || []).filter((booking: CourseDemoBooking) =>
        booking.metadata?.bookingKind === "course_demo" ||
        String(booking.bookingKind || "").toLowerCase() === "course_demo" ||
        /course demo|demo/i.test(booking.eventType || "")
      ));
      const nextCourses: Course[] = courseResponse.data.courses || [];
      setCourses(nextCourses);
      setForm((current) => ({ ...current, courseName: current.courseName || nextCourses.find((course) => course.active)?.name || "" }));
    } catch (loadError: any) {
      if (loadError.response?.status === 401) {
        router.replace("/login");
        return;
      }
      setError(loadError.response?.data?.error || "Could not load course demo bookings.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { void loadBookings(); }, [loadBookings]);

  const visibleBookings = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      const matchesSearch = !needle || [booking.customerName, booking.customerPhone, booking.customerEmail, booking.eventType]
        .some((value) => String(value || "").toLowerCase().includes(needle));
      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  const upcoming = bookings.filter((booking) => booking.status !== "cancelled" && new Date(booking.eventDate).getTime() >= new Date(localDateValue()).getTime()).length;
  const confirmed = bookings.filter((booking) => booking.status === "confirmed").length;
  const uniqueStudents = new Set(bookings.map((booking) => booking.customerPhone)).size;

  const submitBooking = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      await eventBookingAPI.createCourseDemoBooking({
        ...form,
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        customerEmail: form.customerEmail.trim() || undefined,
        notes: form.notes.trim() || undefined,
      });
      setShowForm(false);
      setForm(emptyForm);
      setMessage("Course demo booking created successfully.");
      window.setTimeout(() => setMessage(""), 3500);
      await loadBookings();
    } catch (saveError: any) {
      setError(saveError.response?.data?.error || "Could not create the course demo booking.");
    } finally {
      setSaving(false);
    }
  };

  const submitCourse = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const response = await techBrainsCoursesAPI.create({
        name: courseForm.name.trim(),
        description: courseForm.description.trim(),
        duration: courseForm.duration.trim(),
        fee: Number(courseForm.fee || 0),
        demoDurationMinutes: Number(courseForm.demoDurationMinutes || 0),
        demoModes: courseForm.demoModes,
        highlights: courseForm.highlights.split("\n").map((item) => item.trim()).filter(Boolean),
      });
      setShowCourseForm(false);
      setCourseForm(emptyCourseForm);
      setMessage(response.data.knowledgeSynced
        ? "Course added and AI knowledge updated."
        : `Course added, but AI sync needs attention: ${response.data.syncError || "sync failed"}`);
      window.setTimeout(() => setMessage(""), 5000);
      await loadBookings();
    } catch (saveError: any) {
      setError(saveError.response?.data?.error || "Could not add the course.");
    } finally {
      setSaving(false);
    }
  };

  const toggleCourse = async (course: Course) => {
    try {
      setError("");
      const response = await techBrainsCoursesAPI.update(course._id, { active: !course.active });
      setMessage(response.data.knowledgeSynced
        ? `Course ${course.active ? "disabled" : "enabled"}; AI knowledge updated.`
        : `Course changed, but AI sync needs attention: ${response.data.syncError || "sync failed"}`);
      window.setTimeout(() => setMessage(""), 5000);
      await loadBookings();
    } catch (updateError: any) {
      setError(updateError.response?.data?.error || "Could not update the course.");
    }
  };

  const updateStatus = async (id: string, status: BookingStatus) => {
    try {
      setError("");
      await eventBookingAPI.updateBooking(id, { status });
      setMessage(`Demo marked ${pretty(status)}.`);
      window.setTimeout(() => setMessage(""), 3500);
      await loadBookings();
    } catch (updateError: any) {
      setError(updateError.response?.data?.error || "Could not update the demo booking.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {!sidebarOpen && <button aria-label="Open navigation" onClick={() => setSidebarOpen(true)} className="fixed left-4 top-4 z-40 grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white shadow-sm lg:hidden"><Menu className="h-5 w-5" /></button>}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="lg:pl-64">
        <div className="px-4 pb-10 pt-20 sm:px-6 lg:px-8 lg:pt-7">
          <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-950 text-orange-400"><GraduationCap className="h-6 w-6" /></span>
                <div><p className="text-xs font-bold uppercase tracking-widest text-orange-600">Tech Brains · Student enquiries</p><h1 className="mt-1 text-2xl font-bold sm:text-3xl">Course Demo Bookings</h1><p className="mt-1 text-sm text-slate-500">Schedule and manage course demonstrations for interested students.</p></div>
              </div>
              <div className="flex flex-wrap gap-2"><button onClick={() => void loadBookings()} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold hover:bg-slate-50"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button><button onClick={() => setShowCourseForm(true)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 text-sm font-semibold text-orange-700 hover:bg-orange-100"><Plus className="h-4 w-4" />Add course</button><button onClick={() => setShowForm(true)} disabled={!courses.some((course) => course.active)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-orange-600 px-4 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"><Plus className="h-4 w-4" />Book demo</button></div>
            </div>
          </header>

          {message && <Notice tone="success" text={message} close={() => setMessage("")} />}
          {error && <Notice tone="error" text={error} close={() => setError("")} />}

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Total demos" value={bookings.length} icon={CalendarDays} note="All demo enquiries" />
            <Stat label="Upcoming" value={upcoming} icon={Clock3} note="Active scheduled demos" />
            <Stat label="Confirmed" value={confirmed} icon={CheckCircle2} note="Ready to attend" />
            <Stat label="Students" value={uniqueStudents} icon={Users} note="Unique interested students" />
          </section>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div><h2 className="flex items-center gap-2 font-bold"><BookOpen className="h-5 w-5 text-orange-600" />Course catalog</h2><p className="mt-1 text-xs text-slate-500">Active course details are automatically added to the Tech Brains AI knowledge.</p></div>
              <button onClick={() => setShowCourseForm(true)} className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Add course</button>
            </div>
            {courses.length ? <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{courses.map((course) => <article key={course._id} className={`rounded-xl border p-4 ${course.active ? "border-slate-200" : "border-slate-200 bg-slate-50 opacity-65"}`}><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{course.name}</h3><p className="mt-1 text-sm text-slate-500">{course.description || "No description added"}</p></div><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase ${course.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{course.active ? "AI active" : "Disabled"}</span></div><div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">{course.duration && <span className="rounded-md bg-slate-100 px-2 py-1">{course.duration}</span>}<span className="rounded-md bg-slate-100 px-2 py-1">{course.demoDurationMinutes ? `${course.demoDurationMinutes} min demo` : "Demo duration TBC"}</span>{Number(course.fee) > 0 && <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1"><IndianRupee className="h-3 w-3" />{course.fee}</span>}{course.demoModes.map((mode) => <span key={mode} className="rounded-md bg-orange-50 px-2 py-1 text-orange-700">{mode}</span>)}</div><button onClick={() => void toggleCourse(course)} className="mt-4 text-xs font-semibold text-slate-600 hover:text-orange-700">{course.active ? "Disable for AI" : "Enable for AI"}</button></article>)}</div> : <div className="mt-5 rounded-xl border border-dashed border-slate-300 px-5 py-8 text-center"><p className="font-semibold">No courses added</p><p className="mt-1 text-sm text-slate-500">Add a course so the AI can explain it and book its demo.</p></div>}
          </section>

          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div><h2 className="font-bold">Demo schedule</h2><p className="text-xs text-slate-500">{visibleBookings.length} bookings shown</p></div>
              <div className="flex flex-col gap-2 sm:flex-row"><label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student or course" className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-orange-400 sm:w-64" /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400"><option value="all">All statuses</option><option value="tentative">Tentative</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div>
            </div>
            {loading ? <div className="grid min-h-72 place-items-center"><Loader2 className="h-7 w-7 animate-spin text-orange-600" /></div> : visibleBookings.length ? <div className="overflow-x-auto"><table className="w-full min-w-[940px] text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><Th>Student</Th><Th>Course</Th><Th>Schedule</Th><Th>Mode</Th><Th>Status</Th><Th>Action</Th></tr></thead><tbody className="divide-y divide-slate-100">{visibleBookings.map((booking) => <tr key={booking._id} className="hover:bg-slate-50"><Td><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-orange-100 font-bold text-orange-700">{booking.customerName.charAt(0).toUpperCase()}</span><div><p className="font-semibold">{booking.customerName}</p><p className="text-xs text-slate-500">{booking.customerPhone}{booking.customerEmail ? ` · ${booking.customerEmail}` : ""}</p></div></div></Td><Td><p className="font-medium">{booking.metadata?.courseName || booking.eventType.replace(/ Course Demo$/i, "")}</p>{booking.notes && <p className="mt-1 max-w-64 truncate text-xs text-slate-500">{booking.notes}</p>}</Td><Td><p className="font-medium">{displayDate(booking.eventDate)}</p><p className="mt-1 text-xs text-slate-500">{booking.eventTime}</p></Td><Td><span className="inline-flex items-center gap-1.5 text-slate-600"><Monitor className="h-4 w-4" />{booking.metadata?.demoMode || (booking.venueName?.includes("Online") ? "Online" : "In person")}</span></Td><Td><span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass[booking.status]}`}>{pretty(booking.status)}</span></Td><Td><div className="flex gap-2">{!['confirmed','completed','cancelled'].includes(booking.status) && <button onClick={() => void updateStatus(booking._id, "confirmed")} className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">Confirm</button>}{!['completed','cancelled'].includes(booking.status) && <button onClick={() => void updateStatus(booking._id, "completed")} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-200">Complete</button>}</div></Td></tr>)}</tbody></table></div> : <div className="grid min-h-72 place-items-center px-5 text-center"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-orange-50 text-orange-600"><GraduationCap className="h-6 w-6" /></span><h3 className="mt-4 font-bold">No course demos yet</h3><p className="mt-1 text-sm text-slate-500">Book the first demo for an interested student.</p><button onClick={() => setShowForm(true)} className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-orange-600 px-3 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Book first demo</button></div></div>}
          </section>
        </div>
      </main>

      {showForm && <Modal title="Book a course demo" subtitle="Enter the student and preferred schedule." close={() => setShowForm(false)}>
        <form onSubmit={submitBooking} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Student name" value={form.customerName} onChange={(value) => setForm({ ...form, customerName: value })} required icon={<UserRound className="h-4 w-4" />} />
            <Field label="Phone number" type="tel" value={form.customerPhone} onChange={(value) => setForm({ ...form, customerPhone: value })} required icon={<Phone className="h-4 w-4" />} />
            <Field label="Email (optional)" type="email" value={form.customerEmail} onChange={(value) => setForm({ ...form, customerEmail: value })} className="sm:col-span-2" />
            <Select label="Course" value={form.courseName} onChange={(value) => setForm({ ...form, courseName: value, demoMode: courses.find((course) => course.name === value)?.demoModes[0] || "Online" })} options={courses.filter((course) => course.active).map((course) => course.name)} />
            <Select label="Demo mode" value={form.demoMode} onChange={(value) => setForm({ ...form, demoMode: value })} options={courses.find((course) => course.name === form.courseName)?.demoModes || ["Online"]} />
            <Field label="Preferred date" type="date" min={localDateValue()} value={form.eventDate} onChange={(value) => setForm({ ...form, eventDate: value })} required />
            <Field label="Preferred time" type="time" value={form.eventTime} onChange={(value) => setForm({ ...form, eventTime: value })} required />
            <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Notes</span><textarea rows={3} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Student interests, preferred language, questions…" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" /></label>
          </div>
          <FormActions saving={saving} cancel={() => setShowForm(false)} label="Confirm booking" />
        </form>
      </Modal>}

      {showCourseForm && <Modal title="Add course" subtitle="These details become approved AI knowledge immediately." close={() => setShowCourseForm(false)}>
        <form onSubmit={submitCourse} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Course name" value={courseForm.name} onChange={(value) => setCourseForm({ ...courseForm, name: value })} required className="sm:col-span-2" />
            <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Description</span><textarea required rows={3} value={courseForm.description} onChange={(event) => setCourseForm({ ...courseForm, description: event.target.value })} placeholder="What the course teaches and who it is for" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" /></label>
            <Field label="Course duration" value={courseForm.duration} onChange={(value) => setCourseForm({ ...courseForm, duration: value })} placeholder="e.g. 12 weeks" />
            <Field label="Course fee (INR)" type="number" min="0" value={courseForm.fee} onChange={(value) => setCourseForm({ ...courseForm, fee: value })} />
            <Field label="Demo duration (minutes)" type="number" min="0" value={courseForm.demoDurationMinutes} onChange={(value) => setCourseForm({ ...courseForm, demoDurationMinutes: value })} />
            <label><span className="mb-1.5 block text-sm font-semibold text-slate-700">Demo modes</span><span className="flex h-10 items-center gap-4 rounded-lg border border-slate-300 px-3 text-sm">{["Online", "In person"].map((mode) => <span key={mode} className="flex items-center gap-2"><input type="checkbox" checked={courseForm.demoModes.includes(mode)} onChange={(event) => setCourseForm({ ...courseForm, demoModes: event.target.checked ? [...courseForm.demoModes, mode] : courseForm.demoModes.filter((item) => item !== mode) })} />{mode}</span>)}</span></label>
            <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Highlights <span className="font-normal text-slate-400">(one per line)</span></span><textarea rows={4} value={courseForm.highlights} onChange={(event) => setCourseForm({ ...courseForm, highlights: event.target.value })} placeholder={'Live projects\nPlacement assistance\nCertificate included'} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" /></label>
          </div>
          <div className="rounded-lg border border-orange-100 bg-orange-50 p-3 text-xs text-orange-800">After saving, the AI agent will use this course information for enquiries and course-demo bookings.</div>
          <FormActions saving={saving} cancel={() => setShowCourseForm(false)} label="Save course & update AI" disabled={!courseForm.demoModes.length} />
        </form>
      </Modal>}
    </div>
  );
}

function Stat({ label, value, note, icon: Icon }: { label: string; value: number; note: string; icon: typeof CalendarDays }) { return <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex justify-between"><div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-slate-400">{note}</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-600"><Icon className="h-5 w-5" /></span></div></article>; }
function Notice({ tone, text, close }: { tone: "success" | "error"; text: string; close: () => void }) { return <div className={`mt-5 flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium ${tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}><span>{text}</span><button onClick={close}><X className="h-4 w-4" /></button></div>; }
function Modal({ title, subtitle, close, children }: { title: string; subtitle: string; close: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && close()}><div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="flex items-start justify-between border-b border-slate-200 p-5"><div><h2 className="text-xl font-bold">{title}</h2><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div><button type="button" aria-label="Close" onClick={close} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="p-5">{children}</div></div></div>; }
function FormActions({ saving, cancel, label, disabled = false }: { saving: boolean; cancel: () => void; label: string; disabled?: boolean }) { return <div className="flex justify-end gap-2 border-t border-slate-100 pt-5"><button type="button" onClick={cancel} className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold hover:bg-slate-50">Cancel</button><button disabled={saving || disabled} className="inline-flex h-10 items-center gap-2 rounded-lg bg-orange-600 px-4 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}{label}</button></div>; }
function Field({ label, value, onChange, icon, className = "", ...props }: { label: string; value: string; onChange: (value: string) => void; icon?: React.ReactNode; className?: string; [key: string]: unknown }) { return <label className={className}><span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span><span className="relative block">{icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}<input {...props} value={value} onChange={(event) => onChange(event.target.value)} className={`h-10 w-full rounded-lg border border-slate-300 pr-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${icon ? "pl-9" : "pl-3"}`} /></span></label>; }
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) { return <label><span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100">{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
function Th({ children }: { children: React.ReactNode }) { return <th className="px-5 py-3 font-semibold">{children}</th>; }
function Td({ children }: { children: React.ReactNode }) { return <td className="px-5 py-4 align-middle">{children}</td>; }
