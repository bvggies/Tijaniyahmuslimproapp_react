import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AzanController } from './azan.controller';
import { AzanService } from './azan.service';

@Module({
  imports: [PrismaModule],
  controllers: [AzanController],
  providers: [AzanService],
  exports: [AzanService],
})
export class AzanModule {}
