import { Module } from '@nestjs/common';
import { ScholarsController } from './scholars.controller';
import { ScholarsService } from './scholars.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ScholarsController],
  providers: [ScholarsService],
  exports: [ScholarsService],
})
export class ScholarsModule {}

