import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MONTHLY_KUDOS_LIMIT = 2;

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

    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0
    );

    const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1,
      0,
      0,
      0,
      0
    );

    const usedThisMonth = await prisma.kudos.count({
      where: {
        senderId: user.id,

        status: "ACTIVE",

        createdAt: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
    });

    const remainingThisMonth = Math.max(
      0,
      MONTHLY_KUDOS_LIMIT - usedThisMonth
    );

    return NextResponse.json({
      success: true,
      monthlyLimit: MONTHLY_KUDOS_LIMIT,
      usedThisMonth,
      remainingThisMonth,
      limitReached:
        usedThisMonth >= MONTHLY_KUDOS_LIMIT,
    });
  } catch (error) {
    console.error(
      "GET /api/kudos/monthly-limit error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load monthly Kudos limit.",
      },
      { status: 500 }
    );
  }
}