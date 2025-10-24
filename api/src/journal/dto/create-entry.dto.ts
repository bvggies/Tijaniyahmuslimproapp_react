import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateEntryDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
