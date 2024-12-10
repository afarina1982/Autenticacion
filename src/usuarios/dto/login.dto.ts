import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Email o username del usuario', example: 'andresf' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
