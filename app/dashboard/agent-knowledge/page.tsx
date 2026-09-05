"use client";

import Sidebar from "@/components/Sidebar";
import { useWebSocket } from "@/components/hooks/use-websocket";
import {
  agentKnowledgeAPI,
  authAPI,
  type AgentKnowledgeConnection,
} from "@/lib/api";
import {
  AlertCircle,
  BookOpen,
  Cable,
  Check,
  Loader2,
  Menu,
  Phone,
  RefreshCw,
  Save,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function errorMessage(error: unknown, fallback: string) {
  const data = (error as { response?: { data?: { message?: string; error?: string } } })
    ?.response?.data;
  return data?.message || data?.error || fallback;
}

function isAgentKnowledgeService(value?: string) {
  return ["lead-analysis", "lead", "real-estate-crm", "real-estate", "hospitality-crm"].includes(String(value || "").trim().toLowerCase());
}

export default function AgentKnowledgePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [instructions, setInstructions] = useState("");
  const [savedInstructions, setSavedInstructions] = useState("");
  const [saving, setSaving] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [saved, setSaved] = useState(false);
  const [workspaceLabel, setWorkspaceLabel] = useState("Lead Analysis");
  const [hospitalityWorkspace, setHospitalityWorkspace] = useState(false);
  const dirty = instructions !== savedInstructions;
  const knowledgeQuery = useQuery<AgentKnowledgeConnection[]>({
    queryKey: ["agent-knowledge"],
    queryFn: async () => {
      const response = await agentKnowledgeAPI.list(true);
      return response.data.connections || [];
    },
    staleTime: 15_000,
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
    retry: false,
  });
  const connections = knowledgeQuery.data || [];
  const loading = knowledgeQuery.isLoading && connections.length === 0;
  const error = syncError || (knowledgeQuery.error
    ? errorMessage(knowledgeQuery.error, "Could not load the connected Vozon agent.")
    : "");

  useWebSocket({
    onMessage: (message) => {
      if (message?.type !== "agent-knowledge-updated") return;
      void queryClient.invalidateQueries({ queryKey: ["agent-knowledge"], exact: true });
    },
  });

  useEffect(() => {
    let cancelled = false;
    const verifyAccess = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        if (cancelled) return;
        const selectedService = String(response.data.selectedService || "").toLowerCase();
        const isHospitality = selectedService === "hospitality-crm";
        const hasAgentKnowledgeAccess = isHospitality
          || response.data.legacyPhoneFallback === false
          || response.data.legacyAgentKnowledgeEnabled === true;
        setHospitalityWorkspace(isHospitality);
        if (isHospitality) {
          setWorkspaceLabel("Hotel & Restaurant CRM");
        } else if (["real-estate-crm", "real-estate"].includes(selectedService)) {
          setWorkspaceLabel("Real Estate CRM");
        }
        if (!isAgentKnowledgeService(selectedService) || !hasAgentKnowledgeAccess) {
          router.replace("/dashboard");
          return;
        }
      } catch {
        if (!cancelled) router.replace("/dashboard");
      }
    };

    void verifyAccess();
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    const next = connections.find((connection) => connection.connectorId === selectedId)
      || connections[0]
      || null;
    if (!next) {
      setSelectedId("");
      if (!dirty) {
        setInstructions("");
        setSavedInstructions("");
      }
      return;
    }
    if (selectedId !== next.connectorId) setSelectedId(next.connectorId);
    if (!dirty) {
      setInstructions(next.instructions || "");
      setSavedInstructions(next.instructions || "");
    }
  }, [connections, selectedId, dirty]);

  const selected = useMemo(
    () => connections.find((connection) => connection.connectorId === selectedId) || null,
    [connections, selectedId]
  );
  const selectConnection = (connectorId: string) => {
    if (dirty && !window.confirm("Discard unsaved Agent Knowledge changes?")) return;
    const next = connections.find((connection) => connection.connectorId === connectorId);
    setSelectedId(connectorId);
    setInstructions(next?.instructions || "");
    setSavedInstructions(next?.instructions || "");
    setSaved(false);
    setSyncError("");
  };

  const refreshKnowledge = async () => {
    if (dirty && !window.confirm("Discard unsaved Agent Knowledge changes?")) return;
    setSyncError("");
    setSaved(false);
    await knowledgeQuery.refetch();
  };

  const saveKnowledge = async () => {
    if (!selected || !instructions.trim()) {
      setSyncError("Agent Knowledge cannot be empty.");
      return;
    }
    try {
      setSaving(true);
      setSaved(false);
      setSyncError("");
      const response = await agentKnowledgeAPI.update(selected.connectorId, instructions.trim());
      const updated = response.data.connection;
      queryClient.setQueryData<AgentKnowledgeConnection[]>(["agent-knowledge"], (current = []) =>
        current.map((item) => item.connectorId === updated.connectorId ? updated : item)
      );
      setInstructions(updated.instructions);
      setSavedInstructions(updated.instructions);
      setSaved(true);
    } catch (saveError) {
      setSyncError(errorMessage(saveError, "Could not update Agent Knowledge in Vozon."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-4 z-40 grid h-11 w-11 place-items-center rounded-md border border-zinc-200 bg-white shadow-sm lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="lg:pl-64">
        <header className="border-b border-zinc-200 bg-white">
          <div className="px-4 pb-6 pt-20 sm:px-6 lg:px-8 lg:pt-7">
            <p className="text-xs font-semibold uppercase text-orange-700">{workspaceLabel}</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{hospitalityWorkspace ? "AI Prompt" : "Agent Knowledge"}</h1>
                <p className="mt-2 text-sm text-zinc-500">
                  {hospitalityWorkspace
                    ? "Conversation instructions for your connected hotel and restaurant voice agent."
                    : "Conversation instructions for the connected Vozon agent."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void refreshKnowledge()}
                disabled={knowledgeQuery.isFetching || saving}
                title="Refresh from Vozon"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${knowledgeQuery.isFetching ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="grid min-h-[360px] place-items-center border-y border-zinc-200 bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              </div>
            ) : connections.length === 0 ? (
              <section className="border-y border-zinc-200 bg-white px-5 py-16 text-center">
                <Cable className="mx-auto h-9 w-9 text-zinc-400" />
                <h2 className="mt-4 text-lg font-bold">No Vozon agent connected</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">Connect and bind a Vozon agent before editing Agent Knowledge.</p>
                <Link
                  href="/dashboard/connectors"
                  className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-orange-600 px-4 text-sm font-semibold text-white hover:bg-orange-700"
                >
                  <Cable className="h-4 w-4" />
                  Open Connectors
                </Link>
              </section>
            ) : (
              <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
                <div className="grid gap-4 border-b border-zinc-200 bg-zinc-50 px-5 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                  <label className="block min-w-0">
                    <span className="mb-1.5 block text-xs font-semibold uppercase text-zinc-500">Connected agent</span>
                    {connections.length > 1 ? (
                      <select
                        value={selectedId}
                        onChange={(event) => selectConnection(event.target.value)}
                        className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      >
                        {connections.map((connection) => (
                          <option key={connection.connectorId} value={connection.connectorId}>{connection.agentName}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex h-11 items-center gap-3 text-sm font-semibold">
                        <span className="grid h-9 w-9 place-items-center rounded-md bg-orange-100 text-orange-700"><BookOpen className="h-4 w-4" /></span>
                        <span className="truncate">{selected?.agentName}</span>
                      </div>
                    )}
                  </label>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                    <span className={`inline-flex items-center gap-1.5 ${selected?.available ? "text-emerald-700" : "text-rose-700"}`}>
                      <span className={`h-2 w-2 rounded-full ${selected?.available ? "bg-emerald-500" : "bg-rose-500"}`} />
                      {selected?.available ? "Synced with Vozon" : "Agent unavailable"}
                    </span>
                    {selected?.phoneNumber && (
                      <span className="inline-flex items-center gap-1.5 text-zinc-600"><Phone className="h-3.5 w-3.5" />{selected.phoneNumber}</span>
                    )}
                  </div>
                </div>

                <section className="px-5 py-5 sm:px-6 sm:py-6">
                  <div className="flex items-center justify-between gap-4">
                    <label htmlFor="agent-knowledge" className="text-sm font-bold text-zinc-800">Instructions</label>
                    <span className="text-xs tabular-nums text-zinc-500">{instructions.length.toLocaleString()} / 30,000</span>
                  </div>
                  <textarea
                    id="agent-knowledge"
                    value={instructions}
                    onChange={(event) => { setInstructions(event.target.value); setSaved(false); }}
                    disabled={!selected?.available || saving}
                    maxLength={30000}
                    rows={18}
                    placeholder={hospitalityWorkspace
                      ? "Define the hotel and restaurant assistant's tone, reservation flow, guest questions, policies, upsell rules, and staff handoff instructions."
                      : "Define the lead qualification goals, questions, boundaries, and handoff rules."}
                    className="mt-2 min-h-[360px] w-full resize-y rounded-md border border-zinc-300 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-zinc-100 disabled:text-zinc-500"
                  />
                  <div className="mt-4 flex flex-col gap-3 border-t border-zinc-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm">
                      {saved ? (
                        <span className="inline-flex items-center gap-2 font-semibold text-emerald-700"><Check className="h-4 w-4" />Saved to Vozon</span>
                      ) : dirty ? (
                        <span className="font-medium text-amber-700">Unsaved changes</span>
                      ) : (
                        <span className="text-zinc-500">Knowledge is up to date</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => void saveKnowledge()}
                      disabled={!selected?.available || !dirty || !instructions.trim() || saving}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-orange-600 px-5 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {saving ? "Saving" : "Save to Vozon"}
                    </button>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
