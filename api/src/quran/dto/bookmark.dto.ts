import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateBookmarkDto {
  @IsString()
  verseKey: string;

  @IsNumber()
  @Min(1)
  @Max(114)
  chapterId: number;

  @IsNumber()
  @Min(1)
  verseNumber: number;

  @IsString()
  @IsOptional()
  note?: string;
}

export class UpdateLastReadDto {
  @IsNumber()
  @Min(1)
  @Max(114)
  chapterId: number;

  @IsNumber()
  @Min(1)
  verseNumber: number;

  @IsString()
  verseKey: string;

  @IsNumber()
  @IsOptional()
  scrollPosition?: number;
}

