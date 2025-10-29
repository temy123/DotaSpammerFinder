import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma || new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

// Log database queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Params: ${e.params}`);
    logger.debug(`Duration: ${e.duration}ms`);
  });
}

prisma.$on('error', (e) => {
  logger.error('Database error:', e);
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Database disconnection failed:', error);
    throw error;
  }
};

export default prisma;