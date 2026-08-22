"use client";

import {
  AlertCircle,
  Cable,
  CheckCircle2,
  Clipboard,
  FileSpreadsheet,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  SheetAutomationConfig,
  SheetAutomationJob,
  sheetAutomationAPI,
} from "@/lib/api";

type FormState = {
  sheetUrl: string;
  sheetName: string;
  headerRow: number;
  phoneColumn: string;
  nameColumn: string;
  timezone: string;
  windowStart: string;
  windowEnd: string;
  maxCallsPerPoll: number;
  maxAttempts: number;
  pollIntervalSeconds: number;
};

const DEFAULT_FORM: FormState = {
  sheetUrl: "",
  sheetName: "Sheet1",
  headerRow: 1,
  phoneColumn: "",
  nameColumn: "",
  timezone: "Asia/Kolkata",
  windowStart: "09:00",
  windowEnd: "18:00",
  maxCallsPerPoll: 10,
  maxAttempts: 2,
  pollIntervalSeconds: 60,
};

function formFromAutomation(automation: SheetAutomationConfig | null): FormState {
  if (!automation) return DEFAULT_FORM;
  return {
    sheetUrl: automation.sheetUrl,
    sheetName: automation.sheetName,
    headerRow: automation.headerRow,
    phoneColumn: automation.phoneColumn,
    nameColumn: automation.nameColumn,
    timezone: automation.timezone,
    windowStart: automation.windowStart,
    windowEnd: automation.windowEnd,
    maxCallsPerPoll: automation.maxCallsPerPoll,
    maxAttempts: automation.maxAttempts,
    pollIntervalSeconds: automation.pollIntervalSeconds,
  };
}

function errorMessage(error: unknown) {
  const candidate = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
  return candidate.response?.data?.message || candidate.response?.data?.error || candidate.message || "Request failed";
}

function resultLabel(job: SheetAutomationJob) {
  if (job.disposition) return job.disposition.replaceAll("_", " ");
  return job.status;
}

export default function SheetAutomationModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [automation, setAutomation] = useState<SheetAutomationConfig | null>(null);
  const [jobs, setJobs] = useState<SheetAutomationJob[]>([]);
  const [serviceAccountEmail, setServiceAccountEmail] = useState("");
  const [serverReady, setServerReady] = useState({ sheets: false, calling: false });
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await sheetAutomationAPI.get();
      const data = response.data.data;
      setAutomation(data.automation);
      setJobs(data.recentJobs || []);
      setServiceAccountEmail(data.serviceAccountEmail || "");
      setServerReady({ sheets: data.configured, calling: data.callingConfigured });
      setForm(formFromAutomation(data.automation));
    } catch (error) {
      setNotice({ type: "error", text: errorMessage(error) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const testConnection = async () => {
    setBusy("test");
    setNotice(null);
    try {
      const response = await sheetAutomationAPI.test(form);
      const data = response.data.data;
      setForm((current) => ({
        ...current,
        phoneColumn: data.detectedPhoneColumn || current.phoneColumn,
        nameColumn: data.detectedNameColumn || current.nameColumn,
      }));
      setNotice({ type: "success", text: `Connected. ${data.rowCount} lead rows found.` });
    } catch (error) {
      setNotice({ type: "error", text: errorMessage(error) });
    } finally {
      setBusy(null);
    }
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setBusy("save");
    setNotice(null);
    try {
      await sheetAutomationAPI.save(form);
      await load();
      setNotice({ type: "success", text: "Sheet automation is active." });
    } catch (error) {
      setNotice({ type: "error", text: errorMessage(error) });
    } finally {
      setBusy(null);
    }
  };

  const runAction = async (action: "sync" | "pause" | "resume") => {
    setBusy(action);
    setNotice(null);
    try {
      await sheetAutomationAPI[action]();
      await load();
      setNotice({
        type: "success",
        text: action === "sync" ? "Sheet checked successfully." : action === "pause" ? "Automation paused." : "Automation resumed.",
      });
    } catch (error) {
      setNotice({ type: "error", text: errorMessage(error) });
    } finally {
      setBusy(null);
    }
  };

  const disconnect = async () => {
    if (!window.confirm("Disconnect this Google Sheet automation?")) return;
    setBusy("disconnect");
    try {
      await sheetAutomationAPI.disconnect();
      setAutomation(null);
      setJobs([]);
      setForm(DEFAULT_FORM);
      setNotice({ type: "success", text: "Google Sheet disconnected." });
    } catch (error) {
      setNotice({ type: "error", text: errorMessage(error) });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-3 sm:p-6" onMouseDown={onClose}>
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-950 sm:text-lg">Google Sheet Automation</h2>
              <p className="text-xs text-slate-500">{automation ? `${automation.status} · ${automation.sheetName}` : "Not connected"}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          {loading ? (
            <div className="flex min-h-80 items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-teal-600" />
            </div>
          ) : (
            <form onSubmit={save} className="space-y-6 p-5 sm:p-6">
              {notice && (
                <div className={`flex items-start gap-2 rounded-md border px-3.5 py-3 text-sm ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>
                  {notice.type === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
                  <span>{notice.text}</span>
                </div>
              )}

              {(!serverReady.sheets || !serverReady.calling) && (
                <div className="flex flex-col gap-3 rounded-md border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    {!serverReady.sheets ? "Google service-account credentials are missing on the API. " : ""}
                    {!serverReady.calling ? "Connect Vozon before enabling outbound Sheet calls." : ""}
                  </span>
                  {!serverReady.calling && (
                    <Link href="/dashboard/connectors" onClick={onClose} className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-amber-300 bg-white px-3 text-xs font-bold text-amber-900 hover:bg-amber-100">
                      <Cable className="h-4 w-4" /> Connect Vozon
                    </Link>
                  )}
                </div>
              )}

              {serviceAccountEmail && (
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Sheet access account</label>
                  <div className="flex min-w-0 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-700">{serviceAccountEmail}</span>
                    <button type="button" onClick={() => navigator.clipboard?.writeText(serviceAccountEmail)} className="rounded p-1.5 text-slate-500 hover:bg-white hover:text-slate-900" aria-label="Copy service account email" title="Copy service account email">
                      <Clipboard className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">Google Sheet URL</span>
                  <input required type="url" value={form.sheetUrl} onChange={(event) => update("sheetUrl", event.target.value)} placeholder="https://docs.google.com/spreadsheets/d/..." className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">Sheet tab</span>
                  <input required value={form.sheetName} onChange={(event) => update("sheetName", event.target.value)} className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">Header row</span>
                  <input required min={1} max={100} type="number" value={form.headerRow} onChange={(event) => update("headerRow", Number(event.target.value))} className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">Phone column</span>
                  <input value={form.phoneColumn} onChange={(event) => update("phoneColumn", event.target.value)} placeholder="Auto-detect" className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">Name column</span>
                  <input value={form.nameColumn} onChange={(event) => update("nameColumn", event.target.value)} placeholder="Auto-detect" className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                </label>
              </div>

              <div className="grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-3">
                <label>
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">Start time</span>
                  <input type="time" value={form.windowStart} onChange={(event) => update("windowStart", event.target.value)} className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm" />
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">End time</span>
                  <input type="time" value={form.windowEnd} onChange={(event) => update("windowEnd", event.target.value)} className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm" />
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">Timezone</span>
                  <select value={form.timezone} onChange={(event) => update("timezone", event.target.value)} className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
                    <option value="Asia/Kolkata">India</option>
                    <option value="Asia/Dubai">Dubai</option>
                    <option value="Europe/London">London</option>
                    <option value="America/New_York">New York</option>
                    <option value="America/Los_Angeles">Los Angeles</option>
                  </select>
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">Calls per check</span>
                  <input min={1} max={100} type="number" value={form.maxCallsPerPoll} onChange={(event) => update("maxCallsPerPoll", Number(event.target.value))} className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm" />
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">Max attempts</span>
                  <input min={1} max={5} type="number" value={form.maxAttempts} onChange={(event) => update("maxAttempts", Number(event.target.value))} className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm" />
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">Check interval</span>
                  <select value={form.pollIntervalSeconds} onChange={(event) => update("pollIntervalSeconds", Number(event.target.value))} className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={300}>5 minutes</option>
                    <option value={900}>15 minutes</option>
                  </select>
                </label>
              </div>

              {jobs.length > 0 && (
                <div className="border-t border-slate-200 pt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Recent rows</h3>
                    <span className="text-xs text-slate-500">Last {jobs.length}</span>
                  </div>
                  <div className="overflow-x-auto rounded-md border border-slate-200">
                    <table className="w-full min-w-[560px] text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr><th className="px-3 py-2 font-semibold">Row</th><th className="px-3 py-2 font-semibold">Lead</th><th className="px-3 py-2 font-semibold">Phone</th><th className="px-3 py-2 font-semibold">Result</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {jobs.map((job) => (
                          <tr key={job.id}>
                            <td className="px-3 py-2 font-mono text-slate-500">{job.rowNumber}</td>
                            <td className="max-w-48 truncate px-3 py-2 font-medium text-slate-800">{job.customerName || "Unnamed"}</td>
                            <td className="px-3 py-2 font-mono text-slate-600">{job.phoneNumber}</td>
                            <td className="px-3 py-2 capitalize text-slate-700">{resultLabel(job)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  {automation && (
                    <button type="button" onClick={disconnect} disabled={Boolean(busy)} className="inline-flex h-10 items-center gap-2 rounded-md border border-rose-200 px-3 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50">
                      <Trash2 className="h-4 w-4" /> Disconnect
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  {automation && (
                    <>
                      <button type="button" onClick={() => runAction("sync")} disabled={Boolean(busy)} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                        <RefreshCw className={`h-4 w-4 ${busy === "sync" ? "animate-spin" : ""}`} /> Sync now
                      </button>
                      <button type="button" onClick={() => runAction(automation.status === "active" ? "pause" : "resume")} disabled={Boolean(busy)} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                        {automation.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {automation.status === "active" ? "Pause" : "Resume"}
                      </button>
                    </>
                  )}
                  <button type="button" onClick={testConnection} disabled={Boolean(busy) || !form.sheetUrl} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                    {busy === "test" && <Loader2 className="h-4 w-4 animate-spin" />} Test
                  </button>
                  <button type="submit" disabled={Boolean(busy) || !serverReady.sheets || !serverReady.calling} className="inline-flex h-10 items-center gap-2 rounded-md bg-teal-600 px-4 text-sm font-bold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50">
                    {busy === "save" && <Loader2 className="h-4 w-4 animate-spin" />} {automation ? "Save" : "Connect"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
