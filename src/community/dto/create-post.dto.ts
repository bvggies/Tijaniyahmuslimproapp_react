import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString() @MaxLength(1000) content!: string;
  @IsOptional() @IsArray() mediaUrls?: string[];
}