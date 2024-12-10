import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/usuarios/entities/usuario.entity';
import { Project } from './entities/proyecto.entity';
import { ProjectsController } from 'src/proyectos/proyectos.controller';
import { ProjectsService } from './proyectos.service';
import { UsersService } from 'src/usuarios/usuarios.service';
import { AuthModule } from 'src/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule,JwtModule,
    TypeOrmModule.forFeature([User,Project])],
  controllers: [ProjectsController],
  providers: [ProjectsService, UsersService],
})
export class ProyectosModule {}
