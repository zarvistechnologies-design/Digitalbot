'use client';

import Sidebar from '@/components/Sidebar';
import { useWebSocket } from '@/components/hooks/use-websocket';
import { callsAPI } from '@/lib/api';
import { CACHE_KEYS, cachedFetch, getCache, getStaleCache, invalidateCache, setCache } from '@/lib/cache';
import { Call, CallStats } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type AgentOption = {
  id: string;
  name: string;
};

const ALL_CALLS_LIMIT = 0;

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
  const [refreshInterval, setRefreshInterval] = useState(30000);
  const [isBackgroundFetching, setIsBackgroundFetching] = useState(false);
  const [newCallsCount, setNewCallsCount] = useState(0);
  const [recordingErrors, setRecordingErrors] = useState<Record<string, string>>({});

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

  const syncBookingWorkspaceCalls = async () => {
    const rawUser = localStorage.getItem('user');
    const user = rawUser ? JSON.parse(rawUser) : null;
    const service = String(user?.selectedService || '').toLowerCase();
    if (!['booking-crm', 'event-booking-crm'].includes(service)) return;

    try {
      await callsAPI.syncVozonCalls(50);
      invalidateCache(CACHE_KEYS.CALLS);
      invalidateCache(CACHE_KEYS.CALLS_STATS);
      invalidateCache(CACHE_KEYS.CALLS_AGENTS);
    } catch (syncError: any) {
      console.warn(
        'Vozon call history sync failed:',
        syncError.response?.data?.details || syncError.message
      );
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
    if (mounted) {
      const cachedCalls = getCache<Call[]>(CACHE_KEYS.CALLS);
      if (!cachedCalls || cachedCalls.length === 0) {
        void syncBookingWorkspaceCalls().finally(() => {
          fetchCalls();
          fetchStats();
          fetchAgents();
        });
      } else {
        fetchStats();
        fetchAgents();
      }
    }
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
        fetchCalls(1, ALL_CALLS_LIMIT, searchQuery, true);
        invalidateCache(CACHE_KEYS.CALLS_STATS);
        fetchStats();
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
    await syncBookingWorkspaceCalls();
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

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'user-ended':
      case 'agent-ended':
        return 'bg-white text-orange-700 border-orange-500';
      case 'missed':
      case 'no-answer':
      case 'busy':
        return 'bg-white text-orange-700 border-orange-500';
      case 'ongoing':
      case 'in-progress':
      case 'ringing':
        return 'bg-white text-orange-700 border-orange-500';
      default:
        return 'bg-white text-gray-800 border-gray-300';
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-[1300] bg-orange-600 text-white p-3 rounded-xl shadow-lg hover:bg-orange-700 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[1200]"
        />
      )}

      <div
        className={`fixed left-0 top-0 bottom-0 w-60 transform transition-transform duration-300 ease-in-out z-[1250] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      <div className="w-full md:ml-60 pt-20 md:pt-0">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <>
            {/* Hero Header */}
            <div className="bg-orange-600 text-white">
              <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Call Management</h1>
                    <p className="text-white/90 text-sm md:text-base">Track and analyze your AI-powered conversations</p>
                    <div className="flex items-center gap-2 mt-3 text-sm">
                      <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>Live</span>
                      </div>
                      <div className="text-white/90">Last updated: {formatLastRefreshTime() || 'Just now'}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleRefresh}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-xl transition-all hover:rotate-180 duration-500"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-6 mb-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-5 shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium mb-1">Total Calls</p>
                      <p className="text-3xl font-bold text-gray-900">{callSummary.total}</p>
                    </div>
                    <div className="bg-white border-2 border-orange-500 p-3 rounded-xl">
                      <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium mb-1">Completed</p>
                      <p className="text-3xl font-bold text-gray-900">{callSummary.completed}</p>
                    </div>
                    <div className="bg-white border-2 border-orange-500 p-3 rounded-xl">
                      <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium mb-1">Avg Duration</p>
                      <p className="text-3xl font-bold text-gray-900">{formatDuration(callSummary.averageDuration)}</p>
                    </div>
                    <div className="bg-white border-2 border-orange-500 p-3 rounded-xl">
                      <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium mb-1">Inbound</p>
                      <p className="text-3xl font-bold text-gray-900">{callSummary.inbound}</p>
                    </div>
                    <div className="bg-white border-2 border-orange-500 p-3 rounded-xl">
                      <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alert */}
              {error && (
                <div className="mb-6 bg-white border border-orange-500 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-orange-700">Calls API Error</p>
                      <p className="text-sm text-gray-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Filters */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-600 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Advanced Filters</h2>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-orange-600 hover:text-orange-700 font-semibold px-4 py-2 rounded-lg hover:bg-white transition-colors"
                  >
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>
                </div>

                {showFilters && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Agent</label>
                        <select
                          value={selectedAgent}
                          onChange={(e) => setSelectedAgent(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white shadow-sm"
                        >
                          <option value="">All Agents</option>
                          {availableAgents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                              {agent.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white shadow-sm"
                        >
                          <option value="">All Status</option>
                          <option value="completed">Completed</option>
                          <option value="agent-ended">Agent Ended</option>
                          <option value="user-ended">User Ended</option>
                          <option value="missed">Missed</option>
                          <option value="no-answer">No Answer</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Direction</label>
                        <select
                          value={selectedDirection}
                          onChange={(e) => setSelectedDirection(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white shadow-sm"
                        >
                          <option value="">Inbound & Outbound</option>
                          <option value="inbound">Inbound</option>
                          <option value="outbound">Outbound</option>
                          <option value="unknown">Unknown</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="text"
                          value={phoneFilter}
                          onChange={(e) => setPhoneFilter(e.target.value)}
                          placeholder="Enter phone number"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                        <input
                          type="datetime-local"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                        <input
                          type="datetime-local"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                      <button
                        onClick={handleClearFilters}
                        className="px-6 py-2.5 border-2 border-orange-600 text-orange-600 rounded-xl hover:bg-white transition-all font-semibold shadow-sm"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={handleApplyFilters}
                        className="px-6 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl font-semibold"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Call History Header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">All Calls</h2>
                  <p className="text-gray-500 mt-1">Showing {calls.length} call(s)</p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  disabled={calls.length === 0}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl font-semibold disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                  title={calls.length === 0 ? 'No calls available to download' : 'Download the currently displayed calls'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14a2 2 0 002-2v-2" />
                  </svg>
                  Download CSV ({calls.length})
                </button>
              </div>

              {/* Calls List */}
              <div className="space-y-4">
                {calls.map((call: any) => {
                  const callId = getCallId(call);
                  const { phone, isInbound } = getPhoneDisplay(call);
                  const recordingUrl = getRecordingUrl(call);
                  const recordingError = recordingErrors[callId];
                  
                  return (
                    <div key={callId} className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      <div
                        onClick={() => handleCallClick(callId)}
                        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">ID</p>
                            <p className="text-sm text-gray-900 font-mono font-medium">{call.session_id || call.id}</p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Agent</p>
                            <p className="text-sm text-gray-900 font-medium">{getAgentDisplay(call)}</p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                              {isInbound ? 'Caller' : 'Called To'}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-900 font-medium">{phone}</p>
                              {isInbound ? (
                                <span className="px-2 py-0.5 text-xs bg-white text-orange-700 border border-orange-500 rounded-full font-semibold" title="Inbound">
                                  ↓ IN
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 text-xs bg-white text-orange-700 border border-orange-500 rounded-full font-semibold" title="Outbound">
                                  ↑ OUT
                                </span>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Status</p>
                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(call.status || call.call_status || 'completed')}`}>
                              {call.status || call.call_status || 'completed'}
                            </span>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Duration</p>
                            <p className="text-sm text-gray-900 font-medium">{formatDuration(call.duration)}</p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Timestamp</p>
                            <p className="text-xs text-gray-600 font-medium">
                              {call.start_time ? new Date(call.start_time).toLocaleString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {expandedCall === callId && (
                        <>
                          <div className="border-t border-gray-200"></div>
                          <div className="p-6 bg-white">
                            {/* Call Details Section */}
                            <div className="mb-6 bg-white rounded-xl border-2 border-gray-200 p-5">
                              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="bg-orange-600 p-2 rounded-lg">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                Call Details
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">From Number</p>
                                  <p className="text-sm text-gray-900 font-mono">{call.from_number || 'Unknown'}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">To Number</p>
                                  <p className="text-sm text-gray-900 font-mono">{call.to_number || 'Unknown'}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">Direction</p>
                                  <p className="text-sm text-gray-900 capitalize">{call.direction || 'Unknown'}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">Call ID</p>
                                  <p className="text-sm text-gray-900 font-mono">{call.call_id || call.id}</p>
                                </div>
                              </div>
                            </div>

                            {/* Recordings Section */}
                            <div className="mb-6">
                              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="bg-orange-600 p-2 rounded-lg">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                Recordings & AI Analysis
                              </h3>

                              {recordingUrl ? (
                                <div className="bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm">
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
                                      className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold transition-colors"
                                    >
                                      Open Recording
                                    </a>
                                    <a
                                      href={recordingUrl}
                                      download
                                      className="inline-flex items-center px-4 py-2 border border-orange-600 text-orange-600 hover:bg-orange-50 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                      Download
                                    </a>
                                    {recordingError && (
                                      <span className="text-sm font-medium text-orange-700">
                                        {recordingError}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ) : call.agent_config?.call_settings?.enable_recording ? (
                                <div className="bg-white border-2 border-orange-500 rounded-xl p-4">
                                  <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                      <p className="font-bold text-orange-700 mb-1">Recording Enabled - Processing</p>
                                      <p className="text-sm text-gray-700">
                                        Recording is enabled for this call. It may still be processing. Check your{' '}
                                        <a href="https://dashboard.millis.ai" target="_blank" rel="noopener noreferrer" className="text-orange-600 font-bold underline hover:text-orange-700">
                                           Dashboard
                                        </a>{' '}
                                        for the recording.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-white border-2 border-orange-500 rounded-xl p-4">
                                  <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                      <p className="font-bold text-orange-700 mb-1">No Recording Available</p>
                                      <p className="text-sm text-gray-700">
                                        Recording was not enabled for this call. Enable <code className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-mono">enable_recording: true</code> in agent settings.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Transcription Section */}
                            {(call.chat || call.transcription) && (
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                  <div className="bg-orange-600 p-2 rounded-lg">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                  </div>
                                  Call Transcription
                                </h3>
                                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 max-h-96 overflow-auto shadow-sm">
                                  {(() => {
                                    try {
                                      let chatData = call.chat || call.transcription;

                                      if (typeof chatData === 'string') {
                                        if (!chatData.trim().startsWith('[') && !chatData.trim().startsWith('{')) {
                                          return (
                                            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                              {chatData}
                                            </p>
                                          );
                                        }

                                        try {
                                          chatData = JSON.parse(chatData);
                                        } catch (parseError) {
                                          return (
                                            <div className="bg-white border-2 border-orange-500 rounded-lg p-3 text-gray-800">
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

                                          return (
                                            <div
                                              key={index}
                                              className={`mb-3 p-4 rounded-xl border-2 ${
                                                message.role === 'assistant'
                                                  ? 'bg-white border-orange-500'
                                                  : 'bg-white border-gray-300'
                                              }`}
                                            >
                                              <p className={`text-xs font-bold mb-2 uppercase tracking-wide ${
                                                message.role === 'assistant' ? 'text-orange-700' : 'text-gray-700'
                                              }`}>
                                                {message.role === 'assistant' ? '🤖 AI Agent' : '👤 User'}
                                              </p>
                                              <p className={`text-sm whitespace-pre-wrap leading-relaxed ${
                                                message.role === 'assistant' ? 'text-orange-700' : 'text-gray-800'
                                              }`}>
                                                {messageText}
                                              </p>
                                            </div>
                                          );
                                        }).filter(Boolean);
                                      }

                                      return (
                                        <div className="bg-white border-2 border-orange-500 rounded-lg p-3 text-gray-800">
                                          Unexpected transcription format
                                        </div>
                                      );
                                    } catch (e) {
                                      return (
                                        <div className="bg-white border-2 border-orange-500 rounded-lg p-3 text-gray-800">
                                          Failed to display transcription
                                        </div>
                                      );
                                    }
                                  })()}
                                </div>
                              </div>
                            )}

                            {!call.chat && !call.transcription && (
                              <div className="bg-white border-2 border-orange-500 rounded-xl p-4 mt-6">
                                <div className="flex items-center gap-3">
                                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <p className="text-gray-800 font-medium">No transcription available for this call</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}

                {calls.length === 0 && (
                  <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-12 text-center">
                    <div className="bg-white border-2 border-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No calls found</h3>
                    <p className="text-gray-600">
                      No Millis calls found for the assigned number.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
