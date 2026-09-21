import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "kudos_session";
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is not configured");
  }

  return secret;
}

function createToken(userId) {
  const timestamp = Date.now().toString();

  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(`${userId}:${timestamp}`)
    .digest("hex");

  return Buffer.from(
    `${userId}:${timestamp}:${signature}`
  ).toString("base64url");
}

function verifyToken(token) {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");

    const [userId, timestamp, signature] = decoded.split(":");

    if (!userId || !timestamp || !signature) {
      return null;
    }

    const expectedSignature = crypto
      .createHmac("sha256", getSessionSecret())
      .update(`${userId}:${timestamp}`)
      .digest("hex");

    if (signature.length !== expectedSignature.length) {
      return null;
    }

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    ) {
      return null;
    }

    const createdAt = Number(timestamp);

    if (Number.isNaN(createdAt)) {
      return null;
    }

    if (Date.now() - createdAt > SESSION_DURATION) {
      return null;
    }

    return Number(userId);
  } catch {
    return null;
  }
}

export async function createSession(userId) {
  const token = createToken(userId);

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 60,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const userId = verifyToken(token);

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
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

  if (!user || user.status !== "ACTIVE") {
    return null;
  }

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}