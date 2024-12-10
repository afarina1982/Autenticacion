import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(6, { message: 'Current password must be at least 6 characters' })
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  @IsNotEmpty()
  newPassword: string;
}
 