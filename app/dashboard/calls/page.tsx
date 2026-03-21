'use client';

import Sidebar from '@/components/Sidebar';
import { callsAPI } from '@/lib/api';
import { Call, CallStats } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Mock data for testing when API is not available
const mockCalls: Call[] = [
  {
    id: "call_001",
    phone_number: "+1234567890",
    direction: "inbound",
    status: "completed",
    duration: 125,
    start_time: "2024-10-24T10:00:00Z",
    end_time: "2024-10-24T10:02:05Z",
    recording_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    chat: JSON.stringify([
      { role: "user", content: "Hello, I'd like to schedule an appointment" },
      { role: "assistant", content: "Of course! I'd be happy to help you schedule an appointment." }
    ])
  }
];

const mockStats: CallStats = {
  total_calls: 25,
  completed_calls: 22,
  missed_calls: 3,
  total_duration: 3456,
  average_duration: 138,
  calls_by_direction: {
    inbound: 15,
    outbound: 10
  }
};

const Dashboard = () => {
  const router = useRouter();
  const [calls, setCalls] = useState<Call[]>([]);
  const [allCalls, setAllCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<CallStats | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedCall, setExpandedCall] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [availableAgents, setAvailableAgents] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30000);
  const [isBackgroundFetching, setIsBackgroundFetching] = useState(false);
  const [newCallsCount, setNewCallsCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const fetchCalls = async (page = 1, limit = 100, search = '', isBackground = false) => {
    try {
      if (!isBackground) {
        setLoading(true);
      } else {
        setIsBackgroundFetching(true);
      }
      setError(null);

      await callsAPI.healthCheck();

      let response;
      if (search) {
        response = await callsAPI.searchCalls(search, { page, limit });
      } else {
        response = await callsAPI.getCalls({ page, limit });
      }

      const callsData = response.data.data?.calls || response.data.data || [];

      if (isBackground && calls.length > 0) {
        const newCalls = callsData.filter((newCall: Call) =>
          !calls.some(existingCall => existingCall.id === newCall.id)
        );
        setNewCallsCount(newCalls.length);

        if (newCalls.length > 0) {
          console.log(`${newCalls.length} new call(s) received`);
        }
      }

      setCalls(callsData);
      setAllCalls(callsData);
      setIsUsingMockData(false);
      setLastRefreshTime(new Date());

    } catch (err: any) {
      console.warn('API not available, using mock data:', err.message);
      setCalls(mockCalls);
      setAllCalls(mockCalls);
      setIsUsingMockData(true);
      setError(null);
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
      const response = await callsAPI.getAgents();
      const agentList = response.data.data || [];
      const agentNames = agentList.map((agent: any) => agent.name);
      setAvailableAgents(agentNames);
    } catch (err: any) {
      console.warn('Could not fetch agents:', err.message);
      const agents = [...new Set(calls.map((call: Call) => call.agent_id || call.agent_name).filter(Boolean))];
      setAvailableAgents(agents as string[]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await callsAPI.getStats();
      setStats(response.data.data);
    } catch (err: any) {
      console.warn('Stats API not available, using mock data');
      setStats(mockStats);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchCalls();
      fetchStats();
      fetchAgents();
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !isAutoRefreshEnabled) return;

    const interval = setInterval(() => {
      if (!loading) {
        fetchCalls(1, 100, searchQuery, true);
        fetchStats();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [mounted, isAutoRefreshEnabled, refreshInterval, loading, searchQuery]);

  useEffect(() => {
    setNewCallsCount(0);
  }, [expandedCall]);

  const handleSearch = () => {
    if (isUsingMockData) {
      const filtered = mockCalls.filter(call =>
        getPhoneNumber(call).includes(searchQuery) ||
        call.id.includes(searchQuery) ||
        call.status?.includes(searchQuery.toLowerCase())
      );
      setCalls(filtered);
    } else {
      fetchCalls(1, 100, searchQuery);
    }
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
        call.status === selectedStatus
      );
    }

    if (phoneFilter) {
      filteredCalls = filteredCalls.filter(call =>
        getPhoneNumber(call).includes(phoneFilter)
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
    setPhoneFilter('');
    setStartDate('');
    setEndDate('');
    setCalls(allCalls);
  };

  const handleRefresh = () => {
    setNewCallsCount(0);
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
      try {
        const response = await callsAPI.getCall(callId);
        const callData = response.data.data || response.data;
        setCalls(calls.map(c => c.id === callId ? { ...c, ...callData } : c));
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
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'missed':
      case 'no-answer':
      case 'busy':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'ongoing':
      case 'in-progress':
      case 'ringing':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-orange-50 to-orange-50">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-[1300] bg-gradient-to-r from-orange-600 to-orange-600 text-white p-3 rounded-xl shadow-lg hover:from-orange-700 hover:to-orange-700 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-orange-900/20 backdrop-blur-sm z-[1200]"
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
        {loading && !isUsingMockData ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <>
            {/* Hero Header with Gradient */}
            <div className="bg-gradient-to-r from-orange-600 via-orange-600 to-orange-600 text-white">
              <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Call Management</h1>
                    <p className="text-orange-100 text-sm md:text-base">Track and analyze your AI-powered conversations</p>
                    <div className="flex items-center gap-2 mt-3 text-sm">
                      <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Live</span>
                      </div>
                      <div className="text-orange-100">Last updated: {formatLastRefreshTime() || 'Just now'}</div>
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
                      <p className="text-3xl font-bold text-gray-900">{stats?.total_calls || calls.length}</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-xl">
                      <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium mb-1">Completed</p>
                      <p className="text-3xl font-bold text-gray-900">{stats?.completed_calls || calls.filter(c => c.status === 'completed').length}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-xl">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-lg border-l-4 border-sky-500 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium mb-1">Avg Duration</p>
                      <p className="text-3xl font-bold text-gray-900">{formatDuration(stats?.average_duration)}</p>
                    </div>
                    <div className="bg-sky-100 p-3 rounded-xl">
                      <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium mb-1">Inbound</p>
                      <p className="text-3xl font-bold text-gray-900">{stats?.calls_by_direction?.inbound || calls.filter(c => c.direction === 'inbound').length}</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-xl">
                      <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alert */}
              {isUsingMockData && (
                <div className="mb-6 bg-gradient-to-r from-sky-50 to-sky-50 border border-sky-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-sky-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-sky-900">Demo Mode Active</p>
                      <p className="text-sm text-sky-800 mt-1">Unable to connect to Millis AI API. Showing sample data with recordings. Configure your API key in server/.env to see real data.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Filters */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-500 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Advanced Filters</h2>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-orange-600 hover:text-orange-700 font-semibold px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
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
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white shadow-sm"
                        >
                          <option value="">All Agents</option>
                          {availableAgents.map((agent) => (
                            <option key={agent} value={agent}>
                              {agent}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white shadow-sm"
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
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="text"
                          value={phoneFilter}
                          onChange={(e) => setPhoneFilter(e.target.value)}
                          placeholder="Enter phone number"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                        <input
                          type="datetime-local"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                        <input
                          type="datetime-local"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                      <button
                        onClick={handleClearFilters}
                        className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold shadow-sm"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={handleApplyFilters}
                        className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-orange-600 text-white rounded-xl hover:from-orange-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl font-semibold"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 shadow-sm">
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              )}

              {/* Call History Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">All Calls</h2>
                <p className="text-gray-500">Showing {calls.length} call(s)</p>
              </div>

              {/* Calls List */}
              <div className="space-y-4">
                {calls.map((call: any) => {
                  const { phone, isInbound } = getPhoneDisplay(call);
                  
                  return (
                    <div key={call.id} className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      <div
                        onClick={() => handleCallClick(call.id)}
                        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">ID</p>
                            <p className="text-sm text-gray-900 font-mono font-medium">{call.session_id || call.id}</p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Agent</p>
                            <p className="text-sm text-gray-900 font-medium">{call.agent_name || call.agent_id || 'dr appointment'}</p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                              {isInbound ? 'Caller' : 'Called To'}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-900 font-medium">{phone}</p>
                              {isInbound ? (
                                <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full font-semibold" title="Inbound">
                                  ↓ IN
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-semibold" title="Outbound">
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

                      {expandedCall === call.id && (
                        <>
                          <div className="border-t border-gray-200"></div>
                          <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                            {/* Call Details Section */}
                            <div className="mb-6 bg-white rounded-xl border-2 border-gray-200 p-5">
                              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="bg-gradient-to-r from-orange-500 to-orange-500 p-2 rounded-lg">
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
                                <div className="bg-gradient-to-r from-orange-500 to-orange-500 p-2 rounded-lg">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                Recordings & AI Analysis
                              </h3>

                              {call.recording_url || (call.recording && (call.recording.url || call.recording.recording_url)) ? (
                                <div className="bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm">
                                  <div className="flex items-start gap-2 mb-3">
                                    <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <p className="text-xs text-gray-600 font-mono break-all bg-gray-50 p-2 rounded-lg flex-1">
                                      {call.recording_url || call.recording.url || call.recording.recording_url}
                                    </p>
                                  </div>
                                  <audio
                                    controls
                                    className="w-full"
                                    src={call.recording_url || call.recording.url || call.recording.recording_url}
                                    preload="metadata"
                                  >
                                    Your browser does not support the audio element.
                                  </audio>
                                </div>
                              ) : call.agent_config?.call_settings?.enable_recording ? (
                                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
                                  <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                      <p className="font-bold text-orange-900 mb-1">✅ Recording Enabled - Processing</p>
                                      <p className="text-sm text-orange-800">
                                        Recording is enabled for this call. It may still be processing. Check your{' '}
                                        <a href="https://dashboard.millis.ai" target="_blank" rel="noopener noreferrer" className="text-orange-600 font-bold underline hover:text-orange-700">
                                          Millis Dashboard
                                        </a>{' '}
                                        for the recording.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
                                  <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                      <p className="font-bold text-orange-900 mb-1">No Recording Available</p>
                                      <p className="text-sm text-orange-800">
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
                                  <div className="bg-gradient-to-r from-orange-500 to-orange-500 p-2 rounded-lg">
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
                                            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 text-red-800">
                                              Failed to parse transcription
                                            </div>
                                          );
                                        }
                                      }

                                      if (Array.isArray(chatData)) {
                                        return chatData.map((message: any, index: number) => {
                                          if (message.role === 'tool') return null;

                                          return (
                                            <div
                                              key={index}
                                              className={`mb-3 p-4 rounded-xl border-2 ${
                                                message.role === 'assistant'
                                                  ? 'bg-gradient-to-r from-orange-50 to-orange-50 border-orange-200'
                                                  : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                                              }`}
                                            >
                                              <p className={`text-xs font-bold mb-2 uppercase tracking-wide ${
                                                message.role === 'assistant' ? 'text-orange-900' : 'text-green-900'
                                              }`}>
                                                {message.role === 'assistant' ? '🤖 AI Agent' : '👤 User'}
                                              </p>
                                              <p className={`text-sm whitespace-pre-wrap leading-relaxed ${
                                                message.role === 'assistant' ? 'text-orange-900' : 'text-green-900'
                                              }`}>
                                                {message.content}
                                              </p>
                                            </div>
                                          );
                                        }).filter(Boolean);
                                      }

                                      return (
                                        <div className="bg-sky-50 border-2 border-sky-200 rounded-lg p-3 text-sky-800">
                                          Unexpected transcription format
                                        </div>
                                      );
                                    } catch (e) {
                                      return (
                                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 text-red-800">
                                          Failed to display transcription
                                        </div>
                                      );
                                    }
                                  })()}
                                </div>
                              </div>
                            )}

                            {!call.chat && !call.transcription && (
                              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mt-6">
                                <div className="flex items-center gap-3">
                                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <p className="text-orange-800 font-medium">No transcription available for this call</p>
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
                    <div className="bg-gradient-to-r from-orange-100 to-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No calls found</h3>
                    <p className="text-gray-600">
                      {isUsingMockData
                        ? "Try adjusting your search criteria"
                        : "Configure your Millis AI API key to load call data"
                      }
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
