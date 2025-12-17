import { INestApplication, Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    
    // Configure connection for managed PostgreSQL (Neon)
    // Works best with direct connections and proper SSL
    let urlWithConfig = databaseUrl;
    
    if (databaseUrl && !databaseUrl.includes('sslmode')) {
      // Add sane default connection parameters for managed PostgreSQL
      // Many providers require SSL and work best with direct connections
      const separator = databaseUrl.includes('?') ? '&' : '?';
      const params: string[] = [];
      
      // Add SSL mode (required for Neon/managed PostgreSQL)
      params.push('sslmode=require');
      
      // Connection timeout
      if (!databaseUrl.includes('connect_timeout')) {
        params.push('connect_timeout=10');
      }
      
      // Use connection pooling with a conservative connection limit
      // This helps avoid overwhelming serverless/managed databases
      if (!databaseUrl.includes('connection_limit')) {
        params.push('connection_limit=3');
      }
      if (!databaseUrl.includes('pool_timeout')) {
        params.push('pool_timeout=20');
      }
      
      urlWithConfig = `${databaseUrl}${separator}${params.join('&')}`;
    }

    // Call super() first before accessing 'this'
    super({
      datasources: {
        db: {
          url: urlWithConfig,
        },
      },
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'info', 'warn', 'error'] 
        : ['warn', 'error'],
    });

    // Now we can use this.logger after super()
    if (databaseUrl && !databaseUrl.includes('sslmode')) {
      this.logger.log(`Database URL configured with managed PostgreSQL defaults (SSL, pooling)`);
    }

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
