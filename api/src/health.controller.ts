import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller()
export class HealthController {
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
  health() {
    return { 
      ok: true, 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
  }
}
