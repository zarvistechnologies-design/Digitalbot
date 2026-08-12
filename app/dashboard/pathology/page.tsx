"use client";

import Sidebar from "@/components/Sidebar";
import { pathologyAPI } from "@/lib/pathology-api";
import {
  Activity, Banknote, Beaker, Bot, CalendarDays, ClipboardList, Download,
  FileCheck2, FileText, FlaskConical, Home, Menu, MessageCircle, Microscope,
  Pencil, Plus, RefreshCw, Search, Send, Stethoscope, TestTube2, Trash2, Upload,
  UserRound, Users, WalletCards, X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Tab = "overview" | "orders" | "patients" | "samples" | "reports" | "tests" | "referrals" | "inbox" | "bot";
type Test = { _id: string; code: string; name: string; category: string; sampleType: string; homeCollectionAllowed?: boolean; price: number; priceType?: "fixed" | "starting"; turnaroundHours?: number | null; preparation: string; active: boolean };
type Patient = { _id: string; patientNumber: string; name: string; phone: string; email?: string; age?: number; gender?: string; address?: string; visitCount: number; lastVisitAt?: string };
type Order = {
  _id: string; orderNumber: string; patientId: string; patient: Patient; tests: Test[]; appointmentAt: string;
  collectionType: "center" | "home"; collectionAddress?: string; phlebotomist?: string; collectionTime?: string;
  barcode?: string; sampleStatus: string; orderStatus: string; report: { status: string; fileId?: string; fileName?: string; verifiedBy?: string };
  payment: { subtotal: number; discount: number; total: number; paid: number; estimated?: boolean; status: string; method?: string };
  referral?: { doctorName?: string; clinicName?: string }; notes?: string; source: string;
};
type Referral = { _id: string; doctorName: string; clinicName?: string; phone?: string; commissionType: string; commissionValue: number; active: boolean; patients?: number; billed?: number };
type Overview = { todayBookings: number; samplesCollected: number; reportsPending: number; revenueToday: number; outstanding: number; patients: number; whatsappLeads: number; topTests: Array<{ _id: string; count: number; revenue: number }>; recentOrders: Order[] };
type Conversation = { conversationId: string; phone: string; metaPhoneNumberId: string; patientName?: string; latestMessage: string; latestAt: string; messageCount: number };
type Message = { _id: string; message: string; sentBy: string; type: string; createdAt: string; documentName?: string };

const routeTabs: Record<string, Tab> = {
  bookings: "orders",
  patients: "patients",
  samples: "samples",
  reports: "reports",
  tests: "tests",
  referrals: "referrals",
  whatsapp: "inbox",
  "whatsapp-ai": "bot",
};
const tabRoutes: Record<Tab, string> = {
  overview: "/dashboard/pathology",
  orders: "/dashboard/pathology/bookings",
  patients: "/dashboard/pathology/patients",
  samples: "/dashboard/pathology/samples",
  reports: "/dashboard/pathology/reports",
  tests: "/dashboard/pathology/tests",
  referrals: "/dashboard/pathology/referrals",
  inbox: "/dashboard/pathology/whatsapp",
  bot: "/dashboard/pathology/whatsapp-ai",
};
const sampleStatuses = ["booked", "assigned", "collected", "received", "processing", "completed", "rejected"];
const money = (value = 0) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
const dateTime = (value?: string) => value ? new Date(value).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "-";
const label = (value: string) => value.replace(/_/g, " ").replace(/\b\w/g, character => character.toUpperCase());
const badge = (value: string) => value === "paid" || value === "ready" || value === "delivered" || value === "completed"
  ? "bg-emerald-50 text-emerald-700 border-emerald-200" : value === "partial" || value === "processing" || value === "collected"
  ? "bg-amber-50 text-amber-700 border-amber-200" : value === "cancelled" || value === "rejected"
  ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-sky-50 text-sky-700 border-sky-200";

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4" onMouseDown={onClose}>
    <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-2xl" onMouseDown={event => event.stopPropagation()}>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4"><h2 className="text-lg font-bold text-slate-900">{title}</h2><button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Close"><X className="h-5 w-5" /></button></div>
      <div className="p-5">{children}</div>
    </div>
  </div>;
}

function Empty({ icon: Icon, text }: { icon: typeof Activity; text: string }) {
  return <div className="py-16 text-center text-slate-500"><Icon className="mx-auto mb-3 h-9 w-9 text-slate-300" /><p className="text-sm">{text}</p></div>;
}

export default function PathologyDashboardPage() {
  const pathname = usePathname();
  const router = useRouter();
  const section = pathname.split("/").filter(Boolean).at(-1) || "pathology";
  const tab: Tab = routeTabs[section] || "overview";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [search, setSearch] = useState("");
  const [showBooking, setShowBooking] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [showReferral, setShowReferral] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState<Order | null>(null);
  const [patientHistory, setPatientHistory] = useState<{ patient: Patient; orders: Order[]; repeatPatient: boolean } | null>(null);

  const flash = (type: "ok" | "error", text: string) => { setNotice({ type, text }); window.setTimeout(() => setNotice(null), 4500); };
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [summary, orderRows, patientRows, testRows, referralRows, chatRows] = await Promise.all([
        pathologyAPI.getOverview(), pathologyAPI.getOrders(), pathologyAPI.getPatients(), pathologyAPI.getTests(), pathologyAPI.getReferrals(), pathologyAPI.getConversations(),
      ]);
      setOverview(summary.data.data); setOrders(orderRows.data.data); setPatients(patientRows.data.data); setTests(testRows.data.data); setReferrals(referralRows.data.data); setConversations(chatRows.data.data);
    } catch (error: any) { flash("error", error.response?.data?.error || "Could not load diagnostic workspace"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void loadAll(); }, [loadAll]);
  useEffect(() => { setSearch(""); }, [tab]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter(order => [order.orderNumber, order.patient.name, order.patient.phone, order.barcode, ...order.tests.map(test => test.name)].some(value => String(value || "").toLowerCase().includes(query)));
  }, [orders, search]);
  const filteredPatients = useMemo(() => { const query = search.toLowerCase(); return patients.filter(patient => !query || `${patient.name} ${patient.phone} ${patient.patientNumber}`.toLowerCase().includes(query)); }, [patients, search]);

  async function updateOrder(id: string, data: Record<string, unknown>, success: string) {
    setBusy(id);
    try { await pathologyAPI.updateOrder(id, data); flash("ok", success); await loadAll(); }
    catch (error: any) { flash("error", error.response?.data?.error || "Update failed"); }
    finally { setBusy(""); }
  }
  async function openPatient(id: string) {
    setBusy(id);
    try { setPatientHistory((await pathologyAPI.getPatient(id)).data.data); }
    catch (error: any) { flash("error", error.response?.data?.error || "Could not load patient history"); }
    finally { setBusy(""); }
  }
  async function uploadReport(order: Order, file?: File) {
    if (!file) return; setBusy(order._id);
    try { await pathologyAPI.uploadReport(order._id, file); flash("ok", `Report uploaded for ${order.patient.name}`); await loadAll(); }
    catch (error: any) { flash("error", error.response?.data?.error || "Report upload failed"); }
    finally { setBusy(""); }
  }
  async function viewReport(order: Order) {
    setBusy(order._id);
    try { const response = await pathologyAPI.downloadReport(order._id); const url = URL.createObjectURL(response.data); window.open(url, "_blank", "noopener,noreferrer"); window.setTimeout(() => URL.revokeObjectURL(url), 60_000); }
    catch (error: any) { flash("error", error.response?.data?.error || "Report download failed"); }
    finally { setBusy(""); }
  }
  async function sendReport(order: Order) {
    setBusy(order._id);
    try { await pathologyAPI.sendReport(order._id); flash("ok", `Report sent to ${order.patient.name} on WhatsApp`); await loadAll(); }
    catch (error: any) { flash("error", error.response?.data?.error || "Could not send report"); }
    finally { setBusy(""); }
  }
  async function openConversation(conversation: Conversation) {
    setSelectedConversation(conversation);
    try { setMessages((await pathologyAPI.getMessages(conversation.phone, conversation.metaPhoneNumberId)).data.data); }
    catch (error: any) { flash("error", error.response?.data?.error || "Could not load messages"); }
  }
  const navigateTo = (nextTab: Tab) => router.push(tabRoutes[nextTab]);

  return <div className="min-h-screen bg-slate-100 text-slate-900">
    <button onClick={() => setSidebarOpen(value => !value)} className="fixed left-4 top-4 z-50 rounded-md border border-slate-200 bg-white p-2 shadow lg:hidden" aria-label="Toggle navigation">{sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    <main className="lg:ml-64">
      <header className="border-b border-slate-200 bg-white px-4 py-5 pt-16 lg:px-8 lg:pt-5">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div><div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase text-teal-700"><Microscope className="h-4 w-4" /> Diagnostic Operations</div><h1 className="text-2xl font-bold">Pathology Control Center</h1><p className="mt-1 text-sm text-slate-500">Bookings, patients, samples, reports, referrals and patient communication.</p></div>
          <div className="flex flex-wrap gap-2"><button onClick={() => void loadAll()} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button><button onClick={() => setShowBooking(true)} className="inline-flex h-10 items-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"><Plus className="h-4 w-4" /> New Booking</button></div>
        </div>
      </header>
      <div className="mx-auto max-w-[1500px] p-4 lg:p-8">
        {notice && <div className={`mb-4 rounded-md border px-4 py-3 text-sm font-medium ${notice.type === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>{notice.text}</div>}
        {loading && !overview ? <div className="flex h-80 items-center justify-center"><RefreshCw className="h-7 w-7 animate-spin text-teal-700" /></div> : <>
          {tab === "overview" && overview && <OverviewView overview={overview} onSelect={navigateTo} />}
          {["orders", "patients", "samples", "reports"].includes(tab) && <div className="mb-4 flex items-center gap-3"><div className="relative max-w-lg flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search patient, phone, order or barcode" className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></div></div>}
          {tab === "orders" && <OrdersTable orders={filteredOrders} busy={busy} onUpdate={updateOrder} onPayment={setPaymentOrder} />}
          {tab === "patients" && <PatientsView patients={filteredPatients} busy={busy} onOpen={openPatient} />}
          {tab === "samples" && <SamplesView orders={filteredOrders.filter(order => order.orderStatus !== "cancelled")} busy={busy} onUpdate={updateOrder} />}
          {tab === "reports" && <ReportsView orders={filteredOrders.filter(order => order.orderStatus !== "cancelled")} busy={busy} onUpload={uploadReport} onView={viewReport} onSend={sendReport} />}
          {tab === "tests" && <TestsView tests={tests} busy={busy} onAdd={() => { setEditingTest(null); setShowTest(true); }} onEdit={test => { setEditingTest(test); setShowTest(true); }} onDelete={async test => { if (!window.confirm(`Delete ${test.name}? Existing bookings will keep their saved test details.`)) return; setBusy(test._id); try { await pathologyAPI.deleteTest(test._id); flash("ok", "Test deleted from catalog"); await loadAll(); } catch (error: any) { flash("error", error.response?.data?.error || "Could not delete test"); } finally { setBusy(""); } }} onToggle={async test => { await pathologyAPI.updateTest(test._id, { active: !test.active }); await loadAll(); }} />}
          {tab === "referrals" && <ReferralsView referrals={referrals} onAdd={() => setShowReferral(true)} />}
          {tab === "inbox" && <InboxView conversations={conversations} selected={selectedConversation} messages={messages} onSelect={openConversation} onSent={async () => { if (selectedConversation) await openConversation(selectedConversation); await loadAll(); }} onError={text => flash("error", text)} />}
          {tab === "bot" && <WhatsAppAiSetup onNotice={flash} />}
        </>}
      </div>
    </main>
    {showBooking && <BookingModal tests={tests.filter(test => test.active)} referrals={referrals.filter(item => item.active)} onClose={() => setShowBooking(false)} onSaved={async () => { setShowBooking(false); flash("ok", "Diagnostic booking created"); await loadAll(); }} />}
    {showTest && <TestModal test={editingTest} onClose={() => { setShowTest(false); setEditingTest(null); }} onSaved={async () => { const wasEditing = Boolean(editingTest); setShowTest(false); setEditingTest(null); flash("ok", wasEditing ? "Test updated" : "Test added to catalog"); await loadAll(); }} />}
    {showReferral && <ReferralModal onClose={() => setShowReferral(false)} onSaved={async () => { setShowReferral(false); flash("ok", "Referral doctor added"); await loadAll(); }} />}
    {paymentOrder && <PaymentModal order={paymentOrder} onClose={() => setPaymentOrder(null)} onSaved={async () => { setPaymentOrder(null); flash("ok", "Payment updated"); await loadAll(); }} />}
    {patientHistory && <Modal title={`${patientHistory.patient.name} - Patient History`} onClose={() => setPatientHistory(null)}><PatientHistory data={patientHistory} /></Modal>}
  </div>;
}

function OverviewView({ overview, onSelect }: { overview: Overview; onSelect: (tab: Tab) => void }) {
  const metrics = [
    ["Today's bookings", overview.todayBookings, CalendarDays, "text-sky-700 bg-sky-50", "orders"],
    ["Samples collected", overview.samplesCollected, TestTube2, "text-teal-700 bg-teal-50", "samples"],
    ["Reports pending", overview.reportsPending, FileText, "text-amber-700 bg-amber-50", "reports"],
    ["Revenue today", money(overview.revenueToday), Banknote, "text-emerald-700 bg-emerald-50", "orders"],
    ["Outstanding", money(overview.outstanding), WalletCards, "text-rose-700 bg-rose-50", "orders"],
    ["Total patients", overview.patients, Users, "text-indigo-700 bg-indigo-50", "patients"],
    ["WhatsApp leads", overview.whatsappLeads, MessageCircle, "text-green-700 bg-green-50", "inbox"],
  ] as const;
  return <div className="space-y-6"><section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([name, value, Icon, color, target]) => <button key={name} onClick={() => onSelect(target)} className="rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-slate-300"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-slate-500">{name}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p></div><div className={`rounded-md p-2.5 ${color}`}><Icon className="h-5 w-5" /></div></div></button>)}</section>
    <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]"><section className="rounded-lg border border-slate-200 bg-white"><div className="border-b border-slate-200 px-5 py-4"><h2 className="font-bold">Recent diagnostic orders</h2></div>{overview.recentOrders.length ? <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-left text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Patient</th><th className="px-5 py-3">Tests</th><th className="px-5 py-3">Sample</th><th className="px-5 py-3">Report</th></tr></thead><tbody>{overview.recentOrders.map(order => <tr key={order._id} className="border-t border-slate-100"><td className="px-5 py-3"><p className="font-semibold">{order.patient.name}</p><p className="text-xs text-slate-500">{order.orderNumber}</p></td><td className="px-5 py-3 text-slate-600">{order.tests.map(test => test.code).join(", ")}</td><td className="px-5 py-3"><Status value={order.sampleStatus} /></td><td className="px-5 py-3"><Status value={order.report.status} /></td></tr>)}</tbody></table></div> : <Empty icon={ClipboardList} text="No diagnostic orders yet" />}</section>
      <section className="rounded-lg border border-slate-200 bg-white"><div className="border-b border-slate-200 px-5 py-4"><h2 className="font-bold">Top tests</h2></div><div className="divide-y divide-slate-100">{overview.topTests.map((test, index) => <div key={test._id} className="flex items-center gap-3 px-5 py-4"><div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white">{index + 1}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{test._id}</p><p className="text-xs text-slate-500">{test.count} orders</p></div><span className="text-sm font-bold text-slate-700">{money(test.revenue)}</span></div>)}{!overview.topTests.length && <Empty icon={Beaker} text="Top tests will appear after bookings" />}</div></section></div></div>;
}

function Status({ value }: { value: string }) { return <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${badge(value)}`}>{label(value)}</span>; }

function OrdersTable({ orders, busy, onUpdate, onPayment }: { orders: Order[]; busy: string; onUpdate: (id: string, data: Record<string, unknown>, success: string) => void; onPayment: (order: Order) => void }) {
  if (!orders.length) return <Panel><Empty icon={ClipboardList} text="No bookings match your search" /></Panel>;
  return <Panel><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-sm"><TableHead labels={["Order / Patient", "Appointment", "Tests", "Collection", "Sample", "Report", "Payment", "Actions"]} /><tbody>{orders.map(order => <tr key={order._id} className="border-t border-slate-100 align-top"><td className="px-4 py-3"><p className="font-semibold">{order.patient.name}</p><p className="text-xs text-slate-500">{order.patient.phone} · {order.orderNumber}</p></td><td className="px-4 py-3 text-slate-600">{dateTime(order.appointmentAt)}</td><td className="max-w-56 px-4 py-3 text-slate-600">{order.tests.map(test => test.code).join(", ")}</td><td className="px-4 py-3"><span className="flex items-center gap-1 text-slate-600">{order.collectionType === "home" ? <Home className="h-4 w-4" /> : <Microscope className="h-4 w-4" />}{label(order.collectionType)}</span></td><td className="px-4 py-3"><Status value={order.sampleStatus} /></td><td className="px-4 py-3"><Status value={order.report.status} /></td><td className="px-4 py-3"><Status value={order.payment.status} /><p className="mt-1 text-xs text-slate-500">{money(order.payment.paid)} / {money(order.payment.total)}</p></td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => onPayment(order)} className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-50">Payment</button>{order.orderStatus !== "cancelled" && <button disabled={busy === order._id} onClick={() => onUpdate(order._id, { orderStatus: "cancelled" }, "Booking cancelled")} className="rounded-md border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">Cancel</button>}</div></td></tr>)}</tbody></table></div></Panel>;
}

function PatientsView({ patients, busy, onOpen }: { patients: Patient[]; busy: string; onOpen: (id: string) => void }) {
  return <Panel>{patients.length ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><TableHead labels={["Patient", "Contact", "Age / Gender", "Visits", "Last visit", ""]} /><tbody>{patients.map(patient => <tr key={patient._id} className="border-t border-slate-100"><td className="px-4 py-3"><p className="font-semibold">{patient.name}</p><p className="text-xs text-slate-500">{patient.patientNumber}</p></td><td className="px-4 py-3"><p>{patient.phone}</p><p className="text-xs text-slate-500">{patient.email || "No email"}</p></td><td className="px-4 py-3 text-slate-600">{patient.age ?? "-"} / {patient.gender ? label(patient.gender) : "-"}</td><td className="px-4 py-3"><span className="font-bold">{patient.visitCount}</span>{patient.visitCount > 1 && <span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">Repeat</span>}</td><td className="px-4 py-3 text-slate-600">{dateTime(patient.lastVisitAt)}</td><td className="px-4 py-3 text-right"><button disabled={busy === patient._id} onClick={() => onOpen(patient._id)} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">History</button></td></tr>)}</tbody></table></div> : <Empty icon={Users} text="No patients found" />}</Panel>;
}

function SamplesView({ orders, busy, onUpdate }: { orders: Order[]; busy: string; onUpdate: (id: string, data: Record<string, unknown>, success: string) => void }) {
  return <Panel>{orders.length ? <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-sm"><TableHead labels={["Patient", "Barcode", "Collection", "Collector", "Tests", "Sample status"]} /><tbody>{orders.map(order => <tr key={order._id} className="border-t border-slate-100"><td className="px-4 py-3"><p className="font-semibold">{order.patient.name}</p><p className="text-xs text-slate-500">{order.orderNumber}</p></td><td className="px-4 py-3 font-mono text-xs">{order.barcode || "Not assigned"}</td><td className="px-4 py-3"><p>{label(order.collectionType)}</p><p className="max-w-56 truncate text-xs text-slate-500">{order.collectionAddress || "Center reception"}</p></td><td className="px-4 py-3 text-slate-600">{order.phlebotomist || "Unassigned"}</td><td className="px-4 py-3 text-slate-600">{order.tests.map(test => `${test.code} (${test.sampleType})`).join(", ")}</td><td className="px-4 py-3"><select disabled={busy === order._id} value={order.sampleStatus} onChange={event => onUpdate(order._id, { sampleStatus: event.target.value }, `Sample marked ${label(event.target.value)}`)} className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm">{sampleStatuses.map(status => <option key={status} value={status}>{label(status)}</option>)}</select></td></tr>)}</tbody></table></div> : <Empty icon={TestTube2} text="No samples found" />}</Panel>;
}

function ReportsView({ orders, busy, onUpload, onView, onSend }: { orders: Order[]; busy: string; onUpload: (order: Order, file?: File) => void; onView: (order: Order) => void; onSend: (order: Order) => void }) {
  return <Panel>{orders.length ? <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-sm"><TableHead labels={["Patient", "Tests", "Sample", "Report", "File", "Actions"]} /><tbody>{orders.map(order => <tr key={order._id} className="border-t border-slate-100"><td className="px-4 py-3"><p className="font-semibold">{order.patient.name}</p><p className="text-xs text-slate-500">{order.orderNumber}</p></td><td className="px-4 py-3 text-slate-600">{order.tests.map(test => test.code).join(", ")}</td><td className="px-4 py-3"><Status value={order.sampleStatus} /></td><td className="px-4 py-3"><Status value={order.report.status} /></td><td className="px-4 py-3 text-xs text-slate-500">{order.report.fileName || "No PDF"}</td><td className="px-4 py-3"><div className="flex flex-wrap gap-2"><label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-50"><Upload className="h-3.5 w-3.5" /> Upload<input type="file" accept="application/pdf" className="hidden" disabled={busy === order._id} onChange={event => void onUpload(order, event.target.files?.[0])} /></label>{order.report.fileId && <><button onClick={() => void onView(order)} className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-50"><Download className="h-3.5 w-3.5" /> View</button><button onClick={() => void onSend(order)} disabled={busy === order._id} className="inline-flex items-center gap-1 rounded-md bg-green-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-green-700"><Send className="h-3.5 w-3.5" /> WhatsApp</button></>}</div></td></tr>)}</tbody></table></div> : <Empty icon={FileCheck2} text="No reports found" />}</Panel>;
}

function TestsView({ tests, busy, onAdd, onEdit, onDelete, onToggle }: { tests: Test[]; busy: string; onAdd: () => void; onEdit: (test: Test) => void; onDelete: (test: Test) => void; onToggle: (test: Test) => void }) {
  return <div className="space-y-4"><div className="flex justify-end"><button onClick={onAdd} className="inline-flex h-10 items-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Add Test</button></div><Panel>{tests.length ? <div className="overflow-x-auto"><table className="w-full min-w-[950px] text-sm"><TableHead labels={["Code", "Test / Package", "Category", "Sample", "TAT", "Price", "Status", "Actions"]} /><tbody>{tests.map(test => <tr key={test._id} className="border-t border-slate-100"><td className="px-4 py-3 font-mono text-xs font-bold">{test.code}</td><td className="px-4 py-3"><p className="font-semibold">{test.name}</p><p className="max-w-md text-xs text-slate-500">{test.preparation || "Preparation confirmation required"}</p></td><td className="px-4 py-3 text-slate-600">{test.category}</td><td className="px-4 py-3">{test.sampleType}</td><td className="px-4 py-3">{test.turnaroundHours ? `${test.turnaroundHours}h` : "Confirm"}</td><td className="px-4 py-3 font-semibold">{test.priceType === "starting" ? "From " : ""}{money(test.price)}</td><td className="px-4 py-3"><button disabled={busy === test._id} onClick={() => void onToggle(test)} className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${test.active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-100 text-slate-500"}`}>{test.active ? "Active" : "Inactive"}</button></td><td className="px-4 py-3"><div className="flex gap-2"><button disabled={busy === test._id} onClick={() => onEdit(test)} className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"><Pencil className="h-3.5 w-3.5" /> Edit</button><button disabled={busy === test._id} onClick={() => void onDelete(test)} className="inline-flex items-center gap-1 rounded-md border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /> Delete</button></div></td></tr>)}</tbody></table></div> : <Empty icon={FlaskConical} text="No tests configured" />}</Panel></div>;
}

function ReferralsView({ referrals, onAdd }: { referrals: Referral[]; onAdd: () => void }) {
  return <div className="space-y-4"><div className="flex justify-end"><button onClick={onAdd} className="inline-flex h-10 items-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Add Referring Doctor</button></div><Panel>{referrals.length ? <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-sm"><TableHead labels={["Doctor", "Clinic", "Phone", "Patients", "Billed", "Commission", "Status"]} /><tbody>{referrals.map(item => <tr key={item._id} className="border-t border-slate-100"><td className="px-4 py-3 font-semibold">{item.doctorName}</td><td className="px-4 py-3 text-slate-600">{item.clinicName || "-"}</td><td className="px-4 py-3">{item.phone || "-"}</td><td className="px-4 py-3 font-semibold">{item.patients || 0}</td><td className="px-4 py-3">{money(item.billed || 0)}</td><td className="px-4 py-3">{item.commissionType === "none" ? "None" : `${item.commissionValue}${item.commissionType === "percentage" ? "%" : " fixed"}`}</td><td className="px-4 py-3"><Status value={item.active ? "active" : "inactive"} /></td></tr>)}</tbody></table></div> : <Empty icon={Stethoscope} text="No referral doctors added" />}</Panel></div>;
}

function InboxView({ conversations, selected, messages, onSelect, onSent, onError }: { conversations: Conversation[]; selected: Conversation | null; messages: Message[]; onSelect: (row: Conversation) => void; onSent: () => Promise<void>; onError: (text: string) => void }) {
  const [text, setText] = useState(""); const [sending, setSending] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); if (!selected || !text.trim()) return; setSending(true); try { await pathologyAPI.sendMessage(selected.phone, { message: text.trim(), patientName: selected.patientName, metaPhoneNumberId: selected.metaPhoneNumberId }); setText(""); await onSent(); } catch (error: any) { onError(error.response?.data?.error || "Message could not be sent"); } finally { setSending(false); } }
  return <div className="grid h-[calc(100dvh-190px)] min-h-[560px] max-h-[850px] grid-rows-[220px_minmax(0,1fr)] overflow-hidden rounded-lg border border-slate-200 bg-white lg:h-[calc(100vh-220px)] lg:grid-cols-[340px_minmax(0,1fr)] lg:grid-rows-1"><div className="flex min-h-0 flex-col border-b border-slate-200 lg:border-b-0 lg:border-r"><div className="shrink-0 border-b border-slate-200 px-4 py-3"><h2 className="font-bold">Patient conversations</h2><p className="text-xs text-slate-500">WhatsApp Business inbox</p></div><div className="min-h-0 flex-1 overflow-y-auto">{conversations.map(row => <button key={row.conversationId} onClick={() => void onSelect(row)} className={`w-full border-b border-slate-100 p-4 text-left hover:bg-slate-50 ${selected?.conversationId === row.conversationId ? "bg-green-50" : ""}`}><div className="flex gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700"><UserRound className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{row.patientName || `+${row.phone}`}</p><p className="truncate text-xs text-slate-500">{row.latestMessage}</p><p className="mt-1 text-[11px] text-slate-400">{row.messageCount} messages · {dateTime(row.latestAt)}</p></div></div></button>)}{!conversations.length && <Empty icon={MessageCircle} text="No WhatsApp conversations yet" />}</div></div><div className="flex min-h-0 flex-col overflow-hidden bg-slate-50">{selected ? <><div className="shrink-0 border-b border-slate-200 bg-white px-5 py-3"><p className="font-semibold">{selected.patientName || `+${selected.phone}`}</p><p className="text-xs text-slate-500">+{selected.phone}</p></div><div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">{messages.map(message => <div key={message._id} className={`flex ${message.sentBy === "patient" ? "justify-start" : "justify-end"}`}><div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-sm ${message.sentBy === "patient" ? "border border-slate-200 bg-white" : "bg-green-600 text-white"}`}><p className="whitespace-pre-wrap">{message.message || message.documentName || `[${message.type}]`}</p><p className={`mt-1 text-right text-[10px] ${message.sentBy === "patient" ? "text-slate-400" : "text-green-100"}`}>{dateTime(message.createdAt)}</p></div></div>)}</div><form onSubmit={submit} className="flex shrink-0 gap-2 border-t border-slate-200 bg-white p-4"><input value={text} onChange={event => setText(event.target.value)} placeholder="Reply to patient" className="h-10 min-w-0 flex-1 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-green-600" /><button disabled={sending || !text.trim()} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-green-600 px-4 text-sm font-semibold text-white disabled:opacity-50"><Send className="h-4 w-4" /> Send</button></form></> : <div className="flex flex-1 items-center justify-center"><Empty icon={MessageCircle} text="Select a patient conversation" /></div>}</div></div>;
}

type WhatsAppAiForm = {
  configured: boolean; metaPhoneNumberId: string; metaAccessToken: string; whatsappNumber: string; businessName: string;
  botName: string; welcomeMessage: string; customPrompt: string; aiModel: string; businessStart: string; businessEnd: string;
  timezone: string; enableWhatsAppBot: boolean; enableAppointmentBooking: boolean;
};

const emptyWhatsAppAiForm: WhatsAppAiForm = {
  configured: false, metaPhoneNumberId: "", metaAccessToken: "", whatsappNumber: "", businessName: "", botName: "Riya",
  welcomeMessage: "Hello! Welcome to our diagnostic center. How can I help you today?", customPrompt: "", aiModel: "",
  businessStart: "07:00", businessEnd: "19:00", timezone: "Asia/Kolkata", enableWhatsAppBot: true, enableAppointmentBooking: true,
};

function WhatsAppAiSetup({ onNotice }: { onNotice: (type: "ok" | "error", text: string) => void }) {
  const [form, setForm] = useState<WhatsAppAiForm>(emptyWhatsAppAiForm);
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://digital-api-46ss.onrender.com/api";
  const webhookUrl = `${apiBase.replace(/\/api\/?$/, "")}/whatsapp/webhook`;
  useEffect(() => { void (async () => {
    try {
      const data = (await pathologyAPI.getWhatsappConfig()).data.data;
      if (data.configured) setForm(current => ({ ...current, ...data, metaAccessToken: "", businessStart: data.businessHours?.start || "07:00", businessEnd: data.businessHours?.end || "19:00" }));
    } catch (error: any) { onNotice("error", error.response?.data?.error || "Could not load WhatsApp AI settings"); }
    finally { setLoading(false); }
  })(); }, []);
  const set = <K extends keyof WhatsAppAiForm>(key: K, value: WhatsAppAiForm[K]) => setForm(current => ({ ...current, [key]: value }));
  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true);
    try {
      const data: Record<string, unknown> = { ...form, businessHours: { start: form.businessStart, end: form.businessEnd } };
      delete data.configured; delete data.businessStart; delete data.businessEnd;
      if (!form.metaAccessToken) delete data.metaAccessToken;
      const saved = (await pathologyAPI.updateWhatsappConfig(data)).data.data;
      setForm(current => ({ ...current, ...saved, configured: true, metaAccessToken: "", businessStart: saved.businessHours?.start || current.businessStart, businessEnd: saved.businessHours?.end || current.businessEnd }));
      onNotice("ok", "Pathology WhatsApp AI connected successfully");
    } catch (error: any) { onNotice("error", error.response?.data?.error || "Could not save WhatsApp AI settings"); }
    finally { setSaving(false); }
  }
  if (loading) return <div className="flex h-60 items-center justify-center"><RefreshCw className="h-6 w-6 animate-spin text-teal-700" /></div>;
  return <form onSubmit={submit} className="space-y-5">
    <Panel><div className="border-b border-slate-200 p-5"><div className="flex items-center gap-3"><div className="rounded-lg bg-green-100 p-2 text-green-700"><Bot className="h-5 w-5" /></div><div><h2 className="font-bold">Common Pathology WhatsApp AI</h2><p className="text-sm text-slate-500">Connect any new Meta WhatsApp number. The common handler automatically loads this lab&apos;s prompt, catalog, bookings, and reports.</p></div></div></div>
      <div className="grid gap-4 p-5 sm:grid-cols-2"><Input label="Lab / provider name" required value={form.businessName} onChange={value => set("businessName", value)} /><Input label="Bot name" required value={form.botName} onChange={value => set("botName", value)} /><Input label="WhatsApp number with country code" required value={form.whatsappNumber} onChange={value => set("whatsappNumber", value)} /><Input label="Meta Phone Number ID" required value={form.metaPhoneNumberId} onChange={value => set("metaPhoneNumberId", value)} /><div className="sm:col-span-2"><Input label={form.configured ? "New permanent access token (leave blank to keep existing)" : "Meta permanent access token"} required={!form.configured} value={form.metaAccessToken} onChange={value => set("metaAccessToken", value)} /></div></div>
    </Panel>
    <Panel><div className="border-b border-slate-200 p-5"><h2 className="font-bold">Gemini AI behavior</h2><p className="text-sm text-slate-500">Your prompt customizes the bot but cannot override medical-safety, privacy, or tenant-isolation rules.</p></div><div className="space-y-4 p-5"><Input label="Welcome message" value={form.welcomeMessage} onChange={value => set("welcomeMessage", value)} /><label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Custom pathology prompt</span><textarea rows={10} value={form.customPrompt} onChange={event => set("customPrompt", event.target.value)} placeholder="Describe your lab, supported languages, collection rules, tone, special instructions, and when staff should take over..." className="w-full rounded-md border border-slate-300 p-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /><span className="mt-1 block text-right text-xs text-slate-400">{form.customPrompt.length}/12000</span></label><Input label="Gemini model override (optional)" value={form.aiModel} onChange={value => set("aiModel", value)} /></div></Panel>
    <Panel><div className="border-b border-slate-200 p-5"><h2 className="font-bold">Operations and Meta callback</h2></div><div className="grid gap-4 p-5 sm:grid-cols-2"><Input label="Opening time" type="time" value={form.businessStart} onChange={value => set("businessStart", value)} /><Input label="Closing time" type="time" value={form.businessEnd} onChange={value => set("businessEnd", value)} /><Input label="Timezone" value={form.timezone} onChange={value => set("timezone", value)} /><div className="rounded-md bg-slate-50 p-3 text-sm sm:col-span-2"><p className="text-xs font-semibold text-slate-500">SHARED META WEBHOOK CALLBACK URL</p><p className="mt-1 break-all font-mono text-xs text-slate-800">{webhookUrl}</p><p className="mt-2 text-xs text-slate-500">Use the server&apos;s WHATSAPP_VERIFY_TOKEN as the Meta verify token. The shared router selects the pathology handler automatically.</p></div><label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={form.enableWhatsAppBot} onChange={event => set("enableWhatsAppBot", event.target.checked)} /> Enable automatic AI replies</label><label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={form.enableAppointmentBooking} onChange={event => set("enableAppointmentBooking", event.target.checked)} /> Allow AI to create bookings</label></div></Panel>
    <div className="flex justify-end"><button disabled={saving} className="h-11 rounded-md bg-teal-700 px-6 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : form.configured ? "Save WhatsApp AI" : "Connect WhatsApp AI"}</button></div>
  </form>;
}

function BookingModal({ tests, referrals, onClose, onSaved }: { tests: Test[]; referrals: Referral[]; onClose: () => void; onSaved: () => Promise<void> }) {
  const now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const [form, setForm] = useState({ patientName: "", patientPhone: "", age: "", gender: "", email: "", address: "", appointmentAt: now.toISOString().slice(0, 16), collectionType: "center", collectionAddress: "", phlebotomist: "", referralId: "", discount: "0", paid: "0", paymentMethod: "", notes: "" });
  const [selectedTests, setSelectedTests] = useState<string[]>([]); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  const chosenTests = tests.filter(test => selectedTests.includes(test._id)); const total = chosenTests.reduce((sum, test) => sum + test.price, 0); const estimated = chosenTests.some(test => test.priceType === "starting");
  async function submit(event: FormEvent) { event.preventDefault(); setError(""); if (!selectedTests.length) return setError("Select at least one test"); setSaving(true); try { await pathologyAPI.createOrder({ ...form, age: form.age ? Number(form.age) : undefined, testIds: selectedTests, discount: Number(form.discount), paid: Number(form.paid) }); await onSaved(); } catch (exception: any) { setError(exception.response?.data?.error || "Booking could not be created"); } finally { setSaving(false); } }
  return <Modal title="New Diagnostic Booking" onClose={onClose}><form onSubmit={submit} className="space-y-5">{error && <ErrorBox text={error} />}<fieldset><legend className="mb-3 text-sm font-bold">Patient details</legend><div className="grid gap-3 sm:grid-cols-2"><Input label="Patient name" required value={form.patientName} onChange={value => setForm({ ...form, patientName: value })} /><Input label="Phone number" required value={form.patientPhone} onChange={value => setForm({ ...form, patientPhone: value })} /><Input label="Age" type="number" value={form.age} onChange={value => setForm({ ...form, age: value })} /><Select label="Gender" value={form.gender} onChange={value => setForm({ ...form, gender: value })} options={[['', 'Select'], ['male', 'Male'], ['female', 'Female'], ['other', 'Other']]} /><Input label="Email" type="email" value={form.email} onChange={value => setForm({ ...form, email: value })} /><Input label="Address" value={form.address} onChange={value => setForm({ ...form, address: value })} /></div></fieldset><fieldset><legend className="mb-3 text-sm font-bold">Tests and package</legend><div className="grid max-h-56 gap-2 overflow-y-auto rounded-md border border-slate-200 p-3 sm:grid-cols-2">{tests.map(test => <label key={test._id} className="flex cursor-pointer items-start gap-2 rounded-md border border-slate-200 p-3 hover:bg-slate-50"><input type="checkbox" checked={selectedTests.includes(test._id)} onChange={() => setSelectedTests(current => current.includes(test._id) ? current.filter(id => id !== test._id) : [...current, test._id])} className="mt-1" /><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{test.name}</span><span className="block text-xs text-slate-500">{test.sampleType} · {test.turnaroundHours}h · {money(test.price)}</span></span></label>)}</div><p className="mt-2 text-right text-sm font-bold">Test total: {money(total)}</p></fieldset><fieldset><legend className="mb-3 text-sm font-bold">Collection and payment</legend><div className="grid gap-3 sm:grid-cols-2"><Input label="Date and time" type="datetime-local" required value={form.appointmentAt} onChange={value => setForm({ ...form, appointmentAt: value })} /><Select label="Collection" value={form.collectionType} onChange={value => setForm({ ...form, collectionType: value })} options={[["center", "Center visit"], ["home", "Home collection"]]} />{form.collectionType === "home" && <Input label="Collection address" required value={form.collectionAddress} onChange={value => setForm({ ...form, collectionAddress: value })} />}<Input label="Phlebotomist" value={form.phlebotomist} onChange={value => setForm({ ...form, phlebotomist: value })} /><Select label="Referring doctor" value={form.referralId} onChange={value => setForm({ ...form, referralId: value })} options={[["", "Direct patient"], ...referrals.map(item => [item._id, `${item.doctorName}${item.clinicName ? ` - ${item.clinicName}` : ""}`])]} /><Input label="Discount" type="number" value={form.discount} onChange={value => setForm({ ...form, discount: value })} /><Input label="Amount paid" type="number" value={form.paid} onChange={value => setForm({ ...form, paid: value })} /><Select label="Payment method" value={form.paymentMethod} onChange={value => setForm({ ...form, paymentMethod: value })} options={[["", "Not selected"], ["cash", "Cash"], ["upi", "UPI"], ["card", "Card"], ["online", "Online"]]} /></div></fieldset><div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="h-10 rounded-md border border-slate-300 px-4 text-sm font-semibold">Cancel</button><button disabled={saving} className="h-10 rounded-md bg-teal-700 px-5 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Creating..." : "Create booking"}</button></div></form></Modal>;
}

function TestModal({ test, onClose, onSaved }: { test: Test | null; onClose: () => void; onSaved: () => Promise<void> }) {
  const [form, setForm] = useState({ code: test?.code || "", name: test?.name || "", category: test?.category || "Imaging", sampleType: test?.sampleType || "Imaging", homeCollectionAllowed: test?.homeCollectionAllowed ?? false, price: test ? String(test.price) : "", priceType: test?.priceType || "fixed", turnaroundHours: test?.turnaroundHours ? String(test.turnaroundHours) : "", preparation: test?.preparation || "" }); const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setSaving(true); setError(""); try { const data = { ...form, price: Number(form.price), turnaroundHours: form.turnaroundHours ? Number(form.turnaroundHours) : null }; if (test) await pathologyAPI.updateTest(test._id, data); else await pathologyAPI.createTest(data); await onSaved(); } catch (exception: any) { setError(exception.response?.data?.error || "Could not save test"); } finally { setSaving(false); } }
  return <Modal title={test ? "Edit Test or Package" : "Add Test or Package"} onClose={onClose}><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">{error && <div className="sm:col-span-2"><ErrorBox text={error} /></div>}<Input label="Test code" required value={form.code} onChange={value => setForm({ ...form, code: value })} /><Input label="Test name" required value={form.name} onChange={value => setForm({ ...form, name: value })} /><Input label="Category" required value={form.category} onChange={value => setForm({ ...form, category: value })} /><Input label="Sample / service type" required value={form.sampleType} onChange={value => setForm({ ...form, sampleType: value })} /><Input label="Price" type="number" required value={form.price} onChange={value => setForm({ ...form, price: value })} /><Select label="Price type" value={form.priceType} onChange={value => setForm({ ...form, priceType: value as "fixed" | "starting" })} options={[["fixed", "Fixed price"], ["starting", "Starting price"]]} /><Input label="TAT in hours (optional)" type="number" value={form.turnaroundHours} onChange={value => setForm({ ...form, turnaroundHours: value })} /><label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={form.homeCollectionAllowed} onChange={event => setForm({ ...form, homeCollectionAllowed: event.target.checked })} /> Allow home sample collection</label><div className="sm:col-span-2"><Input label="Provider-confirmed preparation instructions" value={form.preparation} onChange={value => setForm({ ...form, preparation: value })} /></div><div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={onClose} className="h-10 rounded-md border border-slate-300 px-4 text-sm font-semibold">Cancel</button><button disabled={saving} className="h-10 rounded-md bg-teal-700 px-5 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : test ? "Save changes" : "Add test"}</button></div></form></Modal>;
}

function ReferralModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => Promise<void> }) {
  const [form, setForm] = useState({ doctorName: "", clinicName: "", phone: "", email: "", commissionType: "none", commissionValue: "0" }); const [error, setError] = useState("");
  async function submit(event: FormEvent) { event.preventDefault(); try { await pathologyAPI.createReferral({ ...form, commissionValue: Number(form.commissionValue) }); await onSaved(); } catch (exception: any) { setError(exception.response?.data?.error || "Could not add referral doctor"); } }
  return <Modal title="Add Referring Doctor" onClose={onClose}><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">{error && <div className="sm:col-span-2"><ErrorBox text={error} /></div>}<Input label="Doctor name" required value={form.doctorName} onChange={value => setForm({ ...form, doctorName: value })} /><Input label="Clinic / Hospital" value={form.clinicName} onChange={value => setForm({ ...form, clinicName: value })} /><Input label="Phone" value={form.phone} onChange={value => setForm({ ...form, phone: value })} /><Input label="Email" type="email" value={form.email} onChange={value => setForm({ ...form, email: value })} /><Select label="Commission" value={form.commissionType} onChange={value => setForm({ ...form, commissionType: value })} options={[["none", "No commission"], ["percentage", "Percentage"], ["fixed", "Fixed amount"]]} /><Input label="Commission value" type="number" value={form.commissionValue} onChange={value => setForm({ ...form, commissionValue: value })} /><div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={onClose} className="h-10 rounded-md border border-slate-300 px-4 text-sm font-semibold">Cancel</button><button className="h-10 rounded-md bg-teal-700 px-5 text-sm font-semibold text-white">Add doctor</button></div></form></Modal>;
}

function PaymentModal({ order, onClose, onSaved }: { order: Order; onClose: () => void; onSaved: () => Promise<void> }) {
  const [paid, setPaid] = useState(String(order.payment.paid)); const [discount, setDiscount] = useState(String(order.payment.discount)); const [method, setMethod] = useState(order.payment.method || ""); const [error, setError] = useState("");
  async function submit(event: FormEvent) { event.preventDefault(); try { await pathologyAPI.updateOrder(order._id, { payment: { paid: Number(paid), discount: Number(discount), method } }); await onSaved(); } catch (exception: any) { setError(exception.response?.data?.error || "Payment update failed"); } }
  return <Modal title={`Payment - ${order.orderNumber}`} onClose={onClose}><form onSubmit={submit} className="space-y-4">{error && <ErrorBox text={error} />}<div className="rounded-md bg-slate-50 p-4 text-sm"><div className="flex justify-between"><span>Subtotal</span><b>{money(order.payment.subtotal)}</b></div><div className="mt-2 flex justify-between"><span>Current total</span><b>{money(order.payment.total)}</b></div></div><div className="grid gap-3 sm:grid-cols-2"><Input label="Discount" type="number" value={discount} onChange={setDiscount} /><Input label="Total amount received" type="number" value={paid} onChange={setPaid} /><Select label="Payment method" value={method} onChange={setMethod} options={[["", "Not selected"], ["cash", "Cash"], ["upi", "UPI"], ["card", "Card"], ["online", "Online"]]} /></div><div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="h-10 rounded-md border border-slate-300 px-4 text-sm font-semibold">Cancel</button><button className="h-10 rounded-md bg-teal-700 px-5 text-sm font-semibold text-white">Save payment</button></div></form></Modal>;
}

function PatientHistory({ data }: { data: { patient: Patient; orders: Order[]; repeatPatient: boolean } }) {
  return <div className="space-y-5"><div className="grid gap-3 rounded-md bg-slate-50 p-4 sm:grid-cols-3"><div><p className="text-xs text-slate-500">Phone</p><p className="font-semibold">{data.patient.phone}</p></div><div><p className="text-xs text-slate-500">Age / Gender</p><p className="font-semibold">{data.patient.age ?? "-"} / {data.patient.gender ? label(data.patient.gender) : "-"}</p></div><div><p className="text-xs text-slate-500">Patient type</p><p className="font-semibold">{data.repeatPatient ? "Repeat patient" : "First visit"}</p></div></div><div><h3 className="mb-3 text-sm font-bold">Test history</h3><div className="space-y-2">{data.orders.map(order => <div key={order._id} className="rounded-md border border-slate-200 p-3"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">{order.tests.map(test => test.name).join(", ")}</p><p className="mt-1 text-xs text-slate-500">{order.orderNumber} · {dateTime(order.appointmentAt)}</p></div><Status value={order.report.status} /></div></div>)}</div></div></div>;
}

function Panel({ children }: { children: React.ReactNode }) { return <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">{children}</section>; }
function TableHead({ labels }: { labels: string[] }) { return <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500"><tr>{labels.map((text, index) => <th key={`${text}-${index}`} className="px-4 py-3">{text}</th>)}</tr></thead>; }
function Input({ label: text, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) { return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">{text}</span><input type={type} required={required} value={value} onChange={event => onChange(event.target.value)} className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>; }
function Select({ label: text, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) { return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">{text}</span><select value={value} onChange={event => onChange(event.target.value)} className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-teal-600">{options.map(option => <option key={option[0]} value={option[0]}>{option[1]}</option>)}</select></label>; }
function ErrorBox({ text }: { text: string }) { return <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{text}</div>; }
