import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    logger.log('Starting application...');
    
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.enableCors({
      origin: config.get<string>('CORS_ORIGIN') || '*',
      credentials: false,
    });

    const port = Number(config.get<string>('PORT') || 3000);
    await app.listen(port);
    
    logger.log(`Application is running on port ${port}`);
    logger.log(`Health check available at http://localhost:${port}/health`);
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}
bootstrap();
