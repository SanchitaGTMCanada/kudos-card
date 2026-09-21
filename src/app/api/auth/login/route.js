import { NextResponse } from "next/server";
import crypto from "crypto";

import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

function hashPassword(password) {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
}

export async function POST(request) {
  try {
    const body = await request.json();

    const employeeId =
      typeof body.employeeId === "string"
        ? body.employeeId.trim()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!employeeId || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee ID and password are required",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        employeeId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid employee ID or password",
        },
        {
          status: 401,
        }
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          message: "Your account is inactive",
        },
        {
          status: 403,
        }
      );
    }

    const passwordHash = hashPassword(password);

    if (passwordHash !== user.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid employee ID or password",
        },
        {
          status: 401,
        }
      );
    }

    await createSession(user.id);

    return NextResponse.json({
      success: true,
      message: "Login successful",

      user: {
        id: user.id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        designation: user.designation,
        profileImage: user.profileImage,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}