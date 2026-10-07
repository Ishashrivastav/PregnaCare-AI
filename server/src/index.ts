import app from './app.js';
import { config } from './config/index.js';
import { prisma } from './config/database.js';
import { logger } from './utils/logger.js';

async function main() {
  try {
    // Verify database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    app.listen(config.port, '0.0.0.0', () => {
      logger.info(`PregnaCare AI Server listening on http://localhost:${config.port}`);
      logger.info(`Health check available at http://localhost:${config.port}/api/health`);
    });
  } catch (error: any) {
    logger.error('Failed to start server:', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

main();

export { app };
export default app;
