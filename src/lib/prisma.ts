import { Pool, neonConfig } from "@neondatabase/serverless";

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

declare global {
  var __prisma: PrismaClient | undefined;
}
// Configure Neon
neonConfig.webSocketConstructor = ws;

neonConfig.poolQueryViaFetch = true;

const connectionString = import.meta.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    adapter,
  });

if (import.meta.env.DEV) {
  globalThis.__prisma = prisma;
}

export default prisma;
