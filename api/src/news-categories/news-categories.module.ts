import { Module } from '@nestjs/common';
import { NewsCategoriesController } from './news-categories.controller';
import { NewsCategoriesService } from './news-categories.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NewsCategoriesController],
  providers: [NewsCategoriesService],
  exports: [NewsCategoriesService],
})
export class NewsCategoriesModule {}

