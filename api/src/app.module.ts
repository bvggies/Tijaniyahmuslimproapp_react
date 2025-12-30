import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health.controller';
import { AuthModule } from './auth/auth.module';
import { CommunityModule } from './community/community.module';
import { JournalModule } from './journal/journal.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { QuranModule } from './quran/quran.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CommunityModule,
    JournalModule,
    ChatModule,
    NotificationsModule,
    CloudinaryModule,
    QuranModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
