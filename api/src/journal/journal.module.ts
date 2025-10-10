import { Module } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JournalController } from './journal.controller';

@Module({
  providers: [JournalService],
  controllers: [JournalController],
})
export class JournalModule {}
