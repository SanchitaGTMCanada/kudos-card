import "dotenv/config";
import crypto from "crypto";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: Number(process.env.DATABASE_PORT || 3306),
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "kudos_card",
  connectionLimit: 1,
});

const prisma = new PrismaClient({
  adapter,
});

function hashPassword(password: string) {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
}

async function main() {
  console.log("Creating test employees...");

  const password = "Kudos@123";

  const sanchita = await prisma.user.upsert({
    where: {
      employeeId: "EMP001",
    },

    update: {
      name: "Sanchita Sharma",
      email: "sanchita@example.com",
      passwordHash: hashPassword(password),
      designation: "Software Engineer",
      role: "EMPLOYEE",
      status: "ACTIVE",
    },

    create: {
      employeeId: "EMP001",
      name: "Sanchita Sharma",
      email: "sanchita@example.com",
      passwordHash: hashPassword(password),
      designation: "Software Engineer",
      role: "EMPLOYEE",
      status: "ACTIVE",
    },
  });

  const rahul = await prisma.user.upsert({
    where: {
      employeeId: "EMP002",
    },

    update: {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      passwordHash: hashPassword(password),
      designation: "Software Engineer",
      role: "EMPLOYEE",
      status: "ACTIVE",
    },

    create: {
      employeeId: "EMP002",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      passwordHash: hashPassword(password),
      designation: "Software Engineer",
      role: "EMPLOYEE",
      status: "ACTIVE",
    },
  });

  console.log("");
  console.log("=================================");
  console.log("Employees created successfully");
  console.log("=================================");

  console.log(`Employee 1 : ${sanchita.employeeId}`);
  console.log(`Name       : ${sanchita.name}`);
  console.log(`Email      : ${sanchita.email}`);

  console.log("");

  console.log(`Employee 2 : ${rahul.employeeId}`);
  console.log(`Name       : ${rahul.name}`);
  console.log(`Email      : ${rahul.email}`);

  console.log("");

  console.log(`Password   : ${password}`);

  console.log("=================================");
  console.log("");
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });