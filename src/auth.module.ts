import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';  // Importa tu servicio AuthService
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/usuarios/entities/usuario.entity';  // Asegúrate de que la ruta sea correcta
import { PassportModule } from '@nestjs/passport';  // Si estás usando Passport para la autenticación
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  
    PassportModule.register({ defaultStrategy: 'jwt' }),  
    JwtModule.register({
      secret:'secret key',
      signOptions: { expiresIn: '1h' },
    }),  
  ],
  providers: [AuthService, JwtStrategy],  
  exports: [AuthService],  
})
export class AuthModule {}
