import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/proyectos/entities/proyecto.entity';
import { User } from 'src/usuarios/entities/usuario.entity';
import { UsersController } from 'src/usuarios/usuarios.controller';
import { UsersService } from 'src/usuarios/usuarios.service';
import { AuthModule } from 'src/auth.module'; // Importa el AuthModule
import { AuthService } from 'src/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([User, Project]),
   AuthModule,
  JwtModule.register({secret: 'secret_key', signOptions: {expiresIn: '1h'}}),
  ], // Agrega AuthModule aquí
})
export class UsuariosModule {}
