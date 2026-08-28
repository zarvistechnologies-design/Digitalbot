"use client";

import Sidebar from "@/components/Sidebar";
import { DASHBOARD_QUERY_KEYS } from "@/lib/dashboard-query";
import {
  authAPI,
  connectorsAPI,
  workspaceAiAPI,
  type ConnectorProvider,
  type VoiceConnector,
  type WorkspaceAiReadiness,
} from "@/lib/api";
import {
  Cable,
  Check,
  Copy,
  KeyRound,
  Loader2,
  Menu,
  RefreshCw,
  RotateCw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const PROVIDERS: Array<{ value: ConnectorProvider; label: string }> = [
  { value: "vozon", label: "Vozon" },
  { value: "vapi", label: "Vapi" },
  { value: "retell", label: "Retell" },
  { value: "synthflow", label: "Synthflow" },
  { value: "custom", label: "Custom provider" },
];

function errorMessage(error: unknown, fallback: string) {
  const responseMessage = (error as { response?: { data?: { message?: string; error?: string } } })
    ?.response?.data;
  return responseMessage?.message || responseMessage?.error || fallback;
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
  if (!copied) throw new Error("Your browser could not copy the token");
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

function formatDate(value?: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function providerLabel(provider: ConnectorProvider) {
  return PROVIDERS.find((option) => option.value === provider)?.label || provider;
}

function serviceLabel(service: string) {
  return ({
    "doctor-dashboard": "Doctor Dashboard",
    "event-booking-crm": "Event Booking CRM",
    "pathology-diagnostic": "Pathology Diagnostic",
    "lead-analysis": "Lead Analysis",
    "real-estate-crm": "Real Estate CRM",
    "customer-support": "Customer Support",
  } as Record<string, string>)[service] || "Workspace";
}

export default function ConnectorsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const cachedConnections = queryClient.getQueryData<VoiceConnector[]>(DASHBOARD_QUERY_KEYS.connectors);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [connections, setConnections] = useState<VoiceConnector[]>(() => cachedConnections || []);
  const [provider, setProvider] = useState<ConnectorProvider>("vozon");
  const [name, setName] = useState("Vozon voice connection");
  const [loading, setLoading] = useState(() => !cachedConnections);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [tokenLabel, setTokenLabel] = useState("");
  const [tokenProvider, setTokenProvider] = useState<ConnectorProvider>("vozon");
  const [copied, setCopied] = useState(false);
  const [accessAllowed, setAccessAllowed] = useState<boolean | null>(null);
  const [readiness, setReadiness] = useState<WorkspaceAiReadiness | null>(null);

  const updateConnections = useCallback((updater: (current: VoiceConnector[]) => VoiceConnector[]) => {
    setConnections((current) => {
      const next = updater(current);
      queryClient.setQueryData(DASHBOARD_QUERY_KEYS.connectors, next);
      return next;
    });
  }, [queryClient]);

  const loadConnections = useCallback(async (force = false) => {
    try {
      setLoading(true);
      setError("");
      if (force) await queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.connectors, exact: true });
      const next = await queryClient.fetchQuery({
        queryKey: DASHBOARD_QUERY_KEYS.connectors,
        queryFn: async () => {
          const response = await connectorsAPI.list();
          return response.data.connectors || [];
        },
        staleTime: 60_000,
      });
      updateConnections(() => next);
    } catch (loadError) {
      setError(errorMessage(loadError, "Could not load voice connectors."));
    } finally {
      setLoading(false);
    }
  }, [queryClient, updateConnections]);

  useEffect(() => {
    let cancelled = false;
    const verifyAccess = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        if (cancelled) return;
        if (!response.data.connectorManagementEnabled) {
          router.replace('/dashboard');
          return;
        }
        setAccessAllowed(true);
      } catch {
        if (!cancelled) router.replace('/dashboard');
      }
    };
    void verifyAccess();
    return () => { cancelled = true; };
  }, [router]);

  useEffect(() => {
    if (accessAllowed) void loadConnections();
  }, [accessAllowed, loadConnections]);

  useEffect(() => {
    if (!accessAllowed) return;
    let cancelled = false;
    workspaceAiAPI.get()
      .then((response) => { if (!cancelled) setReadiness(response.data.readiness); })
      .catch(() => { if (!cancelled) setReadiness(null); });
    return () => { cancelled = true; };
  }, [accessAllowed]);

  const activeCount = useMemo(
    () => connections.filter((connection) => connection.status === "active").length,
    [connections]
  );

  const createConnection = async () => {
    if (!name.trim()) {
      setError("Enter a connection name.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setToken("");
      const response = await connectorsAPI.create({
        name: name.trim(),
        provider,
      });
      updateConnections((current) => [response.data.connector, ...current]);
      setToken(response.data.token);
      setTokenLabel(response.data.connector.name);
      setTokenProvider(response.data.connector.provider);
      setCopied(false);
    } catch (createError) {
      setError(errorMessage(createError, "Could not generate the connector token."));
    } finally {
      setCreating(false);
    }
  };

  const copyToken = async () => {
    try {
      await copyText(token);
      setCopied(true);
    } catch (copyError) {
      setError(errorMessage(copyError, "Could not copy the connector token."));
    }
  };

  const rotateConnection = async (connection: VoiceConnector) => {
    if (!window.confirm(`Replace the current token for ${connection.name}? The old token will stop working.`)) return;
    try {
      setBusyId(connection.id);
      setError("");
      const response = await connectorsAPI.rotate(connection.id);
      updateConnections((current) => current.map((item) =>
        item.id === connection.id ? response.data.connector : item
      ));
      setToken(response.data.token);
      setTokenLabel(response.data.connector.name);
      setTokenProvider(response.data.connector.provider);
      setCopied(false);
    } catch (rotateError) {
      setError(errorMessage(rotateError, "Could not rotate the connector token."));
    } finally {
      setBusyId("");
    }
  };

  const revokeConnection = async (connection: VoiceConnector) => {
    if (!window.confirm(`Revoke ${connection.name}? ${providerLabel(connection.provider)} will lose access immediately.`)) return;
    try {
      setBusyId(connection.id);
      setError("");
      const response = await connectorsAPI.revoke(connection.id);
      updateConnections((current) => current.map((item) =>
        item.id === connection.id ? response.data.connector : item
      ));
    } catch (revokeError) {
      setError(errorMessage(revokeError, "Could not revoke the connector."));
    } finally {
      setBusyId("");
    }
  };

  if (accessAllowed !== true) {
    return <div className="grid min-h-screen place-items-center bg-zinc-50"><Loader2 className="h-8 w-8 animate-spin text-orange-600" /></div>;
  }

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
            <p className="text-xs font-semibold uppercase text-orange-700">Service Dashboard</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">Voice connectors</h1>
                <p className="mt-2 max-w-2xl text-sm text-zinc-500">Generate one workspace token. Vozon automatically receives this workspace&apos;s tools, permissions and live data sources.</p>
              </div>
              <div className="flex h-9 items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm font-semibold text-zinc-700">
                <Cable className="h-4 w-4 text-orange-600" />
                {activeCount} active
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-7">
            {error && (
              <div className="flex items-start justify-between gap-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
                <span>{error}</span>
                <button type="button" onClick={() => setError("")} aria-label="Dismiss error" className="grid h-6 w-6 shrink-0 place-items-center rounded hover:bg-rose-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {readiness && (
              <section className={`rounded-md border p-4 sm:p-5 ${readiness.ready ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded px-2 py-1 text-xs font-bold uppercase ${readiness.ready ? "bg-emerald-700 text-white" : "bg-amber-600 text-white"}`}>
                        {readiness.ready ? "Ready" : "Setup needed"}
                      </span>
                      <h2 className="font-bold text-zinc-950">{serviceLabel(readiness.service)} · {readiness.toolCount} automatic tools</h2>
                    </div>
                    <p className="mt-2 text-sm text-zinc-700">
                      {readiness.ready
                        ? "Vozon will receive only this workspace's tools when it verifies the token."
                        : `${readiness.checks.filter((check) => !check.complete).length} data source(s) still need configuration before every tool can answer reliably.`}
                    </p>
                  </div>
                  {!readiness.ready && readiness.service !== "doctor-dashboard" && (
                    <Link href="/dashboard/ai-setup" className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800">
                      Complete AI setup
                    </Link>
                  )}
                </div>
              </section>
            )}

            {token && (
              <section className="rounded-md border border-emerald-300 bg-emerald-50 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-emerald-700 text-white"><KeyRound className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="font-bold text-emerald-950">Token generated for {tokenLabel}</h2>
                        <p className="mt-1 text-sm text-emerald-800">Paste it into the {providerLabel(tokenProvider)} connector once. DigitalBot will select and sync the correct workspace tools automatically. It will not be shown again.</p>
                      </div>
                      <button type="button" onClick={() => setToken("")} aria-label="Close token" className="grid h-8 w-8 shrink-0 place-items-center self-end rounded hover:bg-emerald-100 sm:self-auto">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <input readOnly value={token} aria-label="Connector token" className="h-11 min-w-0 flex-1 rounded-md border border-emerald-300 bg-white px-3 font-mono text-xs text-zinc-900 outline-none" />
                      <button type="button" onClick={() => void copyToken()} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied" : "Copy token"}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="border-b border-zinc-200 pb-7">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-orange-600" />
                <h2 className="text-lg font-bold">New connection</h2>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_240px_auto] md:items-end">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-zinc-700">Connection name</span>
                  <input value={name} onChange={(event) => setName(event.target.value)} maxLength={120} className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-zinc-700">Provider</span>
                  <select value={provider} onChange={(event) => setProvider(event.target.value as ConnectorProvider)} className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100">
                    {PROVIDERS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
                <button type="button" onClick={() => void createConnection()} disabled={creating || !name.trim()} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40">
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                  Generate token
                </button>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Connections</h2>
                  <p className="mt-1 text-sm text-zinc-500">Provider agent details appear after the token is verified and bound.</p>
                </div>
                <button type="button" onClick={() => void loadConnections(true)} disabled={loading} title="Refresh connections" aria-label="Refresh connections" className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-zinc-300 bg-white hover:bg-zinc-100 disabled:opacity-50">
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>

              {loading ? (
                <div className="grid min-h-[220px] place-items-center"><Loader2 className="h-7 w-7 animate-spin text-orange-600" /></div>
              ) : connections.length === 0 ? (
                <div className="mt-5 grid min-h-[180px] place-items-center rounded-md border border-dashed border-zinc-300 bg-white px-4 text-center">
                  <div><Cable className="mx-auto h-7 w-7 text-zinc-400" /><p className="mt-3 text-sm font-semibold text-zinc-700">No voice connectors yet</p></div>
                </div>
              ) : (
                <div className="mt-5 grid gap-3">
                  {connections.map((connection) => {
                    const isActive = connection.status === "active";
                    const isBound = Boolean(connection.externalAgentId);
                    const isBusy = busyId === connection.id;
                    return (
                      <article key={connection.id} className="rounded-md border border-zinc-200 bg-white p-4 sm:p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-zinc-950">{connection.name}</h3>
                              <span className="rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-semibold uppercase text-zinc-600">{connection.provider}</span>
                              <span className={`rounded px-2 py-0.5 text-xs font-semibold ${!isActive ? "bg-zinc-200 text-zinc-600" : isBound ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                                {!isActive ? "Revoked" : isBound ? "Connected" : "Waiting for provider"}
                              </span>
                            </div>
                            <div className="mt-3 grid gap-x-8 gap-y-1 text-xs text-zinc-500 sm:grid-cols-2 xl:grid-cols-5">
                              <p><span className="font-semibold text-zinc-700">Key:</span> {connection.tokenPrefix}...</p>
                              <p><span className="font-semibold text-zinc-700">Agent:</span> {connection.externalAgentName || "Not bound"}</p>
                              <p className="break-all"><span className="font-semibold text-zinc-700">Agent ID:</span> {connection.externalAgentId || "Not bound"}</p>
                              <p><span className="font-semibold text-zinc-700">Phone:</span> {connection.externalPhoneNumber || "Not bound"}</p>
                              <p><span className="font-semibold text-zinc-700">Status:</span> {connection.externalAgentMetadata?.status || (isBound ? "Connected" : "Waiting")}</p>
                              <p><span className="font-semibold text-zinc-700">Team:</span> {connection.externalAgentMetadata?.team || "Not provided"}</p>
                              <p><span className="font-semibold text-zinc-700">Language:</span> {connection.externalAgentMetadata?.language || "Not provided"}</p>
                              <p><span className="font-semibold text-zinc-700">Last used:</span> {formatDate(connection.lastUsedAt)}</p>
                            </div>
                          </div>
                          {isActive && (
                            <div className="flex shrink-0 gap-2">
                              <button type="button" onClick={() => void rotateConnection(connection)} disabled={isBusy} className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-50">
                                {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />}
                                Rotate token
                              </button>
                              <button type="button" onClick={() => void revokeConnection(connection)} disabled={isBusy} title="Revoke connector" aria-label={`Revoke ${connection.name}`} className="grid h-10 w-10 place-items-center rounded-md border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 disabled:opacity-50">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
