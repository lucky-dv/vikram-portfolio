import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; prismaUrl?: string };

/**
 * Pass the URL explicitly and rebuild the client if it changes, so a dev server that was
 * started before .env.local existed (or after it was edited) never keeps a stale client.
 */
function client() {
  const url = process.env.DATABASE_URL;
  if (!globalForPrisma.prisma || globalForPrisma.prismaUrl !== url) {
    globalForPrisma.prisma = new PrismaClient(url ? { datasourceUrl: url } : undefined);
    globalForPrisma.prismaUrl = url;
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get: (_t, prop) => Reflect.get(client(), prop),
});
