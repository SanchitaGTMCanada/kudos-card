import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const employees = await prisma.user.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        designation: true,
        profileImage: true,
        role: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error("GET /api/employees error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch employees",
      },
      {
        status: 500,
      }
    );
  }
}