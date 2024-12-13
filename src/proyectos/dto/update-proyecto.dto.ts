import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProyectoDto {
  @ApiPropertyOptional({
    description: 'Name of the project',
    example: 'Updated Project Name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Description of the project',
    example: 'Updated Description of the Project',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Username of the user to assign to the project',
    example: 'john_doe',
  })
  @IsOptional()
  @IsString()
  username?: string;
}
