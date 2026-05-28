import { PrismaClient } from '../app/egenerated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Replaces ambiguous SSL modes with 'verify-full' to match the current pg
 * behavior and suppress the pg-connection-string deprecation warning.
 */
function normalizeSslMode(url: string): string {
  return url.replace(/sslmode=(prefer|require|verify-ca)/, 'sslmode=verify-full');
}

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? '';

  if (url.startsWith('prisma+postgres://')) {
    const { withAccelerate } = require('@prisma/extension-accelerate');
    return new PrismaClient({
      accelerateUrl: url,
    }).$extends(withAccelerate()) as unknown as PrismaClient;
  }

  const { PrismaPg } = require('@prisma/adapter-pg');
  const adapter = new PrismaPg({ connectionString: normalizeSslMode(url) });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
