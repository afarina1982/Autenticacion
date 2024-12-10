import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Name of the project',
    example: 'Project AX', // Valor de ejemplo
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the project',
    example: 'Description of Project C', // Valor de ejemplo
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Username of the user assigned to the project',
    example: 'jane_smith', // Valor de ejemplo
  })
  @IsOptional()
  @IsString()
  username?: string;
}
