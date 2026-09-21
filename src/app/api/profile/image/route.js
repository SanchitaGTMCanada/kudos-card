import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request) {
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

    const formData = await request.formData();

    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Please select an image",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only JPG, PNG and WebP images are allowed",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Image size cannot exceed 2 MB",
        },
        { status: 400 }
      );
    }

    const extension = ALLOWED_TYPES[file.type];

    const fileName = `${user.id}-${crypto.randomUUID()}.${extension}`;

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "profiles"
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    const filePath = path.join(
      uploadDirectory,
      fileName
    );

    const bytes = await file.arrayBuffer();

    await writeFile(
      filePath,
      Buffer.from(bytes)
    );

    const imageUrl = `/uploads/profiles/${fileName}`;

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        profileImage: imageUrl,
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
      message: "Profile image uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "POST /api/profile/image error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload profile image",
      },
      { status: 500 }
    );
  }
}