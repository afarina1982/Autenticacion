import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional() // No es obligatorio
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional() // No es obligatorio
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional() // No es obligatorio
  @IsString()
  @IsNotEmpty()
  username?: string; // Si el usuario lo proporciona, se actualizará el dueño del proyecto
}
