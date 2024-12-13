import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/usuarios/entities/usuario.entity';
import { Project } from './entities/proyecto.entity';
import { ProyectosController } from 'src/proyectos/proyectos.controller';
import { ProyectosService } from './proyectos.service';
import { UsersService } from 'src/usuarios/usuarios.service';
import { AuthModule } from 'src/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule,JwtModule,
    TypeOrmModule.forFeature([User,Project])],
  controllers: [ProyectosController],
  providers: [ProyectosService, UsersService],
})
export class ProyectosModule {}
