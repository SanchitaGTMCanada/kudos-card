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

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const designation =
      typeof body.designation === "string"
        ? body.designation.trim()
        : "";

    const departmentId = body.departmentId
      ? Number(body.departmentId)
      : null;

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const confirmPassword =
      typeof body.confirmPassword === "string"
        ? body.confirmPassword
        : "";

    // Required fields
    if (
      !employeeId ||
      !name ||
      !email ||
      !designation ||
      !password ||
      !confirmPassword
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields",
        },
        { status: 400 }
      );
    }

    // Employee ID validation
    if (employeeId.length < 3 || employeeId.length > 50) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid employee ID",
        },
        { status: 400 }
      );
    }

    // Name validation
    if (name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your full name",
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address",
        },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    if (password.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password cannot exceed 100 characters",
        },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match",
        },
        { status: 400 }
      );
    }

    // Check employee ID
    const existingEmployee =
      await prisma.user.findUnique({
        where: {
          employeeId,
        },
        select: {
          id: true,
        },
      });

    if (existingEmployee) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee ID is already registered",
        },
        { status: 409 }
      );
    }

    // Check email
    const existingEmail =
      await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is already registered",
        },
        { status: 409 }
      );
    }

    // Validate department if supplied
    if (departmentId !== null) {
      if (
        !Number.isInteger(departmentId) ||
        departmentId <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid department",
          },
          { status: 400 }
        );
      }

      const department =
        await prisma.department.findUnique({
          where: {
            id: departmentId,
          },
          select: {
            id: true,
          },
        });

      if (!department) {
        return NextResponse.json(
          {
            success: false,
            message: "Selected department does not exist",
          },
          { status: 400 }
        );
      }
    }

    const passwordHash = hashPassword(password);

    // IMPORTANT:
    // Role and status are controlled by the server.
    const user = await prisma.user.create({
      data: {
        employeeId,
        name,
        email,
        designation,
        passwordHash,
        role: "EMPLOYEE",
        status: "ACTIVE",

        ...(departmentId !== null
          ? {
              department: {
                connect: {
                  id: departmentId,
                },
              },
            }
          : {}),
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
      },
    });

    // Automatically log the user in
    await createSession(user.id);

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/auth/signup error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating your account",
      },
      { status: 500 }
    );
  }
}