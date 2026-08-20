'use client';

import Sidebar from '@/components/Sidebar';
import { useWebSocket } from '@/components/hooks/use-websocket';
import { callsAPI } from '@/lib/api';
import { CACHE_KEYS, cachedFetch, getStaleCache, invalidateCache, setCache } from '@/lib/cache';
import { Call, CallStats } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Bot,
  Clock,
  Download,
  FileText,
  Filter,
  Hash,
  Headphones,
  Menu,
  Mic,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  RefreshCw,
  Search,
  Sparkles,
  User,
  X,
} from 'lucide-react';

type AgentOption = {
  id: string;
  name: string;
};

const ALL_CALLS_LIMIT = 0;

// "Switchboard" theme — a dark slate header rail with teal for live/primary
// actions, sky for inbound, violet for outbound, and status categories that
// map many raw provider strings onto four legible buckets.
const statusBucket = (raw?: string): 'completed' | 'live' | 'missed' | 'other' => {
  const s = (raw || '').toLowerCase();
  if (['completed', 'user-ended', 'agent-ended', 'ended'].includes(s)) return 'completed';
  if (['ongoing', 'in-progress', 'ringing'].includes(s)) return 'live';
  if (['missed', 'no-answer', 'busy'].includes(s)) return 'missed';
  return 'other';
};

const statusStyles: Record<string, string> = {
  completed: 'bg-teal-50 text-teal-700 border-teal-200',
  live: 'bg-amber-50 text-amber-700 border-amber-200',
  missed: 'bg-rose-50 text-rose-700 border-rose-200',
  other: 'bg-slate-100 text-slate-600 border-slate-300',
};

const statusDotColors: Record<string, string> = {
  completed: 'bg-teal-500',
  live: 'bg-amber-500 animate-pulse',
  missed: 'bg-rose-500',
  other: 'bg-slate-400',
};

const statusRailColors: Record<string, string> = {
  completed: 'bg-teal-400',
  live: 'bg-amber-400',
  missed: 'bg-rose-400',
  other: 'bg-slate-300',
};

const Dashboard = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [calls, setCalls] = useState<Call[]>([]);
  const [allCalls, setAllCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<CallStats | null>(null);
  const [mounted, setMounted] = useState(false);
  const [expandedCall, setExpandedCall] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDirection, setSelectedDirection] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [availableAgents, setAvailableAgents] = useState<AgentOption[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(10000);
  const [isBackgroundFetching, setIsBackgroundFetching] = useState(false);
  const [newCallsCount, setNewCallsCount] = useState(0);
  const [recordingErrors, setRecordingErrors] = useState<Record<string, string>>({});
  const syncInFlightRef = useRef(false);

  const getCallId = (call: any): string => {
    return String(call?.id || call?.session_id || call?.call_id || call?._id || '');
  };

  useEffect(() => {
    setMounted(true);
    // Load from cache instantly on mount
    const queryCalls = queryClient.getQueryData<Call[]>([CACHE_KEYS.CALLS]);
    if (queryCalls?.length) setCache(CACHE_KEYS.CALLS, queryCalls, 60_000);
    const cachedCalls = queryCalls || getStaleCache<Call[]>(CACHE_KEYS.CALLS);
    if (cachedCalls && cachedCalls.length > 0) {
      setCalls(cachedCalls);
      setAllCalls(cachedCalls);
      setLoading(false);
    }
    const cachedStats = getStaleCache<CallStats>(CACHE_KEYS.CALLS_STATS);
    if (cachedStats) {
      setStats(cachedStats);
    }
    const cachedAgents = getStaleCache<AgentOption[]>(CACHE_KEYS.CALLS_AGENTS);
    if (cachedAgents) {
      setAvailableAgents(cachedAgents);
    }
  }, [queryClient]);

  // Helper function to get phone number from call object
  const getPhoneNumber = (call: any): string => {
    // Priority: from_number (caller) > to_number > phone_number > Unknown
    return call.from_number || call.to_number || call.phone_number || 'Unknown';
  };

  // Helper function to get display phone with direction indicator
  const getPhoneDisplay = (call: any): { phone: string; isInbound: boolean } => {
    const isInbound = call.direction === 'inbound';
    const phone = isInbound
      ? (call.from_number || call.phone_number || 'Unknown')
      : (call.to_number || call.phone_number || 'Unknown');

    return { phone, isInbound };
  };

  const getAgentDisplay = (call: any): string => {
    const agentName = typeof call.agent_name === 'string' ? call.agent_name.trim() : '';
    const agentId = typeof call.agent_id === 'string' ? call.agent_id.trim() : '';
    return agentName || agentId || 'Unknown Agent';
  };

  const getRecordingUrl = (call: any): string => {
    const recording = call?.recording;
    const candidates = [
      call?.recording_url,
      call?.recordingUrl,
      call?.recording_download_url,
      call?.recordingDownloadUrl,
      call?.recording_file,
      call?.recordingFile,
      call?.recording_file_url,
      call?.recordingFileUrl,
      call?.recordingLink,
      call?.recording_link,
      call?.call_recording,
      call?.call_recording_url,
      call?.callRecordingUrl,
      call?.audio_url,
      call?.audioUrl,
      call?.audio_file,
      call?.audioFile,
      call?.media_url,
      call?.mediaUrl,
      call?.file_url,
      call?.fileUrl,
      typeof recording === 'string' ? recording : null,
      recording?.url,
      recording?.recording_url,
      recording?.recordingUrl,
      recording?.download_url,
      recording?.downloadUrl,
      recording?.link,
      recording?.recording_link,
      recording?.recordingLink,
      recording?.signed_url,
      recording?.signedUrl,
      recording?.playback_url,
      recording?.playbackUrl,
      recording?.audio_url,
      recording?.audioUrl,
      recording?.media_url,
      recording?.mediaUrl,
      recording?.file_url,
      recording?.fileUrl,
      call?.metadata?.recording_url,
      call?.metadata?.recordingUrl,
      call?.metadata?.recording_download_url,
      call?.metadata?.recordingDownloadUrl,
      call?.metadata?.recording_file_url,
      call?.metadata?.recordingFileUrl,
      call?.metadata?.recordingLink,
      call?.metadata?.recording_link,
      call?.metadata?.call_recording,
      call?.metadata?.call_recording_url,
      call?.metadata?.callRecordingUrl,
      call?.metadata?.audio_url,
      call?.metadata?.audioUrl,
      call?.metadata?.media_url,
      call?.metadata?.mediaUrl,
      call?.metadata?.file_url,
      call?.metadata?.fileUrl,
    ];

    const directUrl = candidates.find((value) => typeof value === 'string' && value.trim())?.trim() || findRecordingUrlDeep(call) || '';
    const callId = getCallId(call);
    if (!callId) return directUrl;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || undefined : undefined;
    return directUrl ? callsAPI.getCallRecordingUrl(callId, token) : '';
  };

  const findRecordingUrlDeep = (value: any, path: string[] = [], seen = new Set<any>()): string => {
    if (!value) return '';

    if (typeof value === 'string') {
      const trimmed = value.trim();
      const pathText = path.join('.').toLowerCase();
      const looksLikeAudioPath = /\.(mp3|wav|m4a|mpeg|mp4|ogg)(\?|#|$)/i.test(trimmed);
      const looksLikeRecordingField = /(record|audio|media|playback|download|file|signed)/i.test(pathText);
      return /^https?:\/\//i.test(trimmed) && (looksLikeRecordingField || looksLikeAudioPath) ? trimmed : '';
    }

    if (typeof value !== 'object' || seen.has(value)) return '';
    seen.add(value);

    if (Array.isArray(value)) {
      for (let index = 0; index < value.length; index += 1) {
        const found = findRecordingUrlDeep(value[index], [...path, String(index)], seen);
        if (found) return found;
      }
      return '';
    }

    for (const [key, child] of Object.entries(value)) {
      const found = findRecordingUrlDeep(child, [...path, key], seen);
      if (found) return found;
    }

    return '';
  };

  const syncConnectedWorkspaceCalls = async () => {
    if (syncInFlightRef.current) return;
    syncInFlightRef.current = true;

    try {
      await callsAPI.syncVozonCalls(25);
      invalidateCache(CACHE_KEYS.CALLS);
      invalidateCache(CACHE_KEYS.CALLS_STATS);
      invalidateCache(CACHE_KEYS.CALLS_AGENTS);
    } catch (syncError: any) {
      console.warn(
        'Connected Vozon call sync failed:',
        syncError.response?.data?.details || syncError.message
      );
    } finally {
      syncInFlightRef.current = false;
    }
  };
  const fetchCalls = async (page = 1, limit = ALL_CALLS_LIMIT, search = '', isBackground = false) => {
    try {
      if (!isBackground) {
        // Only show loading if no cached data available
        const cached = getStaleCache<Call[]>(CACHE_KEYS.CALLS);
        if (!cached || cached.length === 0) setLoading(true);
      } else {
        setIsBackgroundFetching(true);
      }
      setError(null);

      const response = await callsAPI.getCalls({ page, limit });

      const rawCallsData = response.data.data?.calls || response.data.calls || response.data.data || [];
      let callsData = Array.isArray(rawCallsData)
        ? rawCallsData.map((call: any, index: number) => ({
            ...call,
            id: getCallId(call) || `call-${index}`,
          }))
        : [];

      if (search.trim()) {
        const term = search.toLowerCase().trim();
        callsData = callsData.filter((call: any) =>
          getCallId(call).toLowerCase().includes(term) ||
          (call.from_number || '').toLowerCase().includes(term) ||
          (call.to_number || '').toLowerCase().includes(term) ||
          (call.phone_number || '').toLowerCase().includes(term) ||
          getAgentDisplay(call).toLowerCase().includes(term) ||
          (call.status || call.call_status || '').toLowerCase().includes(term)
        );
      }

      if (isBackground && calls.length > 0) {
        const newCalls = callsData.filter((newCall: Call) =>
          !calls.some(existingCall => getCallId(existingCall) === getCallId(newCall))
        );
        setNewCallsCount(newCalls.length);
      }

      setCalls(callsData);
      setAllCalls(callsData);
      // Update shared cache so Dashboard gets fresh data too
      setCache(CACHE_KEYS.CALLS, callsData, 60000);
      setLastRefreshTime(new Date());

    } catch (err: any) {
      console.warn('Calls API error:', err.message);
      setCalls([]);
      setAllCalls([]);
      setError(err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to load calls');
      setLastRefreshTime(new Date());
    } finally {
      if (!isBackground) {
        setLoading(false);
      } else {
        setIsBackgroundFetching(false);
      }
    }
  };

  const fetchAgents = async () => {
    try {
      const agentOptions = await cachedFetch<AgentOption[]>(CACHE_KEYS.CALLS_AGENTS, async () => {
        const response = await callsAPI.getAgents();
        const agentList = response.data.data || [];
        return agentList.map((agent: any) => ({
          id: String(agent.id || agent.name),
          name: String(agent.name || agent.id || 'Unknown agent'),
        }));
      }, 120000); // 2 min cache for agents
      setAvailableAgents(agentOptions);
    } catch (err: any) {
      console.warn('Could not fetch agents:', err.message);
      const agents = new Map<string, AgentOption>();
      calls.forEach((call: Call) => {
        const id = String(call.agent_id || call.agent_name || '').trim();
        if (id && !agents.has(id)) {
          agents.set(id, { id, name: String(call.agent_name || call.agent_id) });
        }
      });
      setAvailableAgents([...agents.values()]);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await cachedFetch(CACHE_KEYS.CALLS_STATS, async () => {
        const response = await callsAPI.getStats();
        return response.data.data;
      }, 30000); // 30s cache for stats
      setStats(statsData);
    } catch (err: any) {
      console.warn('Stats API error:', err.message);
      setStats(null);
    }
  };

  useEffect(() => {
    if (!mounted) return;

    // Always reconcile the connected provider on entry. Cached rows remain
    // visible while the sync runs, then the workspace receives fresh details.
    void syncConnectedWorkspaceCalls().finally(() => {
      fetchCalls();
      fetchStats();
      fetchAgents();
    });
  }, [mounted]);

  // WebSocket: instant update when new calls arrive
  useWebSocket({
    onMessage: useCallback((msg: any) => {
      if (msg.type === 'new-call' || msg.type === 'call-update') {
        invalidateCache(CACHE_KEYS.CALLS);
        invalidateCache(CACHE_KEYS.CALLS_STATS);
        fetchCalls(1, ALL_CALLS_LIMIT, searchQuery, true);
        fetchStats();
      }
    }, [searchQuery]),
  });

  useEffect(() => {
    if (!mounted || !isAutoRefreshEnabled) return;

    const interval = setInterval(() => {
      if (!loading) {
        void syncConnectedWorkspaceCalls().finally(() => {
          fetchCalls(1, ALL_CALLS_LIMIT, searchQuery, true);
          invalidateCache(CACHE_KEYS.CALLS_STATS);
          fetchStats();
        });
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [mounted, isAutoRefreshEnabled, refreshInterval, loading, searchQuery]);

  useEffect(() => {
    setNewCallsCount(0);
  }, [expandedCall]);

  const handleSearch = () => {
    fetchCalls(1, ALL_CALLS_LIMIT, searchQuery);
  };

  const handleApplyFilters = () => {
    let filteredCalls = [...allCalls];

    if (selectedAgent) {
      filteredCalls = filteredCalls.filter(call =>
        call.agent_id === selectedAgent || call.agent_name === selectedAgent
      );
    }

    if (selectedStatus) {
      filteredCalls = filteredCalls.filter(call =>
        (call.status || (call as any).call_status) === selectedStatus
      );
    }

    if (selectedDirection) {
      filteredCalls = filteredCalls.filter(call =>
        call.direction === selectedDirection
      );
    }

    if (phoneFilter) {
      const phoneTerm = phoneFilter.trim().toLowerCase();
      filteredCalls = filteredCalls.filter(call =>
        [call.from_number, call.to_number, call.phone_number]
          .some(number => String(number || '').toLowerCase().includes(phoneTerm))
      );
    }

    if (startDate) {
      const startTime = new Date(startDate).getTime();
      filteredCalls = filteredCalls.filter(call => {
        const callTime = new Date(call.start_time || '').getTime();
        return callTime >= startTime;
      });
    }

    if (endDate) {
      const endTime = new Date(endDate).getTime();
      filteredCalls = filteredCalls.filter(call => {
        const callTime = new Date(call.start_time || '').getTime();
        return callTime <= endTime;
      });
    }

    setCalls(filteredCalls);
  };

  const handleClearFilters = () => {
    setSelectedAgent('');
    setSelectedStatus('');
    setSelectedDirection('');
    setPhoneFilter('');
    setStartDate('');
    setEndDate('');
    setCalls(allCalls);
  };

  const escapeCsvCell = (value: unknown) => {
    let text = value === null || value === undefined ? '' : String(value);

    // Prevent Excel/Sheets from interpreting exported user data as a formula.
    if (/^[=+\-@\t\r]/.test(text)) {
      text = `'${text}`;
    }

    return `"${text.replace(/"/g, '""')}"`;
  };

  const formatCsvDuration = (duration: unknown) => {
    const totalSeconds = Math.max(0, Math.round(Number(duration) || 0));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return hours > 0
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownloadCsv = () => {
    if (calls.length === 0) return;

    const headers = [
      'Caller Number',
      'Called Number',
      'Direction',
      'Call Duration',
      'Status',
      'Call Date & Time',
    ];

    const rows = calls.map((call: any) => {
      return [
        call.from_number || call.phone_number || 'Unknown',
        call.to_number || call.phone_number || 'Unknown',
        call.direction
          ? `${call.direction.charAt(0).toUpperCase()}${call.direction.slice(1)}`
          : 'Unknown',
        formatCsvDuration(call.duration),
        call.status || call.call_status || 'Unknown',
        call.start_time ? new Date(call.start_time).toLocaleString() : 'N/A',
      ];
    });

    const csv = [
      headers.map(escapeCsvCell).join(','),
      ...rows.map(row => row.map(escapeCsvCell).join(',')),
    ].join('\r\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `calls-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = async () => {
    setNewCallsCount(0);
    invalidateCache(CACHE_KEYS.CALLS);
    invalidateCache(CACHE_KEYS.CALLS_STATS);
    invalidateCache(CACHE_KEYS.CALLS_AGENTS);
    await syncConnectedWorkspaceCalls();
    fetchCalls();
    fetchStats();
    fetchAgents();
  };

  const toggleAutoRefresh = () => {
    setIsAutoRefreshEnabled(!isAutoRefreshEnabled);
    if (!isAutoRefreshEnabled) {
      setLastRefreshTime(new Date());
    }
  };

  const changeRefreshInterval = (newInterval: number) => {
    setRefreshInterval(newInterval);
  };

  const isCompletedCall = (call: Call) =>
    ['completed', 'user-ended', 'agent-ended', 'ended'].includes(String(call.status || '').toLowerCase());

  const callSummary = {
    total: calls.length,
    completed: calls.filter(isCompletedCall).length,
    averageDuration: calls.length > 0
      ? Math.round(calls.reduce((sum, call) => sum + (Number(call.duration) || 0), 0) / calls.length)
      : undefined,
    inbound: calls.filter((call) => call.direction === 'inbound').length,
  };

  const formatLastRefreshTime = () => {
    if (!lastRefreshTime) return '';
    const now = new Date();
    const diffMs = now.getTime() - lastRefreshTime.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);

    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h ago`;
  };

  const handleCallClick = async (callId: string) => {
    if (expandedCall === callId) {
      setExpandedCall(null);
    } else {
      setExpandedCall(callId);
      setRecordingErrors((prev) => {
        const next = { ...prev };
        delete next[callId];
        return next;
      });
      try {
        const response = await callsAPI.getCall(callId);
        const callData = response.data.data || response.data;
        const normalizedCallData = { ...callData, id: getCallId(callData) || callId };
        setCalls(calls.map(c => getCallId(c) === callId ? { ...c, ...normalizedCallData } : c));
      } catch (err) {
        console.error('Failed to fetch call details:', err);
      }
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <div className="hidden lg:block w-64 bg-slate-900" />
        <main className="flex-1 lg:ml-64" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-sm border border-slate-200"
      >
        {sidebarOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-950/50 z-40" onClick={() => setSidebarOpen(false)}>
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 pt-20 lg:pt-8">
        <div className="max-w-[1600px] mx-auto space-y-3">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
          ) : (
            <>
              {/* ============ Compact Header Bar ============ */}
              <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="hidden sm:grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-slate-900">
                    <Headphones className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg font-bold tracking-tight text-slate-950 truncate">Call Ledger</h1>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 flex-shrink-0">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Live
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">Updated {formatLastRefreshTime() || 'just now'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-5 flex-shrink-0 pl-0 sm:pl-4 sm:border-l sm:border-slate-200">
                  <div className="text-center">
                    <div className="text-base font-bold text-slate-900 font-mono leading-none">{callSummary.total}</div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-bold text-teal-700 font-mono leading-none">{callSummary.completed}</div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Done</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-bold text-slate-900 font-mono leading-none">{formatDuration(callSummary.averageDuration)}</div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Avg</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-bold text-sky-700 font-mono leading-none">{callSummary.inbound}</div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">In</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRefresh}
                    aria-label="Refresh calls"
                    className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                  >
                    <RefreshCw className={`h-4 w-4 ${isBackgroundFetching ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Alert */}
              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-5 py-3.5 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-rose-800">Calls API error</p>
                    <p className="text-sm text-rose-700 mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              {/* ============ Compact Filter Toolbar ============ */}
              <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex-1 min-w-[160px] relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Search ID, number, agent..."
                      className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-slate-900"
                    />
                  </div>

                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="">All Agents</option>
                    {availableAgents.map((agent) => (
                      <option key={agent.id} value={agent.id}>{agent.name}</option>
                    ))}
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="agent-ended">Agent Ended</option>
                    <option value="user-ended">User Ended</option>
                    <option value="missed">Missed</option>
                    <option value="no-answer">No Answer</option>
                  </select>

                  <select
                    value={selectedDirection}
                    onChange={(e) => setSelectedDirection(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="">In &amp; Out</option>
                    <option value="inbound">Inbound</option>
                    <option value="outbound">Outbound</option>
                    <option value="unknown">Unknown</option>
                  </select>

                  <button
                    onClick={handleSearch}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                  >
                    Search
                  </button>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    aria-expanded={showFilters}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      showFilters ? 'border-teal-200 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    More
                  </button>
                </div>

                {showFilters && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2.5">
                    <input
                      type="text"
                      value={phoneFilter}
                      onChange={(e) => setPhoneFilter(e.target.value)}
                      placeholder="Phone number"
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500 w-[140px]"
                    />
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500 font-mono"
                    />
                    <span className="text-xs text-slate-400">to</span>
                    <input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500 font-mono"
                    />

                    <label className="ml-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <input
                        type="checkbox"
                        checked={isAutoRefreshEnabled}
                        onChange={toggleAutoRefresh}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      Auto-refresh
                      {isAutoRefreshEnabled && (
                        <select
                          value={refreshInterval}
                          onChange={(e) => changeRefreshInterval(Number(e.target.value))}
                          className="rounded-md border border-slate-200 bg-white px-1.5 py-1 text-xs text-slate-700"
                        >
                          <option value={5000}>5s</option>
                          <option value={10000}>10s</option>
                          <option value={30000}>30s</option>
                          <option value={60000}>60s</option>
                        </select>
                      )}
                    </label>

                    <div className="ml-auto flex gap-2">
                      <button
                        onClick={handleClearFilters}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleApplyFilters}
                        className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-teal-700"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ============ Call List ============ */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-slate-200">
                  <p className="text-xs text-slate-500">
                    <span className="font-mono font-semibold text-slate-700">{calls.length}</span> call{calls.length === 1 ? '' : 's'}
                    {newCallsCount > 0 && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        <Sparkles className="w-3 h-3" /> {newCallsCount} new
                      </span>
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={handleDownloadCsv}
                    disabled={calls.length === 0}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    title={calls.length === 0 ? 'No calls available to download' : 'Download the currently displayed calls'}
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    Export CSV
                  </button>
                </div>

                {/* Rows */}
                <div className="divide-y divide-slate-100">
                  {calls.map((call: any) => {
                    const callId = getCallId(call);
                    const { phone, isInbound } = getPhoneDisplay(call);
                    const recordingUrl = getRecordingUrl(call);
                    const recordingError = recordingErrors[callId];
                    const bucket = statusBucket(call.status || call.call_status);
                    const isOpen = expandedCall === callId;

                    return (
                      <div key={callId} className="bg-white">
                        <div
                          onClick={() => handleCallClick(callId)}
                          className="group relative flex flex-col gap-2 sm:flex-row sm:items-center pl-3 pr-4 sm:pr-5 py-2.5 cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                          {/* Status rail */}
                          <div className={`hidden sm:block w-1 self-stretch rounded-full flex-shrink-0 ${statusRailColors[bucket]}`} />

                          {/* Direction avatar */}
                          <div className={`flex-shrink-0 p-2.5 rounded-lg transition-colors ${
                            isInbound ? 'bg-sky-50 text-sky-600 group-hover:bg-sky-100' : 'bg-violet-50 text-violet-600 group-hover:bg-violet-100'
                          }`}>
                            {isInbound ? <PhoneIncoming className="w-4 h-4" /> : <PhoneOutgoing className="w-4 h-4" />}
                          </div>

                          <div className="grid flex-1 grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-4 items-center min-w-0">
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-0.5">ID</p>
                              <p className="text-sm text-slate-900 font-mono font-semibold truncate">{call.session_id || call.id}</p>
                            </div>

                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-0.5">Agent</p>
                              <p className="text-sm text-slate-800 font-medium truncate flex items-center gap-1.5">
                                <Bot className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                                <span className="truncate">{getAgentDisplay(call)}</span>
                              </p>
                            </div>

                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-0.5">
                                {isInbound ? 'Caller' : 'Called To'}
                              </p>
                              <p className="text-sm text-slate-900 font-mono font-medium truncate">{phone}</p>
                            </div>

                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-0.5">Status</p>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide border ${statusStyles[bucket]}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusDotColors[bucket]}`} />
                                {call.status || call.call_status || 'completed'}
                              </span>
                            </div>

                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-0.5">Duration</p>
                              <p className="text-sm text-slate-800 font-mono font-medium flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {formatDuration(call.duration)}
                              </p>
                            </div>

                            <div className="sm:text-right">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-0.5">Timestamp</p>
                              <p className="text-xs text-slate-600 font-mono font-medium">
                                {call.start_time ? new Date(call.start_time).toLocaleString() : 'N/A'}
                              </p>
                            </div>
                          </div>

                          {recordingUrl && (
                            <Mic className="hidden sm:block w-4 h-4 text-teal-500 flex-shrink-0" />
                          )}
                        </div>

                        {isOpen && (
                          <div className="border-t border-slate-100 bg-slate-50 p-4 sm:p-6 space-y-5">
                            {/* Call Details */}
                            <div className="bg-white rounded-xl border border-slate-200 p-5">
                              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-500 flex items-center gap-2">
                                <PhoneCall className="w-4 h-4 text-teal-600" />
                                Call Details
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">From Number</p>
                                  <p className="text-sm text-slate-900 font-mono">{call.from_number || 'Unknown'}</p>
                                </div>
                                <div>
                                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">To Number</p>
                                  <p className="text-sm text-slate-900 font-mono">{call.to_number || 'Unknown'}</p>
                                </div>
                                <div>
                                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">Direction</p>
                                  <p className="text-sm text-slate-900 capitalize">{call.direction || 'Unknown'}</p>
                                </div>
                                <div>
                                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">Call ID</p>
                                  <p className="text-sm text-slate-900 font-mono">{call.call_id || call.id}</p>
                                </div>
                              </div>
                            </div>

                            {/* Recordings */}
                            <div>
                              <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500 flex items-center gap-2">
                                <Headphones className="w-4 h-4 text-teal-600" />
                                Recording &amp; AI Analysis
                              </h3>

                              {recordingUrl ? (
                                <div className="bg-white rounded-xl border border-slate-200 p-5">
                                  <audio
                                    controls
                                    className="w-full"
                                    src={recordingUrl}
                                    preload="metadata"
                                    onError={() => {
                                      setRecordingErrors((prev) => ({
                                        ...prev,
                                        [callId]: 'Recording could not be loaded in the browser. Try opening it directly.',
                                      }));
                                    }}
                                  >
                                    Your browser does not support the audio element.
                                  </audio>
                                  <div className="mt-3 flex flex-wrap items-center gap-3">
                                    <a
                                      href={recordingUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition-colors"
                                    >
                                      Open Recording
                                    </a>
                                    <a
                                      href={recordingUrl}
                                      download
                                      className="inline-flex items-center px-4 py-2 border border-teal-600 text-teal-700 hover:bg-teal-50 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                      Download
                                    </a>
                                    {recordingError && (
                                      <span className="text-sm font-medium text-rose-600">{recordingError}</span>
                                    )}
                                  </div>
                                </div>
                              ) : call.agent_config?.call_settings?.enable_recording ? (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                  <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <p className="font-bold text-amber-800 mb-1 text-sm">Recording enabled — processing</p>
                                      <p className="text-sm text-amber-700">
                                        Recording is enabled for this call. It may still be processing. Check your{' '}
                                        <a href="https://dashboard.millis.ai" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-amber-900">
                                          Dashboard
                                        </a>{' '}
                                        for the recording.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
                                  <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <p className="font-bold text-slate-700 mb-1 text-sm">No recording available</p>
                                      <p className="text-sm text-slate-600">
                                        Recording was not enabled for this call. Enable{' '}
                                        <code className="bg-slate-800 text-white px-1.5 py-0.5 rounded text-xs font-mono">enable_recording: true</code>{' '}
                                        in agent settings.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Transcription */}
                            {(call.chat || call.transcription) && (
                              <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500 flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-slate-500" />
                                  Call Transcription
                                </h3>
                                <div className="bg-white border border-slate-200 rounded-xl p-4 max-h-96 overflow-auto">
                                  {(() => {
                                    try {
                                      let chatData = call.chat || call.transcription;

                                      if (typeof chatData === 'string') {
                                        if (!chatData.trim().startsWith('[') && !chatData.trim().startsWith('{')) {
                                          return (
                                            <p className="text-slate-800 whitespace-pre-wrap leading-relaxed text-sm">
                                              {chatData}
                                            </p>
                                          );
                                        }

                                        try {
                                          chatData = JSON.parse(chatData);
                                        } catch (parseError) {
                                          return (
                                            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-700 text-sm">
                                              Failed to parse transcription
                                            </div>
                                          );
                                        }
                                      }

                                      if (Array.isArray(chatData)) {
                                        return chatData.map((message: any, index: number) => {
                                          if (message.role === 'tool') return null;
                                          const messageText = typeof message === 'string'
                                            ? message
                                            : message.content || message.text || message.message || message.transcript || message.value || message.utterance || '';

                                          if (!String(messageText).trim()) return null;

                                          const isAssistant = message.role === 'assistant';

                                          return (
                                            <div
                                              key={index}
                                              className={`mb-2.5 p-3 rounded-lg border-l-2 ${
                                                isAssistant ? 'bg-indigo-50/60 border-indigo-400' : 'bg-slate-50 border-teal-400'
                                              }`}
                                            >
                                              <p className={`text-[10px] font-bold mb-1 uppercase tracking-wide flex items-center gap-1.5 ${
                                                isAssistant ? 'text-indigo-700' : 'text-teal-700'
                                              }`}>
                                                {isAssistant ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                                {isAssistant ? 'AI Agent' : 'Caller'}
                                              </p>
                                              <p className="text-sm whitespace-pre-wrap leading-relaxed text-slate-800">
                                                {messageText}
                                              </p>
                                            </div>
                                          );
                                        }).filter(Boolean);
                                      }

                                      return (
                                        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-700 text-sm">
                                          Unexpected transcription format
                                        </div>
                                      );
                                    } catch (e) {
                                      return (
                                        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-700 text-sm">
                                          Failed to display transcription
                                        </div>
                                      );
                                    }
                                  })()}
                                </div>
                              </div>
                            )}

                            {!call.chat && !call.transcription && (
                              <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                  <FileText className="w-5 h-5 text-slate-400" />
                                  <p className="text-slate-600 font-medium text-sm">No transcription available for this call</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {calls.length === 0 && (
                    <div className="p-12 text-center">
                      <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PhoneCall className="w-7 h-7 text-slate-400" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-1">No calls found</h3>
                      <p className="text-slate-500 text-sm">No calls found for the assigned number.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;