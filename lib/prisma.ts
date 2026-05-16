import { PrismaClient } from "@/prisma/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// 1. Sanitize connection string and inject direct parameters
const rawUrl = process.env.DATABASE_URL || "";
const cleanUrl = rawUrl.split("?")[0];

// Force specific timeout queries globally to avoid database stalls
const connectionString = `${cleanUrl}?sslmode=require&connect_timeout=35&statement_timeout=35000&idle_in_transaction_session_timeout=35000`;

// 2. Configure robust native pg.Pool with hardware keepalive controls
const pool = new pg.Pool({
  connectionString,
  max: 1, // Set to 1 connection to isolate and guarantee sequential pipeline
  idleTimeoutMillis: 10000, // Kill idle links aggressively
  connectionTimeoutMillis: 40000, // Wait up to 40 seconds for Neon compute nodes
  keepAlive: true, // Prevent Windows socket from dropping unexpectedly
  ssl: {
    rejectUnauthorized: false, // Ignore local TLS/SSL validation loops
  },
});

const adapter = new PrismaPg(pool);

// 3. Singleton instantiation
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
