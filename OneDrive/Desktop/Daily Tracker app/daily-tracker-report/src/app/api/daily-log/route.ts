import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { regenerateDayPlan } from "@/lib/ai/planGenerator";

// Submit daily log
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { logs } = body;

    const results = [];

    for (const log of logs) {
      const dailyLog = await prisma.dailyLog.upsert({
        where: {
          userId_taskId_date: {
            userId: session.user.id,
            taskId: log.taskId,
            date: new Date(log.date),
          },
        },
        update: {
          completed: log.completed,
          skipped: log.skipped,
          timeSpent: log.timeSpent,
          energyLevel: log.energyLevel,
          mood: log.mood,
          remarksText: log.remarksText,
          remarksVoiceUrl: log.remarksVoiceUrl,
        },
        create: {
          userId: session.user.id,
          taskId: log.taskId,
          date: new Date(log.date),
          completed: log.completed,
          skipped: log.skipped,
          timeSpent: log.timeSpent,
          energyLevel: log.energyLevel,
          mood: log.mood,
          remarksText: log.remarksText,
          remarksVoiceUrl: log.remarksVoiceUrl,
        },
      });

      // Update task status if completed
      if (log.completed) {
        await prisma.task.update({
          where: { id: log.taskId },
          data: {
            completionStatus: "completed",
            actualHours: log.timeSpent,
          },
        });
      }

      results.push(dailyLog);
    }

    // Trigger rescheduling for incomplete tasks (async)
    const incompleteTasks = logs.filter((l: any) => !l.completed && !l.skipped);
    if (incompleteTasks.length > 0) {
      // Get user preferences
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (user) {
        // Get incomplete task details
        const tasks = await prisma.task.findMany({
          where: {
            id: { in: incompleteTasks.map((t: any) => t.taskId) },
          },
        });

        // Get average energy and mood from today's logs
        const avgLog = {
          energyLevel: logs[0]?.energyLevel || "medium",
          mood: logs[0]?.mood || "neutral",
          remarks: logs.map((l: any) => l.remarksText).filter(Boolean).join("; "),
        };

        try {
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + 1);

          const rescheduledPlan = await regenerateDayPlan(
            tasks.map((t) => ({
              id: t.id,
              title: t.title,
              description: t.description || undefined,
              difficultyLevel: t.difficultyLevel,
              estimatedHours: t.estimatedHours,
              category: t.category || undefined,
              dependencies: t.dependencies,
            })),
            [],
            {
              wakeTime: user.wakeTime,
              sleepTime: user.sleepTime,
              workStartTime: user.workStartTime,
              workEndTime: user.workEndTime,
              peakEnergyTime: user.peakEnergyTime,
              lowEnergyTime: user.lowEnergyTime,
              timezone: user.timezone,
            },
            avgLog,
            nextDate
          );

          // Store the rescheduled plan
          // This would update the DailyPlan for tomorrow
          console.log("Rescheduled plan:", rescheduledPlan);
        } catch (rescheduleError) {
          console.error("Error rescheduling tasks:", rescheduleError);
          // Continue without failing the main request
        }
      }
    }

    return NextResponse.json({
      message: "Daily logs submitted successfully",
      logs: results,
    });
  } catch (error) {
    console.error("Error submitting daily logs:", error);
    return NextResponse.json(
      { error: "Failed to submit daily logs" },
      { status: 500 }
    );
  }
}

// Get daily logs for a specific date
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const goalId = searchParams.get("goalId");

    const date = dateParam ? new Date(dateParam) : new Date();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get daily plan for this date
    const dailyPlan = await prisma.dailyPlan.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        ...(goalId && { goalId }),
      },
      include: {
        scheduledTasks: {
          include: {
            task: true,
          },
          orderBy: { orderIndex: "asc" },
        },
        goal: true,
      },
    });

    // Get any existing logs for this date
    const logs = await prisma.dailyLog.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        task: true,
      },
    });

    // Calculate progress
    const totalTasks = dailyPlan?.scheduledTasks.length || 0;
    const completedTasks = logs.filter((l) => l.completed).length;

    return NextResponse.json({
      dailyPlan,
      logs,
      progress: {
        total: totalTasks,
        completed: completedTasks,
        percentage: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching daily logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily logs" },
      { status: 500 }
    );
  }
}
