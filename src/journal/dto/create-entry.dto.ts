import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';
export class CreateEntryDto {
  @IsString() @MaxLength(200) title!: string;
  @IsString() content!: string;
  @IsOptional() @IsArray() tags?: string[];
}