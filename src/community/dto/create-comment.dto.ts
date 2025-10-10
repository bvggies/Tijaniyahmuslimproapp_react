import { IsString, MaxLength } from 'class-validator';
export class CreateCommentDto {
  @IsString() @MaxLength(500) content!: string;
}