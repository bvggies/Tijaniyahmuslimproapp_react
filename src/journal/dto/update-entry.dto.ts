import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';
export class UpdateEntryDto {
  @IsOptional() @IsString() @MaxLength(200) title?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsArray() tags?: string[];
}