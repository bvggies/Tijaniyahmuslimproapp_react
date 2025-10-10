import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  @IsIn(['text', 'image', 'file'])
  messageType?: string = 'text';
}
