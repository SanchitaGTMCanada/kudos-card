import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
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

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);

    const search =
      searchParams.get("search")?.trim() || "";

    const status =
      searchParams.get("status") || "ALL";

    const where = {};

    if (
      status === "ACTIVE" ||
      status === "INACTIVE"
    ) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          message: {
            contains: search,
          },
        },
        {
          sender: {
            name: {
              contains: search,
            },
          },
        },
        {
          sender: {
            employeeId: {
              contains: search,
            },
          },
        },
        {
          receiver: {
            name: {
              contains: search,
            },
          },
        },
        {
          receiver: {
            employeeId: {
              contains: search,
            },
          },
        },
        {
          category: {
            name: {
              contains: search,
            },
          },
        },
      ];
    }

    const kudos = await prisma.kudos.findMany({
      where,

      include: {
        sender: {
          select: {
            id: true,
            employeeId: true,
            name: true,
            email: true,
            designation: true,
            profileImage: true,
          },
        },

        receiver: {
          select: {
            id: true,
            employeeId: true,
            name: true,
            email: true,
            designation: true,
            profileImage: true,
          },
        },

        category: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

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

    const [
      totalKudos,
      activeKudos,
      inactiveKudos,
      thisMonthKudos,
    ] = await Promise.all([
      prisma.kudos.count(),

      prisma.kudos.count({
        where: {
          status: "ACTIVE",
        },
      }),

      prisma.kudos.count({
        where: {
          status: "INACTIVE",
        },
      }),

      prisma.kudos.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lt: startOfNextMonth,
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,

      kudos,

      summary: {
        total: totalKudos,
        active: activeKudos,
        inactive: inactiveKudos,
        thisMonth: thisMonthKudos,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/admin/kudos error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load Kudos.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
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

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const kudosId = Number(body.kudosId);
    const status = body.status;

    if (!kudosId) {
      return NextResponse.json(
        {
          success: false,
          message: "Kudos ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      !["ACTIVE", "INACTIVE"].includes(status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Kudos status.",
        },
        { status: 400 }
      );
    }

    const kudos = await prisma.kudos.findUnique({
      where: {
        id: kudosId,
      },
    });

    if (!kudos) {
      return NextResponse.json(
        {
          success: false,
          message: "Kudos not found.",
        },
        { status: 404 }
      );
    }

    const updatedKudos =
      await prisma.kudos.update({
        where: {
          id: kudosId,
        },

        data: {
          status,
        },

        include: {
          sender: {
            select: {
              id: true,
              employeeId: true,
              name: true,
              email: true,
              designation: true,
              profileImage: true,
            },
          },

          receiver: {
            select: {
              id: true,
              employeeId: true,
              name: true,
              email: true,
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

    return NextResponse.json({
      success: true,

      message:
        status === "ACTIVE"
          ? "Kudos restored successfully."
          : "Kudos deactivated successfully.",

      kudos: updatedKudos,
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/kudos error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update Kudos.",
      },
      { status: 500 }
    );
  }
}