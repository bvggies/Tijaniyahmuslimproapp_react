import { INestApplication, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    // Configure DATABASE_URL for Neon's connection limits
    const databaseUrl = process.env.DATABASE_URL;
    const urlWithPoolConfig = databaseUrl?.includes('connection_limit') 
      ? databaseUrl 
      : `${databaseUrl}${databaseUrl?.includes('?') ? '&' : '?'}connection_limit=1&pool_timeout=20`;

    super({
      datasources: {
        db: {
          url: urlWithPoolConfig,
        },
      },
      log: ['query', 'info', 'warn', 'error'],
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
