import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request) {
  try {
    /*
     * Get logged-in employee
     */
    const sender = await getCurrentUser();

    if (!sender) {
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

    /*
     * Read request body
     */
    const body = await request.json();

    const receiverId = Number(body.receiverId);
    const categoryId = Number(body.categoryId);

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    /*
     * Basic validation
     */
    if (!receiverId || !categoryId || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Message validation
     */
    if (message.length < 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Kudos message is too short",
        },
        {
          status: 400,
        }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        {
          success: false,
          message: "Kudos message cannot exceed 500 characters",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * User cannot give Kudos to themselves
     */
    if (receiverId === sender.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot give Kudos to yourself.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Check receiver
     */
    const receiver = await prisma.user.findFirst({
      where: {
        id: receiverId,
        status: "ACTIVE",
      },

      select: {
        id: true,
        employeeId: true,
        name: true,
        designation: true,
        profileImage: true,
      },
    });

    if (!receiver) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Check category
     */
    const category = await prisma.kudosCategory.findFirst({
      where: {
        id: categoryId,
        isActive: true,
      },

      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Kudos category not found",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Create Kudos + notification together.
     *
     * If either one fails, Prisma rolls the whole
     * transaction back.
     */
    const result = await prisma.$transaction(async (tx) => {
      const kudos = await tx.kudos.create({
        data: {
          senderId: sender.id,
          receiverId: receiver.id,
          categoryId: category.id,
          message,
          status: "ACTIVE",
        },

        select: {
          id: true,
          message: true,
          status: true,
          createdAt: true,

          sender: {
            select: {
              id: true,
              employeeId: true,
              name: true,
              designation: true,
              profileImage: true,
            },
          },

          receiver: {
            select: {
              id: true,
              employeeId: true,
              name: true,
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

      /*
       * Create receiver notification
       */
      await tx.notification.create({
        data: {
          userId: receiver.id,
          kudosId: kudos.id,
          type: "KUDOS_RECEIVED",
          title: "You've received Kudos! 🎉",
          message: `${sender.name} recognized you for "${category.name}".`,
        },
      });

      return kudos;
    });

    /*
     * Safe response
     *
     * No passwordHash, email or other sensitive
     * account information is returned.
     */
    return NextResponse.json(
      {
        success: true,
        message: "Kudos sent successfully!",
        kudos: result,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/kudos error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send Kudos",
      },
      {
        status: 500,
      }
    );
  }
}