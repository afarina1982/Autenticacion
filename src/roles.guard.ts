import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtener los roles requeridos desde el decorador @Roles
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true; // Si no hay roles requeridos, permitir acceso

    // Obtener la solicitud HTTP
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1]; // Extraer el token del header Authorization

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      // Verificar el token y obtener el payload
      const payload = await this.jwtService.verifyAsync(token);

      // Validar que el usuario tenga al menos uno de los roles requeridos
      if (!requiredRoles.some((role) => payload.roles?.includes(role))) {
        throw new UnauthorizedException('User does not have the required role');
      }

      // Adjuntar información del usuario al objeto `request`
      request.user = payload;

      return true; // Permitir acceso si pasa las validaciones
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
