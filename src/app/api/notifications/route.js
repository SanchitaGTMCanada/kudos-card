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

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 30,
      select: {
        id: true,
        kudosId: true,
        type: true,
        title: true,
        message: true,
        isRead: true,
        createdAt: true,
        kudos: {
          select: {
            id: true,
            message: true,
            category: {
              select: {
                id: true,
                name: true,
                icon: true,
              },
            },
            sender: {
              select: {
                id: true,
                name: true,
                employeeId: true,
                designation: true,
                profileImage: true,
              },
            },
          },
        },
      },
    });

    const unreadCount = notifications.filter(
      (notification) => !notification.isRead
    ).length;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error(
      "GET /api/notifications error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load notifications",
      },
      { status: 500 }
    );
  }
}