import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from 'src/proyectos/dto/create-proyecto.dto';


export class UpdateProyectoDto extends PartialType(CreateProjectDto) {}
