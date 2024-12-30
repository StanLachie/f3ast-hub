import { Pool, neonConfig } from "@neondatabase/serverless";

import { DATABASE_URL } from "$env/static/private";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

export const runtime = "edge";
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
