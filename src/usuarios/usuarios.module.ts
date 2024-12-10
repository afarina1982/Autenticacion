import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/proyectos/entities/proyecto.entity';
import { User } from 'src/usuarios/entities/usuario.entity';
import { UsersController } from 'src/usuarios/usuarios.controller';
import { UsersService } from 'src/usuarios/usuarios.service';
import { AuthModule } from 'src/auth.module'; // Importa el AuthModule

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([User, Project]), AuthModule], // Agrega AuthModule aquí
})
export class UsuariosModule {}
