import { Module } from '@nestjs/common';
import { MakkahLiveController } from './makkah-live.controller';
import { MakkahLiveService } from './makkah-live.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MakkahLiveController],
  providers: [MakkahLiveService],
  exports: [MakkahLiveService],
})
export class MakkahLiveModule {}

