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
        {
          status: 401,
        }
      );
    }

    const categories = await prisma.kudosCategory.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error(
      "GET /api/kudos/categories error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load Kudos categories",
      },
      {
        status: 500,
      }
    );
  }
}