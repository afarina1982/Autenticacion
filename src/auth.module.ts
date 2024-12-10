import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';  // Importa tu servicio AuthService
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/usuarios/entities/usuario.entity';  // Asegúrate de que la ruta sea correcta
import { PassportModule } from '@nestjs/passport';  // Si estás usando Passport para la autenticación

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  // Registra la entidad User en el módulo
    PassportModule.register({ defaultStrategy: 'jwt' }),  // Si usas Passport para la autenticación (opcional)
    JwtModule.register({
      secret:'secret key',
      signOptions: { expiresIn: '1h' },
    }),  // Asegúrate de que el JwtService esté importado aquí
  ],
  providers: [AuthService],  // Inyecta el JwtService en los proveedores
  exports: [AuthService],  // Exporta AuthService si lo usas en otros módulos
})
export class AuthModule {}
