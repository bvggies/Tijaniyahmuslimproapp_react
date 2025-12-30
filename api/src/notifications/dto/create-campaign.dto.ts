import { IsString, IsOptional, IsDateString, IsObject, MinLength } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  body: string;

  @IsOptional()
  @IsString()
  deepLink?: string;

  @IsString()
  targetType: 'all' | 'new_users' | 'active_users' | 'inactive_users' | 'custom';

  @IsOptional()
  @IsObject()
  targetFilters?: Record<string, any>;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  sendNow?: boolean;
}

