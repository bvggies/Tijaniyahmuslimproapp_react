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
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  titleArabic?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  subtitle?: string;

  @IsEnum(ChannelType)
  type: ChannelType;

  @IsEnum(ChannelCategory)
  category: ChannelCategory;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  youtubeId?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsUrl()
  websiteUrl?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  logo?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
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
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  title?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  titleArabic?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsEnum(ChannelType)
  type?: ChannelType;

  @IsOptional()
  @IsEnum(ChannelCategory)
  category?: ChannelCategory;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  youtubeId?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsUrl()
  websiteUrl?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  logo?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
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

