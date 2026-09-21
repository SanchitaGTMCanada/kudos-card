import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const startOfMonth = new Date();

    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Total Kudos given by current user
    const totalGiven = await prisma.kudos.count({
      where: {
        senderId: user.id,
      },
    });

    // Total Kudos received by current user
    const totalReceived = await prisma.kudos.count({
      where: {
        receiverId: user.id,
      },
    });

    // Kudos received/given this month
    const thisMonth = await prisma.kudos.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
        OR: [
          {
            senderId: user.id,
          },
          {
            receiverId: user.id,
          },
        ],
      },
    });

    // Recent Kudos
    const recentKudos = await prisma.kudos.findMany({
      where: {
        OR: [
          {
            senderId: user.id,
          },
          {
            receiverId: user.id,
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            employeeId: true,
            profileImage: true,
            designation: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            employeeId: true,
            profileImage: true,
            designation: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,

      stats: {
        totalGiven,
        totalReceived,
        thisMonth,
      },

      recentKudos,
    });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard data",
      },
      { status: 500 }
    );
  }
}