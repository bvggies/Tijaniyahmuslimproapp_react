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
import { MakkahLiveModule } from './makkah-live/makkah-live.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiModule } from './ai/ai.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { NewsModule } from './news/news.module';
import { NewsCategoriesModule } from './news-categories/news-categories.module';
import { ScholarsModule } from './scholars/scholars.module';
import { AzanModule } from './azan/azan.module';

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
    MakkahLiveModule,
    AnalyticsModule,
    AiModule,
    UsersModule,
    EventsModule,
    NewsModule,
    NewsCategoriesModule,
    ScholarsModule,
    AzanModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
