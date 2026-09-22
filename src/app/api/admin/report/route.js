import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // =========================================================
    // AUTHENTICATION
    // =========================================================

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

    // =========================================================
    // ADMIN ACCESS
    // =========================================================

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    // =========================================================
    // DATE RANGE
    // =========================================================

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

    // =========================================================
    // TOTAL EMPLOYEES
    // =========================================================

    const totalEmployees = await prisma.user.count({
      where: {
        role: "EMPLOYEE",
      },
    });

    // =========================================================
    // ACTIVE EMPLOYEES
    // =========================================================

    const activeEmployees = await prisma.user.count({
      where: {
        role: "EMPLOYEE",
        status: "ACTIVE",
      },
    });

    // =========================================================
    // TOTAL KUDOS
    // =========================================================

    const totalKudos = await prisma.kudos.count({
      where: {
        status: "ACTIVE",
      },
    });

    // =========================================================
    // THIS MONTH'S KUDOS
    // =========================================================

    const monthlyKudos = await prisma.kudos.count({
      where: {
        status: "ACTIVE",
        createdAt: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
    });

    // =========================================================
    // ALL KUDOS FOR REPORTING
    // =========================================================

    const kudos = await prisma.kudos.findMany({
      where: {
        status: "ACTIVE",
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        sender: {
          select: {
            id: true,
            employeeId: true,
            name: true,
            designation: true,
            profileImage: true,
          },
        },

        receiver: {
          select: {
            id: true,
            employeeId: true,
            name: true,
            designation: true,
            profileImage: true,
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

    // =========================================================
    // TOP RECOGNIZED EMPLOYEES
    // =========================================================

    const employeeRecognitionMap = {};

    kudos.forEach((item) => {
      const receiver = item.receiver;

      if (!employeeRecognitionMap[receiver.id]) {
        employeeRecognitionMap[receiver.id] = {
          id: receiver.id,
          employeeId: receiver.employeeId,
          name: receiver.name,
          designation: receiver.designation,
          profileImage: receiver.profileImage,
          kudosCount: 0,
        };
      }

      employeeRecognitionMap[receiver.id].kudosCount += 1;
    });

    const topEmployees = Object.values(
      employeeRecognitionMap
    )
      .sort((a, b) => b.kudosCount - a.kudosCount)
      .slice(0, 5);

    // =========================================================
    // KUDOS BY CATEGORY
    // =========================================================

    const categoryMap = {};

    kudos.forEach((item) => {
      const category = item.category;

      if (!categoryMap[category.id]) {
        categoryMap[category.id] = {
          id: category.id,
          name: category.name,
          icon: category.icon,
          count: 0,
        };
      }

      categoryMap[category.id].count += 1;
    });

    const categoryStats = Object.values(categoryMap).sort(
      (a, b) => b.count - a.count
    );

    // =========================================================
    // RECENT KUDOS
    // =========================================================

    const recentKudos = kudos.slice(0, 10);

    // =========================================================
    // RESPONSE
    // =========================================================

    return NextResponse.json({
      success: true,

      report: {
        totalEmployees,
        activeEmployees,
        totalKudos,
        monthlyKudos,

        topEmployees,

        categoryStats,

        recentKudos,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/admin/report error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load admin report.",
      },
      { status: 500 }
    );
  }
}