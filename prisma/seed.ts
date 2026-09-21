import "dotenv/config";
import crypto from "crypto";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

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
  console.log("Creating test employee...");

  const password = "Kudos@123";

  const user = await prisma.user.upsert({
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

  console.log("");
  console.log("=================================");
  console.log("Employee created successfully");
  console.log("=================================");
  console.log(`Employee ID : ${user.employeeId}`);
  console.log(`Name        : ${user.name}`);
  console.log(`Email       : ${user.email}`);
  console.log(`Password    : ${password}`);
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