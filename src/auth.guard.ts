import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // Importar JwtService
import { UnauthorizedException } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
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
      request.user = payload; // Adjuntar el payload al request
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
