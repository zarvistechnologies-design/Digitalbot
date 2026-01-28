"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getGreeting, formatDate } from "@/lib/utils/date";
import {
  Target,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
  ArrowRight,
  Sparkles,
  Flame,
} from "lucide-react";

interface Goal {
  id: string;
  title: string;
  status: string;
  startDate: string;
  targetEndDate: string;
  tasks: {
    id: string;
    title: string;
    completionStatus: string;
  }[];
}

interface DailyProgress {
  total: number;
  completed: number;
  percentage: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>({ total: 0, completed: 0, percentage: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch goals
        const goalsRes = await fetch("/api/goals");
        const goalsData = await goalsRes.json();
        setGoals(goalsData.goals || []);

        // Fetch today's progress
        const dailyRes = await fetch(`/api/daily-log?date=${new Date().toISOString()}`);
        const dailyData = await dailyRes.json();
        setDailyProgress(dailyData.progress || { total: 0, completed: 0, percentage: 0 });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  // Calculate overall task completion
  const totalTasks = goals.reduce((acc, g) => acc + g.tasks.length, 0);
  const completedTasks = goals.reduce(
    (acc, g) => acc + g.tasks.filter((t) => t.completionStatus === "completed").length,
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {session?.user?.name?.split(" ")[0]} ✨
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{formatDate(new Date())}</p>
        </div>
        <Link href="/dashboard/tracker">
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Daily Check-in
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
              <Target className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Goals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeGoals.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedTasks}/{totalTasks}
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">0 days</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-violet-600" />
            Today&apos;s Progress
          </CardTitle>
          <CardDescription>
            {dailyProgress.completed} of {dailyProgress.total} tasks completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress
            value={dailyProgress.percentage}
            size="lg"
            variant={dailyProgress.percentage === 100 ? "success" : "default"}
            showLabel
          />
          <div className="mt-4">
            <Link href="/dashboard/tracker">
              <Button variant="outline" className="w-full">
                Go to Daily Tracker
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Active Goals */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Goals</h2>
          <Link href="/onboarding">
            <Button variant="ghost" size="sm">
              <Sparkles className="mr-2 h-4 w-4" />
              New Goal
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="mt-4 h-2 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="mt-4 flex gap-2">
                    <div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : activeGoals.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeGoals.map((goal) => {
              const goalCompleted = goal.tasks.filter((t) => t.completionStatus === "completed").length;
              const goalTotal = goal.tasks.length;
              const progress = goalTotal > 0 ? (goalCompleted / goalTotal) * 100 : 0;

              return (
                <Card key={goal.id} className="transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                    <div className="mt-4">
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {goalCompleted}/{goalTotal} tasks
                        </span>
                      </div>
                      <Progress value={progress} size="sm" />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <Badge variant={progress === 100 ? "success" : "default"}>
                        {Math.round(progress)}% complete
                      </Badge>
                      <Link href={`/dashboard/goals/${goal.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
                <Target className="h-8 w-8 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                No active goals yet
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Create your first goal to get started with AI-powered scheduling
              </p>
              <Link href="/onboarding" className="mt-4">
                <Button>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Your First Goal
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
