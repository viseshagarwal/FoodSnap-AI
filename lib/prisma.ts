import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  errorFormat: 'minimal',
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Gracefully handle connection errors
prisma.$connect()
  .catch((e) => {
    console.error('Failed to connect to the database:', e);
    process.exit(1);
  });
