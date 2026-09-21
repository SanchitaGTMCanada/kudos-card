import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    const employees = await prisma.user.findMany({
      where: {
        status: "ACTIVE",

        // Don't allow the logged-in employee
        // to give Kudos to themselves.
        id: {
          not: currentUser.id,
        },
      },

      select: {
        id: true,
        employeeId: true,
        name: true,
        designation: true,
        profileImage: true,
      },

      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error("GET /api/users error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load employees",
      },
      {
        status: 500,
      }
    );
  }
}