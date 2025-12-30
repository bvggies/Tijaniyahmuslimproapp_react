import { IsString, IsOptional, IsEnum, IsBoolean, IsInt, IsUrl, Min } from 'class-validator';

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
  @IsBoolean()
  activeOnly?: boolean;

  @IsOptional()
  @IsBoolean()
  featuredOnly?: boolean;
}

