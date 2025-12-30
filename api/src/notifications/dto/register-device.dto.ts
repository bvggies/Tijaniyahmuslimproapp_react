import { IsString, IsEnum, IsOptional } from 'class-validator';

export class RegisterDeviceDto {
  @IsString()
  expoPushToken: string;

  @IsEnum(['ios', 'android', 'web'])
  platform: 'ios' | 'android' | 'web';

  @IsOptional()
  @IsString()
  deviceName?: string;
}

