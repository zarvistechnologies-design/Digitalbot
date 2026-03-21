"use client";
import Sidebar from "@/components/Sidebar";
import { Activity, AlertCircle, ArrowDown, ArrowUp, BarChart3, Brain, CheckCircle, Clock, FileText, Loader2, Menu, MessageSquare, Minus, PhoneCall, PhoneIncoming, PhoneOutgoing, PieChart, TrendingUp, X, XCircle, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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

export default function AnalyticsOverview() {
  const [mounted, setMounted] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState("7");
  const [recentCalls, setRecentCalls] = useState<Call[]>([]);
  const [toNumber, setToNumber] = useState("");
  const [callStatus, setCallStatus] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const chartColors = ['#f97316', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const API_BASE_URL = 'https://digital-api-46ss.onrender.com/api'; // Local backend

      // Fetch calls from your backend API
      const callsRes = await fetch(`${API_BASE_URL}/calls?limit=1000`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!callsRes.ok) {
        throw new Error(`Failed to fetch calls: ${callsRes.status}`);
      }

      const callsData = await callsRes.json();
      const calls = callsData.data?.calls || callsData.calls || [];

      console.log('Fetched calls:', calls.length);

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

      // Calculate monthly growth from actual data instead of random
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
      setAnalytics(analyticsData);
      setRecentCalls(calls.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, [dateFilter]);

  const handleOutboundCall = async () => {
    if (!toNumber) return alert("Please enter a number to call.");
    setCallStatus("Calling...");
    try {
      const token = 'demo-token'; // Use demo-token for development
      const API_BASE_URL = 'https://digital-api-46ss.onrender.com/api'; // Local backend

      const res = await fetch(`${API_BASE_URL}/outbound-call`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ toNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        setCallStatus("Call initiated successfully!");
        if (mounted) {
          fetchAnalytics();
        }
        setToNumber("");
      } else {
        setCallStatus(`Error: ${data.error || 'Failed to initiate call'}`);
      }
    } catch (err) {
      console.error(err);
      setCallStatus("Failed to initiate call.");
    }
  };

  const MetricCard = ({ title, value, icon: Icon, trend, trendValue, color = "orange", subtitle }: any) => (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-slate-600 text-xs sm:text-sm font-medium mb-1 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">{value}</p>
          {subtitle && <p className="text-slate-500 text-xs truncate">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-${color}-400 to-${color}-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg shrink-0`}>
          <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
        </div>
      </div>
      {trend && trendValue && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-slate-200">
          {trend === "up" && <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />}
          {trend === "down" && <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />}
          {trend === "neutral" && <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />}
          <span className={`text-xs sm:text-sm font-semibold ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-slate-600"}`}>{trendValue}</span>
          <span className="text-slate-500 text-xs ml-1 hidden sm:inline">vs last period</span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100">
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100">
      {/* Mobile Menu Button - Fixed */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-slate-200"
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

      <main className="flex-1 lg:ml-60 p-4 sm:p-6 md:p-8 pt-20 lg:pt-8">
        <div className="container mx-auto max-w-7xl">

          {/* Header */}
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-orange-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  Analytics Dashboard
                </h1>
                <p className="text-slate-600 text-sm sm:text-base md:text-lg">Real-time insights into your AI call center performance</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-3 bg-white rounded-xl border border-slate-300 shadow-md focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-slate-700 font-medium text-sm sm:text-base"
                >
                  <option value="1">Last 24 hours</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
              </div>
            </div>
          </header>

          {/* Quick Call Section */}
          <section className="mb-6 sm:mb-8">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md shrink-0">
                  <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800">Quick Call</h2>
                  <p className="text-slate-600 text-xs sm:text-sm truncate">Start a new AI conversation instantly</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">
                <div className="flex-1">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91XXXXXXXXXX"
                    value={toNumber}
                    onChange={(e) => setToNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-base"
                  />
                </div>
                <button
                  onClick={handleOutboundCall}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 min-h-12"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>Call Now</span>
                </button>
              </div>
              {callStatus && (
                <div className="mt-4 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <p className="text-orange-800 font-medium text-xs sm:text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span className="truncate">{callStatus}</span>
                  </p>
                </div>
              )}
            </div>
          </section>

          {analytics && (
            <>
              {/* Key Metrics */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-5 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 shrink-0" />
                  <span>Key Performance Metrics</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <MetricCard
                    title="Total Calls"
                    value={analytics.totalCalls}
                    icon={PhoneCall}
                    trend={analytics.weeklyGrowth > 0 ? "up" : analytics.weeklyGrowth < 0 ? "down" : "neutral"}
                    trendValue={`${Math.abs(analytics.weeklyGrowth).toFixed(1)}%`}
                    color="orange"
                  />
                  <MetricCard
                    title="Success Rate"
                    value={`${analytics.totalCalls > 0 ? ((analytics.completedCalls / analytics.totalCalls) * 100).toFixed(1) : 0}%`}
                    icon={CheckCircle}
                    subtitle={`${analytics.completedCalls} completed`}
                    color="green"
                  />
                  <MetricCard
                    title="Average Duration"
                    value={`${Math.round(analytics.avgDuration)}s`}
                    icon={Clock}
                    subtitle="Per call"
                    color="orange"
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

              {/* Call Direction & Status */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-5 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 shrink-0" />
                  <span>Call Analytics</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <MetricCard
                    title="Inbound Calls"
                    value={analytics.inboundCalls}
                    icon={PhoneIncoming}
                    subtitle={`${analytics.totalCalls > 0 ? ((analytics.inboundCalls / analytics.totalCalls) * 100).toFixed(1) : 0}% of total`}
                    color="orange"
                  />
                  <MetricCard
                    title="Outbound Calls"
                    value={analytics.outboundCalls}
                    icon={PhoneOutgoing}
                    subtitle={`${analytics.totalCalls > 0 ? ((analytics.outboundCalls / analytics.totalCalls) * 100).toFixed(1) : 0}% of total`}
                    color="orange"
                  />
                  <MetricCard
                    title="Busy Calls"
                    value={analytics.busyCalls}
                    icon={AlertCircle}
                    subtitle={`${analytics.totalCalls > 0 ? ((analytics.busyCalls / analytics.totalCalls) * 100).toFixed(1) : 0}% of total`}
                    color="yellow"
                  />
                </div>
              </section>

              {/* Charts Grid 1 */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-5 flex items-center gap-2">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 shrink-0" />
                  <span>Trend Analysis</span>
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

                  {/* Area Chart */}
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 shrink-0" />
                        <h3 className="text-lg sm:text-xl font-bold text-slate-800">Call Volume Trend</h3>
                      </div>
                    <span className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold self-start sm:self-auto">Area Chart</span>
                  </div>
                  {mounted && (
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={analytics.dailyStats}>
                        <defs>
                          <linearGradient id="callsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={10} angle={-45} textAnchor="end" height={60} />
                        <YAxis stroke="#64748b" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
                        <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="calls" stroke="#f97316" fillOpacity={1} fill="url(#callsGradient)" strokeWidth={2} name="Total Calls" />
                        <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#completedGradient)" strokeWidth={2} name="Completed" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>

                  {/* Bar Chart */}
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-lg overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 shrink-0" />
                        <h3 className="text-lg sm:text-xl font-bold text-slate-800">Hourly Distribution</h3>
                      </div>
                      <span className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold self-start sm:self-auto">Column Chart</span>
                    </div>
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <div className="min-w-[500px] px-4 sm:px-0">
                        {mounted && (
                          <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={analytics.hourlyDistribution}>
                              <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                                  <stop offset="100%" stopColor="#f97316" stopOpacity={0.8} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                              <XAxis dataKey="hour" stroke="#64748b" fontSize={9} angle={-45} textAnchor="end" height={60} />
                              <YAxis stroke="#64748b" fontSize={10} />
                              <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
                              <Bar dataKey="calls" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              {/* Charts Grid 2 */}
              <section className="mb-6 sm:mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

                  {/* Duration Analysis */}
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 shrink-0" />
                        <h3 className="text-lg sm:text-xl font-bold text-slate-800">Duration Analysis</h3>
                      </div>
                      <span className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold self-start sm:self-auto">Bar Chart</span>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={analytics.durationAnalysis} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" stroke="#64748b" fontSize={10} />
                        <YAxis type="category" dataKey="range" stroke="#64748b" fontSize={10} width={60} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
                        <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]}>
                          {analytics.durationAnalysis.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Weekly Performance */}
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 shrink-0" />
                        <h3 className="text-lg sm:text-xl font-bold text-slate-800">Weekly Performance</h3>
                      </div>
                      <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold self-start sm:self-auto">Line Chart</span>
                    </div>
                    {mounted && (
                      <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={analytics.weeklyComparison}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="week" stroke="#64748b" fontSize={10} />
                          <YAxis stroke="#64748b" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
                          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                          <Line type="monotone" dataKey="calls" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 4 }} activeDot={{ r: 6 }} name="Total Calls" />
                          <Line type="monotone" dataKey="successRate" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} name="Success Rate %" strokeDasharray="5 5" />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                </div>
              </section>

              {/* Donut Chart & Call Direction */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-5 flex items-center gap-2">
                  <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
                  <span>Distribution & Breakdown</span>
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

                  {/* Donut Chart */}
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                      <div className="flex items-center gap-2">
                        <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 shrink-0" />
                        <h3 className="text-base sm:text-xl font-bold text-slate-800">Call Status Distribution</h3>
                      </div>
                      <span className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold self-start sm:self-auto">Donut Chart</span>
                    </div>
                    {mounted && (
                      <ResponsiveContainer width="100%" height={280}>
                        <RechartsPieChart>
                          <Pie
                            dataKey="count"
                            data={analytics.statusDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={90}
                            paddingAngle={5}
                            label={(entry: any) => `${entry.payload.status}: ${entry.value}`}
                            labelLine={{ stroke: '#64748b', strokeWidth: 1 }}
                          >
                            {analytics.statusDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    )}
                    <div className="text-center mt-4">
                      <div className="text-2xl sm:text-3xl font-black text-slate-800">{analytics.totalCalls}</div>
                      <div className="text-xs sm:text-sm text-slate-500 font-medium">Total Calls</div>
                    </div>
                  </div>

                  {/* Call Direction Breakdown */}
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 shrink-0" />
                        <h3 className="text-base sm:text-xl font-bold text-slate-800">Call Direction Breakdown</h3>
                      </div>
                      <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold self-start sm:self-auto">Progress Bars</span>
                    </div>
                    <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 shadow-sm">
                        <div className="flex items-center gap-3">
                          <PhoneIncoming className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600 shrink-0" />
                          <span className="font-bold text-slate-800 text-base sm:text-lg">Inbound</span>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-2xl sm:text-3xl font-black text-orange-600">{analytics.inboundCalls}</div>
                          <div className="text-xs sm:text-sm font-semibold text-slate-600">
                            {analytics.totalCalls > 0 ? ((analytics.inboundCalls / analytics.totalCalls) * 100).toFixed(1) : 0}% of total
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 shadow-sm">
                        <div className="flex items-center gap-3">
                          <PhoneOutgoing className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 shrink-0" />
                          <span className="font-bold text-slate-800 text-base sm:text-lg">Outbound</span>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-2xl sm:text-3xl font-black text-orange-600">{analytics.outboundCalls}</div>
                          <div className="text-xs sm:text-sm font-semibold text-slate-600">
                            {analytics.totalCalls > 0 ? ((analytics.outboundCalls / analytics.totalCalls) * 100).toFixed(1) : 0}% of total
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div className="text-xs font-semibold text-orange-600">Inbound</div>
                          <div className="text-xs font-semibold text-orange-600">
                            {analytics.totalCalls > 0 ? ((analytics.inboundCalls / analytics.totalCalls) * 100).toFixed(1) : 0}%
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 sm:h-3 text-xs flex rounded-full bg-orange-100">
                          <div
                            style={{ width: `${analytics.totalCalls > 0 ? (analytics.inboundCalls / analytics.totalCalls) * 100 : 0}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                          ></div>
                        </div>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div className="text-xs font-semibold text-orange-600">Outbound</div>
                          <div className="text-xs font-semibold text-orange-600">
                            {analytics.totalCalls > 0 ? ((analytics.outboundCalls / analytics.totalCalls) * 100).toFixed(1) : 0}%
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 sm:h-3 text-xs flex rounded-full bg-orange-100">
                          <div
                            style={{ width: `${analytics.totalCalls > 0 ? (analytics.outboundCalls / analytics.totalCalls) * 100 : 0}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              {/* AI Analysis Performance */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-5 flex items-center gap-2">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                  <span>AI Analysis Performance</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                  {/* Transcribed Calls */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-md shrink-0">
                        <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl sm:text-4xl font-black text-orange-600">{analytics.transcribedCalls}</div>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-700 font-bold text-base sm:text-lg mb-1">Transcribed Calls</p>
                      <p className="text-slate-600 text-xs sm:text-sm font-semibold">
                        {analytics.totalCalls > 0 ? ((analytics.transcribedCalls / analytics.totalCalls) * 100).toFixed(1) : 0}% of total calls processed
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-orange-200">
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded-full bg-orange-200">
                          <div
                            style={{ width: `${analytics.totalCalls > 0 ? (analytics.transcribedCalls / analytics.totalCalls) * 100 : 0}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summarized Calls */}
                  <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-sky-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center shadow-md shrink-0">
                        <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl sm:text-4xl font-black text-sky-600">{analytics.summarizedCalls}</div>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-700 font-bold text-base sm:text-lg mb-1">Summarized Calls</p>
                      <p className="text-slate-600 text-xs sm:text-sm font-semibold">
                        {analytics.transcribedCalls > 0 ? ((analytics.summarizedCalls / analytics.transcribedCalls) * 100).toFixed(1) : 0}% of transcribed calls
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-sky-200">
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded-full bg-sky-200">
                          <div
                            style={{ width: `${analytics.transcribedCalls > 0 ? (analytics.summarizedCalls / analytics.transcribedCalls) * 100 : 0}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Processing Rate */}
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-md shrink-0">
                        <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl sm:text-4xl font-black text-emerald-600">
                          {analytics.transcribedCalls > 0 ? ((analytics.summarizedCalls / analytics.transcribedCalls) * 100).toFixed(1) : 0}%
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-700 font-bold text-base sm:text-lg mb-1">Processing Rate</p>
                      <p className="text-slate-600 text-xs sm:text-sm font-semibold">AI summary completion rate</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-emerald-200">
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded-full bg-emerald-200">
                          <div
                            style={{ width: `${analytics.transcribedCalls > 0 ? (analytics.summarizedCalls / analytics.transcribedCalls) * 100 : 0}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              {/* Peak Hours */}
              {analytics.peakHours.length > 0 && (
                <section className="mb-6 sm:mb-8">
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-lg">
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 shrink-0" />
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-800">Peak Call Hours</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                      {analytics.peakHours.map((peak, index) => (
                        <div
                          key={peak.hour}
                          className="text-center p-4 sm:p-5 bg-gradient-to-br from-orange-50 to-orange-50 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <div className="text-2xl sm:text-3xl font-black text-orange-600 mb-2">{peak.hour}:00</div>
                          <div className="text-slate-700 text-base sm:text-lg font-bold">{peak.count} calls</div>
                          <div className="text-xs text-slate-500 mt-2 font-semibold">Rank #{index + 1}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Recent Calls */}
              <section className="mb-6 sm:mb-8">
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-lg">
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
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                              {call.direction === 'inbound' ? (
                                <PhoneIncoming className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0" />
                              ) : (
                                <PhoneOutgoing className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0" />
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

            </>
          )}
        </div>
      </main>
    </div>
  );
}



