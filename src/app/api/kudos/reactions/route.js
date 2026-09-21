import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const ALLOWED_REACTIONS = ["heart", "clap", "fire"];

export async function POST(request) {
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

    const body = await request.json();

    const kudosId = Number(body.kudosId);
    const reaction =
      typeof body.reaction === "string"
        ? body.reaction.trim().toLowerCase()
        : "";

    if (!kudosId || !reaction) {
      return NextResponse.json(
        {
          success: false,
          message: "Kudos ID and reaction are required",
        },
        {
          status: 400,
        }
      );
    }

    if (!ALLOWED_REACTIONS.includes(reaction)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid reaction",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Make sure the Kudos exists and is active.
     */
    const kudos = await prisma.kudos.findFirst({
      where: {
        id: kudosId,
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    if (!kudos) {
      return NextResponse.json(
        {
          success: false,
          message: "Kudos not found",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Check whether this user already has
     * this exact reaction.
     */
    const existingReaction =
      await prisma.kudosReaction.findFirst({
        where: {
          kudosId,
          userId: user.id,
          reaction,
        },
        select: {
          id: true,
        },
      });

    /*
     * If reaction exists, remove it.
     * Otherwise create it.
     *
     * This gives us toggle behavior:
     *
     * Click ❤️ → add
     * Click ❤️ again → remove
     */
    if (existingReaction) {
      await prisma.kudosReaction.delete({
        where: {
          id: existingReaction.id,
        },
      });
    } else {
      await prisma.kudosReaction.create({
        data: {
          kudosId,
          userId: user.id,
          reaction,
        },
      });
    }

    /*
     * Get updated reaction counts.
     */
    const reactions = await prisma.kudosReaction.findMany({
      where: {
        kudosId,
      },
      select: {
        userId: true,
        reaction: true,
      },
    });

    const counts = {
      heart: 0,
      clap: 0,
      fire: 0,
    };

    const myReactions = [];

    reactions.forEach((item) => {
      const type = item.reaction?.toLowerCase();

      if (type === "heart") {
        counts.heart += 1;
      }

      if (type === "clap") {
        counts.clap += 1;
      }

      if (type === "fire") {
        counts.fire += 1;
      }

      if (item.userId === user.id) {
        myReactions.push(type);
      }
    });

    return NextResponse.json({
      success: true,
      message: existingReaction
        ? "Reaction removed"
        : "Reaction added",
      reactions: counts,
      myReactions,
    });
  } catch (error) {
    console.error(
      "POST /api/kudos/reactions error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update reaction",
      },
      {
        status: 500,
      }
    );
  }
}