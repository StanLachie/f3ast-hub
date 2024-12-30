import { Pool, neonConfig } from "@neondatabase/serverless";

import { DATABASE_URL } from "$env/static/private";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

// Configure neon to use ws
neonConfig.webSocketConstructor = ws;
const connectionString = DATABASE_URL;

// Create a singleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    // Enable direct connections for edge compatibility
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
