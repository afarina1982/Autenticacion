import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './proyectos/entities/proyecto.entity';
import { User } from 'src/usuarios/entities/usuario.entity';
import { AuthModule } from 'src/auth.module';

@Module({
  imports: [AuthModule, UsuariosModule,
    ConfigModule.forRoot(
    {
      envFilePath: `.env`,
      load: [() => ({
        version: require('../package.json').version,
        name: require('../package.json').name,
        description: require('../package.json').description,
        author: require('../package.json').author,
        license: require('../package.json').license
      })],
      isGlobal: true
    }),
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 4100,
    username: 'root',
    password: 'clave123',
    database: 'project_management',
    entities: [Project, User,]
  }),
 UsuariosModule, ProyectosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
//prueba de funcionamiento