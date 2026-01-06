import { IsString, IsOptional, IsEnum, IsBoolean, IsInt, IsUrl, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export enum ChannelType {
  YOUTUBE_LIVE = 'YOUTUBE_LIVE',
  TV_CHANNEL = 'TV_CHANNEL',
}

export enum ChannelCategory {
  MAKKAH = 'MAKKAH',
  MADINAH = 'MADINAH',
  QURAN = 'QURAN',
  ISLAMIC = 'ISLAMIC',
  NEWS = 'NEWS',
  EDUCATIONAL = 'EDUCATIONAL',
}

export class CreateChannelDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  titleArabic?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsEnum(ChannelType)
  type: ChannelType;

  @IsEnum(ChannelCategory)
  category: ChannelCategory;

  @IsOptional()
  @IsString()
  youtubeId?: string;

  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

export class UpdateChannelDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  titleArabic?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsEnum(ChannelType)
  type?: ChannelType;

  @IsOptional()
  @IsEnum(ChannelCategory)
  category?: ChannelCategory;

  @IsOptional()
  @IsString()
  youtubeId?: string;

  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

export class ChannelQueryDto {
  @IsOptional()
  @IsEnum(ChannelType)
  type?: ChannelType;

  @IsOptional()
  @IsEnum(ChannelCategory)
  category?: ChannelCategory;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true || value === '1' || value === 1) return true;
    if (value === 'false' || value === false || value === '0' || value === 0) return false;
    return undefined;
  })
  @IsBoolean()
  activeOnly?: boolean;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true || value === '1' || value === 1) return true;
    if (value === 'false' || value === false || value === '0' || value === 0) return false;
    return undefined;
  })
  @IsBoolean()
  featuredOnly?: boolean;
}

