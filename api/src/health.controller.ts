import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  root() {
    return { 
      message: 'Tijaniyah API is running',
      health: '/health',
      timestamp: new Date().toISOString()
    };
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  async health() {
    const dbHealthy = await this.prisma.isHealthy();
    
    return { 
      ok: dbHealthy, 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: dbHealthy,
        provider: 'PostgreSQL (Neon)'
      }
    };
  }
}
