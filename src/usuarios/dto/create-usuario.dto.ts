import { IsString, IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'El nombre de usuario del usuario',
    example: 'andresf',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'El correo electrónico del usuario',
    example: 'andres@correo.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'La contraseña del usuario',
    example: 'password123',
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'El rol del usuario',
    example: 'user',
    default: 'user',
    enum: ['admin', 'user'], // Valores permitidos
  })
  @IsEnum(['admin', 'user'], { message: 'El rol debe ser "admin" o "user"' })
  role: 'admin' | 'user' = 'user'; // Valor predeterminado
}
