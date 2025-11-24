import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const dbPath = path.join(process.cwd(), "prisma/dev.db");

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
    datasources: {
      db: {
        url: process.env.NODE_ENV === "production" 
             ? `file:${dbPath}` 
             : process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;