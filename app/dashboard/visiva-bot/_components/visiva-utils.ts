export function formatPhone(phone: string) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  if (digits.length > 10) return `+${digits}`;
  return phone;
}

export function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const stateLabels: Record<string, string> = {
  NEW: "New",
  QUALIFYING: "Qualifying",
  APPOINTMENT_PENDING: "Appointment Pending",
  APPOINTMENT_SCHEDULED: "Appointment Scheduled",
  ESCALATED: "Escalated",
  OPTED_OUT: "Opted Out",
  COMPLETED: "Completed",
};

export const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  appointment_scheduled: "Appointment Scheduled",
  not_interested: "Not Interested",
  escalated: "Escalated",
  closed: "Closed",
};

export const interestLabels: Record<string, string> = {
  alto: "High",
  medio: "Medium",
  bajo: "Low",
  unknown: "Unknown",
};

export const modalityLabels: Record<string, string> = {
  presencial: "Presencial",
  en_linea: "En linea",
  mixto: "Mixto",
  unknown: "Unknown",
};

export function stateClass(state: string) {
  if (state === "APPOINTMENT_SCHEDULED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (state === "ESCALATED") return "bg-red-50 text-red-700 border-red-200";
  if (state === "OPTED_OUT") return "bg-slate-100 text-slate-600 border-slate-200";
  if (state === "APPOINTMENT_PENDING") return "bg-sky-50 text-sky-700 border-sky-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

export function interestClass(interest: string) {
  if (interest === "alto") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (interest === "medio") return "bg-amber-50 text-amber-700 border-amber-200";
  if (interest === "bajo") return "bg-slate-100 text-slate-600 border-slate-200";
  return "bg-sky-50 text-sky-700 border-sky-200";
}
