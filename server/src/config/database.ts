import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

// Global singleton instance to prevent multiple connection pools in long-running services
const globalForPrisma = globalThis as unknown as {
  prismaInstance: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? [
            { emit: 'event', level: 'error' },
            { emit: 'event', level: 'warn' },
          ]
        : [{ emit: 'event', level: 'error' }],
  });
}

export const basePrisma = globalForPrisma.prismaInstance ?? createPrismaClient();

if (!globalForPrisma.prismaInstance) {
  globalForPrisma.prismaInstance = basePrisma;
}

// Log connection errors gracefully without throwing unhandled exceptions
// @ts-ignore
basePrisma.$on('error', (e: any) => {
  logger.error('Prisma connection error:', { message: e.message || String(e) });
});

// Helper to determine if an error is a transient connection drop
export function isTransientConnectionError(error: any): boolean {
  if (!error) return false;
  const msg = String(error.message || error);
  const code = error.code;
  return (
    code === 'P1017' || // Server has closed the connection
    code === 'P1001' || // Can't reach database server
    msg.includes('kind: Closed') ||
    msg.includes('connection: Error { kind: Closed') ||
    msg.includes('Closed') ||
    msg.includes('Connection closed') ||
    msg.includes('ECONNRESET') ||
    msg.includes('ETIMEDOUT') ||
    msg.includes('Server has closed the connection')
  );
}

// Resilient connect function with exponential backoff for cold starts (e.g., Neon serverless)
export async function connectWithRetry(maxRetries = 5, delayMs = 2000): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await basePrisma.$connect();
      return;
    } catch (err: any) {
      if (attempt === maxRetries) {
        throw err;
      }
      const waitTime = delayMs * attempt;
      logger.warn(
        `Database connection attempt ${attempt}/${maxRetries} failed. Retrying in ${waitTime}ms... (${err.message})`
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
}

// Resilient Prisma client with query auto-retry on closed connection
export const prisma = basePrisma.$extends({
  query: {
    $allOperations: async ({ operation, model, args, query }: any) => {
      try {
        return await query(args);
      } catch (error: any) {
        if (isTransientConnectionError(error)) {
          logger.warn(
            `Transient connection drop in ${model ?? 'raw'}.${operation}. Reconnecting and retrying...`
          );
          try {
            await basePrisma.$disconnect().catch(() => {});
            await basePrisma.$connect();
            return await query(args);
          } catch (retryError) {
            throw retryError;
          }
        }
        throw error;
      }
    },
  },
}) as unknown as PrismaClient;

export default prisma;
