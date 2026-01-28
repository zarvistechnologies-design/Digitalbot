import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { generatePlan } from "@/lib/ai/planGenerator";

// Create a new goal with tasks
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { goal, tasks, generateSchedule = true } = body;

    // Create goal
    const newGoal = await prisma.goal.create({
      data: {
        userId: session.user.id,
        title: goal.title,
        description: goal.description,
        imageUrl: goal.imageUrl,
        startDate: new Date(goal.startDate),
        targetEndDate: new Date(goal.targetEndDate),
        tasks: {
          create: tasks.map((task: any, index: number) => ({
            title: task.title,
            description: task.description,
            difficultyLevel: task.difficultyLevel,
            estimatedHours: task.estimatedHours,
            category: task.category,
            dependencies: task.dependencies || [],
            orderIndex: index,
          })),
        },
      },
      include: {
        tasks: true,
      },
    });

    // Generate AI schedule if requested
    if (generateSchedule) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (user) {
        const schedule = await generatePlan(
          newGoal.tasks.map((t) => ({
            id: t.id,
            title: t.title,
            description: t.description || undefined,
            difficultyLevel: t.difficultyLevel,
            estimatedHours: t.estimatedHours,
            category: t.category || undefined,
            dependencies: t.dependencies,
          })),
          {
            wakeTime: user.wakeTime,
            sleepTime: user.sleepTime,
            workStartTime: user.workStartTime,
            workEndTime: user.workEndTime,
            peakEnergyTime: user.peakEnergyTime,
            lowEnergyTime: user.lowEnergyTime,
            timezone: user.timezone,
          },
          new Date(goal.startDate),
          new Date(goal.targetEndDate)
        );

        // Create daily plans from the generated schedule
        for (const day of schedule.dailySchedule) {
          const dailyPlan = await prisma.dailyPlan.create({
            data: {
              goalId: newGoal.id,
              userId: session.user.id,
              date: new Date(day.date),
            },
          });

          // Create scheduled tasks
          for (const [index, scheduledTask] of day.tasks.entries()) {
            await prisma.scheduledTask.create({
              data: {
                dailyPlanId: dailyPlan.id,
                taskId: scheduledTask.taskId,
                timeSlot: scheduledTask.timeSlot,
                energyRequired: scheduledTask.energyRequired,
                orderIndex: index,
              },
            });
          }
        }

        return NextResponse.json({
          goal: newGoal,
          schedule,
          message: "Goal created with AI-generated schedule",
        });
      }
    }

    return NextResponse.json({
      goal: newGoal,
      message: "Goal created successfully",
    });
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }
}

// Get all goals for the user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const goals = await prisma.goal.findMany({
      where: { userId: session.user.id },
      include: {
        tasks: {
          orderBy: { orderIndex: "asc" },
        },
        _count: {
          select: {
            dailyPlans: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}
