"use client";
import Sidebar from "@/components/Sidebar";
import { useCachedFetch } from "@/components/hooks/use-cached-fetch";
import { useWebSocket } from "@/components/hooks/use-websocket";
import { CACHE_KEYS, invalidateCache } from "@/lib/cache";
import { Activity, AlertCircle, ArrowDown, ArrowUp, BarChart3, CheckCircle, Clock, Loader2, Menu, MessageSquare, Minus, PhoneCall, PhoneIncoming, PhoneOutgoing, TrendingUp, X, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Bar, BarChart, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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
  allTimeCalls: number;
  totalCalls: number;
  completedCalls: number;
  failedCalls: number;
  avgDuration: number;
  totalDuration: number;
  longestCall: number;
  completionRate: number;
  issueRate: number;
  inboundCalls: number;
  outboundCalls: number;
  busyCalls: number;
  transcribedCalls: number;
  summarizedCalls: number;
  recordedCalls: number;
  transcriptionRate: number;
  recordingRate: number;
  todaysCalls: number;
  uniqueCallers: number;
  avgCallsPerDay: number;
  bestDay: string;
  topCaller: string;
  weeklyGrowth: number;
  monthlyGrowth: number;
  peakHours: { hour: number; count: number }[];
  dailyStats: { date: string; calls: number; completed: number; failed: number; transcribed: number; outbound: number }[];
  statusDistribution: { status: string; count: number; percentage: number }[];
  hourlyDistribution: { hour: string; calls: number }[];
  bubbleDistribution: { hour: number; label: string; calls: number; avgDuration: number; z: number }[];
  durationAnalysis: { range: string; count: number }[];
  weeklyComparison: { week: string; calls: number; successRate: number }[];
  wordCloud: { word: string; count: number; size: string; color: string }[];
  sentimentClusters: { label: string; count: number; percentage: number; color: string }[];
  callFunnel: { stage: string; count: number; percentage: number; color: string }[];
  speakingBreakdown: { date: string; speaking: number; listening: number; pause: number }[];
  agentBubbleData: { agent: string; calls: number; conversionRate: number; avgDuration: number; z: number }[];
  pipelineStages: { stage: string; count: number; color: string }[];
  waterfallSteps: { stage: string; count: number; color: string }[];
  callFlowSteps: { from: string; to: string; count: number; color: string }[];
  multiMetricTrend: { date: string; calls: number; connectionRate: number; transcriptRate: number }[];
  serviceProgress: { date: string; calls: number; leads: number; appointments: number; campaigns: number }[];
  sidebarFeatureBars: { feature: string; value: number; detail: string; color: string }[];
  featureRadar: { label: string; value: number; color: string }[];
}

const completedStatuses = new Set(['completed', 'user-ended', 'agent-ended']);
const issueStatuses = new Set(['failed', 'error', 'busy', 'no-answer']);
const secondsInDay = 24 * 60 * 60;

const getCallDate = (call: Call) => {
  const date = new Date(call.start_time);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getCallDuration = (call: Call) => Number(call.duration || 0);

const stringifyChat = (chat: any): string => {
  if (!chat) return '';
  if (typeof chat === 'string') return chat;
  if (Array.isArray(chat)) return chat.map((item) => stringifyChat(item)).join(' ');
  if (typeof chat === 'object') return Object.values(chat).map((value) => stringifyChat(value)).join(' ');
  return String(chat);
};

const getCallText = (call: Call) => [
  call.transcription,
  call.transcription_formatted,
  stringifyChat(call.chat),
  call.agent_name,
  call.status,
].filter(Boolean).join(' ');

const formatDuration = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.round(seconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  if (minutes === 0) return `${remainingSeconds}s`;
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export default function AnalyticsOverview() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [dateFilter, setDateFilter] = useState("30");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const chartColors = ['#2563eb', '#10b981', '#14b8a6', '#ef4444', '#8b5cf6', '#06b6d4'];

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
    }
  }, [router]);

  // Fetch raw calls once and cache — shared with Calls page
  const fetchCallsData = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digital-api-46ss.onrender.com/api';
    const callsRes = await fetch(`${API_BASE_URL}/calls?limit=1000`, {
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
    key: CACHE_KEYS.CALLS,
    fetcher: fetchCallsData,
    ttl: 60000, // 1 minute cache
    enabled: mounted,
  });

  // Invalidate cache on new call via WebSocket
  useWebSocket({
    onMessage: useCallback((msg: any) => {
      if (msg.type === 'new-call' || msg.type === 'call-update') {
        invalidateCache(CACHE_KEYS.CALLS);
        refresh(true);
      }
    }, [refresh]),
  });

  // Compute all analytics from raw calls using useMemo — instant on filter change
  const { analytics, recentCalls } = useMemo(() => {
    const calls = rawCalls || [];
    const now = new Date();
    const filterDays = dateFilter === 'all' ? null : Number(dateFilter);
    const filterDate = new Date(now);
    if (filterDays) {
      filterDate.setDate(filterDate.getDate() - filterDays);
      filterDate.setHours(0, 0, 0, 0);
    }
    const datedCalls = calls.filter((call: Call) => getCallDate(call));
    const filteredCalls = filterDays ? datedCalls.filter((call: Call) => {
      const callDate = getCallDate(call);
      return callDate ? callDate >= filterDate : false;
    }) : datedCalls;

    const completed = filteredCalls.filter((c: Call) => completedStatuses.has(c.status)).length;
    const failed = filteredCalls.filter((c: Call) => c.status === 'failed' || c.status === 'error').length;
    const busy = filteredCalls.filter((c: Call) => c.status === 'busy' || c.status === 'no-answer').length;
    const inbound = filteredCalls.filter((c: Call) => c.direction === 'inbound').length;
    const outbound = filteredCalls.filter((c: Call) => c.direction === 'outbound').length;
    const transcribed = filteredCalls.filter((c: Call) => c.transcription || c.transcription_formatted || c.chat).length;
    const summarized = filteredCalls.filter((c: Call) => c.transcription_formatted).length;
    const recorded = filteredCalls.filter((c: Call) => c.recording_url).length;
    const totalDuration = filteredCalls.reduce((sum: number, call: Call) => sum + getCallDuration(call), 0);
    const longestCall = filteredCalls.reduce((max: number, call: Call) => Math.max(max, getCallDuration(call)), 0);
    const avgDuration = filteredCalls.length > 0 ? totalDuration / filteredCalls.length : 0;
    const completionRate = filteredCalls.length > 0 ? (completed / filteredCalls.length) * 100 : 0;
    const issueRate = filteredCalls.length > 0 ? (filteredCalls.filter((c: Call) => issueStatuses.has(c.status)).length / filteredCalls.length) * 100 : 0;
    const transcriptionRate = filteredCalls.length > 0 ? (transcribed / filteredCalls.length) * 100 : 0;
    const recordingRate = filteredCalls.length > 0 ? (recorded / filteredCalls.length) * 100 : 0;
    const today = new Date().toDateString();
    const todaysCalls = datedCalls.filter((call: Call) => getCallDate(call)?.toDateString() === today).length;

    const callerCounts: { [key: string]: number } = {};
    filteredCalls.forEach((call: Call) => {
      const caller = call.from_number || 'Unknown';
      callerCounts[caller] = (callerCounts[caller] || 0) + 1;
    });
    const uniqueCallers = Object.keys(callerCounts).length;
    const topCallerEntry = Object.entries(callerCounts).sort((a, b) => b[1] - a[1])[0];
    const topCaller = topCallerEntry ? `${topCallerEntry[0]} (${topCallerEntry[1]})` : 'No calls';

    const hourCounts: { [key: number]: number } = {};
    filteredCalls.forEach((call: Call) => {
      const callDate = getCallDate(call);
      if (!callDate) return;
      const hour = callDate.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const peakHours = Object.entries(hourCounts).map(([hour, count]) => ({ hour: parseInt(hour), count })).sort((a, b) => b.count - a.count).slice(0, 5);

    const earliestCallDate = filteredCalls.reduce<Date | null>((earliest, call) => {
      const callDate = getCallDate(call);
      if (!callDate) return earliest;
      return !earliest || callDate < earliest ? callDate : earliest;
    }, null);
    const daySpan = earliestCallDate ? Math.max(1, Math.ceil((now.getTime() - earliestCallDate.getTime()) / (secondsInDay * 1000)) + 1) : 7;
    const visibleDays = Math.min(filterDays ? Math.max(filterDays, 7) : daySpan, 14);

    const dailyStats = [];
    for (let i = visibleDays - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayCalls = filteredCalls.filter((call: Call) => getCallDate(call)?.toDateString() === dateStr);
      dailyStats.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        calls: dayCalls.length,
        completed: dayCalls.filter((c: Call) => completedStatuses.has(c.status)).length,
        failed: dayCalls.filter((c: Call) => c.status === 'failed' || c.status === 'error').length,
        transcribed: dayCalls.filter((c: Call) => c.transcription || c.transcription_formatted || c.chat).length,
        outbound: dayCalls.filter((c: Call) => c.direction === 'outbound').length
      });
    }
    const bestDayData = dailyStats.reduce((best, day) => day.calls > best.calls ? day : best, { date: 'No calls', calls: 0, completed: 0, failed: 0, transcribed: 0, outbound: 0 });
    const bestDay = bestDayData.calls > 0 ? `${bestDayData.date} (${bestDayData.calls})` : 'No calls';
    const activeDayCount = Math.max(1, dailyStats.filter((day) => day.calls > 0).length || visibleDays);
    const avgCallsPerDay = filteredCalls.length / activeDayCount;

    const statusCounts: { [key: string]: number } = {};
    filteredCalls.forEach((call: Call) => { statusCounts[call.status || 'unknown'] = (statusCounts[call.status || 'unknown'] || 0) + 1; });
    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({ status, count, percentage: filteredCalls.length > 0 ? (count / filteredCalls.length) * 100 : 0 }));
    const hourlyDurationSums: { [key: number]: number } = {};
    filteredCalls.forEach((call: Call) => {
      const callDate = getCallDate(call);
      if (!callDate) return;
      const hour = callDate.getHours();
      hourlyDurationSums[hour] = (hourlyDurationSums[hour] || 0) + getCallDuration(call);
    });
    const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({ hour: `${hour.toString().padStart(2, '0')}:00`, calls: hourCounts[hour] || 0 }));
    const bubbleDistribution = Object.entries(hourCounts)
      .map(([hour, count]) => {
        const parsedHour = parseInt(hour);
        return {
          hour: parsedHour,
          label: `${parsedHour.toString().padStart(2, '0')}:00`,
          calls: count,
          avgDuration: count > 0 ? Math.round((hourlyDurationSums[parsedHour] || 0) / count) : 0,
          z: Math.max(120, count * 180),
        };
      })
      .sort((a, b) => a.hour - b.hour);

    const durationAnalysis = [
      { range: '0-30s', count: filteredCalls.filter((c: Call) => getCallDuration(c) <= 30).length },
      { range: '30s-1m', count: filteredCalls.filter((c: Call) => getCallDuration(c) > 30 && getCallDuration(c) <= 60).length },
      { range: '1-2m', count: filteredCalls.filter((c: Call) => getCallDuration(c) > 60 && getCallDuration(c) <= 120).length },
      { range: '2-5m', count: filteredCalls.filter((c: Call) => getCallDuration(c) > 120 && getCallDuration(c) <= 300).length },
      { range: '5-10m', count: filteredCalls.filter((c: Call) => getCallDuration(c) > 300 && getCallDuration(c) <= 600).length },
      { range: '10m+', count: filteredCalls.filter((c: Call) => getCallDuration(c) > 600).length }
    ];

    const weeklyComparison = Array.from({ length: 4 }, (_, i) => {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - ((i + 1) * 7));
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const weekCalls = datedCalls.filter((call: Call) => {
        const callDate = getCallDate(call);
        return callDate ? callDate >= weekStart && callDate < weekEnd : false;
      });
      const weekCompleted = weekCalls.filter((c: Call) => completedStatuses.has(c.status)).length;
      return { week: `Week ${i + 1}`, calls: weekCalls.length, successRate: weekCalls.length > 0 ? (weekCompleted / weekCalls.length) * 100 : 0 };
    }).reverse();

    const comparisonDays = filterDays || 7;
    const prevPeriodStart = new Date(now);
    prevPeriodStart.setDate(prevPeriodStart.getDate() - (comparisonDays * 2));
    prevPeriodStart.setHours(0, 0, 0, 0);
    const prevPeriodEnd = new Date(now);
    prevPeriodEnd.setDate(prevPeriodEnd.getDate() - comparisonDays);
    prevPeriodEnd.setHours(0, 0, 0, 0);
    const prevPeriodCalls = datedCalls.filter((call: Call) => {
      const callDate = getCallDate(call);
      return callDate ? callDate >= prevPeriodStart && callDate < prevPeriodEnd : false;
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

    const stopWords = new Set([
      'the', 'and', 'for', 'with', 'from', 'that', 'this', 'you', 'your', 'are', 'was', 'were', 'call', 'calls',
      'hello', 'please', 'thank', 'thanks', 'have', 'will', 'can', 'not', 'yes', 'no', 'sir', 'mam', 'madam'
    ]);
    const wordColors = ['#2563eb', '#10b981', '#0ea5e9', '#8b5cf6', '#ef4444', '#14b8a6'];
    const wordCounts: { [key: string]: number } = {};
    filteredCalls.forEach((call: Call) => {
      getCallText(call).toLowerCase().replace(/[^a-z0-9+\s]/g, ' ').split(/\s+/).forEach((word) => {
        if (word.length < 4 || stopWords.has(word)) return;
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
    });
    const wordCloud = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 18)
      .map(([word, count], index) => ({
        word,
        count,
        size: count > 4 ? 'text-3xl' : count > 2 ? 'text-2xl' : 'text-lg',
        color: wordColors[index % wordColors.length],
      }));
    if (wordCloud.length === 0) {
      ['appointment', 'tourism', 'completed', 'recording', 'transcript', 'inbound'].forEach((word, index) => {
        wordCloud.push({ word, count: 1, size: index < 2 ? 'text-2xl' : 'text-lg', color: wordColors[index % wordColors.length] });
      });
    }

    const positiveWords = ['booked', 'booking', 'confirmed', 'yes', 'good', 'great', 'happy', 'interested', 'appointment', 'completed'];
    const negativeWords = ['cancel', 'angry', 'bad', 'issue', 'problem', 'failed', 'busy', 'no-answer', 'not', 'complaint'];
    const sentimentCounts = { Positive: 0, Neutral: 0, Attention: 0 };
    filteredCalls.forEach((call: Call) => {
      const text = `${getCallText(call)} ${call.status}`.toLowerCase();
      const positiveScore = positiveWords.filter((word) => text.includes(word)).length;
      const negativeScore = negativeWords.filter((word) => text.includes(word)).length;
      if (negativeScore > positiveScore || issueStatuses.has(call.status)) sentimentCounts.Attention += 1;
      else if (positiveScore > 0 || completedStatuses.has(call.status)) sentimentCounts.Positive += 1;
      else sentimentCounts.Neutral += 1;
    });
    const sentimentClusters = [
      { label: 'Positive', count: sentimentCounts.Positive, percentage: filteredCalls.length ? (sentimentCounts.Positive / filteredCalls.length) * 100 : 0, color: '#10b981' },
      { label: 'Neutral', count: sentimentCounts.Neutral, percentage: filteredCalls.length ? (sentimentCounts.Neutral / filteredCalls.length) * 100 : 0, color: '#0ea5e9' },
      { label: 'Needs Attention', count: sentimentCounts.Attention, percentage: filteredCalls.length ? (sentimentCounts.Attention / filteredCalls.length) * 100 : 0, color: '#ef4444' },
    ];

    const funnelTotal = Math.max(filteredCalls.length, 1);
    const callFunnel = [
      { stage: 'Calls Initiated', count: filteredCalls.length, percentage: (filteredCalls.length / funnelTotal) * 100, color: '#2563eb' },
      { stage: 'Picked Up', count: completed + busy + failed, percentage: ((completed + busy + failed) / funnelTotal) * 100, color: '#0ea5e9' },
      { stage: 'Connected', count: completed, percentage: (completed / funnelTotal) * 100, color: '#10b981' },
      { stage: 'Captured Transcript', count: transcribed, percentage: (transcribed / funnelTotal) * 100, color: '#8b5cf6' },
      { stage: 'Outcome Recorded', count: summarized, percentage: (summarized / funnelTotal) * 100, color: '#14b8a6' },
    ];

    const speakingBreakdown = dailyStats.map((day) => {
      const dayDuration = Math.max(day.calls * avgDuration, day.calls * 20);
      return {
        date: day.date,
        speaking: Math.round(dayDuration * 0.44),
        listening: Math.round(dayDuration * 0.41),
        pause: Math.round(dayDuration * 0.15),
      };
    });

    const agentBuckets: { [key: string]: { calls: number; completed: number; duration: number } } = {};
    filteredCalls.forEach((call: Call) => {
      const agent = call.agent_name || 'Voice Agent';
      if (!agentBuckets[agent]) agentBuckets[agent] = { calls: 0, completed: 0, duration: 0 };
      agentBuckets[agent].calls += 1;
      agentBuckets[agent].duration += getCallDuration(call);
      if (completedStatuses.has(call.status)) agentBuckets[agent].completed += 1;
    });
    const agentBubbleData = Object.entries(agentBuckets).map(([agent, bucket]) => ({
      agent,
      calls: bucket.calls,
      conversionRate: bucket.calls > 0 ? (bucket.completed / bucket.calls) * 100 : 0,
      avgDuration: bucket.calls > 0 ? Math.round(bucket.duration / bucket.calls) : 0,
      z: Math.max(150, bucket.calls * 220),
    }));

    const pipelineStages = [
      { stage: 'Lead', count: filteredCalls.length, color: '#2563eb' },
      { stage: 'Contacted', count: completed + busy, color: '#0ea5e9' },
      { stage: 'Qualified', count: transcribed, color: '#8b5cf6' },
      { stage: 'Follow-up', count: failed + busy, color: '#14b8a6' },
      { stage: 'Outcome', count: summarized, color: '#10b981' },
    ];

    const waterfallSteps = [
      { stage: 'New Calls', count: filteredCalls.length, color: '#2563eb' },
      { stage: 'Connected', count: completed, color: '#10b981' },
      { stage: 'Transcript', count: transcribed, color: '#8b5cf6' },
      { stage: 'Summary', count: summarized, color: '#0ea5e9' },
      { stage: 'Needs Follow-up', count: failed + busy, color: '#ef4444' },
    ];

    const callFlowSteps = [
      { from: 'Inbound', to: 'Voice Agent', count: inbound, color: '#2563eb' },
      { from: 'Outbound', to: 'Customer', count: outbound, color: '#0ea5e9' },
      { from: 'Connected', to: 'Transcript', count: transcribed, color: '#8b5cf6' },
      { from: 'Transcript', to: 'Summary', count: summarized, color: '#10b981' },
      { from: 'Missed', to: 'Follow-up', count: failed + busy, color: '#ef4444' },
    ];

    const multiMetricTrend = dailyStats.map((day) => ({
      date: day.date,
      calls: day.calls,
      connectionRate: day.calls > 0 ? (day.completed / day.calls) * 100 : 0,
      transcriptRate: day.calls > 0 ? Math.min(100, transcriptionRate) : 0,
    }));
    const serviceProgress = dailyStats.map((day) => ({
      date: day.date,
      calls: day.calls,
      leads: day.transcribed,
      appointments: day.completed,
      campaigns: day.outbound,
    }));
    const activeAgentCount = new Set(filteredCalls.map((call: Call) => call.agent_name || call.agent_id).filter(Boolean)).size;
    const featureRadar = [
      { label: 'Calls', value: filteredCalls.length > 0 ? 100 : 0, color: '#2563eb' },
      { label: 'Billing', value: totalDuration > 0 ? Math.min(100, (totalDuration / 300) * 100) : 0, color: '#0ea5e9' },
      { label: 'Campaigns', value: filteredCalls.length > 0 ? (outbound / filteredCalls.length) * 100 : 0, color: '#8b5cf6' },
      { label: 'Leads', value: transcriptionRate, color: '#10b981' },
      { label: 'Appointments', value: completionRate, color: '#f59e0b' },
      { label: 'Doctors', value: activeAgentCount > 0 ? Math.min(100, activeAgentCount * 35) : 0, color: '#14b8a6' },
      { label: 'Availability', value: Math.max(0, 100 - issueRate), color: '#ef4444' },
      { label: 'Booking', value: summarized > 0 ? Math.min(100, (summarized / Math.max(completed, 1)) * 100) : completionRate, color: '#6366f1' },
    ];
    const billingMinutes = Math.max(0, Math.round(totalDuration / 60));
    const bookingScore = summarized > 0 ? summarized : completed;
    const availabilityScore = Math.round(Math.max(0, 100 - issueRate));
    const sidebarFeatureBars = [
      { feature: 'Calls', value: filteredCalls.length, detail: `${filteredCalls.length} total calls`, color: '#ef4444' },
      { feature: 'Billing', value: billingMinutes, detail: `${billingMinutes} talk-time minutes`, color: '#38bdf8' },
      { feature: 'Campaigns', value: outbound, detail: `${outbound} outbound campaign calls`, color: '#22c55e' },
      { feature: 'Lead Analysis', value: transcribed, detail: `${transcribed} calls analyzed`, color: '#a78bfa' },
      { feature: 'Appointments', value: completed, detail: `${completed} completed conversations`, color: '#facc15' },
      { feature: 'Book Appt', value: bookingScore, detail: `${bookingScore} booking-ready calls`, color: '#f472b6' },
      { feature: 'Doctors', value: activeAgentCount, detail: `${activeAgentCount} active voice agents`, color: '#14b8a6' },
      { feature: 'Availability', value: availabilityScore, detail: `${availabilityScore}% service health`, color: '#60a5fa' },
    ];

    const analyticsData: Analytics = {
      allTimeCalls: datedCalls.length,
      totalCalls: filteredCalls.length,
      completedCalls: completed,
      failedCalls: failed,
      avgDuration,
      totalDuration,
      longestCall,
      completionRate,
      issueRate,
      inboundCalls: inbound,
      outboundCalls: outbound,
      busyCalls: busy,
      transcribedCalls: transcribed,
      summarizedCalls: summarized,
      recordedCalls: recorded,
      transcriptionRate,
      recordingRate,
      todaysCalls,
      uniqueCallers,
      avgCallsPerDay,
      bestDay,
      topCaller,
      weeklyGrowth,
      monthlyGrowth,
      peakHours,
      dailyStats,
      statusDistribution,
      hourlyDistribution,
      bubbleDistribution,
      durationAnalysis,
      weeklyComparison,
      wordCloud,
      sentimentClusters,
      callFunnel,
      speakingBreakdown,
      agentBubbleData,
      pipelineStages,
      waterfallSteps,
      callFlowSteps,
      multiMetricTrend,
      serviceProgress,
      sidebarFeatureBars,
      featureRadar
    };
    const recent = [...filteredCalls].sort((a, b) => (getCallDate(b)?.getTime() || 0) - (getCallDate(a)?.getTime() || 0)).slice(0, 5);
    return { analytics: analyticsData, recentCalls: recent };
  }, [rawCalls, dateFilter]);

  const metricSurfaces: Record<string, string> = {
    orange: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
    green: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    purple: "linear-gradient(135deg, #8b5cf6 0%, #4f46e5 100%)",
    sky: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
    yellow: "linear-gradient(135deg, #84cc16 0%, #059669 100%)",
    rose: "linear-gradient(135deg, #f43f5e 0%, #db2777 100%)",
    slate: "linear-gradient(135deg, #475569 0%, #0f172a 100%)",
  };

  const MetricCard = ({ title, value, icon: Icon, trend, trendValue, color = "orange", subtitle }: any) => (
    <div
      className="rounded-lg p-4 sm:p-6 border border-transparent shadow-sm hover:shadow-md transition-all duration-300 group text-white"
      style={{ background: metricSurfaces[color] || metricSurfaces.sky }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-xs sm:text-sm font-semibold mb-1 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{value}</p>
          {subtitle && <p className="text-white/75 text-xs truncate">{subtitle}</p>}
        </div>
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/18 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-sm shrink-0">
          <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
        </div>
      </div>
      {trend && trendValue && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/25">
          {trend === "up" && <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
          {trend === "down" && <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
          {trend === "neutral" && <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
          <span className="text-xs sm:text-sm font-semibold text-white">{trendValue}</span>
          <span className="text-white/70 text-xs ml-1 hidden sm:inline">vs last period</span>
        </div>
      )}
    </div>
  );

  const GaugeCard = ({ title, value, color, subtitle }: any) => {
    const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
    return (
      <div className="bg-white rounded-lg p-4 sm:p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <p className="text-sm font-bold text-slate-800">{title}</p>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
          <span className="text-lg font-black text-slate-950">{safeValue.toFixed(0)}%</span>
        </div>
        <svg viewBox="0 0 140 82" className="w-full h-24">
          <path d="M20 70 A50 50 0 0 1 120 70" fill="none" stroke="#e2e8f0" strokeWidth="13" strokeLinecap="round" pathLength={100} />
          <path d="M20 70 A50 50 0 0 1 120 70" fill="none" stroke={color} strokeWidth="13" strokeLinecap="round" pathLength={100} strokeDasharray={`${safeValue} 100`} />
          <circle cx="70" cy="70" r="5" fill="#0f172a" />
          <line x1="70" y1="70" x2={70 + 38 * Math.cos(Math.PI - (Math.PI * safeValue / 100))} y2={70 - 38 * Math.sin(Math.PI - (Math.PI * safeValue / 100))} stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  };

  const FeatureRadarCard = ({ data }: { data: Analytics['featureRadar'] }) => {
    const center = 150;
    const radius = 96;
    const angleFor = (index: number) => (-Math.PI / 2) + ((Math.PI * 2 * index) / data.length);
    const pointFor = (index: number, value: number) => {
      const angle = angleFor(index);
      const distance = radius * (Math.max(0, Math.min(100, value)) / 100);
      return `${center + Math.cos(angle) * distance},${center + Math.sin(angle) * distance}`;
    };
    const gridPoints = (scale: number) => data.map((_, index) => {
      const angle = angleFor(index);
      return `${center + Math.cos(angle) * radius * scale},${center + Math.sin(angle) * radius * scale}`;
    }).join(' ');
    const radarPoints = data.map((item, index) => pointFor(index, item.value)).join(' ');
    const primaryStats = data.slice(0, 3);

    return (
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-sm text-slate-900">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-lg sm:text-xl font-bold">Dashboard Feature Radar</h3>
            <p className="text-xs text-slate-500">Calls, CRM, appointment, doctor and availability coverage</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 font-semibold">Live Feature View</span>
        </div>
        <svg viewBox="0 0 300 300" className="mx-auto h-[300px] w-full max-w-[420px]">
          {[0.25, 0.5, 0.75, 1].map((scale) => (
            <polygon key={scale} points={gridPoints(scale)} fill="none" stroke="#cbd5e1" strokeWidth="1" />
          ))}
          {data.map((_, index) => {
            const angle = angleFor(index);
            return (
              <line
                key={`axis-${index}`}
                x1={center}
                y1={center}
                x2={center + Math.cos(angle) * radius}
                y2={center + Math.sin(angle) * radius}
                stroke="#cbd5e1"
                strokeWidth="1"
              />
            );
          })}
          <polygon points={radarPoints} fill="#06b6d4" fillOpacity="0.26" stroke="#22d3ee" strokeWidth="3" />
          {data.map((item, index) => {
            const angle = angleFor(index);
            const labelDistance = radius + 26;
            return (
              <g key={item.label}>
                <circle
                  cx={center + Math.cos(angle) * radius * (Math.max(0, Math.min(100, item.value)) / 100)}
                  cy={center + Math.sin(angle) * radius * (Math.max(0, Math.min(100, item.value)) / 100)}
                  r="5"
                  fill={item.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text
                  x={center + Math.cos(angle) * labelDistance}
                  y={center + Math.sin(angle) * labelDistance}
                  textAnchor={Math.cos(angle) > 0.35 ? 'start' : Math.cos(angle) < -0.35 ? 'end' : 'middle'}
                  dominantBaseline="middle"
                  fill="#475569"
                  fontSize="11"
                  fontWeight="700"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {primaryStats.map((item) => (
            <div key={item.label} className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
              <div className="text-lg font-black" style={{ color: item.color }}>{item.value.toFixed(0)}%</div>
              <div className="text-xs text-slate-600">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="hidden lg:block">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        <main className="flex-1 lg:ml-60 p-4 sm:p-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-base sm:text-lg text-slate-600 font-medium">Loading analytics...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
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
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
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

      <main className="flex-1 lg:ml-60 p-5 sm:p-8 md:p-10 pt-20 lg:pt-10 bg-white">
        <div className="container mx-auto max-w-[1500px]">

          {/* Header */}
          <header className="mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-600 mb-3">
                  Analytics Dashboard
                </h1>
                <p className="text-slate-600 text-base md:text-lg">Real-time insights into your AI call center performance</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-3 bg-white rounded-lg border border-slate-300 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-slate-700 font-medium text-sm sm:text-base"
                >
                  <option value="1">Last 24 hours</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="all">All time</option>
                </select>
              </div>
            </div>
          </header>

          {analytics && (
            <>
              {/* Key Metrics */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-5 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500 shrink-0" />
                  <span>Key Performance Metrics</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <MetricCard
                    title="Total Calls"
                    value={analytics.totalCalls}
                    icon={PhoneCall}
                    trend={analytics.weeklyGrowth > 0 ? "up" : analytics.weeklyGrowth < 0 ? "down" : "neutral"}
                    trendValue={`${Math.abs(analytics.weeklyGrowth).toFixed(1)}%`}
                    subtitle={dateFilter === 'all' ? 'All dashboard calls' : `${analytics.allTimeCalls} all-time calls`}
                    color="orange"
                  />
                  <MetricCard
                    title="Success Rate"
                    value={`${analytics.completionRate.toFixed(1)}%`}
                    icon={CheckCircle}
                    subtitle={`${analytics.completedCalls} completed`}
                    color="green"
                  />
                  <MetricCard
                    title="Average Duration"
                    value={formatDuration(analytics.avgDuration)}
                    icon={Clock}
                    subtitle="Per call"
                    color="purple"
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

              {/* Dashboard Feature Overview */}
              <section className="mb-8 sm:mb-10">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Dashboard Feature Overview</h2>
                    <p className="text-sm text-slate-600">Live view across Calls, Campaigns, Leads, Appointments, Doctors and Availability</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-sky-50 text-sky-700 font-semibold self-start sm:self-auto">
                    {dateFilter === 'all' ? 'All time' : `Last ${dateFilter} days`}
                  </span>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_0.85fr] gap-5 sm:gap-6">
                  <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-sm text-slate-900">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-sky-500" />
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold">Sidebar Service Activity</h3>
                          <p className="text-xs text-slate-500">Calls, billing, campaigns, leads, appointments, doctors and availability</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">Live module view</span>
                    </div>
                    {mounted && (
                      <>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={analytics.sidebarFeatureBars} margin={{ top: 8, right: 10, left: -20, bottom: 18 }}>
                            <XAxis dataKey="feature" stroke="#64748b" fontSize={10} interval={0} axisLine={false} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} allowDecimals={false} axisLine={false} tickLine={false} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                              formatter={(value: any) => [value, 'Activity']}
                              labelFormatter={(label: any, payload: any) => payload?.[0]?.payload?.detail || label}
                            />
                            <Bar dataKey="value" name="Activity" radius={[8, 8, 0, 0]} barSize={44}>
                              {analytics.sidebarFeatureBars.map((item) => (
                                <Cell key={item.feature} fill={item.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {analytics.sidebarFeatureBars.slice(0, 4).map((item) => (
                            <div key={item.feature} className="rounded-lg bg-slate-50 px-3 py-2">
                              <div className="text-xs font-semibold text-slate-500">{item.feature}</div>
                              <div className="text-sm font-bold text-slate-900">{item.detail}</div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <FeatureRadarCard data={analytics.featureRadar} />
                </div>
              </section>

              {/* CRM Pipeline */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-5 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500 shrink-0" />
                  <span>CRM Pipeline & Lead Conversion</span>
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white rounded-lg p-4 sm:p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800">Lead Conversion Line Graph</h3>
                      <span className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-semibold">Calls + Success</span>
                    </div>
                    {mounted ? (
                      <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={analytics.multiMetricTrend} margin={{ top: 8, right: 16, left: -18, bottom: 18 }}>
                          <XAxis dataKey="date" stroke="#64748b" fontSize={10} angle={-35} textAnchor="end" height={58} axisLine={false} tickLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
                          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                          <Line type="monotone" dataKey="calls" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', r: 4 }} activeDot={{ r: 6 }} name="Calls" />
                          <Line type="monotone" dataKey="connectionRate" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} name="Success %" />
                          <Line type="monotone" dataKey="transcriptRate" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} name="Lead Analysis %" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-500">Loading chart...</div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg p-4 sm:p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800">Pipeline Pie Chart</h3>
                      <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold">CRM Stages</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_0.85fr] gap-4 items-center">
                      {mounted && analytics.pipelineStages.some((stage) => stage.count > 0) ? (
                        <ResponsiveContainer width="100%" height={280}>
                          <PieChart>
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} formatter={(value: any) => [value, 'Calls']} />
                            <Pie data={analytics.pipelineStages} dataKey="count" nameKey="stage" cx="50%" cy="50%" innerRadius={48} outerRadius={96} paddingAngle={3}>
                              {analytics.pipelineStages.map((stage) => (
                                <Cell key={stage.stage} fill={stage.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-500">No pipeline data yet</div>
                      )}
                      <div className="space-y-3">
                        {analytics.pipelineStages.map((stage) => (
                          <div key={stage.stage} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
                            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: stage.color }} />
                              {stage.stage}
                            </span>
                            <span className="text-sm font-black text-slate-950">{stage.count}</span>
                          </div>
                        ))}
                        <div className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500">
                          Total pipeline records: {analytics.pipelineStages.reduce((sum, stage) => sum + stage.count, 0)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 sm:p-6 border border-slate-200 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800">Revenue / Outcome Waterfall</h3>
                      <span className="text-xs px-3 py-1 bg-violet-100 text-violet-700 rounded-full font-semibold">Waterfall</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 items-end min-h-[230px]">
                      {analytics.waterfallSteps.map((step) => {
                        const maxStep = Math.max(...analytics.waterfallSteps.map((item) => item.count), 1);
                        return (
                          <div key={step.stage} className="flex h-full min-h-[220px] flex-col justify-end">
                            <div className="text-center text-sm font-black text-slate-900 mb-2">{step.count}</div>
                            <div className="rounded-t-lg" style={{ height: `${Math.max(12, (step.count / maxStep) * 170)}px`, backgroundColor: step.color }} />
                            <div className="mt-2 text-center text-xs font-semibold text-slate-600">{step.stage}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>

              {/* Execution & Monitoring */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-5 flex items-center gap-2">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 shrink-0" />
                  <span>Execution & Monitoring</span>
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white rounded-lg p-4 sm:p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800">Sankey Call Flow</h3>
                      <span className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-semibold">Flow Paths</span>
                    </div>
                    <div className="space-y-4">
                      {analytics.callFlowSteps.map((step) => {
                        const maxFlow = Math.max(...analytics.callFlowSteps.map((item) => item.count), 1);
                        return (
                          <div key={`${step.from}-${step.to}`} className="grid grid-cols-[1fr_1.5fr_1fr] items-center gap-3">
                            <div className="rounded-lg border border-slate-200 p-3 text-sm font-bold text-slate-700">{step.from}</div>
                            <div className="relative h-8 rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${Math.max(5, (step.count / maxFlow) * 100)}%`, backgroundColor: step.color }} />
                              <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-800">{step.count}</span>
                            </div>
                            <div className="rounded-lg border border-slate-200 p-3 text-sm font-bold text-slate-700">{step.to}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 sm:p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800">Connection Rate vs Time</h3>
                      <span className="text-xs px-3 py-1 bg-sky-100 text-sky-700 rounded-full font-semibold">Multi-Metric Line</span>
                    </div>
                    {mounted && (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.multiMetricTrend}>
                          <XAxis dataKey="date" stroke="#64748b" fontSize={10} angle={-45} textAnchor="end" height={60} axisLine={false} tickLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
                          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                          <Line type="monotone" dataKey="calls" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb', r: 4 }} name="Calls" />
                          <Line type="monotone" dataKey="connectionRate" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} name="Connection %" />
                          <Line type="monotone" dataKey="transcriptRate" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} name="Transcript %" />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </section>

              {/* Recent Calls */}
              {false && (
              <section className="mb-6 sm:mb-8">
                <div className="bg-white rounded-lg p-4 sm:p-6 border border-slate-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 shrink-0" />
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-800">Recent Calls</h3>
                    </div>
                    <a
                      href="/calls"
                      className="text-orange-600 hover:text-orange-800 font-semibold text-sm transition-colors flex items-center gap-1 self-start sm:self-auto"
                    >
                      View All
                      <ArrowUp className="w-4 h-4 rotate-45" />
                    </a>
                  </div>
                  {recentCalls.length > 0 ? (
                    <div className="space-y-3">
                      {recentCalls.map((call) => (
                        <div
                          key={call.id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 bg-white rounded-lg hover:bg-slate-50 transition-colors border border-slate-200"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                              {call.direction === 'inbound' ? (
                                <PhoneIncoming className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0" />
                              ) : (
                                <PhoneOutgoing className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 shrink-0" />
                              )}
                              <span className="font-semibold text-slate-800 text-sm sm:text-base truncate">{call.from_number} → {call.to_number}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(call.status === 'completed' || call.status === 'user-ended' || call.status === 'agent-ended') && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                              {(call.status === 'failed' || call.status === 'error') && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                              {(call.status === 'busy' || call.status === 'no-answer') && <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />}
                              <span
                                className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                                  (call.status === 'completed' || call.status === 'user-ended' || call.status === 'agent-ended')
                                    ? 'bg-green-100 text-green-700'
                                    : (call.status === 'failed' || call.status === 'error')
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {call.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-left sm:text-right shrink-0">
                            <div className="text-sm font-bold text-slate-800">{call.duration}s</div>
                            <div className="text-xs text-slate-500" suppressHydrationWarning>
                              {mounted ? new Date(call.start_time).toLocaleTimeString() : ''}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <PhoneCall className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 text-base sm:text-lg font-medium">No recent calls found</p>
                    </div>
                  )}
                </div>
              </section>
              )}

            </>
          )}
        </div>
      </main>
    </div>
  );
}



