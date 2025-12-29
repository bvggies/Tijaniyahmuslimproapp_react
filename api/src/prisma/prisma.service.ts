import { INestApplication, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    // Configure DATABASE_URL for Neon's serverless connection pooling
    // For Vercel serverless functions, use Neon's connection pooler
    const databaseUrl = process.env.DATABASE_URL;
    
    // Check if we're in a serverless environment (Vercel)
    const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
    
    let connectionUrl = databaseUrl;
    
    if (isServerless && databaseUrl) {
      // For Neon on Vercel, use connection pooling
      // If URL doesn't already have pooling configured, add it
      if (!databaseUrl.includes('?') && !databaseUrl.includes('pool_timeout')) {
        connectionUrl = `${databaseUrl}?pgbouncer=true&connect_timeout=10`;
      } else if (!databaseUrl.includes('pgbouncer=true')) {
        // Add pgbouncer parameter if not present
        const separator = databaseUrl.includes('?') ? '&' : '?';
        connectionUrl = `${databaseUrl}${separator}pgbouncer=true&connect_timeout=10`;
      }
    } else if (databaseUrl && !databaseUrl.includes('connection_limit')) {
      // For non-serverless, use standard connection limits
      const separator = databaseUrl.includes('?') ? '&' : '?';
      connectionUrl = `${databaseUrl}${separator}connection_limit=1&pool_timeout=20`;
    }

    super({
      datasources: {
        db: {
          url: connectionUrl,
        },
      },
      // Reduce logging in production for better performance
      log: process.env.NODE_ENV === 'production' 
        ? ['warn', 'error'] 
        : ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      this.logger.log('Connecting to database...');
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
