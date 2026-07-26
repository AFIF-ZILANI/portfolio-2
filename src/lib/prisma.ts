import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Prisma 7 requires a driver adapter.
const createPrisma = () =>
    new PrismaClient({
        adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    });

// Reuse one client across dev HMR reloads so we don't leak a connection pool per edit.
// ponytail: plain global, not a Proxy wrapper — Proxies break libraries that introspect the client.
const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createPrisma> };

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
