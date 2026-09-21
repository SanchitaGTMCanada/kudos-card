import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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

    const [received, given] = await Promise.all([
      prisma.kudos.findMany({
        where: {
          receiverId: user.id,
          status: "ACTIVE",
        },

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          message: true,
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

          reactions: {
            select: {
              id: true,
              userId: true,
              reaction: true,
            },
          },
        },
      }),

      prisma.kudos.findMany({
        where: {
          senderId: user.id,
          status: "ACTIVE",
        },

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          message: true,
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

          reactions: {
            select: {
              id: true,
              userId: true,
              reaction: true,
            },
          },
        },
      }),
    ]);

    function formatKudos(items) {
      return items.map((item) => {
        const reactions = {
          heart: 0,
          clap: 0,
          fire: 0,
        };

        const myReactions = [];

        item.reactions.forEach((reaction) => {
          const type = reaction.reaction?.toLowerCase();

          if (type === "heart") {
            reactions.heart += 1;
          }

          if (type === "clap") {
            reactions.clap += 1;
          }

          if (type === "fire") {
            reactions.fire += 1;
          }

          if (reaction.userId === user.id) {
            myReactions.push(type);
          }
        });

        return {
          id: item.id,
          message: item.message,
          createdAt: item.createdAt,

          sender: item.sender,
          receiver: item.receiver,

          category: item.category,

          reactions,
          myReactions,
        };
      });
    }

    return NextResponse.json({
      success: true,
      received: formatKudos(received),
      given: formatKudos(given),
      summary: {
        totalReceived: received.length,
        totalGiven: given.length,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/kudos/my error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load My Kudos",
      },
      {
        status: 500,
      }
    );
  }
}