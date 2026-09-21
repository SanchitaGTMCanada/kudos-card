import { NextResponse } from "next/server";
import crypto from "crypto";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function hashPassword(password) {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
}

export async function PATCH(request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const currentPassword =
      typeof body.currentPassword === "string"
        ? body.currentPassword
        : "";

    const newPassword =
      typeof body.newPassword === "string"
        ? body.newPassword
        : "";

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Current password and new password are required",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "New password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    if (newPassword.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message:
            "New password cannot exceed 100 characters",
        },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "New password must be different from your current password",
        },
        { status: 400 }
      );
    }

    // Get the password hash separately.
    // getCurrentUser() intentionally does not expose it.
    const user = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const currentPasswordHash =
      hashPassword(currentPassword);

    if (
      currentPasswordHash !== user.passwordHash
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password is incorrect",
        },
        { status: 400 }
      );
    }

    const newPasswordHash =
      hashPassword(newPassword);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(
      "PATCH /api/profile/password error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to change password",
      },
      { status: 500 }
    );
  }
}