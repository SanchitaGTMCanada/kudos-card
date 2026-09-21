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

    // ---------------------------------------
    // Start of current month
    // ---------------------------------------

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

    // ---------------------------------------
    // Total Kudos given
    // ---------------------------------------

    const totalGiven = await prisma.kudos.count({
      where: {
        senderId: user.id,
        status: "ACTIVE",
      },
    });

    // ---------------------------------------
    // Total Kudos received
    // ---------------------------------------

    const totalReceived = await prisma.kudos.count({
      where: {
        receiverId: user.id,
        status: "ACTIVE",
      },
    });

    // ---------------------------------------
    // Kudos this month
    // ---------------------------------------

    const thisMonth = await prisma.kudos.count({
      where: {
        status: "ACTIVE",

        createdAt: {
          gte: startOfMonth,
        },

        OR: [
          {
            senderId: user.id,
          },
          {
            receiverId: user.id,
          },
        ],
      },
    });

    // ---------------------------------------
    // Recent Kudos
    // ---------------------------------------

    const recentKudos = await prisma.kudos.findMany({
      where: {
        status: "ACTIVE",

        OR: [
          {
            senderId: user.id,
          },
          {
            receiverId: user.id,
          },
        ],
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 5,

      include: {
        sender: {
          select: {
            id: true,
            name: true,
            employeeId: true,
            profileImage: true,
            designation: true,
          },
        },

        receiver: {
          select: {
            id: true,
            name: true,
            employeeId: true,
            profileImage: true,
            designation: true,
          },
        },

        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },

        reactions: {
          select: {
            id: true,
            userId: true,
            reaction: true,
          },
        },
      },
    });

    // ---------------------------------------
    // Format recent Kudos
    // ---------------------------------------

    const formattedRecentKudos = recentKudos.map((item) => {
      const reactionCounts = {
        heart: 0,
        clap: 0,
        fire: 0,
      };

      item.reactions.forEach((reaction) => {
        const type = reaction.reaction?.toLowerCase();

        if (type === "heart") {
          reactionCounts.heart += 1;
        }

        if (type === "clap") {
          reactionCounts.clap += 1;
        }

        if (type === "fire") {
          reactionCounts.fire += 1;
        }
      });

      return {
        id: item.id,

        message: item.message,

        createdAt: item.createdAt,

        category: {
          id: item.category.id,
          name: item.category.name,
          icon: item.category.icon,
        },

        sender: {
          id: item.sender.id,
          name: item.sender.name,
          employeeId: item.sender.employeeId,
          profileImage: item.sender.profileImage,
          designation: item.sender.designation,
        },

        receiver: {
          id: item.receiver.id,
          name: item.receiver.name,
          employeeId: item.receiver.employeeId,
          profileImage: item.receiver.profileImage,
          designation: item.receiver.designation,
        },

        reactions: reactionCounts,
      };
    });

    // ---------------------------------------
    // Response
    // ---------------------------------------

    return NextResponse.json({
      success: true,

      stats: {
        totalGiven,
        totalReceived,
        thisMonth,
      },

      recentKudos: formattedRecentKudos,
    });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard data",
      },
      {
        status: 500,
      }
    );
  }
}