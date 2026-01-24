import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";

// Get current user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        timezone: true,
        wakeTime: true,
        sleepTime: true,
        workStartTime: true,
        workEndTime: true,
        notificationTime: true,
        peakEnergyTime: true,
        lowEnergyTime: true,
        onboardingComplete: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: body.name,
        timezone: body.timezone,
        wakeTime: body.wakeTime,
        sleepTime: body.sleepTime,
        workStartTime: body.workStartTime,
        workEndTime: body.workEndTime,
        notificationTime: body.notificationTime,
        peakEnergyTime: body.peakEnergyTime,
        lowEnergyTime: body.lowEnergyTime,
        onboardingComplete: body.onboardingComplete,
      },
      select: {
        id: true,
        email: true,
        name: true,
        timezone: true,
        wakeTime: true,
        sleepTime: true,
        workStartTime: true,
        workEndTime: true,
        notificationTime: true,
        peakEnergyTime: true,
        lowEnergyTime: true,
        onboardingComplete: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
