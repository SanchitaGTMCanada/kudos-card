import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const body = await request.json();

    const designation =
      typeof body.designation === "string"
        ? body.designation.trim()
        : "";

    const profileImage =
      typeof body.profileImage === "string"
        ? body.profileImage.trim()
        : "";

    if (designation.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Designation cannot exceed 100 characters",
        },
        { status: 400 }
      );
    }

    if (profileImage.length > 500) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Profile image URL is too long",
        },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        designation: designation || null,
        profileImage: profileImage || null,
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
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "PATCH /api/profile error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
      },
      { status: 500 }
    );
  }
}