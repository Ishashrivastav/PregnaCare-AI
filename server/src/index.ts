import app from './app.js';
import { config } from './config/index.js';
import { prisma, connectWithRetry } from './config/database.js';
import { logger } from './utils/logger.js';

async function main() {
  try {
    // Start listening on port immediately so Render detects container readiness
    const server = app.listen(config.port, '0.0.0.0', () => {
      logger.info(`PregnaCare AI Server listening on http://localhost:${config.port}`);
      logger.info(`Health check available at http://localhost:${config.port}/api/health`);
    });

    // Connect to database with retry (handling Neon cold starts smoothly)
    try {
      await connectWithRetry(5, 2000);
      logger.info('Database connected successfully');
    } catch (dbErr: any) {
      logger.error('Initial database connection warning (will retry on incoming requests):', {
        message: dbErr.message,
      });
    }

    // Graceful shutdown on process termination signals (only disconnect on exit)
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Closing HTTP server and disconnecting database...`);
      server.close(async () => {
        try {
          await prisma.$disconnect();
          logger.info('Database disconnected cleanly.');
        } catch {
          // ignore error on exit
        }
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error: any) {
    logger.error('Failed to start server:', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

main();

export { app };
export default app;
