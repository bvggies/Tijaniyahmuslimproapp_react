import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}

