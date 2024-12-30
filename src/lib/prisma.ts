import { Pool, neonConfig } from "@neondatabase/serverless";

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
const connectionString = import.meta.env.VITE_DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
