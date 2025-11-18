import { INestApplication, Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    
    // Configure connection pooling for Railway PostgreSQL
    // Railway PostgreSQL supports multiple connections, so we use a reasonable pool size
    let urlWithPoolConfig = databaseUrl;
    
    if (databaseUrl && !databaseUrl.includes('connection_limit')) {
      // Railway PostgreSQL works best with connection pooling
      // Use connection_limit=5 for better performance and reliability
      const separator = databaseUrl.includes('?') ? '&' : '?';
      urlWithPoolConfig = `${databaseUrl}${separator}connection_limit=5&pool_timeout=20&connect_timeout=10`;
    }

    super({
      datasources: {
        db: {
          url: urlWithPoolConfig,
        },
      },
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'info', 'warn', 'error'] 
        : ['warn', 'error'],
    });

    // Handle connection errors gracefully
    this.$on('error' as never, (e: any) => {
      this.logger.error('Prisma error:', e);
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

  // Health check method
  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
