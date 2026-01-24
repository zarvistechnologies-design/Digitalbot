"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  Zap,
  Smile,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Flame,
  Target,
  Brain,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

interface AnalyticsData {
  overview: {
    totalTasks: number;
    completedTasks: number;
    skippedTasks: number;
    completionRate: number;
    streak: number;
  };
  energy: {
    distribution: { low: number; medium: number; high: number };
    completionByEnergy: Record<string, { total: number; completed: number }>;
  };
  mood: {
    distribution: { happy: number; neutral: number; down: number; stressed: number };
    completionByMood: Record<string, { total: number; completed: number }>;
  };
  dailyTrend: Array<{
    date: string;
    total: number;
    completed: number;
    avgEnergy: number;
  }>;
  patterns: Array<{
    id: string;
    patternType: string;
    patternDetail: any;
    suggestedFix: string;
    frequency: number;
  }>;
}

const COLORS = {
  violet: "#8B5CF6",
  green: "#22C55E",
  orange: "#F97316",
  blue: "#3B82F6",
  red: "#EF4444",
  yellow: "#EAB308",
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState<"week" | "month" | "all">("week");
  const [isLoading, setIsLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics?period=${period}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const detectPatterns = async () => {
    setIsDetecting(true);
    try {
      const response = await fetch("/api/analytics", { method: "POST" });
      const result = await response.json();
      if (result.patterns) {
        fetchAnalytics(); // Refresh to show new patterns
        alert("Pattern detection complete! Check the Procrastination Insights section.");
      }
    } catch (error) {
      console.error("Error detecting patterns:", error);
    } finally {
      setIsDetecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-24 p-6" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return <div>Failed to load analytics</div>;
  }

  const energyPieData = [
    { name: "High", value: data.energy.distribution.high, color: COLORS.green },
    { name: "Medium", value: data.energy.distribution.medium, color: COLORS.yellow },
    { name: "Low", value: data.energy.distribution.low, color: COLORS.orange },
  ];

  const moodPieData = [
    { name: "Happy", value: data.mood.distribution.happy, color: COLORS.green },
    { name: "Neutral", value: data.mood.distribution.neutral, color: COLORS.blue },
    { name: "Down", value: data.mood.distribution.down, color: COLORS.orange },
    { name: "Stressed", value: data.mood.distribution.stressed, color: COLORS.red },
  ];

  const completionByEnergyData = Object.entries(data.energy.completionByEnergy).map(
    ([level, stats]) => ({
      name: level.charAt(0).toUpperCase() + level.slice(1),
      rate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      total: stats.total,
    })
  );

  const completionByMoodData = Object.entries(data.mood.completionByMood).map(([mood, stats]) => ({
    name: mood.charAt(0).toUpperCase() + mood.slice(1),
    rate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    total: stats.total,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and understand your patterns
          </p>
        </div>
        <div className="flex gap-2">
          {(["week", "month", "all"] as const).map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {p === "week" ? "7 Days" : p === "month" ? "30 Days" : "All Time"}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
              <Target className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.overview.completionRate}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.overview.completedTasks}/{data.overview.totalTasks}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.overview.streak} days
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Skipped</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.overview.skippedTasks}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-violet-600" />
            Daily Progress Trend
          </CardTitle>
          <CardDescription>Your task completion over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { weekday: "short" })}
                  stroke="#9CA3AF"
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke={COLORS.violet}
                  strokeWidth={2}
                  dot={{ fill: COLORS.violet }}
                  name="Completed"
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke={COLORS.blue}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: COLORS.blue }}
                  name="Planned"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Energy & Mood Analysis */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Energy Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Energy Analysis
            </CardTitle>
            <CardDescription>Your energy levels and productivity correlation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={energyPieData}
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {energyPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Completion Rate by Energy
                </h4>
                {completionByEnergyData.map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span className="font-medium">{item.rate}%</span>
                    </div>
                    <Progress value={item.rate} size="sm" className="mt-1" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mood Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="h-5 w-5 text-green-600" />
              Mood Analysis
            </CardTitle>
            <CardDescription>How your mood affects productivity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodPieData}
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {moodPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Completion Rate by Mood
                </h4>
                {completionByMoodData.map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span className="font-medium">{item.rate}%</span>
                    </div>
                    <Progress value={item.rate} size="sm" className="mt-1" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Procrastination Patterns */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-violet-600" />
                Procrastination Insights
              </CardTitle>
              <CardDescription>AI-detected patterns and suggestions</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={detectPatterns} isLoading={isDetecting}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Detect Patterns
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.patterns.length > 0 ? (
            <div className="space-y-4">
              {data.patterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                      <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="warning">{pattern.patternType.replace("_", " ")}</Badge>
                        <span className="text-xs text-gray-500">
                          Detected {pattern.frequency} times
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        {pattern.patternDetail?.description || "Pattern detected in your task completion behavior"}
                      </p>
                      <div className="mt-3 flex items-start gap-2 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                        <Lightbulb className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {pattern.suggestedFix}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Brain className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                No patterns detected yet. Complete more daily logs to enable AI analysis.
              </p>
              <Button variant="outline" className="mt-4" onClick={detectPatterns} isLoading={isDetecting}>
                Run Pattern Detection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
