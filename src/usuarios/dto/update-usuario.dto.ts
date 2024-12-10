import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/usuarios/dto/create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUserDto) {}
