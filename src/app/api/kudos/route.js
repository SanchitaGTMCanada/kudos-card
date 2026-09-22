import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import {
  sendKudosRecipientEmail,
  sendKudosHrEmail,
} from "@/lib/email";

const MONTHLY_KUDOS_LIMIT = 2;

export async function POST(request) {
  try {
    // =========================================================
    // AUTHENTICATION
    // =========================================================

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

    // =========================================================
    // REQUEST BODY
    // =========================================================

    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const receiverId = Number(body.receiverId);
    const categoryId = Number(body.categoryId);

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    // =========================================================
    // VALIDATION
    // =========================================================

    if (
      !Number.isInteger(receiverId) ||
      receiverId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a valid recipient.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(categoryId) ||
      categoryId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a valid Kudos category.",
        },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: "Kudos message is required.",
        },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Kudos message cannot exceed 1000 characters.",
        },
        { status: 400 }
      );
    }

    // =========================================================
    // PREVENT SELF KUDOS
    // =========================================================

    if (receiverId === user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot give Kudos to yourself.",
        },
        { status: 400 }
      );
    }

    // =========================================================
    // CURRENT MONTH RANGE
    // =========================================================

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

    // =========================================================
    // CHECK MONTHLY LIMIT
    //
    // Each employee can give maximum 2 Kudos per month.
    // =========================================================

    const monthlyKudosCount =
      await prisma.kudos.count({
        where: {
          senderId: user.id,

          createdAt: {
            gte: startOfMonth,
            lt: startOfNextMonth,
          },

          status: "ACTIVE",
        },
      });

    if (
      monthlyKudosCount >= MONTHLY_KUDOS_LIMIT
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You have already used your 2 Kudos for this month.",
          limitReached: true,
          monthlyLimit: MONTHLY_KUDOS_LIMIT,
          usedThisMonth: monthlyKudosCount,
          remainingThisMonth: 0,
        },
        { status: 400 }
      );
    }

    // =========================================================
    // GET RECEIVER
    // =========================================================

    const receiver =
      await prisma.user.findUnique({
        where: {
          id: receiverId,
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

    if (!receiver) {
      return NextResponse.json(
        {
          success: false,
          message: "Recipient not found.",
        },
        { status: 404 }
      );
    }

    if (receiver.status !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          message:
            "You cannot send Kudos to an inactive employee.",
        },
        { status: 400 }
      );
    }

    if (!receiver.email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The selected employee does not have an email address.",
        },
        { status: 400 }
      );
    }

    // =========================================================
    // GET CATEGORY
    // =========================================================

    const category =
      await prisma.kudosCategory.findUnique({
        where: {
          id: categoryId,
        },

        select: {
          id: true,
          name: true,
          description: true,
          icon: true,
          isActive: true,
        },
      });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Kudos category not found.",
        },
        { status: 404 }
      );
    }

    if (!category.isActive) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This Kudos category is currently inactive.",
        },
        { status: 400 }
      );
    }

    // =========================================================
    // CREATE KUDOS
    // =========================================================

    const kudos =
      await prisma.kudos.create({
        data: {
          senderId: user.id,
          receiverId: receiver.id,
          categoryId: category.id,
          message,
          status: "ACTIVE",
        },

        select: {
          id: true,
          senderId: true,
          receiverId: true,
          categoryId: true,
          message: true,
          status: true,
          createdAt: true,
          updatedAt: true,

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
      });

    // =========================================================
    // CREATE DATABASE NOTIFICATION
    // =========================================================

    let notification = null;

    try {
      notification =
        await prisma.notification.create({
          data: {
            userId: receiver.id,
            kudosId: kudos.id,
            type: "KUDOS_RECEIVED",
            title: "You've received Kudos! 🎉",
            message: `${kudos.sender.name} recognized you for "${category.name}".`,
            isRead: false,
          },

          select: {
            id: true,
            kudosId: true,
            type: true,
            title: true,
            message: true,
            isRead: true,
            createdAt: true,
          },
        });
    } catch (notificationError) {
      console.error(
        "Failed to create Kudos notification:",
        notificationError
      );
    }

    // =========================================================
    // SEND EMAIL TO RECIPIENT
    // =========================================================

    let recipientEmailSent = false;

    try {
      await sendKudosRecipientEmail({
        recipient: kudos.receiver,
        sender: kudos.sender,
        category: kudos.category,
        message: kudos.message,
      });

      recipientEmailSent = true;
    } catch (emailError) {
      console.error(
        "Failed to send recipient Kudos email:",
        emailError
      );
    }

    // =========================================================
    // SEND EMAIL TO HR
    // =========================================================

    let hrEmailSent = false;

    try {
      await sendKudosHrEmail({
        sender: kudos.sender,
        recipient: kudos.receiver,
        category: kudos.category,
        message: kudos.message,
      });

      hrEmailSent = true;
    } catch (emailError) {
      console.error(
        "Failed to send HR Kudos email:",
        emailError
      );
    }

    // =========================================================
    // MONTHLY USAGE
    // =========================================================

    const usedThisMonth =
      monthlyKudosCount + 1;

    const remainingThisMonth =
      Math.max(
        0,
        MONTHLY_KUDOS_LIMIT -
          usedThisMonth
      );

    // =========================================================
    // RESPONSE
    // =========================================================

    return NextResponse.json(
      {
        success: true,

        message:
          "Kudos sent successfully!",

        kudos,

        notification,

        monthlyLimit:
          MONTHLY_KUDOS_LIMIT,

        usedThisMonth,

        remainingThisMonth,

        email: {
          recipient: recipientEmailSent,
          hr: hrEmailSent,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/kudos error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to send Kudos. Please try again.",
      },
      { status: 500 }
    );
  }
}