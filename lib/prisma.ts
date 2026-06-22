import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../app/egenerated/prisma/client';

const TRANSIENT_DB_ERROR =
  /Failed to connect to upstream database|ECONNRESET|ECONNREFUSED|ETIMEDOUT|Connection terminated unexpectedly/i;

const MAX_RETRIES = 3;
const RETRY_BASE_MS = 300;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: pg.Pool | undefined;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientDatabaseError(error: unknown): boolean {
  return error instanceof Error && TRANSIENT_DB_ERROR.test(error.message);
}

async function withDatabaseRetry<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isTransientDatabaseError(error) || attempt === MAX_RETRIES - 1) {
        throw error;
      }
      await sleep(RETRY_BASE_MS * 2 ** attempt);
    }
  }

  throw lastError;
}

/**
 * Prisma Postgres pooled URLs proxy through pooled.db.prisma.io and can fail
 * while the upstream database wakes from idle. Node.js servers should use the
 * direct TCP host instead.
 */
function normalizeDatabaseUrl(url: string): string {
  return url
    .replace('pooled.db.prisma.io', 'db.prisma.io')
    .replace(/sslmode=(prefer|require|verify-ca)/, 'sslmode=verify-full');
}

function createPgPool(): pg.Pool {
  const connectionString = normalizeDatabaseUrl(process.env.DATABASE_URL ?? '');
  const pool = new pg.Pool({
    connectionString,
    max: 10,
    connectionTimeoutMillis: 15_000,
  });

  pool.on('error', (error) => {
    console.error('[prisma] idle pg pool client error:', error.message);
  });

  return pool;
}

function withQueryRetry(client: PrismaClient): PrismaClient {
  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          return withDatabaseRetry(() => query(args));
        },
      },
    },
  }) as unknown as PrismaClient;
}

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? '';

  if (url.startsWith('prisma+postgres://')) {
    const { withAccelerate } = require('@prisma/extension-accelerate');
    const client = new PrismaClient({
      accelerateUrl: url,
    }).$extends(withAccelerate()) as unknown as PrismaClient;

    return withQueryRetry(client);
  }

  const pool = globalForPrisma.pgPool ?? createPgPool();
  globalForPrisma.pgPool = pool;

  const adapter = new PrismaPg(pool);
  return withQueryRetry(new PrismaClient({ adapter }));
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
