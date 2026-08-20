"use client";
import Sidebar from "@/components/Sidebar";
import { useCachedFetch } from "@/components/hooks/use-cached-fetch";
import { useWebSocket } from "@/components/hooks/use-websocket";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/dashboard/LazyRecharts";
import { CACHE_KEYS, invalidateCache } from "@/lib/cache";
import { Activity, AlertCircle, ArrowDown, ArrowRight, ArrowUp, BarChart3, Brain, CheckCircle2, Clock, FileText, Loader2, Menu, MessageSquare, Minus, PhoneCall, PhoneIncoming, PhoneOutgoing, PieChart, Sparkles, TrendingUp, X, XCircle, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

interface Call {
  id: string;
  session_id?: string;
  from_number: string;
  to_number: string;
  status: string;
  start_time: string;
  end_time?: string;
  duration: number;
  direction: string;
  agent_name: string;
  agent_id?: string;
  transcription?: string;
  transcription_formatted?: string;
  chat?: any;
  recording_url?: string;
}

interface Analytics {
  totalCalls: number;
  completedCalls: number;
  failedCalls: number;
  avgDuration: number;
  inboundCalls: number;
  outboundCalls: number;
  busyCalls: number;
  transcribedCalls: number;
  summarizedCalls: number;
  todaysCalls: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
  peakHours: { hour: number; count: number }[];
  dailyStats: { date: string; calls: number; completed: number; failed: number }[];
  statusDistribution: { status: string; count: number; percentage: number }[];
  hourlyDistribution: { hour: string; calls: number }[];
  durationAnalysis: { range: string; count: number }[];
  weeklyComparison: { week: string; calls: number; successRate: number }[];
}

// Ledger palette — teal for primary/positive, sky for inbound, violet for
// outbound, amber for caution, rose for failure, indigo for AI/analysis.
const chartColors = ['#0d9488', '#0284c7', '#f59e0b', '#e11d48', '#7c3aed', '#4f46e5'];

const statusTone = (status: string) => {
  const s = status.toLowerCase();
  if (['completed', 'user-ended', 'agent-ended'].includes(s)) return { text: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200', dot: 'bg-teal-500' };
  if (['failed', 'error'].includes(s)) return { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-500' };
  if (['busy', 'no-answer'].includes(s)) return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' };
  return { text: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-300', dot: 'bg-slate-400' };
};

const metricTones: Record<string, { chip: string; icon: string; ring: string }> = {
  teal: { chip: 'bg-teal-50', icon: 'text-teal-600', ring: 'border-teal-200' },
  sky: { chip: 'bg-sky-50', icon: 'text-sky-600', ring: 'border-sky-200' },
  violet: { chip: 'bg-violet-50', icon: 'text-violet-600', ring: 'border-violet-200' },
  amber: { chip: 'bg-amber-50', icon: 'text-amber-600', ring: 'border-amber-200' },
  rose: { chip: 'bg-rose-50', icon: 'text-rose-600', ring: 'border-rose-200' },
  indigo: { chip: 'bg-indigo-50', icon: 'text-indigo-600', ring: 'border-indigo-200' },
  slate: { chip: 'bg-slate-100', icon: 'text-slate-600', ring: 'border-slate-200' },
};

export default function AnalyticsOverview() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [dateFilter, setDateFilter] = useState("7");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Redirect Akiara users to their dashboard
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.selectedService === 'akiara') {
        router.replace('/dashboard/akiara-sessions');
        return;
      }
      if (user.selectedService === 'healthiQure patient navigation') {
        router.replace('/dashboard/bot-sessions');
        return;
      }
      if (user.selectedService === 'pathology-diagnostic') {
        router.replace('/dashboard/pathology');
        return;
      }
      if (['booking-crm', 'event-booking-crm'].includes(String(user.selectedService || '').toLowerCase())) {
        if (!user.bookingOnboardingComplete) {
          router.replace('/dashboard/booking-crm/setup');
          return;
        }
      }    }
  }, [router]);

  // Fetch raw calls once and cache — shared with Calls page
  const fetchCallsData = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digital-api-46ss.onrender.com/api';
    const callsRes = await fetch(`${API_BASE_URL}/calls?limit=1000&view=summary`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!callsRes.ok) throw new Error(`Failed to fetch calls: ${callsRes.status}`);
    const callsData = await callsRes.json();
    return callsData.data?.calls || callsData.calls || [];
  }, []);

  const { data: rawCalls, loading, refresh } = useCachedFetch<Call[]>({
    key: CACHE_KEYS.DASHBOARD_CALLS_SUMMARY,
    fetcher: fetchCallsData,
    ttl: 60000, // 1 minute cache
    enabled: mounted,
  });

  // Invalidate cache on new call via WebSocket
  useWebSocket({
    onMessage: useCallback((msg: any) => {
      if (msg.type === 'new-call' || msg.type === 'call-update') {
        invalidateCache(CACHE_KEYS.DASHBOARD_CALLS_SUMMARY);
        refresh(true);
      }
    }, [refresh]),
  });

  // Compute all analytics from raw calls using useMemo — instant on filter change
  const { analytics, recentCalls, agentLeaderboard, heatmapData, qualityTrend } = useMemo(() => {
    const calls = rawCalls || [];

    const now = new Date();
    const filterDays = parseInt(dateFilter);
    const filterDate = new Date(now.getTime() - (filterDays * 24 * 60 * 60 * 1000));
    const filteredCalls = calls.filter((call: Call) => new Date(call.start_time) >= filterDate);

    const completed = filteredCalls.filter((c: Call) => c.status === 'completed' || c.status === 'user-ended' || c.status === 'agent-ended').length;
    const failed = filteredCalls.filter((c: Call) => c.status === 'failed' || c.status === 'error').length;
    const busy = filteredCalls.filter((c: Call) => c.status === 'busy' || c.status === 'no-answer').length;
    const inbound = filteredCalls.filter((c: Call) => c.direction === 'inbound').length;
    const outbound = filteredCalls.filter((c: Call) => c.direction === 'outbound').length;
    const transcribed = filteredCalls.filter((c: Call) => c.transcription || c.transcription_formatted || c.chat).length;
    const summarized = filteredCalls.filter((c: Call) => c.transcription_formatted).length;
    const totalDuration = filteredCalls.reduce((sum: number, call: Call) => sum + (call.duration || 0), 0);
    const avgDuration = filteredCalls.length > 0 ? totalDuration / filteredCalls.length : 0;
    const today = new Date().toDateString();
    const todaysCalls = filteredCalls.filter((call: Call) => new Date(call.start_time).toDateString() === today).length;

    const hourCounts: { [key: number]: number } = {};
    filteredCalls.forEach((call: Call) => {
      const hour = new Date(call.start_time).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const peakHours = Object.entries(hourCounts).map(([hour, count]) => ({ hour: parseInt(hour), count })).sort((a, b) => b.count - a.count).slice(0, 5);

    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dateStr = date.toDateString();
      const dayCalls = filteredCalls.filter((call: Call) => new Date(call.start_time).toDateString() === dateStr);
      dailyStats.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        calls: dayCalls.length,
        completed: dayCalls.filter((c: Call) => c.status === 'completed' || c.status === 'user-ended' || c.status === 'agent-ended').length,
        failed: dayCalls.filter((c: Call) => c.status === 'failed' || c.status === 'error').length
      });
    }

    const statusCounts: { [key: string]: number } = {};
    filteredCalls.forEach((call: Call) => { statusCounts[call.status] = (statusCounts[call.status] || 0) + 1; });
    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({ status, count, percentage: filteredCalls.length > 0 ? (count / filteredCalls.length) * 100 : 0 }));
    const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({ hour: `${hour.toString().padStart(2, '0')}:00`, calls: hourCounts[hour] || 0 }));

    const durationAnalysis = [
      { range: '0-30s', count: filteredCalls.filter((c: Call) => c.duration <= 30).length },
      { range: '30s-1m', count: filteredCalls.filter((c: Call) => c.duration > 30 && c.duration <= 60).length },
      { range: '1-2m', count: filteredCalls.filter((c: Call) => c.duration > 60 && c.duration <= 120).length },
      { range: '2-5m', count: filteredCalls.filter((c: Call) => c.duration > 120 && c.duration <= 300).length },
      { range: '5-10m', count: filteredCalls.filter((c: Call) => c.duration > 300 && c.duration <= 600).length },
      { range: '10m+', count: filteredCalls.filter((c: Call) => c.duration > 600).length }
    ];

    const weeklyComparison = Array.from({ length: 4 }, (_, i) => {
      const weekStart = new Date(now.getTime() - ((i + 1) * 7 * 24 * 60 * 60 * 1000));
      const weekEnd = new Date(weekStart.getTime() + (7 * 24 * 60 * 60 * 1000));
      const weekCalls = filteredCalls.filter((call: Call) => {
        const callDate = new Date(call.start_time);
        return callDate >= weekStart && callDate < weekEnd;
      });
      const weekCompleted = weekCalls.filter((c: Call) => c.status === 'completed' || c.status === 'user-ended' || c.status === 'agent-ended').length;
      return { week: `Week ${i + 1}`, calls: weekCalls.length, successRate: weekCalls.length > 0 ? (weekCompleted / weekCalls.length) * 100 : 0 };
    }).reverse();

    const prevPeriodStart = new Date(now.getTime() - (filterDays * 2 * 24 * 60 * 60 * 1000));
    const prevPeriodEnd = new Date(now.getTime() - (filterDays * 24 * 60 * 60 * 1000));
    const prevPeriodCalls = calls.filter((call: Call) => {
      const callDate = new Date(call.start_time);
      return callDate >= prevPeriodStart && callDate < prevPeriodEnd;
    }).length;
    const weeklyGrowth = prevPeriodCalls > 0 ? ((filteredCalls.length - prevPeriodCalls) / prevPeriodCalls) * 100 : 0;

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const thisMonthCalls = calls.filter((call: Call) => new Date(call.start_time) >= monthStart).length;
    const lastMonthCalls = calls.filter((call: Call) => {
      const callDate = new Date(call.start_time);
      return callDate >= prevMonthStart && callDate <= prevMonthEnd;
    }).length;
    const monthlyGrowth = lastMonthCalls > 0 ? ((thisMonthCalls - lastMonthCalls) / lastMonthCalls) * 100 : 0;

    const analyticsData: Analytics = { totalCalls: filteredCalls.length, completedCalls: completed, failedCalls: failed, avgDuration, inboundCalls: inbound, outboundCalls: outbound, busyCalls: busy, transcribedCalls: transcribed, summarizedCalls: summarized, todaysCalls, weeklyGrowth, monthlyGrowth, peakHours, dailyStats, statusDistribution, hourlyDistribution, durationAnalysis, weeklyComparison };
    // Agent leaderboard
    const agentMap: { [key: string]: { name: string; calls: number; totalDuration: number; completed: number } } = {};
    filteredCalls.forEach((c: any) => {
      const key = c.agent_id || c.agent_name || 'Unknown';
      if (!agentMap[key]) agentMap[key] = { name: c.agent_name || key, calls: 0, totalDuration: 0, completed: 0 };
      agentMap[key].calls += 1;
      agentMap[key].totalDuration += (c.duration || 0);
      if (c.status === 'completed' || c.status === 'user-ended' || c.status === 'agent-ended') agentMap[key].completed += 1;
    });
    const agentLeaderboard = Object.values(agentMap).map(a => ({
      name: a.name || 'Unknown',
      calls: a.calls,
      avgDuration: a.calls > 0 ? Math.round(a.totalDuration / a.calls) : 0,
      successRate: a.calls > 0 ? Math.round((a.completed / a.calls) * 100) : 0,
    })).sort((a, b) => b.calls - a.calls).slice(0, 8);

    // Hourly heatmap (weekday x hour)
    const heatmapData: number[][] = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));
    filteredCalls.forEach((c: any) => {
      const d = new Date(c.start_time);
      if (isNaN(d.getTime())) return;
      const wd = d.getDay(); // 0 (Sun) - 6
      const hr = d.getHours();
      heatmapData[wd][hr] = (heatmapData[wd][hr] || 0) + 1;
    });

    // Call quality trend (heuristic): completed + transcription presence
    const trendDays = Math.min(Math.max(7, parseInt(dateFilter)), 30);
    const qualityTrend: { date: string; score: number }[] = [];
    for (let i = trendDays - 1; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const dayStr = day.toDateString();
      const dayCalls = filteredCalls.filter((c: any) => new Date(c.start_time).toDateString() === dayStr);
      if (dayCalls.length === 0) {
        qualityTrend.push({ date: day.toLocaleDateString(), score: 0 });
        continue;
      }
      const totalScore = dayCalls.reduce((sum: number, c: any) => {
        let s = (c.status === 'completed' || c.status === 'user-ended' || c.status === 'agent-ended') ? 1 : 0;
        if (c.transcription || c.transcription_formatted || c.chat) s += 0.5;
        return sum + s;
      }, 0);
      const avg = totalScore / (dayCalls.length * 1.5); // normalize to 0..1
      qualityTrend.push({ date: day.toLocaleDateString(), score: Math.round(avg * 100) });
    }

    return { analytics: analyticsData, recentCalls: calls.slice(0, 5), agentLeaderboard, heatmapData, qualityTrend };
  }, [rawCalls, dateFilter]);

  const heatmapMax = heatmapData ? heatmapData.flat().reduce((m, v) => Math.max(m, v), 0) : 0;

  const MetricCard = ({ title, value, icon: Icon, trend, trendValue, color = "teal", subtitle }: any) => {
    const tone = metricTones[color] || metricTones.slate;
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1.5 truncate">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-950 font-mono leading-none">{value}</p>
            {subtitle && <p className="text-slate-500 text-xs mt-1.5 truncate">{subtitle}</p>}
          </div>
          <div className={`grid h-11 w-11 sm:h-12 sm:w-12 flex-shrink-0 place-items-center rounded-lg border ${tone.chip} ${tone.ring}`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${tone.icon}`} />
          </div>
        </div>
        {trend && trendValue && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
            {trend === "up" && <ArrowUp className="w-3.5 h-3.5 text-teal-600" />}
            {trend === "down" && <ArrowDown className="w-3.5 h-3.5 text-rose-600" />}
            {trend === "neutral" && <Minus className="w-3.5 h-3.5 text-slate-400" />}
            <span className={`text-xs font-bold font-mono ${trend === "up" ? "text-teal-700" : trend === "down" ? "text-rose-700" : "text-slate-500"}`}>{trendValue}</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">vs last period</span>
          </div>
        )}
      </div>
    );
  };

  const SectionHeading = ({ icon: Icon, title, subtitle }: any) => (
    <div className="mb-4 flex items-center gap-2.5">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-900">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <h2 className="text-base font-bold text-slate-900 leading-none">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  const ChartCard = ({ icon: Icon, title, tag, tagColor = 'slate', children }: any) => {
    const tone = metricTones[tagColor] || metricTones.slate;
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-slate-400 shrink-0" />
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          </div>
          {tag && (
            <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide self-start sm:self-auto ${tone.chip} ${tone.icon}`}>
              {tag}
            </span>
          )}
        </div>
        {children}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <div className="hidden lg:block">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        <main className="flex-1 lg:ml-60 p-4 sm:p-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-medium">Loading analytics...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Menu Button - Fixed */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-sm border border-slate-200"
      >
        {sidebarOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/50 z-40"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      <main className="flex-1 lg:ml-60 p-4 sm:p-6 lg:p-6 pt-20 lg:pt-8">
        <div className="container mx-auto max-w-7xl space-y-5">

          {/* Header — compact bar, matches Call Ledger / Appointments */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="hidden sm:grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-slate-900">
                <BarChart3 className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold tracking-tight text-slate-950 truncate">Analytics</h1>
                <p className="text-xs text-slate-400">Performance across your AI call center</p>
              </div>
            </div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              <option value="1">Last 24 hours</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          {analytics && (
            <>
              {/* Key Metrics */}
              <section>
                <SectionHeading icon={TrendingUp} title="Key Performance Metrics" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <MetricCard
                    title="Total Calls"
                    value={analytics.totalCalls}
                    icon={PhoneCall}
                    trend={analytics.weeklyGrowth > 0 ? "up" : analytics.weeklyGrowth < 0 ? "down" : "neutral"}
                    trendValue={`${Math.abs(analytics.weeklyGrowth).toFixed(1)}%`}
                    color="teal"
                  />
                  <MetricCard
                    title="Success Rate"
                    value={`${analytics.totalCalls > 0 ? ((analytics.completedCalls / analytics.totalCalls) * 100).toFixed(1) : 0}%`}
                    icon={CheckCircle2}
                    subtitle={`${analytics.completedCalls} completed`}
                    color="teal"
                  />
                  <MetricCard
                    title="Average Duration"
                    value={`${Math.round(analytics.avgDuration)}s`}
                    icon={Clock}
                    subtitle="Per call"
                    color="indigo"
                  />
                  <MetricCard
                    title="Today's Calls"
                    value={analytics.todaysCalls}
                    icon={Activity}
                    trend={analytics.todaysCalls > 10 ? "up" : analytics.todaysCalls < 5 ? "down" : "neutral"}
                    trendValue="Active"
                    color="sky"
                  />
                </div>
              </section>

              {/* Agent Leaderboard, Hourly Heatmap, Quality Trend */}
              <section>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* Agent Leaderboard */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-900">Agent Leaderboard</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Top performers</span>
                    </div>
                    {agentLeaderboard && agentLeaderboard.length > 0 ? (
                      <div className="space-y-2.5">
                        {agentLeaderboard.map((a: any, idx: number) => (
                          <div key={a.name} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center font-mono font-bold text-xs text-slate-600 flex-shrink-0">{idx + 1}</div>
                              <div className="min-w-0">
                                <div className="font-semibold text-slate-800 text-sm truncate">{a.name}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{a.calls} calls · {a.avgDuration}s avg</div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-sm font-bold text-slate-900 font-mono">{a.calls}</div>
                              <div className="text-[11px] text-teal-600 font-semibold">{a.successRate}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400">No agent data</div>
                    )}
                  </div>

                  {/* Hourly Heatmap */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-900">Hourly Heatmap</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Weekday × hour</span>
                    </div>
                    {heatmapData ? (
                      <div className="text-xs text-slate-600">
                        <div className="overflow-auto">
                          <div className="inline-grid" style={{ gridTemplateColumns: `3.5rem repeat(24, 22px)`, gap: '4px', alignItems: 'center' }}>
                            <div />
                            {Array.from({ length: 24 }).map((_, h) => (
                              <div key={`h-${h}`} className="text-center text-slate-300 font-mono" style={{ fontSize: 9 }}>{h}</div>
                            ))}

                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((wd, i) => {
                              const row = heatmapData[i] || Array.from({ length: 24 }, () => 0);
                              return (
                                <React.Fragment key={`row-${i}`}>
                                  <div className="flex items-center text-[11px] font-bold text-slate-500">{wd}</div>
                                  {row.map((val: number, j: number) => {
                                    const alpha = heatmapMax > 0 ? Math.max(0.06, (val / heatmapMax) * 0.95) : 0;
                                    const style: any = val === 0
                                      ? { width: 22, height: 16, borderRadius: 4, background: '#f1f5f9' }
                                      : { width: 22, height: 16, borderRadius: 4, background: `rgba(13,148,136,${alpha})` };
                                    return <div key={`cell-${i}-${j}`} title={`${val} calls`} style={style} />;
                                  })}
                                </React.Fragment>
                              );
                            })}
                          </div>
                          <div className="mt-2 text-[11px] text-slate-400">Darker = more calls</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400">No heatmap data</div>
                    )}
                  </div>

                  {/* Call Quality Trend */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-900">Call Quality Trend</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Heuristic</span>
                    </div>
                    {qualityTrend && qualityTrend.length > 0 ? (
                      <div style={{ height: 160 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={qualityTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tickFormatter={(d: string) => new Date(d).toLocaleDateString()} hide />
                            <YAxis domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} stroke="#94a3b8" fontSize={10} />
                            <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ backgroundColor: 'rgba(255,255,255,0.97)', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '12px' }} />
                            <Line type="monotone" dataKey="score" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 2, fill: '#0d9488' }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400">No quality data</div>
                    )}
                  </div>
                </div>
              </section>

              {/* Call Direction & Status */}
              <section>
                <SectionHeading icon={BarChart3} title="Call Analytics" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <MetricCard
                    title="Inbound Calls"
                    value={analytics.inboundCalls}
                    icon={PhoneIncoming}
                    subtitle={`${analytics.totalCalls > 0 ? ((analytics.inboundCalls / analytics.totalCalls) * 100).toFixed(1) : 0}% of total`}
                    color="sky"
                  />
                  <MetricCard
                    title="Outbound Calls"
                    value={analytics.outboundCalls}
                    icon={PhoneOutgoing}
                    subtitle={`${analytics.totalCalls > 0 ? ((analytics.outboundCalls / analytics.totalCalls) * 100).toFixed(1) : 0}% of total`}
                    color="violet"
                  />
                  <MetricCard
                    title="Busy Calls"
                    value={analytics.busyCalls}
                    icon={AlertCircle}
                    subtitle={`${analytics.totalCalls > 0 ? ((analytics.busyCalls / analytics.totalCalls) * 100).toFixed(1) : 0}% of total`}
                    color="amber"
                  />
                </div>
              </section>

              {/* Charts Grid 1 */}
              <section>
                <SectionHeading icon={Activity} title="Trend Analysis" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <ChartCard icon={TrendingUp} title="Call Volume Trend" tag="Area Chart" tagColor="teal">
                    {mounted && (
                      <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={analytics.dailyStats}>
                          <defs>
                            <linearGradient id="callsGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
                              <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} angle={-45} textAnchor="end" height={55} />
                          <YAxis stroke="#94a3b8" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.97)', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '12px' }} />
                          <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '11px' }} />
                          <Area type="monotone" dataKey="calls" stroke="#0d9488" fillOpacity={1} fill="url(#callsGradient)" strokeWidth={2} name="Total Calls" />
                          <Area type="monotone" dataKey="completed" stroke="#4f46e5" fillOpacity={1} fill="url(#completedGradient)" strokeWidth={2} name="Completed" />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </ChartCard>

                  <ChartCard icon={Clock} title="Hourly Distribution" tag="Column Chart" tagColor="indigo">
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <div className="min-w-[500px] px-4 sm:px-0">
                        {mounted && (
                          <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={analytics.hourlyDistribution}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={9} angle={-45} textAnchor="end" height={55} />
                              <YAxis stroke="#94a3b8" fontSize={10} />
                              <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.97)', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '12px' }} />
                              <Bar dataKey="calls" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </ChartCard>
                </div>
              </section>

              {/* Charts Grid 2 */}
              <section>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <ChartCard icon={BarChart3} title="Duration Analysis" tag="Bar Chart" tagColor="slate">
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={analytics.durationAnalysis} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                        <YAxis type="category" dataKey="range" stroke="#94a3b8" fontSize={10} width={55} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.97)', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '12px' }} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                          {analytics.durationAnalysis.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard icon={TrendingUp} title="Weekly Performance" tag="Line Chart" tagColor="teal">
                    {mounted && (
                      <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={analytics.weeklyComparison}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="week" stroke="#94a3b8" fontSize={10} />
                          <YAxis stroke="#94a3b8" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.97)', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '12px' }} />
                          <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '11px' }} />
                          <Line type="monotone" dataKey="calls" stroke="#0d9488" strokeWidth={2} dot={{ fill: '#0d9488', r: 3 }} activeDot={{ r: 5 }} name="Total Calls" />
                          <Line type="monotone" dataKey="successRate" stroke="#4f46e5" strokeWidth={2} dot={{ fill: '#4f46e5', r: 3 }} activeDot={{ r: 5 }} name="Success Rate %" strokeDasharray="5 5" />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </ChartCard>
                </div>
              </section>

              {/* Donut Chart & Call Direction */}
              <section>
                <SectionHeading icon={PieChart} title="Distribution & Breakdown" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <ChartCard icon={PieChart} title="Call Status Distribution" tag="Donut Chart" tagColor="teal">
                    {mounted && (
                      <ResponsiveContainer width="100%" height={260}>
                        <RechartsPieChart>
                          <Pie
                            dataKey="count"
                            data={analytics.statusDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={48}
                            outerRadius={85}
                            paddingAngle={4}
                            label={(entry: any) => `${entry.payload.status}: ${entry.value}`}
                            labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                          >
                            {analytics.statusDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.97)', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '12px' }} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    )}
                    <div className="text-center mt-3 pt-3 border-t border-slate-100">
                      <div className="text-2xl font-bold text-slate-950 font-mono">{analytics.totalCalls}</div>
                      <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">Total Calls</div>
                    </div>
                  </ChartCard>

                  <ChartCard icon={BarChart3} title="Call Direction Breakdown" tag="Progress" tagColor="slate">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between gap-3 p-3.5 bg-sky-50 rounded-lg border border-sky-200">
                        <div className="flex items-center gap-2.5">
                          <PhoneIncoming className="w-5 h-5 text-sky-600 shrink-0" />
                          <span className="font-bold text-slate-800 text-sm">Inbound</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-sky-700 font-mono leading-none">{analytics.inboundCalls}</div>
                          <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                            {analytics.totalCalls > 0 ? ((analytics.inboundCalls / analytics.totalCalls) * 100).toFixed(1) : 0}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 p-3.5 bg-violet-50 rounded-lg border border-violet-200">
                        <div className="flex items-center gap-2.5">
                          <PhoneOutgoing className="w-5 h-5 text-violet-600 shrink-0" />
                          <span className="font-bold text-slate-800 text-sm">Outbound</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-violet-700 font-mono leading-none">{analytics.outboundCalls}</div>
                          <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                            {analytics.totalCalls > 0 ? ((analytics.outboundCalls / analytics.totalCalls) * 100).toFixed(1) : 0}%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex mb-1.5 items-center justify-between text-[11px] font-bold text-sky-700">
                          <span>Inbound</span>
                          <span className="font-mono">{analytics.totalCalls > 0 ? ((analytics.inboundCalls / analytics.totalCalls) * 100).toFixed(1) : 0}%</span>
                        </div>
                        <div className="overflow-hidden h-2 rounded-full bg-sky-100">
                          <div
                            style={{ width: `${analytics.totalCalls > 0 ? (analytics.inboundCalls / analytics.totalCalls) * 100 : 0}%` }}
                            className="h-full bg-sky-500 rounded-full transition-all duration-500"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex mb-1.5 items-center justify-between text-[11px] font-bold text-violet-700">
                          <span>Outbound</span>
                          <span className="font-mono">{analytics.totalCalls > 0 ? ((analytics.outboundCalls / analytics.totalCalls) * 100).toFixed(1) : 0}%</span>
                        </div>
                        <div className="overflow-hidden h-2 rounded-full bg-violet-100">
                          <div
                            style={{ width: `${analytics.totalCalls > 0 ? (analytics.outboundCalls / analytics.totalCalls) * 100 : 0}%` }}
                            className="h-full bg-violet-500 rounded-full transition-all duration-500"
                          />
                        </div>
                      </div>
                    </div>
                  </ChartCard>
                </div>
              </section>

              {/* AI Analysis Performance */}
              <section>
                <SectionHeading icon={Brain} title="AI Analysis Performance" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* Transcribed Calls */}
                  <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="grid h-11 w-11 place-items-center rounded-lg bg-indigo-600">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-indigo-700 font-mono">{analytics.transcribedCalls}</div>
                    </div>
                    <p className="text-slate-800 font-bold text-sm mb-1">Transcribed Calls</p>
                    <p className="text-slate-500 text-xs font-medium">
                      {analytics.totalCalls > 0 ? ((analytics.transcribedCalls / analytics.totalCalls) * 100).toFixed(1) : 0}% of total calls processed
                    </p>
                    <div className="mt-3 pt-3 border-t border-indigo-200/70">
                      <div className="overflow-hidden h-1.5 rounded-full bg-indigo-200">
                        <div
                          style={{ width: `${analytics.totalCalls > 0 ? (analytics.transcribedCalls / analytics.totalCalls) * 100 : 0}%` }}
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summarized Calls */}
                  <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="grid h-11 w-11 place-items-center rounded-lg bg-sky-600">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-sky-700 font-mono">{analytics.summarizedCalls}</div>
                    </div>
                    <p className="text-slate-800 font-bold text-sm mb-1">Summarized Calls</p>
                    <p className="text-slate-500 text-xs font-medium">
                      {analytics.transcribedCalls > 0 ? ((analytics.summarizedCalls / analytics.transcribedCalls) * 100).toFixed(1) : 0}% of transcribed calls
                    </p>
                    <div className="mt-3 pt-3 border-t border-sky-200/70">
                      <div className="overflow-hidden h-1.5 rounded-full bg-sky-200">
                        <div
                          style={{ width: `${analytics.transcribedCalls > 0 ? (analytics.summarizedCalls / analytics.transcribedCalls) * 100 : 0}%` }}
                          className="h-full bg-sky-600 rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Processing Rate */}
                  <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 sm:p-5 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-600">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-teal-700 font-mono">
                        {analytics.transcribedCalls > 0 ? ((analytics.summarizedCalls / analytics.transcribedCalls) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                    <p className="text-slate-800 font-bold text-sm mb-1">Processing Rate</p>
                    <p className="text-slate-500 text-xs font-medium">AI summary completion rate</p>
                    <div className="mt-3 pt-3 border-t border-teal-200/70">
                      <div className="overflow-hidden h-1.5 rounded-full bg-teal-200">
                        <div
                          style={{ width: `${analytics.transcribedCalls > 0 ? (analytics.summarizedCalls / analytics.transcribedCalls) * 100 : 0}%` }}
                          className="h-full bg-teal-600 rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Peak Hours */}
              {analytics.peakHours.length > 0 && (
                <section>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <h3 className="text-sm font-bold text-slate-900">Peak Call Hours</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {analytics.peakHours.map((peak, index) => (
                        <div
                          key={peak.hour}
                          className="text-center p-3.5 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <div className="text-xl font-bold text-slate-950 font-mono mb-1">{peak.hour}:00</div>
                          <div className="text-slate-600 text-xs font-semibold">{peak.count} calls</div>
                          <div className="text-[10px] text-teal-600 font-bold mt-1.5 uppercase tracking-wide">Rank #{index + 1}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Recent Calls */}
              <section>
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <h3 className="text-sm font-bold text-slate-900">Recent Calls</h3>
                    </div>
                    <a
                      href="/calls"
                      className="text-teal-700 hover:text-teal-800 font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      View All
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  {recentCalls.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {recentCalls.map((call) => {
                        const tone = statusTone(call.status);
                        return (
                          <div
                            key={call.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 sm:px-5 py-3 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {call.direction === 'inbound' ? (
                                <PhoneIncoming className="w-4 h-4 text-sky-600 shrink-0" />
                              ) : (
                                <PhoneOutgoing className="w-4 h-4 text-violet-600 shrink-0" />
                              )}
                              <span className="font-medium text-slate-800 text-sm font-mono truncate">{call.from_number} → {call.to_number}</span>
                              <span className={`hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide border ${tone.bg} ${tone.text} ${tone.border}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
                                {call.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0 pl-7 sm:pl-0">
                              <span className={`sm:hidden inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide border ${tone.bg} ${tone.text} ${tone.border}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
                                {call.status}
                              </span>
                              <div className="text-right">
                                <div className="text-sm font-bold text-slate-800 font-mono">{call.duration}s</div>
                                <div className="text-[11px] text-slate-400 font-mono" suppressHydrationWarning>
                                  {mounted ? new Date(call.start_time).toLocaleTimeString() : ''}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <PhoneCall className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm font-medium">No recent calls found</p>
                    </div>
                  )}
                </div>
              </section>

            </>
          )}
        </div>
      </main>
    </div>
  );
}
