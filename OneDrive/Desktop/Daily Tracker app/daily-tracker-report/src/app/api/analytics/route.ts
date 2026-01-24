import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { detectProcrastinationPatterns, generateWeeklyInsights } from "@/lib/ai/patternDetector";

// Get analytics data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week"; // week, month, all
    const goalId = searchParams.get("goalId");

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    if (period === "week") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "month") {
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Fetch daily logs
    const logs = await prisma.dailyLog.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
        ...(goalId && { task: { goalId } }),
      },
      include: {
        task: true,
      },
      orderBy: { date: "asc" },
    });

    // Calculate metrics
    const totalTasks = logs.length;
    const completedTasks = logs.filter((l) => l.completed).length;
    const skippedTasks = logs.filter((l) => l.skipped).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Energy analysis
    const energyLevels = logs.filter((l) => l.energyLevel).map((l) => l.energyLevel);
    const energyDistribution = {
      low: energyLevels.filter((e) => e === "low").length,
      medium: energyLevels.filter((e) => e === "medium").length,
      high: energyLevels.filter((e) => e === "high").length,
    };

    // Mood analysis
    const moods = logs.filter((l) => l.mood).map((l) => l.mood);
    const moodDistribution = {
      happy: moods.filter((m) => m === "happy").length,
      neutral: moods.filter((m) => m === "neutral").length,
      down: moods.filter((m) => m === "down").length,
      stressed: moods.filter((m) => m === "stressed").length,
    };

    // Task completion by energy level
    const completionByEnergy = {
      low: {
        total: logs.filter((l) => l.energyLevel === "low").length,
        completed: logs.filter((l) => l.energyLevel === "low" && l.completed).length,
      },
      medium: {
        total: logs.filter((l) => l.energyLevel === "medium").length,
        completed: logs.filter((l) => l.energyLevel === "medium" && l.completed).length,
      },
      high: {
        total: logs.filter((l) => l.energyLevel === "high").length,
        completed: logs.filter((l) => l.energyLevel === "high" && l.completed).length,
      },
    };

    // Task completion by mood
    const completionByMood = {
      happy: {
        total: logs.filter((l) => l.mood === "happy").length,
        completed: logs.filter((l) => l.mood === "happy" && l.completed).length,
      },
      neutral: {
        total: logs.filter((l) => l.mood === "neutral").length,
        completed: logs.filter((l) => l.mood === "neutral" && l.completed).length,
      },
      down: {
        total: logs.filter((l) => l.mood === "down").length,
        completed: logs.filter((l) => l.mood === "down" && l.completed).length,
      },
      stressed: {
        total: logs.filter((l) => l.mood === "stressed").length,
        completed: logs.filter((l) => l.mood === "stressed" && l.completed).length,
      },
    };

    // Daily trend data for charts
    const dailyData = logs.reduce((acc: Record<string, any>, log) => {
      const dateKey = log.date.toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          total: 0,
          completed: 0,
          skipped: 0,
          avgEnergy: 0,
          energySum: 0,
          energyCount: 0,
        };
      }
      acc[dateKey].total += 1;
      if (log.completed) acc[dateKey].completed += 1;
      if (log.skipped) acc[dateKey].skipped += 1;
      if (log.energyLevel) {
        const energyValue = log.energyLevel === "low" ? 1 : log.energyLevel === "medium" ? 2 : 3;
        acc[dateKey].energySum += energyValue;
        acc[dateKey].energyCount += 1;
      }
      return acc;
    }, {});

    // Calculate average energy for each day
    Object.values(dailyData).forEach((day: any) => {
      day.avgEnergy = day.energyCount > 0 ? day.energySum / day.energyCount : 0;
    });

    // Calculate streak
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateKey = checkDate.toISOString().split("T")[0];
      const dayLogs = logs.filter(
        (l) => l.date.toISOString().split("T")[0] === dateKey
      );
      if (dayLogs.length === 0) break;
      if (dayLogs.some((l) => l.completed)) {
        streak++;
      } else {
        break;
      }
    }

    // Get procrastination patterns
    const patterns = await prisma.procrastinationPattern.findMany({
      where: { userId: session.user.id },
      orderBy: { frequency: "desc" },
      take: 5,
    });

    return NextResponse.json({
      overview: {
        totalTasks,
        completedTasks,
        skippedTasks,
        completionRate: Math.round(completionRate),
        streak,
      },
      energy: {
        distribution: energyDistribution,
        completionByEnergy,
      },
      mood: {
        distribution: moodDistribution,
        completionByMood,
      },
      dailyTrend: Object.values(dailyData),
      patterns,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

// Trigger pattern detection
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get last 14 days of logs
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const logs = await prisma.dailyLog.findMany({
      where: {
        userId: session.user.id,
        date: { gte: twoWeeksAgo },
      },
      include: {
        task: true,
      },
      orderBy: { date: "desc" },
    });

    // Calculate task completion rates
    const taskCompletionRates: Record<string, number> = {};
    const taskTotals: Record<string, { completed: number; total: number }> = {};

    logs.forEach((log) => {
      const taskName = log.task.title;
      if (!taskTotals[taskName]) {
        taskTotals[taskName] = { completed: 0, total: 0 };
      }
      taskTotals[taskName].total += 1;
      if (log.completed) taskTotals[taskName].completed += 1;
    });

    Object.entries(taskTotals).forEach(([name, stats]) => {
      taskCompletionRates[name] = stats.completed / stats.total;
    });

    // Detect patterns using AI
    const patternResult = await detectProcrastinationPatterns(
      logs.map((log) => ({
        taskId: log.taskId,
        taskName: log.task.title,
        date: log.date.toISOString(),
        completed: log.completed,
        skipped: log.skipped,
        timeSlot: "unknown", // Would need to be fetched from scheduled tasks
        energyLevel: log.energyLevel,
        mood: log.mood,
        remarksText: log.remarksText,
      })),
      taskCompletionRates
    );

    // Store detected patterns
    for (const pattern of patternResult.patterns) {
      await prisma.procrastinationPattern.create({
        data: {
          userId: session.user.id,
          patternType: pattern.patternType,
          patternDetail: pattern.patternDetail,
          suggestedFix: pattern.suggestedFix,
        },
      });
    }

    return NextResponse.json({
      message: "Pattern detection completed",
      patterns: patternResult.patterns,
      insights: patternResult.overallInsights,
      recommendations: patternResult.recommendations,
    });
  } catch (error) {
    console.error("Error detecting patterns:", error);
    return NextResponse.json(
      { error: "Failed to detect patterns" },
      { status: 500 }
    );
  }
}
