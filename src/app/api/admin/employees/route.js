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

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    const employees = await prisma.user.findMany({
      where: {
        role: "EMPLOYEE",
      },

      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        designation: true,
        profileImage: true,
        role: true,
        status: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/employees error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load employees.",
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

    const employeeId = Number(body.employeeId);
    const status = body.status;

    if (!employeeId) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee ID is required.",
        },
        { status: 400 }
      );
    }

    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid employee status.",
        },
        { status: 400 }
      );
    }

    const employee = await prisma.user.findUnique({
      where: {
        id: employeeId,
      },

      select: {
        id: true,
        role: true,
        name: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found.",
        },
        { status: 404 }
      );
    }

    if (employee.role !== "EMPLOYEE") {
      return NextResponse.json(
        {
          success: false,
          message: "This account cannot be managed here.",
        },
        { status: 400 }
      );
    }

    const updatedEmployee =
      await prisma.user.update({
        where: {
          id: employeeId,
        },

        data: {
          status,
        },

        select: {
          id: true,
          employeeId: true,
          name: true,
          email: true,
          designation: true,
          profileImage: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });

    return NextResponse.json({
      success: true,
      message:
        status === "ACTIVE"
          ? "Employee activated successfully."
          : "Employee deactivated successfully.",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/employees error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update employee.",
      },
      { status: 500 }
    );
  }
}