import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1]; // Extraer token del encabezado

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      // Verificar el token usando el JwtService
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'secret_key', // Asegúrate de que esta clave coincida con la usada para firmar el token
      });

      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }

      // Verificar si el usuario tiene el rol admin
      if (payload.role !== 'admin') {
        throw new UnauthorizedException('Only admins can access this resource');
      }

      request.user = payload; // Adjuntar el payload al request
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true; // Permitir el acceso si el rol es admin
  }
}
