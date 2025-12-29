import { INestApplication, Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false;

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

    // Call super() first before accessing 'this'
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

    // Handle connection errors and reconnection
    this.$on('error' as never, (e: any) => {
      this.logger.error('Prisma error:', e);
      // Mark as disconnected so we can reconnect
      if (e.message?.includes('Closed') || e.message?.includes('connection')) {
        this.isConnected = false;
        this.logger.warn('Connection lost, will attempt to reconnect on next query');
      }
    });
  }

  async onModuleInit() {
    await this.connectWithRetry();
  }

  async connectWithRetry(retries = 5, delay = 2000) {
    for (let i = 0; i < retries; i++) {
      try {
        this.logger.log(`Connecting to database... (attempt ${i + 1}/${retries})`);
        await this.$connect();
        this.isConnected = true;
        this.logger.log('✅ Database connected successfully');
        return;
      } catch (error: any) {
        this.logger.warn(`Database connection attempt ${i + 1} failed:`, error.message);
        
        if (i < retries - 1) {
          this.logger.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 1.5; // Exponential backoff
        } else {
          this.logger.error('❌ Failed to connect to database after all retries:', error);
          throw error;
        }
      }
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await this.$disconnect();
      await app.close();
    });

    process.on('SIGINT', async () => {
      await this.$disconnect();
      await app.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.$disconnect();
      await app.close();
      process.exit(0);
    });
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      this.logger.log('Disconnecting from database...');
      await this.$disconnect();
      this.isConnected = false;
      this.logger.log('Database disconnected');
    }
  }

  // Health check method with automatic reconnection
  async isHealthy(): Promise<boolean> {
    try {
      // If not connected, try to reconnect
      if (!this.isConnected) {
        await this.connectWithRetry(3, 1000);
      }
      return await this.executeWithReconnect(async () => {
        await this.$queryRaw`SELECT 1`;
        return true;
      });
    } catch (error: any) {
      this.logger.warn('Health check failed, attempting reconnection:', error.message);
      // Try to reconnect
      try {
        await this.connectWithRetry(2, 1000);
        return await this.executeWithReconnect(async () => {
          await this.$queryRaw`SELECT 1`;
          return true;
        });
      } catch {
        return false;
      }
    }
  }

  // Helper method to execute queries with automatic reconnection
  private async executeWithReconnect<T>(queryFn: () => Promise<T>): Promise<T> {
    try {
      return await queryFn();
    } catch (error: any) {
      if (error.message?.includes('Closed') || error.message?.includes('connection')) {
        this.logger.warn('Connection closed during query, reconnecting...');
        this.isConnected = false;
        await this.connectWithRetry(2, 1000);
        // Retry the query
        return await queryFn();
      }
      throw error;
    }
  }
}
